# High-Level Design (HLD)

## 1. Arsitektur Sistem Overall
Sistem menggunakan arsitektur 3-tier sederhana: Client (Frontend), Server (Backend), dan External Cloud Service (Xendit & Mimo API).
┌──────────────┐          ┌──────────────┐          ┌───────────────────────┐
│              │  Fetch   │   Backend    │  HTTPS   │  OpenAI / Gemini API  │
│   Frontend   │─────────>│ (Next.js/Node│─────────>│ (Agentic AI Reason)   │
│  (Chat UI)   │<─────────│   Server)    │<─────────│                       │
│              │  Stream  │              │          └───────────────────────┘
└──────────────┘          └──────┬───────┘
│▲
││ HTTPS (API & Webhook)
▼│
┌────┴──────────────────┐
│    Xendit Sandbox     │
│   (Payment Gateway)   │
└───────────────────────┘

## 2. Tech Stack
* **Frontend:** Next.js (React) / HTML + TailwindCSS.
* **Backend:** Node.js (Express atau Next.js API Routes).
* **AI Engine:** Mimo dengan fitur *Function Calling/Tools*.
* **Payment Gateway:** Xendit API (Test Mode).