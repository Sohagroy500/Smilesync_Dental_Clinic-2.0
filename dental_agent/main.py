"""
Main execution script for Dental Agent Backend
Run this file to start the FastAPI server with Google ADK 2.0 Dental Workflow Graph.
"""

import uvicorn
from dental_agent.utils.helpers import setup_logging

if __name__ == "__main__":
    setup_logging()
    print("=" * 65)
    print("  SmileSync Dental Clinic - Google ADK 2.0 AI Assistant Server")
    print("=" * 65)
    uvicorn.run("dental_agent.workflow:app", host="0.0.0.0", port=8000, reload=True)
