"""
Gemini LLM Service for Dental Clinic AI Chatbot
Uses Gemini 3.6 Flash for answering clinic questions and extracting information.
"""

import os
import json
import logging
from google import genai
from google.genai import types
from dental_agent.config import settings

logger = logging.getLogger("dental_agent.llm_service")

# Clinic Knowledge Context
CLINIC_KNOWLEDGE_BASE = """
SmileSync Dental Clinic Core Information:
- Clinic Name: SmileSync Dental Clinic
- Operating Hours: Monday to Friday 8:00 AM - 6:00 PM, Saturday 9:00 AM - 2:00 PM, Sunday Closed
- Location: 100 Smile Boulevard, Suite 400, San Francisco, CA 94105
- Phone: +1 (555) 019-2834
- Email: contact@smilesyncdental.com

Available Services & Pricing Overview:
1. Laser Teeth Whitening: $299 (Includes 60-min in-office laser treatment + custom touch-up tray)
2. Invisalign® Clear Aligners: $3,499 - $4,999 (Includes initial 3D iTero scan and retainer set)
3. Dental Implants: $1,899 / tooth (Titanium post + custom porcelain crown)
4. Porcelain Veneers: $850 / tooth
5. Painless Root Canal Therapy: $650 - $950
6. Preventive Cleaning & Oral Examination: $150
7. 24/7 Emergency Dental Care: $150 consultation + same-day emergency relief

Dentists & Specialists:
- Dr. Sarah Jenkins, DDS (Lead Cosmetic Dentist & Whitening Specialist, 14 years exp)
- Dr. Marcus Vance, DMD (Orthodontics & Invisalign Lead Specialist, 12 years exp)
- Dr. Elena Rostova, DDS (Pediatric Dentistry & Root Canal Specialist, 10 years exp)

Appointment Booking Process:
- Customers can book by providing their Full Name, Email Address, and Phone Number.
- Once provided, a unique Appointment ID is generated and stored instantly.
"""

def get_genai_client() -> genai.Client:
    """
    Returns an initialized Google GenAI client using Gemini API Key.
    """
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    if api_key:
        return genai.Client(api_key=api_key)
    return genai.Client()

def answer_clinic_question(question: str) -> str:
    """
    Uses Gemini 3.6 Flash to answer clinic questions naturally and professionally.
    If question is unrelated to the clinic, politely explains that the assistant only supports SmileSync Dental Clinic.
    """
    client = get_genai_client()

    prompt = f"""
You are the polite, intelligent AI assistant for {settings.CLINIC_NAME}.

CLINIC KNOWLEDGE BASE:
{CLINIC_KNOWLEDGE_BASE}

STRICT BOUNDARY INSTRUCTIONS:
1. Only answer questions related to {settings.CLINIC_NAME} (hours, services, dentists, treatments, location, pricing, contact, appointment process).
2. If the user asks something completely UNRELATED to dental care or the clinic (e.g. general trivia, coding, weather, sports, cooking, politics, other businesses), politely explain that you are an AI receptionist for SmileSync Dental Clinic and can only assist with clinic-related inquiries and appointment bookings.
3. Keep answers warm, professional, concise, and helpful.

User Question: {question}
"""

    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                system_instruction=f"You are the official AI assistant for {settings.CLINIC_NAME}."
            )
        )
        return response.text or f"Thank you for contacting {settings.CLINIC_NAME}. How may I help you with our dental services today?"
    except Exception as e:
        logger.error(f"Error calling Gemini API for clinic question: {e}")
        # Fallback response
        return (
            f"Welcome to {settings.CLINIC_NAME}! We offer Laser Teeth Whitening ($299), Invisalign ($3,499+), "
            f"and 3D Dental Implants ($1,899). Our clinic is open Monday-Friday 8am-6pm and Saturday 9am-2pm. "
            f"Would you like to schedule an appointment?"
        )

def extract_info_from_text(user_message: str) -> dict:
    """
    Uses Gemini 3.6 Flash to assist in extracting customer full_name, email, and phone from free text.
    Returns JSON object with extracted fields.
    """
    client = get_genai_client()

    prompt = f"""
Extract any customer contact details mentioned in the user's message for booking a dental appointment.

User message: "{user_message}"

Extract JSON with these keys (use null if not mentioned):
{{
  "full_name": string or null,
  "email": string or null,
  "phone": string or null
}}

Respond ONLY with valid raw JSON without markdown code blocks.
"""

    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.0,
                response_mime_type="application/json"
            )
        )
        text = (response.text or "{}").strip()
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        return {
            "full_name": data.get("full_name") or None,
            "email": data.get("email") or None,
            "phone": data.get("phone") or None
        }
    except Exception as e:
        logger.warning(f"Fallback extraction used: {e}")
        return {"full_name": None, "email": None, "phone": None}
