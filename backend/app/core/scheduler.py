"""
Base Scheduler – abstract interface that every scheduling algorithm must implement.
Also contains context-switch utilities shared across schedulers.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from app.core.process import Process


class BaseScheduler(ABC):
    """
    Abstract base class for all scheduling algorithms.
    Subclasses implement `select_next` which, given the ready queue and
    the current time unit, returns the next process to run (or None if idle).
    """

    # Context-switch overhead in time units (0 for our simulation)
    CONTEXT_SWITCH_OVERHEAD: int = 0

    def __init__(self, time_quantum: int = 2):
        self.time_quantum = time_quantum
        self._current_quantum_remaining: int = 0

    @property
    def name(self) -> str:
        """Human-readable algorithm name."""
        return self.__class__.__name__

    @abstractmethod
    def select_next(
        self,
        ready_queue: List[Process],
        current_process: Optional[Process],
        current_time: int,
    ) -> Optional[Process]:
        """
        Select the next process to execute.

        Args:
            ready_queue     – processes that have arrived and are not terminated
            current_process – process currently holding the CPU (may be None)
            current_time    – current simulation clock tick

        Returns:
            The process that should run next, or None if CPU is idle.
        """

    def reset(self) -> None:
        """Reset any per-run state (e.g., quantum counter)."""
        self._current_quantum_remaining = 0

    # ── Convenience helpers ───────────────────────────────────────────────────

    @staticmethod
    def is_preemptive() -> bool:
        """Indicates whether this scheduler can preempt the running process."""
        return False

    @staticmethod
    def sort_by_arrival(processes: List[Process]) -> List[Process]:
        """Sort by arrival time, breaking ties by pid."""
        return sorted(processes, key=lambda p: (p.arrival_time, p.pid))
