from typing import List, Optional
from app.core.process import Process
from app.core.scheduler import BaseScheduler

class PriorityPreemptive(BaseScheduler):
    """
    Priority Scheduling (Preemptive).
    Lower priority number means higher priority.
    At each tick, the process with the highest priority (lowest number) runs.
    """

    def select_next(
        self,
        ready_queue: List[Process],
        current_process: Optional[Process],
        current_time: int,
    ) -> Optional[Process]:
        if not ready_queue and current_process is None:
            return None

        candidates = list(ready_queue)
        if current_process:
            candidates.append(current_process)

        if not candidates:
            return None

        # Sort by priority (asc), then arrival (asc), then pid (asc)
        candidates.sort(key=lambda p: (p.priority, p.arrival_time, p.pid))
        return candidates[0]

    @staticmethod
    def is_preemptive() -> bool:
        return True
