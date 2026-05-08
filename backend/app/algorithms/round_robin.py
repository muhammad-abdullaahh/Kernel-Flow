from typing import List, Optional
from app.core.process import Process
from app.core.scheduler import BaseScheduler

class RoundRobin(BaseScheduler):
    """
    Round Robin (RR) Scheduling.
    Preemptive: each process is assigned a fixed time slot (quantum) in cyclic order.
    """

    def __init__(self, time_quantum: int = 2):
        super().__init__(time_quantum)
        self._current_quantum_remaining = time_quantum

    def select_next(
        self,
        ready_queue: List[Process],
        current_process: Optional[Process],
        current_time: int,
    ) -> Optional[Process]:
        
        if current_process is not None:
            self._current_quantum_remaining -= 1
            
            # If quantum is still active, continue unless it's done (handled by simulator)
            if self._current_quantum_remaining > 0:
                return current_process
            
            # Quantum expired. Note: State manager will move it to the back of the queue.
            self._current_quantum_remaining = self.time_quantum
            if not ready_queue:
                return current_process
            
            return ready_queue[0]

        if not ready_queue:
            return None

        # Start a new quantum for the next process
        self._current_quantum_remaining = self.time_quantum
        return ready_queue[0]

    def reset(self):
        super().reset()
        self._current_quantum_remaining = self.time_quantum

    @staticmethod
    def is_preemptive() -> bool:
        return True
