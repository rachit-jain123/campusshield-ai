def compute_hygiene(events: list):
    score = 100

    for event in events:
        if event == "phishing_click":
            score -= 20
        if event == "weak_password":
            score -= 15
        if event == "no_2fa":
            score -= 10

    return max(score, 0)