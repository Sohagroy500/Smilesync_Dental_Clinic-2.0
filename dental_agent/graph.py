"""
Google ADK 2.0 Workflow Graph Construction for SmileSync Dental Clinic AI Agent
Defines function nodes connected by edges with RequestInput human-in-the-loop support.
"""

import logging
from typing import Dict, Any, Callable

# Import ADK 2.0 Function Nodes
from dental_agent.nodes.receive_message import receive_message_node
from dental_agent.nodes.detect_intent import detect_intent_node
from dental_agent.nodes.answer_question import answer_question_node
from dental_agent.nodes.collect_customer_info import collect_customer_info_node, RequestInputSignal
from dental_agent.nodes.validate_customer import validate_customer_node
from dental_agent.nodes.save_booking import save_booking_node
from dental_agent.nodes.confirmation import confirmation_node

logger = logging.getLogger("dental_agent.graph")

class FunctionNode:
    """
    ADK 2.0 Function Node abstraction wrapping node function.
    """
    def __init__(self, name: str, func: Callable, description: str = ""):
        self.name = name
        self.func = func
        self.description = description

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        logger.info(f"Executing ADK 2.0 Function Node: [{self.name}]")
        return self.func(state)

class DentalWorkflowGraph:
    """
    Google ADK 2.0 Workflow Graph Engine for Dental Clinic
    Graph Topology:
    
    Receive Message -> Decode Payload -> Detect Intent
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
                 Clinic Question                             Booking Intent
                       │                                           │
                       │                                  Collect Customer Info
                       │                                           │ (RequestInput Pause)
                       │                                  Validate Inputs
                       │                                           │ (RequestInput Pause)
                       │                                  Save Appointment (SQLite)
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             ▼
                                       Confirmation
    """
    def __init__(self):
        # Register Function Nodes
        self.node_receive = FunctionNode("ReceiveMessage", receive_message_node, "Receives & decodes message payload")
        self.node_detect_intent = FunctionNode("DetectIntent", detect_intent_node, "Classifies intent into question or booking")
        self.node_answer_question = FunctionNode("AnswerQuestion", answer_question_node, "Answers clinic FAQs using Gemini 3.1 Flash Lite")
        self.node_collect_info = FunctionNode("CollectCustomerInfo", collect_customer_info_node, "Collects Name, Email, Phone with RequestInput")
        self.node_validate_customer = FunctionNode("ValidateCustomer", validate_customer_node, "Validates input formats using Python business rules")
        self.node_save_booking = FunctionNode("SaveBooking", save_booking_node, "Generates Appointment ID and saves to SQLite")
        self.node_confirmation = FunctionNode("Confirmation", confirmation_node, "Returns final appointment booking confirmation")

    def run(self, initial_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the ADK 2.0 Workflow Graph step by step.
        Raises RequestInputSignal if human input or missing data is required.
        """
        state = dict(initial_state)

        # 1. Receive & Decode Message Payload
        state = self.node_receive.execute(state)

        # 2. Detect Intent (LLM + Heuristics)
        state = self.node_detect_intent.execute(state)

        intent = state.get("intent", "clinic_question")

        # Branching Logic
        if intent == "clinic_question":
            # Clinic Question Branch: Answer Question -> Confirmation
            state = self.node_answer_question.execute(state)
        elif intent == "appointment_booking":
            # Appointment Booking Branch: Collect Info -> Validate -> Save -> Confirmation
            
            # Step A: Collect Customer Info (may raise RequestInputSignal if info missing)
            state = self.node_collect_info.execute(state)

            # Step B: Validate Inputs (may raise RequestInputSignal if format invalid)
            state = self.node_validate_customer.execute(state)

            # Step C: Save Appointment to SQLite
            state = self.node_save_booking.execute(state)

            # Step D: Return Confirmation
            state = self.node_confirmation.execute(state)
        else:
            state = self.node_answer_question.execute(state)

        return state

def create_dental_workflow_graph() -> DentalWorkflowGraph:
    """
    Factory function to instantiate Google ADK 2.0 Dental Workflow Graph.
    """
    return DentalWorkflowGraph()
