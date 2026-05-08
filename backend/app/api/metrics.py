from typing import List
from fastapi import APIRouter
from app.models.process_model import ProcessInput
from app.services.metric_calculator import MetricCalculator
from app.core.process import Process
from app.core.simulator import Simulator
from app.services.comparison_service import ComparisonService

router = APIRouter(prefix="/metrics")

@router.post("/calculate")
async def calculate_metrics(processes: List[ProcessInput], algorithm: str, time_quantum: int = 2):
    # This endpoint runs a quick sync simulation to get final metrics
    proc_objs = [
        Process(pid=p.pid, arrival_time=p.arrival_time, burst_time=p.burst_time, priority=p.priority)
        for p in processes
    ]
    
    algo_class = ComparisonService.ALGORITHMS.get(algorithm)
    if not algo_class:
        return {"error": "Invalid algorithm"}
        
    algo = algo_class(time_quantum=time_quantum) if algorithm == "RR" else algo_class()
    
    sim = Simulator(proc_objs, algo)
    result = sim.run()
    
    metrics = MetricCalculator.calculate_system_metrics(
        result.processes, result.total_time, result.busy_time
    )
    
    return {
        "metrics": metrics,
        "processes": [p.to_dict() for p in result.processes]
    }
