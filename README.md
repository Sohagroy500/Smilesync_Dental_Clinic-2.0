# 🦷 SmileSync — AI-Powered Dental Practice & Admin Platform

<p align="center">
  <img src="https://img.shields.io/badge/Conversational%20Framework-Google%20ADK-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google ADK" />
  <img src="https://img.shields.io/badge/AI Engine-Google%20Gemini%202.5%20Flash-34A853?style=for-the-badge&logo=googlecloud&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Image Engine-Unsplash%20%2B%20Gemini%20Visuals-EA4335?style=for-the-badge&logo=googlephotos&logoColor=white" alt="Image Engine" />
  <img src="https://img.shields.io/badge/Architecture-Clean%20Agent%20Driven-blueviolet?style=for-the-badge&logo=diagramsdotnet&logoColor=white" alt="Clean Architecture" />
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Express.js-Server-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
</p>

---

## 🛠️ Complete Technology Stack & Frameworks

SmileSync is built using a modern full-stack web architecture integrated with Google's latest AI Agent paradigms and high-performance physics engines:

| Category | Technology / Framework | Usage & Purpose |
| :--- | :--- | :--- |
| **Conversational Framework** | **Google ADK (Agent Development Kit)** | Agentic conversational state machine, agent tool orchestration, and graph node execution visualizer (`AdkCodeExplorer.tsx`) |
| **AI Language Model** | **Google Gemini AI SDK (`@google/genai`)** | Powered by `gemini-2.5-flash` for instant clinical triage, intent routing, and intelligent patient inquiries |
| **Image & Visual Engine** | **Unsplash Clinical API + Gemini Visuals** | High-resolution medical imagery, doctor showcase photos, procedure visuals, and dynamic image placeholders |
| **Frontend UI Framework** | **React 18 + TypeScript 5** | Strictly typed component architecture with dynamic state hooks and reactive UI elements |
| **Styling & Design System** | **Tailwind CSS v4 + Glassmorphism** | Utility-first responsive styling, backdrop blur filters, dark/light theme switching, and custom gradients |
| **Physics & FX Engine** | **Custom RAF + LERP Interpolation** | Smooth 60 FPS mouse-tracking radial spotlights and 3D card perspective tilt with zero lag or jitter |
| **Icons & Vectors** | **Lucide React** | Dynamic, customizable vector graphics for medical equipment, status badges, and navigation |
| **Backend Runtime** | **Express.js + Node.js** | Single-port (`3000`) backend serving API routes (`/api/chat`), static assets, and dev proxying |
| **Auth & Security** | **JWT + Bcrypt Hashing** | Secure Admin Gate authentication with token verification and encrypted credential validation |
| **Database & Diagnostics** | **MySQL Inspector & Clinical Schema** | Integrated SQL query visualizer (`MysqlInspector.tsx`) for inspecting clinical records and database tables |

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
* **Role**: Renders responsive UI views, high-resolution visual imagery, and handles user interaction physics.
* **Key Mechanisms**:
  * **Interactive Mouse Physics Engine**: Zero-jitter spotlighting and subtle 3D card tilt via `requestAnimationFrame` + Lerp interpolation.
  * **Image Showcase System**: High-definition medical photography and clinical avatars integrated across Hero, Services, and Doctor profiles.
  * **Chat UI Widget**: Reactive floating assistant interface (`ChatWidget`, `ChatMessages`, `MessageInput`).
  * **Admin Command Center**: Real-time management dashboards and database inspectors.

---

#### 🧠 2. Application & Agent Orchestration Layer (Use Cases & AI Reasoning)
* **Location**: `src/services/apiService.ts`, `server.ts` (`/api/chat`), `src/components/AiGraphAssistant.tsx`
* **Role**: Coordinates AI reasoning loops, prompt engineering, and clinical intent routing via Google ADK.
* **Key Mechanisms**:
  * **Google ADK & Gemini AI SDK**: Uses `@google/genai` with `gemini-2.5-flash` model for conversational triage and function calling.
  * **Function Calling & Intent Routing**: Routes user queries to specific actions (e.g., booking appointments, recommending dental specialists, post-op guidance).
  * **Agent Visualizer / ADK Explorer**: Inspector UI (`AdkCodeExplorer.tsx`) visualizing AI reasoning nodes, tool execution, and context windows.

---

#### 📐 3. Domain Entity Layer (Core Business Rules)
* **Location**: `src/types.ts`, `src/data/dentalData.ts`
* **Role**: Defines fundamental clinical models, data schemas, and state contracts independent of external frameworks.
* **Key Entities**:
  * `Service` & `Doctor`: Clinical service specs, pricing, categories, high-resolution imagery URLs, and provider rosters.
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
| **Presentation** | UI, High-Res Imagery, 60fps Mouse FX | React 18, Tailwind v4, Lucide, Unsplash API | Depends on Application Layer |
| **Agent / App** | Conversational AI, Google ADK Graph | Gemini 2.5 Flash, Express `/api/chat`, `@google/genai` | Depends on Domain Layer |
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
  <b>SmileSync AI Architecture</b> • Clean Architecture for AI Agent Developers (Google ADK & Gemini API)
</p>
