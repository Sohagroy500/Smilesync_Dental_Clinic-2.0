"""
ADK 2.0 Function Node: Confirmation
Generates final appointment booking confirmation message.
"""

import logging

logger = logging.getLogger("dental_agent.nodes.confirmation")

def confirmation_node(state: dict) -> dict:
    """
    Function node to return booking confirmation.
    Includes Appointment ID, Date, Time, and friendly clinic closing message.
    """
    updated_state = dict(state)
    no_slots = updated_state.get("no_slots_available", False)

    if no_slots:
        message = (
            "We apologize, but there are currently no available 30-minute appointment slots in our schedule. "
            "Please try again later or contact SmileSync Dental Clinic directly at +1 (555) 019-2834 to speak with our reception desk."
        )
        updated_state["response"] = message
        updated_state["status"] = "NO_SLOTS"
        return updated_state

    appointment = updated_state.get("appointment", {})
    appt_id = appointment.get("appointment_id", "N/A")
    appt_date = appointment.get("appointment_date", "July 30, 2026")
    start_time = appointment.get("appointment_start_time", "10:00 AM")
    end_time = appointment.get("appointment_end_time", "10:30 AM")

    confirmation_message = (
        f"✅ Your appointment has been booked successfully!\n\n"
        f"Appointment ID: {appt_id}\n\n"
        f"Date: {appt_date}\n\n"
        f"Time: {start_time} – {end_time}\n\n"
        f"We look forward to seeing you at SmileSync Dental Clinic."
    )

    updated_state["response"] = confirmation_message
    updated_state["status"] = "COMPLETED"

    logger.info(f"[Node: Confirmation] Generated confirmation message for Appointment ID: {appt_id}")
    return updated_state
