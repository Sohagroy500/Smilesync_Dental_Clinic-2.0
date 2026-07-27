"""
Helper utilities for payload processing, logging, and state formatting.
"""

import json
import logging

def setup_logging():
    """
    Configures structured logging for dental agent.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    )

def format_state_for_log(state: dict) -> str:
    """
    Formats workflow state dictionary safely for logging.
    """
    safe_state = {k: v for k, v in state.items() if k not in ["raw_payload"]}
    return json.dumps(safe_state, default=str, indent=2)
