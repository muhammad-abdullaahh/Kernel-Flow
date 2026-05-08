from typing import List
from app.models.process_model import ProcessInput

def validate_processes(processes: List[ProcessInput]):
    """Validates basic process constraints."""
    pids = set()
    for p in processes:
        if p.pid in pids:
            raise ValueError(f"Duplicate PID found: {p.pid}")
        if p.arrival_time < 0:
            raise ValueError(f"Arrival time must be >= 0 for PID {p.pid}")
        if p.burst_time <= 0:
            raise ValueError(f"Burst time must be > 0 for PID {p.pid}")
        if not (1 <= p.priority <= 10):
            raise ValueError(f"Priority must be between 1 and 10 for PID {p.pid}")
        pids.add(p.pid)
