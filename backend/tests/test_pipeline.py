import pytest
from app.pipeline.router import full_pipeline

def test_full_pipeline():
    # test positive and negative feedback
    test_feedback = [
        {  
            "message": "I ordered paneer and milk via Swiggy Instamart and they arrived two hours late and warm. Totally unacceptable service!"
        },
        {
            "message": "I am so impressed! I ordered atta, rice, and some spices on Swiggy Instamart, and everything was delivered in under 15 minutes. The packaging was perfect and the delivery executive was super polite."
        }
    ]
    
    print("Running pipeline...")
    result = full_pipeline.invoke(test_feedback[1])
    
    if hasattr(result, 'tool_calls') and result.tool_calls:
        print("\n--- LLM Tool Call Executed ---")
        print(result.tool_calls)

    assert hasattr(result, 'tool_calls')
    assert len(result.tool_calls) > 0