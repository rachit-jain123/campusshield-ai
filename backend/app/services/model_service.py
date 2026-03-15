import joblib
import os

MODEL_PATH = os.path.join("model", "phishing_model1.pkl")
VECTORIZER_PATH = os.path.join("model", "vectorizer1.pkl")

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)


def predict_url(url: str):
    # Transform URL using same vectorizer used in training
    transformed_url = vectorizer.transform([url])

    prediction = model.predict(transformed_url)[0]

    if hasattr(model, "predict_proba"):
        probability = model.predict_proba(transformed_url)[0][1]
        risk_score = round(probability * 100, 2)
    else:
        risk_score = 80 if prediction == 1 else 20

    return prediction, risk_score