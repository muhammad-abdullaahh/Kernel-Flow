from typing import List
from fastapi import APIRouter
from app.models.process_model import ProcessInput
from app.services.recommendation_engine import RecommendationEngine

router = APIRouter(prefix="/recommend")

@router.post("/")
async def recommend_algorithm(processes: List[ProcessInput]):
    recommendation = RecommendationEngine.recommend(processes)
    return recommendation
