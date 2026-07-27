"""
ADK 2.0 Function Node: Receive Message & Decode Payload
Handles plain JSON payloads and Pub/Sub base64 encoded messages.
"""

import json
import base64
import logging

logger = logging.getLogger("dental_agent.nodes.receive_message")

def decode_payload(raw_payload: dict) -> dict:
    """
    Decodes incoming chat message payload.
    Supports:
    1. Plain JSON: {"message": "User query here", ...}
    2. Pub/Sub Event: {"message": {"data": "base64_string..."}}
    """
    message_text = ""
    customer_info = {}

    if not isinstance(raw_payload, dict):
        return {"user_message": str(raw_payload), "customer_info": {}}

    # Case 1: Google Cloud Pub/Sub Event format
    if "message" in raw_payload and isinstance(raw_payload["message"], dict) and "data" in raw_payload["message"]:
        try:
            encoded_data = raw_payload["message"]["data"]
            decoded_bytes = base64.b64decode(encoded_data)
            decoded_str = decoded_bytes.decode("utf-8")
            
            # Try parsing decoded pub/sub payload as JSON or text
            try:
                parsed_json = json.loads(decoded_str)
                if isinstance(parsed_json, dict):
                    message_text = parsed_json.get("message") or parsed_json.get("user_message") or decoded_str
                    customer_info = {
                        "full_name": parsed_json.get("full_name") or parsed_json.get("name"),
                        "email": parsed_json.get("email"),
                        "phone": parsed_json.get("phone") or parsed_json.get("phone_number")
                    }
                else:
                    message_text = decoded_str
            except json.JSONDecodeError:
                message_text = decoded_str
        except Exception as e:
            logger.error(f"Failed to decode Pub/Sub base64 data: {e}")
            message_text = str(raw_payload)

    # Case 2: Plain JSON request format
    else:
        message_text = raw_payload.get("message") or raw_payload.get("user_message") or raw_payload.get("query") or ""
        customer_info = {
            "full_name": raw_payload.get("full_name") or raw_payload.get("name"),
            "email": raw_payload.get("email"),
            "phone": raw_payload.get("phone") or raw_payload.get("phone_number")
        }

    return {
        "user_message": message_text.strip(),
        "customer_info": {k: v for k, v in customer_info.items() if v is not None}
    }

def receive_message_node(state: dict) -> dict:
    """
    Function node that initializes workflow state and decodes payload.
    """
    raw_payload = state.get("raw_payload") or state
    decoded = decode_payload(raw_payload)

    updated_state = dict(state)
    updated_state["user_message"] = decoded["user_message"]
    
    # Merge existing customer info
    current_info = updated_state.get("customer_info", {})
    current_info.update(decoded["customer_info"])
    updated_state["customer_info"] = current_info

    logger.info(f"[Node: ReceiveMessage] Decoded message: '{decoded['user_message']}'")
    return updated_state
