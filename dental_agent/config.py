"""
Dental Clinic AI Chatbot - Configuration Settings
Google ADK 2.0 MVP Configuration
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Clinic Details
    CLINIC_NAME: str = "SmileSync Dental Clinic"
    TIMEZONE: str = "America/Los_Angeles"

    # LLM Settings
    GEMINI_MODEL_NAME: str = os.getenv("GEMINI_MODEL_NAME", "gemini-3.6-flash")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # SQLite Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./dental_clinic.db")

    # Logging Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
