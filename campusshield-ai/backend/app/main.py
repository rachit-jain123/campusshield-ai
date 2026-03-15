import os
import pickle
import numpy as np
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ==========================
# APP INIT
# ==========================

app = FastAPI(title="CampusShield AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# LOAD MODELS (Hackathon Specialized)
# ==========================

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
MODEL_DIR = os.path.join(BACKEND_DIR, "model")

import joblib

print("Loading specialized ML Models...")

# 1. URL Model (Fine-Tuned)
URL_MODEL_PATH = os.path.join(MODEL_DIR, "url_model_finetuned.pkl")
URL_VEC_PATH = os.path.join(MODEL_DIR, "vectorizer1.pkl") 
url_model = joblib.load(URL_MODEL_PATH)
url_vectorizer = joblib.load(URL_VEC_PATH)

# 2. Text Model
TEXT_MODEL_PATH = os.path.join(MODEL_DIR, "text_model.pkl")
TEXT_VEC_PATH = os.path.join(MODEL_DIR, "text_vectorizer.pkl")
text_model = joblib.load(TEXT_MODEL_PATH)
text_vectorizer = joblib.load(TEXT_VEC_PATH)

# 3. Document Model
DOC_MODEL_PATH = os.path.join(MODEL_DIR, "doc_model.pkl")
DOC_VEC_PATH = os.path.join(MODEL_DIR, "doc_vectorizer.pkl")
doc_model = joblib.load(DOC_MODEL_PATH)
doc_vectorizer = joblib.load(DOC_VEC_PATH)

print("✅ All 3 Special Models loaded successfully (URL, TEXT, DOC)")

# ==========================
# REQUEST MODELS
# ==========================

class URLRequest(BaseModel):
    url: str

class TextRequest(BaseModel):
    text: str

# ==========================
# MEMORY STORAGE
# ==========================

scan_history = []

# ==========================
# HEURISTIC CHECK
# ==========================

def heuristic_check(content):
    suspicious_words = [
        "login", "verify", "update", "secure",
        "account", "confirm", "free", "winner",
        "reset", "urgent", "bank", "password"
    ]
    matched = []
    for word in suspicious_words:
        if word in content.lower():
            matched.append(word)
    return matched

# ==========================
# CORE SCAN LOGIC & XAI
# ==========================

def scan_content(content, content_type):
    # Truncate content for the model if it's too long
    model_input = content[:5000] if len(content) > 5000 else content
    
    # Select specialized model
    if content_type == "URL":
        target_model = url_model
        target_vec = url_vectorizer
    elif content_type == "TEXT":
        target_model = text_model
        target_vec = text_vectorizer
    else:  # DOCUMENT
        target_model = doc_model
        target_vec = doc_vectorizer
    
    vectorized = target_vec.transform([model_input])
    prediction = target_model.predict(vectorized)[0]
    probabilities = target_model.predict_proba(vectorized)[0]

    confidence = float(np.max(probabilities)) * 100
    matched_keywords = heuristic_check(content)

    risk_level = "Safe"
    if prediction == 1 or len(matched_keywords) >= 2:
        risk_level = "High Risk"
    elif len(matched_keywords) == 1:
        risk_level = "Suspicious"
        
    # Explainable AI (XAI) breakdown
    xai_reasons = []
    
    if len(matched_keywords) > 0:
        xai_reasons.append({
            "factor": "Suspicious Keywords",
            "description": f"Found potentially dangerous words: {', '.join(matched_keywords)}",
            "impact": "High" if len(matched_keywords) >= 2 else "Medium"
        })
        
    if content_type == "URL":
        if "@" in content:
            xai_reasons.append({
                "factor": "Credential Masking",
                "description": "URL contains '@' symbol, which is often used to hide the true destination.",
                "impact": "High"
            })
        if "http://" in content:
            xai_reasons.append({
                "factor": "Unencrypted Connection",
                "description": "URL uses HTTP instead of secure HTTPS, indicating traffic is not encrypted.",
                "impact": "Medium"
            })
        if len(content) > 75:
            xai_reasons.append({
                "factor": "Unusual Length",
                "description": f"URL length ({len(content)} chars) is unusually long, common in obfuscated malicious links.",
                "impact": "Low"
            })
    elif content_type == "DOCUMENT":
        if len(content) < 50:
            xai_reasons.append({
                "factor": "Insufficient Content",
                "description": "Document contains very little extractable text, which might indicate an image-based payload.",
                "impact": "Medium"
            })
            
    if prediction == 1:
        xai_reasons.append({
            "factor": "Lexical Analysis",
            "description": "The Machine Learning model classified the lexical structure as malicious based on known patterns.",
            "impact": "Critical"
        })
    else:
        xai_reasons.append({
            "factor": "Lexical Analysis",
            "description": "The lexical structure appears standard and aligns with benign samples.",
            "impact": "Positive"
        })

    result = {
        "type": content_type,
        "input": content[:500] + "..." if len(content) > 500 else content,
        "ml_prediction": "Phishing" if prediction == 1 else "Legitimate",
        "confidence": round(confidence, 2),
        "risk_level": risk_level,
        "matched_keywords": matched_keywords,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "xai_analysis": {
            "summary": f"Detected as {risk_level.upper()} with {round(confidence, 2)}% confidence.",
            "reasons": xai_reasons
        }
    }

    scan_history.append(result)
    return result

# ==========================
# ENDPOINTS
# ==========================

import PyPDF2
import io
from fastapi import UploadFile, File, HTTPException

@app.post("/scan-url")
def scan_url(data: URLRequest):
    return scan_content(data.url, "URL")

@app.post("/scan-text")
def scan_text(data: TextRequest):
    return scan_content(data.text, "TEXT")

@app.post("/scan-doc")
async def scan_doc(file: UploadFile = File(...)):
    filename = file.filename.lower()
    if not filename.endswith(".pdf") and not filename.endswith(".txt"):
         raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported for now.")
         
    content = ""
    try:
        file_bytes = await file.read()
        if file.filename.endswith(".pdf"):
            reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    content += text + "\n"
        else:
            content = file_bytes.decode("utf-8", errors="ignore")
            
        if not content.strip():
            return scan_content("No extractable text found in document.", "DOCUMENT")
            
        return scan_content(content, "DOCUMENT")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/history")
def get_history():
    return scan_history

@app.get("/stats")
def get_stats():
    total = len(scan_history)
    high = len([x for x in scan_history if x["risk_level"] == "High Risk"])
    safe = len([x for x in scan_history if x["risk_level"] == "Safe"])

    return {
        "total_scans": total,
        "high_risk": high,
        "safe": safe
    }

@app.get("/")
def root():
    return {"message": "CampusShield AI Backend Running 🚀"}