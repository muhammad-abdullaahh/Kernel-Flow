"""
Process class – represents a Process Control Block (PCB).
Holds all attributes of a simulated process throughout its lifecycle.
"""
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class ProcessState(str, Enum):
    """Valid states a process can be in during simulation."""
    NEW = "new"
    READY = "ready"
    RUNNING = "running"
    WAITING = "waiting"
    TERMINATED = "terminated"


@dataclass
class Process:
    """
    Represents a single process in the simulation.

    Attributes:
        pid            – unique process identifier
        arrival_time   – time unit when process enters the ready queue
        burst_time     – total CPU time required
        priority       – scheduling priority (1 = highest, 10 = lowest)
        remaining_time – remaining burst time (used by preemptive algorithms)
        state          – current process state
        start_time     – first time the process is assigned CPU (for response time)
        finish_time    – time unit when process completes
        waiting_time   – accumulated time spent in ready queue
        response_time  – start_time - arrival_time (set on first CPU allocation)
    """
    pid: int
    arrival_time: int
    burst_time: int
    priority: int = 5

    # Runtime attributes (mutated during simulation)
    remaining_time: int = field(init=False)
    state: ProcessState = field(default=ProcessState.NEW)
    start_time: Optional[int] = field(default=None)
    finish_time: Optional[int] = field(default=None)
    waiting_time: int = field(default=0)
    response_time: Optional[int] = field(default=None)

    # Internal tracking
    last_run_time: Optional[int] = field(default=None, repr=False)

    def __post_init__(self):
        self.remaining_time = self.burst_time

    # ── Derived metrics ───────────────────────────────────────────────────────

    @property
    def turnaround_time(self) -> Optional[int]:
        """Total time from arrival to completion."""
        if self.finish_time is not None:
            return self.finish_time - self.arrival_time
        return None

    # ── State helpers ─────────────────────────────────────────────────────────

    def mark_started(self, current_time: int) -> None:
        """Record the first time the process gets the CPU."""
        if self.start_time is None:
            self.start_time = current_time
            self.response_time = current_time - self.arrival_time
        self.state = ProcessState.RUNNING
        self.last_run_time = current_time

    def mark_finished(self, current_time: int) -> None:
        """Mark process as terminated and record finish time."""
        self.finish_time = current_time
        self.state = ProcessState.TERMINATED

    def to_dict(self) -> dict:
        """Serialise process to a plain dict for JSON responses."""
        return {
            "pid": self.pid,
            "arrival_time": self.arrival_time,
            "burst_time": self.burst_time,
            "priority": self.priority,
            "remaining_time": self.remaining_time,
            "state": self.state.value,
            "start_time": self.start_time,
            "finish_time": self.finish_time,
            "waiting_time": self.waiting_time,
            "turnaround_time": self.turnaround_time,
            "response_time": self.response_time,
        }

    def clone(self) -> "Process":
        """Return a fresh copy for independent simulations (comparison mode)."""
        p = Process(
            pid=self.pid,
            arrival_time=self.arrival_time,
            burst_time=self.burst_time,
            priority=self.priority,
        )
        return p
