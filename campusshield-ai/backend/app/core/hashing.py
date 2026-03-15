import hashlib
from app.core.config import settings

def hash_user(value: str):
    return hashlib.sha256(
        (value + settings.HASH_SALT).encode()
    ).hexdigest()