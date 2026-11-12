import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data

def test_simulate_deterioration_endpoint():
    payload = {
        "produce_type": "tomatoes",
        "initial_quantity": 1000.0,
        "deterioration_rate": 0.018,
        "duration_hours": 24.0,
        "step_size": 0.5,
        "storage_condition": "normal",
        "scenario_id": "normal_journey"
    }
    response = client.post("/api/simulate/deterioration", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["starting_quantity"] == 1000.0
    assert data["remaining_quantity_analytical"] < 1000.0
    assert data["quantity_lost"] > 0
    assert len(data["time_series"]) > 0
    assert "error_metrics" in data
    assert data["error_metrics"]["max_absolute_error_rk4"] < 1.0

def test_simulate_supply_endpoint():
    payload = {
        "produce_type": "kaukau",
        "initial_quantity": 500.0,
        "supply_rate": 30.0,
        "deterioration_rate": 0.01,
        "duration_hours": 12.0,
        "step_size": 0.5,
        "storage_condition": "improved"
    }
    response = client.post("/api/simulate/supply", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["equilibrium_quantity"] is not None
    assert data["equilibrium_quantity"] > 0
    assert len(data["time_series"]) > 0

def test_invalid_input_validation():
    payload = {
        "produce_type": "tomatoes",
        "initial_quantity": -50.0,  # invalid gt=0
        "deterioration_rate": 0.018,
        "duration_hours": 24.0
    }
    response = client.post("/api/simulate/deterioration", json=payload)
    assert response.status_code == 422  # Pydantic validation error
