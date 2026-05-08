from typing import List, Optional
from app.core.process import Process
from app.core.scheduler import BaseScheduler

class PriorityNonPreemptive(BaseScheduler):
    """
    Priority Scheduling (Non-preemptive).
    Lower priority number means higher priority.
    Selects the process with the highest priority and runs it to completion.
    """

    def select_next(
        self,
        ready_queue: List[Process],
        current_process: Optional[Process],
        current_time: int,
    ) -> Optional[Process]:
        # Non-preemptive: keep running if possible
        if current_process is not None:
            return current_process

        if not ready_queue:
            return None

        # Sort by priority (asc), then arrival (asc), then pid (asc)
        ready_queue.sort(key=lambda p: (p.priority, p.arrival_time, p.pid))
        return ready_queue[0]

    @staticmethod
    def is_preemptive() -> bool:
        return False
