"""
ADK 2.0 Function Node: Validate Customer
Validates customer input strictly using Python business rules.
"""

import logging
from dental_agent.validators import validate_customer_payload
from dental_agent.nodes.collect_customer_info import RequestInputSignal

logger = logging.getLogger("dental_agent.nodes.validate_customer")

def validate_customer_node(state: dict) -> dict:
    """
    Function node to validate customer data.
    Validates required fields, email format, phone format, and strips whitespace.
    If validation fails, raises RequestInputSignal for corrections.
    """
    updated_state = dict(state)
    customer_info = updated_state.get("customer_info", {})

    is_valid, cleaned_data, errors = validate_customer_payload(customer_info)

    if not is_valid:
        error_msg = f"Validation Error: {'; '.join(errors)}. Please check and re-enter your details."
        logger.warning(f"[Node: ValidateCustomer] Validation failed: {errors}")

        updated_state["requires_input"] = True
        updated_state["validation_errors"] = errors
        updated_state["prompt"] = error_msg

        # Raise ADK 2.0 RequestInput pause signal with specific validation feedback
        raise RequestInputSignal(
            prompt=error_msg,
            missing_fields=["customer_info_correction"],
            current_info=customer_info
        )

    # Store validated cleaned data in state
    updated_state["customer_info"] = cleaned_data
    updated_state["is_validated"] = True
    logger.info(f"[Node: ValidateCustomer] Validation passed: {cleaned_data}")

    return updated_state
