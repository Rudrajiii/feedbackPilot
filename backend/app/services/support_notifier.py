from typing import Protocol
from app.config import FEEDBACK_MODE

class SupportNotifier(Protocol):
    def notify(self , customer_id:str , summary: str , urgency: str) -> str:
        pass

class MockSupportNotifier:
    def notify(self , customer_id:str , summary: str , urgency: str) -> str:
        print(f"\n[MOCK EMAIL SERVICE] Sending email to support@company.com")
        print(f"Subject: [{urgency.upper()} URGENCY] Feedback from {customer_id}")
        print(f"Body: {summary}")
        return "Mock email delivered."

class SMTPSupportNotifier:
    def notify(self , customer_id:str , summary: str , urgency: str) -> str:
        print(f"\n[LIVE EMAIL SERVICE] Connecting to SMTP server...")
        return "Real email delivered."

def get_support_notifier() -> SupportNotifier:
    '''factory function to inject the correct service based on environment'''
    return SMTPSupportNotifier() if FEEDBACK_MODE == "live" else MockSupportNotifier() 