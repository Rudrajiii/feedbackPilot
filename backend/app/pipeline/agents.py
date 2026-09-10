from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda
from app.pipeline.tools import request_rating_tool, notify_support_tool
from dotenv import load_dotenv

load_dotenv()

agent = ChatGoogleGenerativeAI(model="gemini-3.5-flash" , temperature=0.6)

def prep_positive(inputs: dict) -> dict:
    return {
        "original_message": inputs["original_message"]["message"],
        "summary": inputs["sentiment_result"].summary
    }

def prep_negative(inputs: dict) -> dict:
    return {
        "original_message": inputs["original_message"]["message"],
        "summary": inputs["sentiment_result"].summary,
        "urgency": inputs["sentiment_result"].urgency
    }

positive_prompt = ChatPromptTemplate([
    ("system" , "You are a customer loyalty agent. The customer left positive feedback. Call the request_rating_tool to ask them for a review. Draft a friendly custom_message referencing their specific feedback."),
    ("human" , "Original Feedback: {original_message}\nSummary: {summary}")
])

positive_agent = RunnableLambda(prep_positive) | positive_prompt | agent.bind_tools([request_rating_tool])

negative_prompt = ChatPromptTemplate([
    ("system","You are an escalation agent. The customer left negative feedback. Call the notify_support_tool with a concise summary and the required urgency level."),
    ("human","Original Feedback: {original_message}\nSummary: {summary}\nUrgency: {urgency}")
])

negative_agent = RunnableLambda(prep_negative) | negative_prompt | agent.bind_tools([notify_support_tool])

def neutral_logger(inputs:dict) -> str:
    summary = inputs["sentiment_result"].summary
    print(f"\n[LOG ONLY] Neutral feedback recorded: {summary}")
    return "Logged to database."

neutral_agent = RunnableLambda(neutral_logger)

