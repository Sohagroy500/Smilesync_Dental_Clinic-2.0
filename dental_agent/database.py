"""
Database setup using SQLAlchemy and SQLite for SmileSync Dental Clinic.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dental_agent.config import settings

# Create SQLite SQLAlchemy Engine
# connect_args={"check_same_thread": False} allows SQLite to be used across threads in FastAPI
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()

def get_db():
    """
    Dependency helper to obtain a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Initialize and create tables in SQLite database.
    """
    from dental_agent.models import Appointment  # import to register model
    Base.metadata.create_all(bind=engine)
