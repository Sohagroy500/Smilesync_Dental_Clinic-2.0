"""
ADK 2.0 Function Node: Collect Customer Information
Collects Full Name, Email Address, and Phone Number.
Uses RequestInput whenever information is missing.
"""

import logging
from dental_agent.services.llm_service import extract_info_from_text

logger = logging.getLogger("dental_agent.nodes.collect_customer_info")

class RequestInputSignal(Exception):
    """
    ADK 2.0 RequestInput Signal raised to pause workflow execution and request missing user input.
    """
    def __init__(self, prompt: str, missing_fields: list[str], current_info: dict):
        self.prompt = prompt
        self.missing_fields = missing_fields
        self.current_info = current_info
        super().__init__(prompt)

def collect_customer_info_node(state: dict) -> dict:
    """
    Function node that collects customer information.
    1. Extracts any contact details provided in state or message.
    2. Identifies missing fields (full_name, email, phone).
    3. If any field is missing, triggers RequestInput pause to prompt customer.
    """
    updated_state = dict(state)
    current_info = dict(updated_state.get("customer_info", {}))
    user_message = updated_state.get("user_message", "")

    # Attempt extraction from free text if fields are missing
    if not (current_info.get("full_name") and current_info.get("email") and current_info.get("phone")):
        extracted = extract_info_from_text(user_message)
        for key in ["full_name", "email", "phone"]:
            if not current_info.get(key) and extracted.get(key):
                current_info[key] = extracted[key]

    updated_state["customer_info"] = current_info

    # Check for missing fields
    missing = []
    if not current_info.get("full_name"):
        missing.append("Full Name")
    if not current_info.get("email"):
        missing.append("Email Address")
    if not current_info.get("phone"):
        missing.append("Phone Number")

    # If any information is missing, raise RequestInput signal / pause workflow
    if missing:
        missing_str = ", ".join(missing)
        prompt_msg = f"To complete your appointment booking, please provide your {missing_str}."
        logger.info(f"[Node: CollectCustomerInfo] Pausing workflow via RequestInput. Missing: {missing}")

        updated_state["requires_input"] = True
        updated_state["missing_fields"] = missing
        updated_state["prompt"] = prompt_msg
        
        # Raise ADK 2.0 RequestInputSignal
        raise RequestInputSignal(prompt=prompt_msg, missing_fields=missing, current_info=current_info)

    updated_state["requires_input"] = False
    logger.info(f"[Node: CollectCustomerInfo] All required customer details collected: {current_info}")
    return updated_state
