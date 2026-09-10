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

'''
sample output from this test
backend/tests/test_chains.py::test_get_sample_sentiment sentiment='positive' confidence=0.98 topics=['AI tool integration', 'information search', 'research accuracy'] urgency='low' summary='The user highly praises the combination of AI tools for making work-related research and information searching easier and more accurate.'
'''

def test_get_sample_sentiment():
    message = """
        I love the combination of several AI tools. Makes searching for information much easier. I use this while doing research at work and I've found it to be very helpful and accurate.
    """
    result = classify_sentiment.invoke({"message":message})
    print(result)

    assert None
