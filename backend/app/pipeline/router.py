from langchain_core.runnables import RunnableBranch, RunnablePassthrough, RunnableParallel
from langchain_core.runnables import RunnableLambda
from app.pipeline.chains import classify_sentiment, preprocess_feedback
from app.pipeline.agents import positive_agent, negative_agent, neutral_agent


def extract_sentiment(inputs: dict) -> str:
    result = inputs["sentiment_result"]
    return result.sentiment if hasattr(result , "sentiment") else result["sentiment"]

feedback_router = RunnableBranch(
    (lambda x: extract_sentiment(x) == "positive", positive_agent),
    (lambda x: extract_sentiment(x) == "negetive", negative_agent),
    neutral_agent
)

full_pipeline = (
    RunnableLambda(preprocess_feedback)
    | RunnableParallel(
        original_message=RunnablePassthrough(),
        sentiment_result=classify_sentiment
    )
    | RunnableParallel(
        agent_output=feedback_router,
        sentiment_result=lambda x: x["sentiment_result"]
    )
)