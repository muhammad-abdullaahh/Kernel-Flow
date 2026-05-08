from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.models.process_model import ProcessInput, ProcessOutput
from app.models.metrics_model import SystemMetrics

class SimulationStartRequest(BaseModel):
    processes: List[ProcessInput]
    algorithm: str
    time_quantum: int = 2

class SimulationState(BaseModel):
    time: int
    running_pid: Optional[int]
    ready_queue: List[Dict[str, Any]]
    gantt_update: Optional[Dict[str, Any]]
    event_type: str
    processes: List[ProcessOutput]
    metrics: Dict[str, Any]

class ComparisonRequest(BaseModel):
    processes: List[ProcessInput]
    algorithms: List[str]
    time_quantum: int = 2

class ComparisonResult(BaseModel):
    algorithm: str
    metrics: SystemMetrics
    processes: List[ProcessOutput]
