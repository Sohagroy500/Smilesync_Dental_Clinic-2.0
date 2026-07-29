# SmileSync Dental Clinic AI Appointment System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-Next.js%20%7C%20React%20%7C%20TypeScript-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688)
![Google ADK](https://img.shields.io/badge/AI-Google%20ADK%202.0%20%7C%20Gemini%203.1%20Flash%20Lite-4285F4)
![Database](https://img.shields.io/badge/Database-SQLite%20%7C%20SQLAlchemy-003B57)

SmileSync Dental Clinic is an AI-powered appointment booking and customer support system built with Google ADK 2.0. The application enables patients to ask clinic-related questions and book appointments through an intelligent chatbot while providing administrators with a modern dashboard for managing appointments and patients.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Author](#author)

---

## Project Overview

Modern healthcare practices frequently experience administrative bottlenecks due to repetitive patient inquiries, complex phone-based appointment scheduling, and manual data management. **SmileSync Dental Clinic AI Appointment System** addresses these operational challenges by combining an agentic AI conversational workflow with a robust clinical administration dashboard.

### Problems Solved

1. **High Inbound Inquiry Volume**: Patient support calls regarding operating hours, service costs, and pre-procedure guidelines consume valuable administrative staff time.
2. **Friction in Appointment Scheduling**: Traditional phone calls or rigid form systems lead to abandoned bookings and scheduling conflicts.
3. **Data Disconnection**: Unstructured patient chat interactions rarely sync directly into clinical appointment schedules.

### Why It Was Built

SmileSync was built to demonstrate how state-of-the-art conversational frameworks (Google ADK 2.0) can be seamlessly integrated into modern full-stack web applications. By pairing natural language understanding with strict deterministic tool execution, the system automates patient intake without sacrificing data integrity or clinical workflow precision.

### AI Capabilities & Business Value

- **Conversational Intent Routing**: Automatically distinguishes between general clinic inquiries and appointment booking requests.
- **Structured Data Extraction**: Seamlessly collects patient details (full name, phone number, preferred service, date, and time) through multi-turn dialogue.
- **Automated Slot Booking**: Evaluates database schedules to assign the next available 30-minute clinical time slot.
- **Operational Cost Reduction**: Reduces receptionist phone overhead by automating routine triage and booking workflows 24/7.

---

## Key Features

### Patient Experience & AI Support
- **AI Chatbot**: Real-time conversational assistant embedded directly into the patient portal.
- **Google ADK 2.0 Workflow Graph**: Graph-based conversational state machine coordinating AI reasoning and tool calls.
- **Natural Language Understanding**: Powered by Gemini 3.1 Flash Lite for fast, contextual responses.
- **Clinic FAQ Assistant**: Instantly answers questions regarding dental services, pricing, insurance, and clinic policies.
- **AI Appointment Booking**: Conversational intake flow that guides patients through booking step-by-step.
- **Automatic Customer Information Collection**: Dynamically captures required contact details and validates inputs before finalizing requests.
- **Next Available 30-Minute Slot Booking**: Intelligently schedules appointments into open 30-minute time slots.

### Administration & Management
- **Admin Dashboard**: Comprehensive command center displaying clinic metrics, daily schedules, and patient rosters.
- **JWT Authentication**: Secure token-based authentication protecting admin endpoints and data management.
- **Appointment Management**: View, filter, approve, reschedule, or cancel patient appointments.
- **Patient Management**: Centralized patient directory tracking contact history and booking records.
- **Input Validation**: Strict schema enforcement across both frontend and backend layers to ensure data sanity.
- **Clean Modular Architecture**: Decoupled presentation, domain logic, AI agent orchestration, and infrastructure layers.

---

## Tech Stack

### Frontend
| Technology | Usage |
| :--- | :--- |
| **Next.js / React** | Server-side rendering, component lifecycle, and application routing |
| **TypeScript** | End-to-end type safety and interface definitions |
| **Tailwind CSS** | Utility-first, responsive design system with custom theme variables |
| **Shadcn UI** | Accessible, modular UI primitives and layout components |
| **Framer Motion** | Fluid page transitions, modal overlays, and interactive animations |

### Backend & AI Engine
| Technology | Usage |
| :--- | :--- |
| **Python** | Core backend language runtime |
| **FastAPI** | High-performance asynchronous REST API framework |
| **Google ADK 2.0** | Agent Development Kit for agentic workflow graph execution |
| **Gemini 3.1 Flash Lite** | High-speed, low-latency LLM for natural language processing |
| **SQLAlchemy** | Object-Relational Mapping (ORM) for database interactions |
| **SQLite** | Lightweight, relational embedded database |
| **JWT & bcrypt** | Token authentication and password hashing security |

---

## System Architecture

SmileSync follows a clean, decoupled architecture separating client presentation, API gateways, agentic state machines, and relational storage.

```text
Customer
   │
   ▼
Chat Widget (React / Next.js)
   │
   ▼
FastAPI API (REST Endpoint)
   │
   ▼
Google ADK Workflow Graph (Agentic State Machine)
   │
┌──┴────────────┐
│               │
▼               ▼
FAQ Node    Appointment Node
│               │
└───────┬───────┘
        ▼
SQLite Database (SQLAlchemy ORM)
```

### Workflow Process

1. **Patient Request**: The patient enters a natural language message in the Chat Widget.
2. **API Dispatch**: The frontend forwards the message to the FastAPI server (`/api/chat`).
3. **ADK Graph Evaluation**: Google ADK 2.0 evaluates message intent (FAQ inquiry vs. Appointment request).
4. **Tool Execution**:
   - For FAQ queries, the agent queries the clinic knowledge base.
   - For booking requests, the agent extracts patient details and executes the 30-minute slot allocation function.
5. **Persistence**: Validated bookings are committed to the SQLite database via SQLAlchemy.
6. **Response Rendering**: The structured result is returned to the UI with real-time state updates.

---

## Project Structure

```text
smilesync-dental/
├── frontend/                     # Next.js / React Frontend Application
│   ├── public/                   # Static assets, branding, and icons
│   ├── src/
│   │   ├── components/           # UI components (Header, Hero, Services, Admin)
│   │   │   ├── chat/             # ChatWidget, ChatMessages, MessageInput
│   │   │   └── ui/               # Reusable Shadcn UI primitives
│   │   ├── hooks/                # Custom React hooks (e.g., mouse spotlight, animations)
│   │   ├── services/             # API client services & HTTP handlers
│   │   ├── types/                # TypeScript interfaces and type definitions
│   │   └── app/                  # Next.js pages and layout routes
│   ├── package.json              # Frontend dependencies and scripts
│   └── tailwind.config.js        # Tailwind CSS configuration
│
├── backend/                      # FastAPI & Python Backend Service
│   ├── app/
│   │   ├── api/                  # REST API route handlers (chat, auth, appointments)
│   │   ├── core/                 # Security (JWT, bcrypt) and app configuration
│   │   ├── db/                   # Database session, models, and migrations
│   │   ├── agent/                # Google ADK 2.0 workflow graph & tool declarations
│   │   └── schemas/              # Pydantic data validation schemas
│   ├── main.py                   # FastAPI server entry point
│   ├── requirements.txt          # Python dependencies
│   └── clinic.db                 # SQLite database file
│
├── .env.example                  # Environment variable configuration template
├── README.md                     # Project documentation
└── LICENSE                       # MIT License
```

---

## Installation & Setup

Follow these steps to clone, configure, and run the SmileSync application locally.

### Prerequisites

- **Node.js** (v18.x or higher) & **npm**
- **Python** (v3.10 or higher)
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/your-username/smilesync-dental.git
cd smilesync-dental
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

### 3. Backend Setup

Open a new terminal window in the project root:

```bash
cd backend
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate

pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory (see [Environment Variables](#environment-variables)).

### 5. Run Backend Server

```bash
cd backend
uvicorn main:app --reload --port 8000
```
The FastAPI backend server will start at `http://localhost:8000`.

### 6. Run Frontend Application

```bash
cd frontend
npm run dev
```
The application will launch at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in the backend root directory with the following variables:

```env
# Application Settings
ENVIRONMENT=development
PORT=8000

# Security & Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120

# Database Configuration
DATABASE_URL=sqlite:///./clinic.db

# Google Gemini & ADK API Configuration
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

---

## Screenshots

| View | Screenshot |
| :--- | :--- |
| **Homepage** | ![Homepage Placeholder](https://via.placeholder.com/800x450?text=SmileSync+Homepage+View) |
| **AI Chatbot** | ![Chatbot Placeholder](https://via.placeholder.com/800x450?text=AI+Chatbot+Assistant+In+Action) |
| **Appointment Booking** | ![Booking Flow Placeholder](https://via.placeholder.com/800x450?text=Conversational+Appointment+Booking) |
| **Admin Login** | ![Admin Login Placeholder](https://via.placeholder.com/800x450?text=Admin+Authentication+Portal) |
| **Dashboard** | ![Dashboard Placeholder](https://via.placeholder.com/800x450?text=Clinic+Analytics+%26+Overview) |
| **Appointments** | ![Appointments Placeholder](https://via.placeholder.com/800x450?text=Appointment+Management+Grid) |
| **Patients** | ![Patients Placeholder](https://via.placeholder.com/800x450?text=Patient+Records+Directory) |

---

## Future Improvements

- [ ] **Google Calendar Integration**: Two-way synchronization between clinic schedules and Google Calendar.
- [ ] **Gmail Notifications**: Automatic email booking confirmations, calendar invites, and cancellation notices.
- [ ] **WhatsApp Notifications**: Instant SMS and WhatsApp appointment reminders for patients.
- [ ] **Appointment Reminders**: Automated 24-hour pre-appointment reminders to reduce no-shows.
- [ ] **Multi-Doctor Scheduling**: Support for assigning specific practitioners and dental specialists to slots.
- [ ] **Patient Medical Records**: Secure storage for dental histories, treatment plans, and X-ray attachments.
- [ ] **Payment Integration**: Stripe/PayPal payment gateway for initial consultation deposits.
- [ ] **Analytics Dashboard**: Advanced reporting on peak booking hours, cancellation rates, and revenue.
- [ ] **Role-Based Access Control (RBAC)**: Fine-grained permissions for receptionists, dentists, and administrators.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Author

**SmileSync Development Team**

- **GitHub**: [https://github.com/your-username](https://github.com/your-username)
- **LinkedIn**: [https://linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)
- **Portfolio Website**: [https://your-portfolio-website.com](https://your-portfolio-website.com)
- **Email**: contact@smilesync-clinic.com

---

<p align="center">
  <b>SmileSync Dental Clinic AI System</b> • Powered by Google ADK 2.0 & Gemini 3.1 Flash Lite
</p>
