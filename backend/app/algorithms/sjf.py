from typing import List, Optional
from app.core.process import Process
from app.core.scheduler import BaseScheduler

class SJF(BaseScheduler):
    """
    Shortest Job First (SJF) Scheduling.
    Non-preemptive: selects the process with the smallest burst time.
    """

    def select_next(
        self,
        ready_queue: List[Process],
        current_process: Optional[Process],
        current_time: int,
    ) -> Optional[Process]:
        # Non-preemptive: if something is running, keep it
        if current_process is not None:
            return current_process

        if not ready_queue:
            return None

        # Select process with shortest burst time. Tie-break with arrival time then pid.
        ready_queue.sort(key=lambda p: (p.burst_time, p.arrival_time, p.pid))
        return ready_queue[0]

    @staticmethod
    def is_preemptive() -> bool:
        return False
