import pytest
from app.pipeline.chains import preprocess_feedback , classify_sentiment

def test_preprocess_feedback_strips_whitespace():
    raw_input = {"message": "The   shipping was   SO SLOW!! \n\n"}
    result = preprocess_feedback(raw_input)

    assert result['message'] == "The shipping was SO SLOW!!"

def test_preprocess_feedback_truncates_length():
    long_text = "A" * 2500
    raw_input = {"message": long_text}
    result = preprocess_feedback(raw_input)
    
    assert len(result["message"]) == 2000


# it works but takes time due to api call

# def test_get_sample_sentiment():
#     message = """
#         Dogshit product, petty developer. It should be free. Waste of money, and time.
#     """
#     result = classify_sentiment.invoke({"message":message})
#     print(result)

#     assert len(result) > 0