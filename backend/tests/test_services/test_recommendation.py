import pytest
from app.services.recommendation_engine import RecommendationEngine
from app.models.process_model import ProcessInput

def make_process(pid, arrival, burst, priority=0):
    return ProcessInput(pid=pid, arrival_time=arrival, burst_time=burst, priority=priority)

def test_recommends_priority_when_priorities_set():
    engine = RecommendationEngine()
    processes = [make_process(1, 0, 5, 1), make_process(2, 0, 3, 3)]
    result = engine.recommend(processes)
    assert result["algorithm"] == "priority_p"

def test_recommends_rr_for_similar_bursts():
    engine = RecommendationEngine()
    processes = [make_process(i, 0, 5) for i in range(1, 5)]
    result = engine.recommend(processes)
    assert result["algorithm"] == "rr"

def test_recommends_fcfs_for_empty():
    engine = RecommendationEngine()
    result = engine.recommend([])
    assert result["algorithm"] == "fcfs"
