from fastapi import APIRouter
from app.models.simulation_model import ComparisonRequest
from app.services.comparison_service import ComparisonService
from app.core.process import Process

router = APIRouter(prefix="/compare")

@router.post("/")
async def compare_algorithms(request: ComparisonRequest):
    # Convert input models to Process objects
    processes = [
        Process(pid=p.pid, arrival_time=p.arrival_time, burst_time=p.burst_time, priority=p.priority)
        for p in request.processes
    ]
    
    results = ComparisonService.compare_algorithms(
        processes, request.algorithms, request.time_quantum
    )
    
    return {"results": results}
