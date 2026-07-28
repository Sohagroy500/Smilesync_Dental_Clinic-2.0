# 🦷 SmileSync — AI-Powered Dental Practice & Admin Platform

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Clean%20Agent%20Driven-blueviolet?style=for-the-badge&logo=diagramsdotnet&logoColor=white" alt="Clean Architecture" />
  <img src="https://img.shields.io/badge/AI Engine-Google%20Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Express.js-Server-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
</p>

---

## 🏗️ Clean Architecture Overview for AI Agent Developers

SmileSync follows **Clean Architecture principles** modified specifically for **AI Agent & LLM-integrated applications**. Business logic, AI graph orchestration, UI components, and infrastructure adapters are strictly decoupled into concentric layers:

```text
               ┌─────────────────────────────────────────┐
               │    1. Presentation Layer (UI & Physics)  │
               │   ┌─────────────────────────────────┐   │
               │   │ 2. Application & Agent Layer    │   │
               │   │   ┌─────────────────────────┐   │   │
               │   │   │ 3. Domain Entity Layer  │   │   │
               │   │   │   ┌─────────────────┐   │   │   │
               │   │   │   │ 4. Infra/Adapters│   │   │   │
               │   │   │   └─────────────────┘   │   │   │
               │   │   └─────────────────────────┘   │   │
               │   └─────────────────────────────────┘   │
               └─────────────────────────────────────────┘
```

---

### 🏛️ Layer Breakdown

#### 🎨 1. Presentation Layer (User Interface & Physics)
* **Location**: `src/components/`, `src/components/chat/`
* **Role**: Renders responsive UI views and handles user interaction physics.
* **Key Mechanisms**:
  * **Interactive Mouse Physics Engine**: Zero-jitter spotlighting and subtle 3D card tilt via `requestAnimationFrame` + Lerp interpolation.
  * **Chat UI Widget**: Reactive floating assistant interface (`ChatWidget`, `ChatMessages`, `MessageInput`).
  * **Admin Command Center**: Real-time management dashboards and database inspectors.

---

#### 🧠 2. Application & Agent Orchestration Layer (Use Cases & AI Reasoning)
* **Location**: `src/services/apiService.ts`, `server.ts` (`/api/chat`), `src/components/AiGraphAssistant.tsx`
* **Role**: Coordinates AI reasoning loops, prompt engineering, and clinical intent routing.
* **Key Mechanisms**:
  * **Google Gemini AI SDK**: Uses `@google/genai` with `gemini-2.5-flash` model for instant conversational triage.
  * **Function Calling & Intent Routing**: Routes user queries to specific actions (e.g., booking appointments, recommending dental specialists, post-op guidance).
  * **Agent Visualizer / ADK Explorer**: Inspector UI (`AdkCodeExplorer.tsx`) visualizing AI reasoning nodes, tool execution, and context windows.

---

#### 📐 3. Domain Entity Layer (Core Business Rules)
* **Location**: `src/types.ts`, `src/data/dentalData.ts`
* **Role**: Defines fundamental clinical models, data schemas, and state contracts independent of external frameworks.
* **Key Entities**:
  * `Service` & `Doctor`: Clinical service specs, pricing, categories, and provider rosters.
  * `Appointment`: Patient booking contracts, status states, and schedule slots.
  * `AdminUser` & `Analytics`: Authentication profiles and clinic KPI definitions.

---

#### 🔌 4. Infrastructure & External Adapters Layer (Storage & Server)
* **Location**: `server.ts`, `src/server/authDb.ts`, `src/server/jwtAuth.ts`
* **Role**: Handles external side-effects, API proxies, server ports, and key security.
* **Key Services**:
  * **Secure Express Proxy**: Proxies Gemini API requests on port `3000` to prevent exposing API keys on the client browser.
  * **Auth Adapter**: JWT token issuance and password encryption utilities.
  * **Database Inspectors**: Tools for inspecting MySQL/PostgreSQL/In-Memory clinical schemas.

---

## ⚡ Quick Architecture Summary Matrix

| Layer | Responsibility | Tech / Files | Dependencies |
| :--- | :--- | :--- | :--- |
| **Presentation** | UI, Animations, 60fps Mouse FX | React 18, Tailwind v4, Lucide Icons | Depends on Application Layer |
| **Agent / App** | AI Triage, Prompt Graph, Intent Routing | Gemini 2.5 Flash, Express `/api/chat` | Depends on Domain Layer |
| **Domain** | Data Contracts, Business Rules | `types.ts`, `dentalData.ts` | Zero Dependencies (Pure TS) |
| **Infrastructure**| API Security, DB Operations, Node Server | `server.ts`, Express, Node.js | Implements Interfaces |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Full-Stack Dev Server
```bash
npm run dev
```
App will launch on **http://localhost:3000**.

### 3. Production Build
```bash
npm run build
npm start
```

---

<p align="center">
  <b>SmileSync AI Architecture</b> • Clean Architecture for AI Agent Developers
</p>
