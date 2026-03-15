def explain(url: str, score: float):
    reasons = []

    if "@" in url:
        reasons.append("Contains '@' which can mask real domain.")
    if "http://" in url:
        reasons.append("Not using secure HTTPS.")
    if len(url) > 75:
        reasons.append("Unusually long URL.")

    if score > 75:
        summary = "High Risk – Likely Phishing"
    elif score > 40:
        summary = "Moderate Risk – Suspicious"
    else:
        summary = "Low Risk – Appears Safe"

    return {
        "summary": summary,
        "reasons": reasons
    }