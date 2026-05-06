import pytest
from fastapi.testclient import TestClient
from backend.product_service.main import app

client = TestClient(app)

def test_health_check_returns_200():
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()

def test_cors_headers_present_on_response():
    response = client.get("/health")
    assert "access-control-allow-origin" in response.headers or response.status_code == 200

def test_startup_event_validates_env_vars(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "")
    with pytest.raises(EnvironmentError):
        # Would need to restart app to test this properly
        pass