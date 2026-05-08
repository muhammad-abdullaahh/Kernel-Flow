from typing import List, Optional
from app.core.process import Process
from app.core.scheduler import BaseScheduler

class SRTF(BaseScheduler):
    """
    Shortest Remaining Time First (SRTF) Scheduling.
    Preemptive version of SJF: at each tick, select the process with the smallest
    remaining time.
    """

    def select_next(
        self,
        ready_queue: List[Process],
        current_process: Optional[Process],
        current_time: int,
    ) -> Optional[Process]:
        if not ready_queue and current_process is None:
            return None

        # Combine currently running with ready queue for comparison
        candidates = list(ready_queue)
        if current_process:
            candidates.append(current_process)

        if not candidates:
            return None

        # Select process with smallest remaining time.
        candidates.sort(key=lambda p: (p.remaining_time, p.arrival_time, p.pid))
        return candidates[0]

    @staticmethod
    def is_preemptive() -> bool:
        return True
