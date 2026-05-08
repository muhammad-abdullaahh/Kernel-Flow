from pydantic import BaseModel

class SystemMetrics(BaseModel):
    completed: int = 0
    total_time: int = 0
    cpu_load: float
    throughput: float
    avg_waiting_time: float
    avg_turnaround_time: float
    avg_response_time: float

class ComparisonMetrics(BaseModel):
    algorithm_name: str
    metrics: SystemMetrics
