"""
ADK 2.0 Function Node: Detect Intent
Routes the workflow to Clinic Question or Appointment Booking branch.
"""

import logging
from dental_agent.services.intent_service import classify_intent

logger = logging.getLogger("dental_agent.nodes.detect_intent")

def detect_intent_node(state: dict) -> dict:
    """
    Function node to detect user intent.
    Updates state['intent'] with 'clinic_question' or 'appointment_booking'.
    """
    user_message = state.get("user_message", "")
    
    # Classify intent using Gemini 3.1 Flash Lite
    intent = classify_intent(user_message)
    
    updated_state = dict(state)
    updated_state["intent"] = intent

    logger.info(f"[Node: DetectIntent] User Query: '{user_message}' -> Classified Intent: '{intent}'")
    return updated_state
