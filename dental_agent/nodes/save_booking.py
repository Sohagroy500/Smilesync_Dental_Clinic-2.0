"""
ADK 2.0 Function Node: Save Booking
Generates unique Appointment ID and persists appointment record into SQLite database.
"""

import logging
from dental_agent.database import SessionLocal
from dental_agent.services.booking_service import save_appointment

logger = logging.getLogger("dental_agent.nodes.save_booking")

def save_booking_node(state: dict) -> dict:
    """
    Function node to save appointment.
    1. Extracts validated customer info.
    2. Queries appointment database for next available 30-minute slot within business hours.
    3. Generates unique Appointment ID and saves record to SQLite.
    """
    updated_state = dict(state)
    customer_info = updated_state.get("customer_info", {})

    full_name = customer_info.get("full_name", "")
    email = customer_info.get("email", "")
    phone = customer_info.get("phone", "")

    db = SessionLocal()
    try:
        appointment = save_appointment(
            db=db,
            full_name=full_name,
            email=email,
            phone=phone
        )
        if appointment:
            updated_state["appointment"] = appointment.to_dict()
            updated_state["no_slots_available"] = False
            logger.info(f"[Node: SaveBooking] Stored Appointment ID: {appointment.appointment_id}")
        else:
            updated_state["appointment"] = None
            updated_state["no_slots_available"] = True
            logger.warning("[Node: SaveBooking] No available slots found.")
    finally:
        db.close()

    return updated_state
