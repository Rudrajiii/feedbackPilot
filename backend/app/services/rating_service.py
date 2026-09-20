from typing import Protocol
from app.config import FEEDBACK_MODE

class RatingService(Protocol):
    def request_rating(self , customer_id: str, custom_message: str) -> str:
        pass

class MockRatingService:
    def notify(self , customer_id: str, custom_message: str) -> str:
        print(f"\n[MOCK SMS SERVICE] Sending message to {customer_id}")
        print(f"Payload: {custom_message}")
        return "Mock SMS delivered."

class RealRatingService:
    def request_rating(self, customer_id: str, custom_message: str) -> str:
        print(f"\n[LIVE SMS SERVICE] Authenticating...")
        return "Real SMS delivered."

def get_rating_service() -> RatingService:
    return RealRatingService() if FEEDBACK_MODE == "live" else MockRatingService()