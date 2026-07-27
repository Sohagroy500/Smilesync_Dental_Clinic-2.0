import { AdkFile } from '../types';

export const ADK_STARTER_FILES: AdkFile[] = [
  {
    path: 'dental_agent/graph.py',
    name: 'graph.py',
    language: 'python',
    description: 'Google ADK 2.0 Workflow Graph engine & topology',
    content: `"""
Google ADK 2.0 Workflow Graph Construction for SmileSync Dental Clinic AI Agent
Defines function nodes connected by edges with RequestInput human-in-the-loop support.
"""

from typing import Dict, Any, Callable
from dental_agent.nodes.receive_message import receive_message_node
from dental_agent.nodes.detect_intent import detect_intent_node
from dental_agent.nodes.answer_question import answer_question_node
from dental_agent.nodes.collect_customer_info import collect_customer_info_node, RequestInputSignal
from dental_agent.nodes.validate_customer import validate_customer_node
from dental_agent.nodes.save_booking import save_booking_node
from dental_agent.nodes.confirmation import confirmation_node

class FunctionNode:
    def __init__(self, name: str, func: Callable, description: str = ""):
        self.name = name
        self.func = func
        self.description = description

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        return self.func(state)

class DentalWorkflowGraph:
    """
    Google ADK 2.0 Workflow Graph Topology:
    Receive Message -> Decode Payload -> Detect Intent
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
                 Clinic Question                             Booking Intent
                       │                                           │
                       │                                  Collect Customer Info (RequestInput)
                       │                                           │
                       │                                  Validate Inputs
                       │                                           │
                       │                                  Save Appointment (SQLite)
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             ▼
                                       Confirmation
    """
    def __init__(self):
        self.node_receive = FunctionNode("ReceiveMessage", receive_message_node)
        self.node_detect_intent = FunctionNode("DetectIntent", detect_intent_node)
        self.node_answer_question = FunctionNode("AnswerQuestion", answer_question_node)
        self.node_collect_info = FunctionNode("CollectCustomerInfo", collect_customer_info_node)
        self.node_validate_customer = FunctionNode("ValidateCustomer", validate_customer_node)
        self.node_save_booking = FunctionNode("SaveBooking", save_booking_node)
        self.node_confirmation = FunctionNode("Confirmation", confirmation_node)

    def run(self, initial_state: Dict[str, Any]) -> Dict[str, Any]:
        state = dict(initial_state)
        state = self.node_receive.execute(state)
        state = self.node_detect_intent.execute(state)

        intent = state.get("intent", "clinic_question")
        if intent == "clinic_question":
            state = self.node_answer_question.execute(state)
        elif intent == "appointment_booking":
            state = self.node_collect_info.execute(state)
            state = self.node_validate_customer.execute(state)
            state = self.node_save_booking.execute(state)
            state = self.node_confirmation.execute(state)
        return state

def create_dental_workflow_graph() -> DentalWorkflowGraph:
    return DentalWorkflowGraph()
`
  },
  {
    path: 'dental_agent/workflow.py',
    name: 'workflow.py',
    language: 'python',
    description: 'FastAPI web service & RequestInput pause runner',
    content: `"""
FastAPI Server & Workflow Runner for Dental Clinic AI Chatbot
Exposes REST & Pub/Sub webhook endpoints for Google ADK 2.0 Workflow Graph.
"""

from fastapi import FastAPI, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from dental_agent.config import settings
from dental_agent.database import init_db, get_db
from dental_agent.graph import create_dental_workflow_graph
from dental_agent.nodes.collect_customer_info import RequestInputSignal
from dental_agent.models import Appointment

app = FastAPI(title="SmileSync Dental Clinic AI Agent (Google ADK 2.0)")

@app.on_event("startup")
def startup_event():
    init_db()

@app.post("/api/chat")
async def handle_chat_message(request: Request):
    body = await request.json()
    workflow_graph = create_dental_workflow_graph()

    initial_state = {
        "raw_payload": body,
        "customer_info": {
            "full_name": body.get("full_name") or body.get("name"),
            "email": body.get("email"),
            "phone": body.get("phone") or body.get("phone_number")
        }
    }

    try:
        final_state = workflow_graph.run(initial_state)
        return {
            "status": "success",
            "requires_input": False,
            "response": final_state.get("response", ""),
            "intent": final_state.get("intent", "clinic_question"),
            "appointment": final_state.get("appointment")
        }
    except RequestInputSignal as pause_signal:
        return {
            "status": "paused",
            "requires_input": True,
            "prompt": pause_signal.prompt,
            "missing_fields": pause_signal.missing_fields,
            "current_info": pause_signal.current_info
        }
`
  },
  {
    path: 'dental_agent/config.py',
    name: 'config.py',
    language: 'python',
    description: 'Clinic name, SQLite path & Gemini 3.6 Flash settings',
    content: `"""
Dental Clinic AI Chatbot - Configuration Settings
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CLINIC_NAME: str = "SmileSync Dental Clinic"
    TIMEZONE: str = "America/Los_Angeles"
    GEMINI_MODEL_NAME: str = os.getenv("GEMINI_MODEL_NAME", "gemini-3.6-flash")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./dental_clinic.db")

settings = Settings()
`
  },
  {
    path: 'dental_agent/database.py',
    name: 'database.py',
    language: 'python',
    description: 'SQLAlchemy SQLite database session configuration',
    content: `"""
Database setup using SQLAlchemy and SQLite for SmileSync Dental Clinic.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dental_agent.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from dental_agent.models import Appointment
    Base.metadata.create_all(bind=engine)
`
  },
  {
    path: 'dental_agent/models.py',
    name: 'models.py',
    language: 'python',
    description: 'SQLAlchemy Appointment schema for SQLite',
    content: `"""
SQLAlchemy Models for Dental Clinic Database
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from dental_agent.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    appointment_id = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(30), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "appointment_id": self.appointment_id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }
`
  },
  {
    path: 'dental_agent/validators.py',
    name: 'validators.py',
    language: 'python',
    description: 'Pure Python input validation (email, phone, name formatting)',
    content: `"""
Python Input Validators for Dental Clinic Customer Data
Strictly Python business rules (no LLM used for validation).
"""

import re
from typing import Dict, List, Tuple, Any

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
PHONE_REGEX = re.compile(r"^\\+?[0-9\\s\\-\\(\\)\\.]{7,20}$")

def clean_whitespace(text: str) -> str:
    if not text:
        return ""
    return re.sub(r"\\s+", " ", text.strip())

def validate_full_name(name: str) -> Tuple[bool, str, str]:
    cleaned = clean_whitespace(name or "")
    if not cleaned:
        return False, "", "Full name is required."
    return True, cleaned, ""

def validate_email(email: str) -> Tuple[bool, str, str]:
    cleaned = clean_whitespace(email or "").lower()
    if not cleaned or not EMAIL_REGEX.match(cleaned):
        return False, cleaned, "Invalid email address format."
    return True, cleaned, ""

def validate_phone(phone: str) -> Tuple[bool, str, str]:
    cleaned = clean_whitespace(phone or "")
    if not cleaned or not PHONE_REGEX.match(cleaned):
        return False, cleaned, "Invalid phone number format."
    return True, cleaned, ""

def validate_customer_payload(customer_data: Dict[str, Any]) -> Tuple[bool, Dict[str, str], List[str]]:
    errors: List[str] = []
    cleaned_data: Dict[str, str] = {}

    is_name_valid, name_clean, name_err = validate_full_name(customer_data.get("full_name") or "")
    if not is_name_valid: errors.append(name_err)
    else: cleaned_data["full_name"] = name_clean

    is_email_valid, email_clean, email_err = validate_email(customer_data.get("email") or "")
    if not is_email_valid: errors.append(email_err)
    else: cleaned_data["email"] = email_clean

    is_phone_valid, phone_clean, phone_err = validate_phone(customer_data.get("phone") or "")
    if not is_phone_valid: errors.append(phone_err)
    else: cleaned_data["phone"] = phone_clean

    return len(errors) == 0, cleaned_data, errors
`
  },
  {
    path: 'dental_agent/services/llm_service.py',
    name: 'llm_service.py',
    language: 'python',
    description: 'Gemini 3.6 Flash service for clinic questions & info extraction',
    content: `"""
Gemini LLM Service for Dental Clinic AI Chatbot
"""

import os
from google import genai
from google.genai import types
from dental_agent.config import settings

def answer_clinic_question(question: str) -> str:
    client = genai.Client(api_key=settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY"))

    prompt = f"""
You are the polite AI assistant for {settings.CLINIC_NAME}.
Only answer questions related to the dental clinic (opening hours, services, dentists, treatments, location, pricing, contact, appointment process).
If asked something unrelated, politely explain that you only support SmileSync Dental Clinic.

User Question: {question}
"""
    response = client.models.generate_content(
        model=settings.GEMINI_MODEL_NAME,
        contents=prompt
    )
    return response.text or "How may I help you with our dental services today?"
`
  },
  {
    path: 'dental_agent/services/booking_service.py',
    name: 'booking_service.py',
    language: 'python',
    description: 'Appointment ID generation & SQLite persistence logic',
    content: `"""
Booking Service - Pure Python Business Logic
Generates unique Appointment IDs and handles SQLite database persistence.
"""

import uuid
import datetime
from sqlalchemy.orm import Session
from dental_agent.models import Appointment

def generate_appointment_id() -> str:
    year = datetime.datetime.now().year
    random_code = uuid.uuid4().hex[:6].upper()
    return f"SMILE-{year}-{random_code}"

def save_appointment(db: Session, full_name: str, email: str, phone: str) -> Appointment:
    appointment_id = generate_appointment_id()
    new_appointment = Appointment(
        appointment_id=appointment_id,
        full_name=full_name,
        email=email,
        phone=phone,
        created_at=datetime.datetime.utcnow()
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment
`
  },
  {
    path: 'dental_agent/services/intent_service.py',
    name: 'intent_service.py',
    language: 'python',
    description: 'Intent classification (clinic_question vs appointment_booking)',
    content: `"""
Intent Classification Service
"""

import json
from google import genai
from dental_agent.config import settings

def classify_intent(message: str) -> str:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    prompt = f"""Classify into "clinic_question" or "appointment_booking": "{message}" """
    try:
        response = client.models.generate_content(model=settings.GEMINI_MODEL_NAME, contents=prompt)
        text = response.text.lower()
        if "booking" in text or "appointment" in text:
            return "appointment_booking"
    except Exception:
        pass
    return "clinic_question"
`
  },
  {
    path: 'dental_agent/nodes/collect_customer_info.py',
    name: 'collect_customer_info.py',
    language: 'python',
    description: 'Node with RequestInput signal whenever information is missing',
    content: `"""
ADK 2.0 Function Node: Collect Customer Information
Collects Full Name, Email Address, and Phone Number.
Uses RequestInput whenever information is missing.
"""

class RequestInputSignal(Exception):
    def __init__(self, prompt: str, missing_fields: list[str], current_info: dict):
        self.prompt = prompt
        self.missing_fields = missing_fields
        self.current_info = current_info
        super().__init__(prompt)

def collect_customer_info_node(state: dict) -> dict:
    current_info = state.get("customer_info", {})
    missing = []
    if not current_info.get("full_name"): missing.append("Full Name")
    if not current_info.get("email"): missing.append("Email Address")
    if not current_info.get("phone"): missing.append("Phone Number")

    if missing:
        raise RequestInputSignal(
            prompt=f"Please provide your {', '.join(missing)} to complete your booking.",
            missing_fields=missing,
            current_info=current_info
        )
    return state
`
  },
  {
    path: 'dental_agent/nodes/save_booking.py',
    name: 'save_booking.py',
    language: 'python',
    description: 'Node that saves appointment into SQLite',
    content: `"""
ADK 2.0 Function Node: Save Booking
Generates unique Appointment ID and persists appointment record into SQLite database.
"""

from dental_agent.database import SessionLocal
from dental_agent.services.booking_service import save_appointment

def save_booking_node(state: dict) -> dict:
    info = state.get("customer_info", {})
    db = SessionLocal()
    try:
        appt = save_appointment(db, info.get("full_name"), info.get("email"), info.get("phone"))
        state["appointment"] = appt.to_dict()
    finally:
        db.close()
    return state
`
  }
];
