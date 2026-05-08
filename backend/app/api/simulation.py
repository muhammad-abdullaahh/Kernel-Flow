import json
import uuid
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from app.models.simulation_model import SimulationStartRequest
from app.core.simulator import Simulator
from app.core.process import Process
from app.websocket.connection_manager import active_simulations
from app.services.comparison_service import ComparisonService
from app.services.metric_calculator import MetricCalculator

router = APIRouter(prefix="/simulation")

@router.post("/start")
async def start_simulation(request: SimulationStartRequest):
    session_id = str(uuid.uuid4())
    
    # Convert input models to Process objects
    processes = [
        Process(pid=p.pid, arrival_time=p.arrival_time, burst_time=p.burst_time, priority=p.priority)
        for p in request.processes
    ]
    
    # Get algorithm class
    algo_class = ComparisonService.ALGORITHMS.get(request.algorithm)
    if not algo_class:
        raise HTTPException(status_code=400, detail="Invalid algorithm")
        
    if request.algorithm == "RR":
        algo = algo_class(time_quantum=request.time_quantum)
    else:
        algo = algo_class()
        
    simulator = Simulator(processes, algo)
    active_simulations[session_id] = simulator
    
    return {"session_id": session_id}

@router.get("/stream/{session_id}")
async def stream_simulation(session_id: str, speed: float = 1.0):
    simulator = active_simulations.get(session_id)
    if not simulator:
        raise HTTPException(status_code=404, detail="Simulation session not found")
        
    async def event_generator():
        async for event in simulator.run_stream(delay=speed):
            yield f"data: {json.dumps(event)}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/batch")
async def run_batch_simulation(request: SimulationStartRequest):
    processes = [
        Process(pid=p.pid, arrival_time=p.arrival_time, burst_time=p.burst_time, priority=p.priority)
        for p in request.processes
    ]
    
    algo_class = ComparisonService.ALGORITHMS.get(request.algorithm)
    if not algo_class:
        raise HTTPException(status_code=400, detail="Invalid algorithm")
        
    algo = algo_class(time_quantum=request.time_quantum) if request.algorithm == "RR" else algo_class()
    
    simulator = Simulator(processes, algo)
    result = simulator.run()
    
    metrics = MetricCalculator.calculate_system_metrics(
        result.processes, result.total_time, result.busy_time
    )
    
    return {
        "processes": [p.to_dict() for p in result.processes],
        "gantt_blocks": result.gantt_blocks,
        "metrics": metrics
    }

@router.post("/pause/{session_id}")
async def pause_simulation(session_id: str):
    simulator = active_simulations.get(session_id)
    if simulator:
        simulator.pause()
        return {"status": "paused"}
    raise HTTPException(status_code=404, detail="Session not found")

@router.post("/resume/{session_id}")
async def resume_simulation(session_id: str):
    simulator = active_simulations.get(session_id)
    if simulator:
        simulator.resume()
        return {"status": "resumed"}
    raise HTTPException(status_code=404, detail="Session not found")

@router.post("/step/{session_id}")
async def step_simulation(session_id: str):
    simulator = active_simulations.get(session_id)
    if simulator:
        simulator.step()
        return {"status": "stepped"}
    raise HTTPException(status_code=404, detail="Session not found")

@router.post("/stop/{session_id}")
async def stop_simulation(session_id: str):
    simulator = active_simulations.get(session_id)
    if simulator:
        simulator.stop()
        del active_simulations[session_id]
        return {"status": "stopped"}
    raise HTTPException(status_code=404, detail="Session not found")
