def check_login(new_device: bool, new_location: bool):
    risk = 0
    reasons = []

    if new_device:
        risk += 40
        reasons.append("New device login")

    if new_location:
        risk += 40
        reasons.append("New geographic location")

    return {
        "risk_score": risk,
        "reasons": reasons,
        "action": "Step-up Authentication Required" if risk > 50 else "Login Approved"
    }