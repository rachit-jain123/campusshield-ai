import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import os

# Create /model dir if not exists
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

# Synthetic Text Data (Hackathon Quality)
data = {
    'text': [
        # Phishing / Social Engineering
        "Urgent: Your account will be locked in 24 hours. Click here to verify now.",
        "Congratulations! You've been selected for a $1000 Walmart gift card. Claim at this link.",
        "Your package is pending delivery. Please update your shipping address with a $2.99 fee.",
        "Security Alert: Unauthorized login attempt detected from Russia. Reset your password immediately.",
        "Hi, I'm the CEO. I need you to urgently buy 5 Apple gift cards for a client meeting.",
        "You have won the foreign lottery! Please send your bank details to claim your prize.",
        "Verify your Apple ID now or your iCloud will be permanently deleted.",
        "Dear customer, your PayPal account is limited. Confirm your identity to restore access.",
        "Final notice: Pay your outstanding tax debt or face immediate arrest by the IRS.",
        "Update your Office365 credentials to continue receiving emails.",
        
        # Safe / Normal
        "Hey, are we still on for lunch tomorrow at 12?",
        "Please review the attached quarterly financial report when you have a moment.",
        "The project meeting has been rescheduled to Thursday at 10 AM EST.",
        "I'll be out of office next week for vacation. Contact Sarah for emergencies.",
        "Can you send over the final draft of the presentation?",
        "Looking forward to the team building event on Friday!",
        "Thanks for the update, I will look into those bugs this afternoon.",
        "Happy birthday! I hope you have a wonderful day celebrating.",
        "Just a reminder to submit your timesheets by the end of the day.",
        "Let's catch up later over coffee to discuss the new features."
    ],
    'label': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] # 1 Phish, 0 Safe
}

df = pd.DataFrame(data)

print("Training Text Model...")
vectorizer = TfidfVectorizer(max_features=1000)
X = vectorizer.fit_transform(df['text'])
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Text Model Accuracy: {accuracy * 100:.2f}%")

joblib.dump(model, os.path.join(MODEL_DIR, "text_model.pkl"))
joblib.dump(vectorizer, os.path.join(MODEL_DIR, "text_vectorizer.pkl"))

print("✅ Text Model Saved successfully!")
