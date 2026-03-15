import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import os

# Create /model dir if not exists
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

# Synthetic Document Data (Hackathon Quality)
data = {
    'text': [
        # Phishing / Malicious Documents
        "INVOICE OVERDUE. Please click the hidden macro link below to view your charge details. Do not ignore.",
        "Confidential Salary Report 2026. Enable Macros to view the encrypted content.",
        "This document is protected by Microsoft. Please click 'Enable Content' to decrypt the file.",
        "Your recent order #99281 has been processed. Download the attached receipt to view the tracking. http://malicious-tracker.link",
        "W2 Tax Form 2025. Please log in with your corporate credentials to view the secure PDF.",
        "You have a secured message from HR regarding your termination. Open the link to read.",
        "To view this secure Adobe PDF, please click the link to verify your email password.",
        
        # Safe / Normal Documents
        "Quarterly Business Review Q1 2026. Summary of financial performance and upcoming OKRs.",
        "Employee Handbook 2026. Please read the updated policies on remote work and vacation time.",
        "Project Alpha Architecture Design Document. Details the integration between the new API and the legacy database.",
        "Meeting minutes from the board of directors. Discussed Q3 budget allocations.",
        "Research paper on the applications of Reinforcement Learning in cybersecurity. Abstract: This paper explores...",
        "Receipt for software subscription. Total cost: $49.99 billed to Visa ending in 1234.",
        "Draft syllabus for CS101 Introduction to Computer Science. Includes weekly topics and grading rubric."
    ],
    'label': [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0] # 1 Malicious, 0 Safe
}

df = pd.DataFrame(data)

print("Training Document Model...")
vectorizer = TfidfVectorizer(max_features=1500)
X = vectorizer.fit_transform(df['text'])
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Document Model Accuracy: {accuracy * 100:.2f}%")

joblib.dump(model, os.path.join(MODEL_DIR, "doc_model.pkl"))
joblib.dump(vectorizer, os.path.join(MODEL_DIR, "doc_vectorizer.pkl"))

print("✅ Document Model Saved successfully!")
