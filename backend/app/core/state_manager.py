"""
State Manager – tracks the ready queue, waiting queue, and process state
transitions during a simulation run.
"""
from typing import List, Optional
from app.core.process import Process, ProcessState


class StateManager:
    """
    Manages the lifecycle of processes across all queues.

    Queues:
        ready_queue   – processes that have arrived and are waiting for CPU
        running       – at most one process currently executing
        terminated    – processes that have finished
    """

    def __init__(self, processes: List[Process]):
        # All processes sorted by arrival time (original input order preserved)
        self.all_processes: List[Process] = sorted(
            processes, key=lambda p: (p.arrival_time, p.pid)
        )
        self.ready_queue: List[Process] = []
        self.running: Optional[Process] = None
        self.terminated: List[Process] = []

        # Index into all_processes – processes before this index have arrived
        self._arrival_cursor: int = 0

    # ── Queue operations ──────────────────────────────────────────────────────

    def admit_arrived_processes(self, current_time: int) -> List[Process]:
        """
        Move newly arrived processes into the ready queue.
        Returns the list of processes admitted at this tick.
        """
        admitted = []
        while (
            self._arrival_cursor < len(self.all_processes)
            and self.all_processes[self._arrival_cursor].arrival_time <= current_time
        ):
            p = self.all_processes[self._arrival_cursor]
            if p.state == ProcessState.NEW:
                p.state = ProcessState.READY
                self.ready_queue.append(p)
                admitted.append(p)
            self._arrival_cursor += 1
        return admitted

    def set_running(self, process: Optional[Process], current_time: int) -> None:
        """Put a process on the CPU."""
        if process is None:
            self.running = None
            return

        if self.running is not None and self.running is not process:
            # Preemption: put the old process back in the ready queue
            self.running.state = ProcessState.READY
            if self.running not in self.ready_queue:
                self.ready_queue.append(self.running)

        if process in self.ready_queue:
            self.ready_queue.remove(process)

        process.mark_started(current_time)
        self.running = process

    def tick_running(self) -> bool:
        """
        Advance the running process by one time unit.
        Returns True if the process just finished.
        """
        if self.running is None:
            return False

        self.running.remaining_time -= 1

        if self.running.remaining_time <= 0:
            return True  # finished
        return False

    def finalize_running(self, current_time: int) -> None:
        """Mark the running process as terminated."""
        if self.running is not None:
            self.running.mark_finished(current_time)
            self.terminated.append(self.running)
            self.running = None

    def accumulate_waiting_times(self) -> None:
        """
        Called every tick to increment waiting_time for every ready process.
        """
        for p in self.ready_queue:
            p.waiting_time += 1

    @property
    def all_terminated(self) -> bool:
        """True when all processes have completed."""
        return len(self.terminated) == len(self.all_processes)

    def ready_queue_snapshot(self) -> List[dict]:
        """Serialisable snapshot of the current ready queue."""
        return [
            {"pid": p.pid, "remaining_time": p.remaining_time, "priority": p.priority}
            for p in self.ready_queue
        ]
