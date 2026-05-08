from fastapi import APIRouter
from app.services.comparison_service import ComparisonService

router = APIRouter(prefix="/algorithms")

@router.get("/")
async def list_algorithms():
    return {
        "algorithms": list(ComparisonService.ALGORITHMS.keys())
    }
