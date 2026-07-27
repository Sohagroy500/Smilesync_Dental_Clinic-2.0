"""
Intent Classification Service
Classifies user incoming chat message into:
1. "clinic_question"
2. "appointment_booking"
"""

import os
import json
import logging
from google import genai
from google.genai import types
from dental_agent.config import settings

logger = logging.getLogger("dental_agent.intent_service")

def classify_intent(message: str) -> str:
    """
    Classifies user message into 'clinic_question' or 'appointment_booking'.
    Uses Gemini 3.6 Flash with Python keyword backup fallback.
    """
    text_lower = message.lower().strip()

    # Fast-path keyword backup check
    booking_keywords = [
        "book", "appointment", "schedule", "reserve", "slot", "visit", 
        "teeth whitening", "invisalign", "implant", "cleaning", "consultation"
    ]
    
    # Check Gemini API for intent classification
    try:
        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key) if api_key else genai.Client()

        prompt = f"""
Classify the following customer chat message for a dental clinic into EXACTLY ONE category:
- "appointment_booking" if the customer wants to book, schedule, request, or reserve a dental appointment or consultation.
- "clinic_question" if the customer is asking a question about clinic hours, pricing, doctors, services, location, or general inquiries.

Customer message: "{message}"

Respond with ONLY JSON:
{{"intent": "clinic_question" | "appointment_booking"}}
"""

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.0,
                response_mime_type="application/json"
            )
        )
        parsed = json.loads(response.text or "{}")
        classified_intent = parsed.get("intent")
        if classified_intent in ["clinic_question", "appointment_booking"]:
            return classified_intent
    except Exception as e:
        logger.warning(f"Intent classification LLM call fallback: {e}")

    # Fallback to Python keyword heuristic
    if any(kw in text_lower for kw in booking_keywords):
        return "appointment_booking"

    return "clinic_question"
