from langchain_core.tools import tool
from app.services.rating_service import get_rating_service
from app.services.support_notifier import get_support_notifier

@tool
def request_rating_tool(customer_id: str , custom_msg:str) -> str:
    """Sends a friendly 5-star rating request to a happy customer."""
    service = get_rating_service()
    return service.request_rating(customer_id , custom_msg)

@tool
def notify_support_tool(customer_id:str, complaint_summary:str , urgency: str) -> str:
    """Escalates negative feedback to the human support team."""
    service = get_support_notifier()
    return service.notify(customer_id, complaint_summary, urgency)