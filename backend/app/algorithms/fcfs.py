from typing import List, Optional
from app.core.process import Process
from app.core.scheduler import BaseScheduler

class FCFS(BaseScheduler):
    """
    First-Come, First-Served (FCFS) Scheduling.
    Non-preemptive: the process that arrives first is executed first.
    """

    def select_next(
        self,
        ready_queue: List[Process],
        current_process: Optional[Process],
        current_time: int,
    ) -> Optional[Process]:
        # If a process is already running, it continues until finished (Non-preemptive)
        if current_process is not None:
            return current_process

        if not ready_queue:
            return None

        # FCFS: Select the one that arrived first. Ready queue is usually ordered by arrival.
        # But we ensure it by sorting just in case.
        ready_queue.sort(key=lambda p: (p.arrival_time, p.pid))
        return ready_queue[0]

    @staticmethod
    def is_preemptive() -> bool:
        return False
