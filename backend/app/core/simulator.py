"""
Simulator – clock-driven simulation engine.

Runs a scheduling algorithm step-by-step, emitting a stream of events that
the SSE endpoint relays to the frontend in real time.

Each event is a dict:
    {
        "time":         int,          # current clock tick
        "running_pid":  int | None,   # pid executing this tick
        "ready_queue":  [{"pid":..., "remaining_time":..., "priority":...}],
        "gantt_update": {"pid": int, "start": int, "end": int} | None,
        "event_type":   "tick" | "start" | "stop" | "context_switch" | "done",
        "processes":    [{...}],      # full process snapshots
        "metrics":      {...},        # live aggregate metrics
    }
"""
import asyncio
from typing import List, Optional, AsyncGenerator, Dict, Any

from app.core.process import Process, ProcessState
from app.core.state_manager import StateManager
from app.core.scheduler import BaseScheduler
from app.utils.logger import get_logger

logger = get_logger(__name__)


class SimulationResult:
    """Holds the final output of a completed simulation."""

    def __init__(self):
        self.gantt_blocks: List[Dict[str, Any]] = []
        self.processes: List[Process] = []
        self.total_time: int = 0
        self.busy_time: int = 0

    @property
    def cpu_utilization(self) -> float:
        if self.total_time == 0:
            return 0.0
        return round(self.busy_time / self.total_time * 100, 2)

    @property
    def throughput(self) -> float:
        if self.total_time == 0:
            return 0.0
        terminated = [p for p in self.processes if p.finish_time is not None]
        return round(len(terminated) / self.total_time, 4)


class Simulator:
    """
    Clock-driven simulation engine.

    Usage:
        sim = Simulator(processes, scheduler)
        result = sim.run()                    # synchronous, returns SimulationResult
        async for event in sim.run_stream():  # async, yields SSE dicts
            ...
    """

    MAX_TIME = 500  # Guard against infinite loops

    def __init__(self, processes: List[Process], scheduler: BaseScheduler):
        self.scheduler = scheduler
        self.state_manager = StateManager(processes)
        self._gantt_blocks: List[Dict[str, Any]] = []
        self._current_block: Optional[Dict[str, Any]] = None
        self._busy_time: int = 0
        self._is_paused: bool = False
        self._is_stopped: bool = False
        self._step_event = asyncio.Event()

    # ── Control ───────────────────────────────────────────────────────────────

    def pause(self) -> None:
        self._is_paused = True

    def resume(self) -> None:
        self._is_paused = False
        self._step_event.set()

    def step(self) -> None:
        """Release the pause lock for exactly one iteration."""
        self._is_paused = True
        self._step_event.set()

    def stop(self) -> None:
        self._is_stopped = True
        self._step_event.set()

    # ── Synchronous run (for comparison / metrics) ────────────────────────────

    def run(self) -> SimulationResult:
        """Run the entire simulation synchronously. Returns SimulationResult."""
        sm = self.state_manager
        clock = 0

        while not sm.all_terminated and clock < self.MAX_TIME:
            sm.admit_arrived_processes(clock)

            selected = self.scheduler.select_next(
                sm.ready_queue, sm.running, clock
            )
            sm.set_running(selected, clock)
            sm.accumulate_waiting_times()

            if sm.running:
                self._busy_time += 1
                self._update_gantt(sm.running.pid, clock)
                finished = sm.tick_running()
                if finished:
                    sm.finalize_running(clock + 1)
                    self._close_gantt(clock + 1)
            else:
                self._close_gantt(clock)

            clock += 1

        # Close any open gantt block
        self._close_gantt(clock)

        result = SimulationResult()
        result.gantt_blocks = self._gantt_blocks
        result.processes = sm.all_processes
        result.total_time = clock
        result.busy_time = self._busy_time
        return result

    # ── Async streaming run (SSE) ─────────────────────────────────────────────

    async def run_stream(self, delay: float = 0.0) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Async generator that yields one event dict per clock tick.
        Consumers can call pause/resume/stop to control the simulation.
        """
        sm = self.state_manager
        clock = 0
        prev_running_pid: Optional[int] = None

        while not sm.all_terminated and clock < self.MAX_TIME:
            # Honour pause
            if self._is_paused:
                self._step_event.clear()
                await self._step_event.wait()

            if self._is_stopped:
                break

            sm.admit_arrived_processes(clock)

            selected = self.scheduler.select_next(
                sm.ready_queue, sm.running, clock
            )
            sm.set_running(selected, clock)
            sm.accumulate_waiting_times()

            # Detect event type
            event_type = "tick"
            if selected is not None and (prev_running_pid != selected.pid):
                event_type = "context_switch" if prev_running_pid is not None else "start"

            # sm.set_running is now handled above accumulate_waiting_times

            gantt_update = None
            if sm.running:
                self._busy_time += 1
                self._update_gantt(sm.running.pid, clock)
                finished = sm.tick_running()

                if finished:
                    gantt_update = self._close_gantt(clock + 1)
                    sm.finalize_running(clock + 1)
                    event_type = "stop"
            else:
                self._close_gantt(clock)

            current_pid = sm.running.pid if sm.running else None
            prev_running_pid = current_pid

            event = {
                "time": clock,
                "running_pid": current_pid,
                "ready_queue": sm.ready_queue_snapshot(),
                "gantt_update": gantt_update or (dict(self._current_block) if self._current_block else None),
                "event_type": event_type,
                "processes": [p.to_dict() for p in sm.all_processes],
                "metrics": self._live_metrics(clock + 1),
            }

            yield event
            clock += 1
            await asyncio.sleep(delay)

        # Final done event
        self._close_gantt(clock)
        
        # Calculate final metrics using the standard calculator
        final_metrics = MetricCalculator.calculate_system_metrics(
            sm.all_processes, clock, self._busy_time
        )
        
        yield {
            "time": clock,
            "running_pid": None,
            "ready_queue": [],
            "gantt_update": None,
            "event_type": "done",
            "processes": [p.to_dict() for p in sm.all_processes],
            "metrics": {
                "completed": final_metrics.completed,
                "total_time": final_metrics.total_time,
                "avg_waiting_time": final_metrics.avg_waiting_time,
                "avg_turnaround_time": final_metrics.avg_turnaround_time,
                "avg_response_time": final_metrics.avg_response_time,
                "cpu_load": final_metrics.cpu_load,
                "throughput": final_metrics.throughput,
            },
        }

    # ── Gantt helpers ─────────────────────────────────────────────────────────

    def _update_gantt(self, pid: int, clock: int) -> None:
        """Extend (or start) a gantt block for the given pid."""
        if self._current_block is None or self._current_block["pid"] != pid:
            self._close_gantt(clock)
            self._current_block = {"pid": pid, "start": clock, "end": clock + 1}
        else:
            self._current_block["end"] = clock + 1

    def _close_gantt(self, clock: int) -> Optional[Dict[str, Any]]:
        """Finalise the current gantt block and return it."""
        if self._current_block is not None:
            self._current_block["end"] = clock
            block = dict(self._current_block)
            self._gantt_blocks.append(block)
            self._current_block = None
            return block
        return None

    # ── Live metric helper ────────────────────────────────────────────────────
    def _live_metrics(self, clock: int) -> Dict[str, Any]:
        """
        Uses the MetricCalculator to generate consistent live telemetry.
        """
        metrics = MetricCalculator.calculate_system_metrics(
            self.state_manager.all_processes, 
            clock, 
            self._busy_time
        )
        
        return {
            "completed": metrics.completed,
            "total_time": metrics.total_time,
            "avg_waiting_time": metrics.avg_waiting_time,
            "avg_turnaround_time": metrics.avg_turnaround_time,
            "avg_response_time": metrics.avg_response_time,
            "cpu_load": metrics.cpu_load,
            "throughput": metrics.throughput,
        }
