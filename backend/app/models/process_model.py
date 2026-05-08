from typing import Optional
from pydantic import BaseModel, Field

class ProcessInput(BaseModel):
    pid: int
    arrival_time: int = Field(..., ge=0)
    burst_time: int = Field(..., gt=0)
    priority: int = Field(5, ge=1, le=10)

class ProcessOutput(BaseModel):
    pid: int
    arrival_time: int
    burst_time: int
    priority: int
    remaining_time: int
    state: str
    start_time: Optional[int]
    finish_time: Optional[int]
    waiting_time: int
    turnaround_time: Optional[int]
    response_time: Optional[int]
