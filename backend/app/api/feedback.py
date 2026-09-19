from fastapi import APIRouter , Depends , HTTPException , BackgroundTasks
from sqlmodel import Session
from pydantic import BaseModel
from app.db import get_session , engine
from app.models import Feedback
from app.pipeline.router import full_pipeline

router = APIRouter(prefix="/feedback", tags=["Feedback"])

class FeedbackSubmitRequest(BaseModel):
    customer_id:str
    message:str

def process_feedback_bg_task(feedback_id:int):
    # runs the llm pipeline in bg and updates the db
    with Session(engine) as session:
        feedback = session.get(Feedback , feedback_id)
        if not feedback:
            return
        try:
            # starting the llm pipeline
            print(f"[PIPELINE] processing feedback {feedback_id}...")
            pipeline_result = full_pipeline.invoke({"message":feedback.message})

            agent_output = pipeline_result["agent_output"]
            sentiment_result = pipeline_result["sentiment_result"]

            feedback.sentiment = sentiment_result.sentiment
            feedback.confidence = sentiment_result.confidence
            feedback.urgency = sentiment_result.urgency
            feedback.summary = sentiment_result.summary

            action_taken = "log_only"
            custom_message = None
            if hasattr(agent_output , 'tool_calls') and agent_output.tool_calls:
                tool_call = agent_output.tool_calls[0]
                tool_name = agent_output.tool_calls[0]['name']
                action_taken = f"tool_called: {tool_name}"

                if tool_name == "request_rating_tool" and "args" in tool_call:
                    custom_message = tool_call["args"].get("custom_msg")

            feedback.status = "completed"
            feedback.action_taken = action_taken
            feedback.custom_message = custom_message

            session.add(feedback)
            session.commit()
            print(f"[PIPELINE] feedback {feedback_id} completed.")
        
        except Exception as e:
            print(f"[PIPELINE FAILED] feedback id : {feedback_id}")
            print(f"failure reason : {e}")
            feedback.status = "failed"
            session.add(feedback)
            session.commit()


@router.post("/")
def submit_feedback(
    request: FeedbackSubmitRequest,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session)
):
    # get the feedback , save it as 'processing' and queue the ai task
    new_feedback = Feedback(
        customer_id=request.customer_id,
        message=request.message,
        status="processing"
    )
    session.add(new_feedback)
    session.commit()
    session.refresh(new_feedback)

    background_tasks.add_task(process_feedback_bg_task , new_feedback.id)


    return {"id": new_feedback.id , "status": "processing"}

@router.get("/{feedback_id}")
def get_feedback(feedback_id:int , session: Session = Depends(get_session)):
    feedback = session.get(Feedback , feedback_id)
    if not feedback:
        raise HTTPException(
            status_code=404,
            detail="feedback not found"
        )

    return feedback
