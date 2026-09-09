import re
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser , PydanticOutputParser
from app.pipeline.schemas import SentimentResult
from dotenv import load_dotenv

load_dotenv()

MAX_CHAR_LIMIT = 2000

def preprocess_feedback(raw_input:dict) -> dict:
    """
    Strips excessive whitespace and normalizes text before sending to the LLM.
    Expects a dict with a 'message' key.
    """
    message = raw_input.get("message" , "")

    sanitized_message = re.sub(r'\s+' , ' ' , message).strip()

    clean_message = sanitized_message[:MAX_CHAR_LIMIT]
    return {"message":clean_message}

model = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite")
parser = StrOutputParser()
structured_output = PydanticOutputParser(pydantic_object=SentimentResult)

prompt = PromptTemplate(
    template="""
    You are an expert feedback analyzer.
    Extract the sentiment, confidence score, main topics, urgency level,
    and a one-sentence summary from the provided customer feedback.
    Strictly adhere to the requested schema.
    Here is the feedback below :\n
    {message}\n
    {format_instruction}
""",
    input_variables=["message"],
    partial_variables={"format_instruction":structured_output.get_format_instructions()}
)

classify_sentiment = prompt | model | parser

