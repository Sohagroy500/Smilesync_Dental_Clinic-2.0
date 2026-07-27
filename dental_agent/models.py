"""
SQLAlchemy Models for Dental Clinic Database
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from dental_agent.database import Base

class Appointment(Base):
    """
    Appointment Table Schema
    Stores confirmed dental appointments in SQLite.
    """
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    appointment_id = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(30), nullable=False)
    appointment_date = Column(String(50), nullable=False, default="July 30, 2026")
    appointment_start_time = Column(String(30), nullable=False, default="10:00 AM")
    appointment_end_time = Column(String(30), nullable=False, default="10:30 AM")
    duration = Column(String(30), default="30 minutes", nullable=False)
    status = Column(String(30), default="Booked", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self) -> dict:
        """
        Convert appointment model instance to dictionary.
        """
        return {
            "id": self.id,
            "appointment_id": self.appointment_id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "appointment_date": self.appointment_date,
            "appointment_start_time": self.appointment_start_time,
            "appointment_end_time": self.appointment_end_time,
            "duration": self.duration,
            "status": self.status,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }
