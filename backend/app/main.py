from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.db import create_db_and_tables
from app.api.feedback import router as feedback_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    print("db tables are created...")
    yield
    print("shutting down...")


app = FastAPI(
    title="feedbackpilot api",
    description="agentic feedback-response pipeline",
    lifespan=lifespan
)

app.include_router(feedback_router)

@app.get("/")
def health_check():
    return {"status":"ok" , "message":"server is running..."}

