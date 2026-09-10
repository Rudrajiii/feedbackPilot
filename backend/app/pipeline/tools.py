from langchain_core.tools import tool

@tool
def request_rating_tool(customer_id: str , custom_msg:str) -> str:
    """Sends a friendly 5-star rating request to a happy customer."""
    print(f"\n[LOYALTY ACTION] Requesting rating from {customer_id}...")
    print(f"Message: {custom_msg}")
    return "Rating request sent successfully."

@tool
def notify_support_tool(customer_id:str, complaint_summary:str , urgency: str) -> str:
    """Escalates negative feedback to the human support team."""
    print(f"\n[ESCALATION ACTION] Alerting Support for {customer_id}...")
    print(f"Urgency: [{urgency.upper()}] | Issue: {complaint_summary}")
    return "Support team notified."