"""
FastAPI Server & Workflow Runner for Dental Clinic AI Chatbot
Exposes REST & Pub/Sub webhook endpoints for Google ADK 2.0 Workflow Graph.
"""

import uvicorn
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from dental_agent.config import settings
from dental_agent.database import init_db, get_db
from dental_agent.graph import create_dental_workflow_graph
from dental_agent.nodes.collect_customer_info import RequestInputSignal
from dental_agent.models import Appointment

app = FastAPI(
    title="SmileSync Dental Clinic AI Agent (Google ADK 2.0)",
    description="Backend AI Assistant for answering clinic questions and booking appointments.",
    version="2.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables on startup
@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/health")
def health_check():
    """
    Health check endpoint.
    """
    return {
        "status": "healthy",
        "clinic": settings.CLINIC_NAME,
        "framework": "Google ADK 2.0",
        "model": settings.GEMINI_MODEL_NAME,
        "database": "SQLite (appointments table initialized)"
    }

@app.post("/api/chat")
async def handle_chat_message(request: Request):
    """
    Primary endpoint for user chat messages (plain JSON or Pub/Sub payload).
    Executes Google ADK 2.0 Workflow Graph.
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload.")

    workflow_graph = create_dental_workflow_graph()

    # Construct initial state
    initial_state = {
        "raw_payload": body,
        "customer_info": {
            "full_name": body.get("full_name") or body.get("name"),
            "email": body.get("email"),
            "phone": body.get("phone") or body.get("phone_number")
        }
    }

    try:
        # Run ADK 2.0 Graph Execution
        final_state = workflow_graph.run(initial_state)

        return {
            "status": "success",
            "requires_input": False,
            "response": final_state.get("response", ""),
            "intent": final_state.get("intent", "clinic_question"),
            "appointment": final_state.get("appointment"),
            "customer_info": final_state.get("customer_info")
        }

    except RequestInputSignal as pause_signal:
        # RequestInput Human-in-the-loop pause point caught
        return {
            "status": "paused",
            "requires_input": True,
            "prompt": pause_signal.prompt,
            "missing_fields": pause_signal.missing_fields,
            "current_info": pause_signal.current_info
        }

    except Exception as err:
        return {
            "status": "error",
            "message": f"An error occurred while executing workflow: {str(err)}"
        }

@app.get("/api/appointments")
def list_appointments(db: Session = Depends(get_db)):
    """
    Retrieves all confirmed appointments from SQLite database.
    """
    appointments = db.query(Appointment).order_by(Appointment.created_at.desc()).all()
    return [a.to_dict() for a in appointments]

if __name__ == "__main__":
    uvicorn.run("dental_agent.workflow:app", host="0.0.0.0", port=8000, reload=True)
