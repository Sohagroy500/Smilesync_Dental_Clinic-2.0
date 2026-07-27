"""
ADK 2.0 Function Node: Answer Clinic Question
Uses Gemini 3.1 Flash Lite to answer customer clinic questions.
"""

import logging
from dental_agent.services.llm_service import answer_clinic_question

logger = logging.getLogger("dental_agent.nodes.answer_question")

def answer_question_node(state: dict) -> dict:
    """
    Function node to handle clinic questions.
    Generates response and updates state['response'].
    """
    user_message = state.get("user_message", "")
    
    # Generate natural response using Gemini 3.1 Flash Lite
    answer = answer_clinic_question(user_message)

    updated_state = dict(state)
    updated_state["response"] = answer
    updated_state["status"] = "COMPLETED"

    logger.info(f"[Node: AnswerQuestion] Generated response for query: '{user_message}'")
    return updated_state
