from fastapi import APIRouter
from pydantic import BaseModel
from app.services.model_service import predict_url
from app.services.explain_service import explain
from app.services.hygiene_service import compute_hygiene
from app.services.anomaly_service import check_login
from app.core.hashing import hash_user

router = APIRouter()

fake_db = {}

class ScanRequest(BaseModel):
    url: str
    user_id: str

class LoginRequest(BaseModel):
    user_id: str
    new_device: bool
    new_location: bool


@router.post("/scan")
def scan_url(data: ScanRequest):
    prediction, risk = predict_url(data.url)
    explanation = explain(data.url, risk)

    hashed_user = hash_user(data.user_id)

    if hashed_user not in fake_db:
        fake_db[hashed_user] = []

    if risk > 75:
        fake_db[hashed_user].append("phishing_click")

    return {
        "prediction": int(prediction),
        "risk_score": risk,
        "explanation": explanation
    }


@router.post("/hygiene")
def hygiene(user_id: str):
    hashed_user = hash_user(user_id)
    events = fake_db.get(hashed_user, [])
    score = compute_hygiene(events)

    return {"hygiene_score": score}


@router.post("/login-check")
def login_check(data: LoginRequest):
    return check_login(data.new_device, data.new_location)