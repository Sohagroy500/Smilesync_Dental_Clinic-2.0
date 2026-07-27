"""
Booking Service - Pure Python Business Logic
Generates unique Appointment IDs and handles SQLite database persistence.
Never uses LLM for ID generation or database persistence.
"""

import random
import datetime
import logging
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from dental_agent.models import Appointment

logger = logging.getLogger("dental_agent.booking_service")

def generate_appointment_id(db: Session) -> str:
    """
    Generates a unique Appointment ID in Python.
    Format: APT-XXXXXX
    Example: APT-000124
    """
    while True:
        code = f"APT-{random.randint(100000, 999999)}"
        existing = db.query(Appointment).filter(Appointment.appointment_id == code).first()
        if not existing:
            return code

def find_next_available_slot(db: Session) -> Optional[Tuple[str, str, str]]:
    """
    Finds the next available 30-minute appointment slot within clinic business hours:
    - Monday to Friday: 8:00 AM to 6:00 PM
    - Saturday: 9:00 AM to 2:00 PM
    - Sunday: Closed

    Returns tuple: (date_str, start_time_str, end_time_str)
    Example: ("July 30, 2026", "10:00 AM", "10:30 AM")
    """
    # Query all currently booked appointments
    booked_records = db.query(Appointment).filter(Appointment.status == "Booked").all()
    booked_slots = set()
    for rec in booked_records:
        if rec.appointment_date and rec.appointment_start_time:
            booked_slots.add((rec.appointment_date, rec.appointment_start_time))

    # Search starting from tomorrow
    start_base = datetime.datetime.now() + datetime.timedelta(days=1)

    for day_offset in range(30):
        current_date = start_base + datetime.timedelta(days=day_offset)
        weekday = current_date.weekday() # 0 = Monday, 5 = Saturday, 6 = Sunday

        if weekday == 6:
            # Sunday closed
            continue

        if weekday in range(0, 5):
            # Mon - Fri: 8:00 AM to 6:00 PM (18:00)
            start_hour, end_hour = 8, 18
        else:
            # Sat: 9:00 AM to 2:00 PM (14:00)
            start_hour, end_hour = 9, 14

        date_str = current_date.strftime("%B %d, %Y") # e.g. "July 30, 2026"
        curr_time = datetime.datetime.combine(current_date.date(), datetime.time(start_hour, 0))
        end_time_boundary = datetime.datetime.combine(current_date.date(), datetime.time(end_hour, 0))

        while curr_time + datetime.timedelta(minutes=30) <= end_time_boundary:
            slot_end = curr_time + datetime.timedelta(minutes=30)
            
            # Format time without leading zero for hours (e.g., 10:00 AM, 8:30 AM)
            start_str = curr_time.strftime("%I:%M %p").lstrip("0")
            end_str = slot_end.strftime("%I:%M %p").lstrip("0")

            if (date_str, start_str) not in booked_slots:
                return (date_str, start_str, end_str)

            curr_time = slot_end

    return None

def save_appointment(db: Session, full_name: str, email: str, phone: str) -> Optional[Appointment]:
    """
    Saves confirmed appointment into SQLite database using pure Python scheduling logic.
    Finds first available 30-minute slot during clinic hours.
    Returns Appointment model instance or None if no slots available.
    """
    slot = find_next_available_slot(db)
    if not slot:
        logger.warning("No available appointment slots found in the upcoming 30 days.")
        return None

    date_str, start_time_str, end_time_str = slot
    appointment_id = generate_appointment_id(db)

    new_appointment = Appointment(
        appointment_id=appointment_id,
        full_name=full_name,
        email=email,
        phone=phone,
        appointment_date=date_str,
        appointment_start_time=start_time_str,
        appointment_end_time=end_time_str,
        duration="30 minutes",
        status="Booked",
        created_at=datetime.datetime.utcnow()
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    logger.info(f"Successfully booked appointment {appointment_id} for {full_name} on {date_str} at {start_time_str} - {end_time_str}.")
    return new_appointment
