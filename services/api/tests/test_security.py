from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_security_headers_are_present() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["referrer-policy"] == "strict-origin-when-cross-origin"


def test_public_registration_is_disabled_by_default() -> None:
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "attacker@example.com", "password": "StrongPassword123!", "rol": "admin"},
    )
    assert response.status_code == 404


def test_oversized_request_is_rejected() -> None:
    response = client.post(
        "/health",
        headers={"content-length": str(16 * 1024 * 1024)},
    )
    assert response.status_code == 413
