from pydantic import BaseModel , Field
from typing import Literal

class SentimentResult(BaseModel):
    sentiment: Literal["positive" , "neutral" , "negetive"] = Field(
        description="The overall sentiment of the customer feedback."
    )

    confidence: float = Field(
        description="Confidence score of the sentiment classification from 0.0 to 1.0."
    )

    topics: list[str] = Field(
        description="A list of 1-3 word topics mentioned in the feedback (e.g., 'shipping speed', 'product quality')."
    )

    urgency: Literal["low" , "mid" , "high"] = Field(
        description="The urgency level for customer support to address this feedback."
    )

    summary: str = Field(
        description="A one-sentence summary of the core issue or praise."
    )


