from fastapi import APIRouter, UploadFile, File, Response
from app.services.csv_service import CSVService
from app.websocket.connection_manager import active_simulations

router = APIRouter()

@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    content = await file.read()
    processes = CSVService.parse_processes(content)
    return {"processes": processes}

@router.get("/export-report/{session_id}")
async def export_report(session_id: str):
    simulator = active_simulations.get(session_id)
    if not simulator:
        return {"error": "Session not found"}
        
    # Get processes from state manager
    processes = [p.to_dict() for p in simulator.state_manager.all_processes]
    csv_str = CSVService.export_report(processes)
    
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=report_{session_id}.csv"}
    )
