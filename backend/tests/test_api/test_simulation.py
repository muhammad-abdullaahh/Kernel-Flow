import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "KernelFlow API is running"

def test_get_algorithms():
    response = client.get("/api/algorithms")
    assert response.status_code == 200
    data = response.json()
    assert "algorithms" in data
    assert len(data["algorithms"]) > 0

def test_start_simulation():
    payload = {
        "processes": [
            {"pid": 1, "arrival_time": 0, "burst_time": 5, "priority": 0},
            {"pid": 2, "arrival_time": 2, "burst_time": 3, "priority": 0},
        ],
        "algorithm": "fcfs",
        "time_quantum": 2
    }
    response = client.post("/api/start", json=payload)
    assert response.status_code in (200, 422)
