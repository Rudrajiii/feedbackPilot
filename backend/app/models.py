from sqlmodel import SQLModel , Field
from typing import Optional
from datetime import datetime , timezone

class Feedback(SQLModel , table=True):
    id: Optional[int] = Field(default=None , primary_key=True)
    customer_id: str
    message: str

    status: str = Field(default="processing")
    # ai results
    sentiment: Optional[str] = None
    confidence: Optional[str] = None
    urgency: Optional[str] = None
    summary: Optional[str] = None
    # agent results
    action_taken: Optional[str] = None
    custom_message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

