# BACKLOG — AI-Powered Payment Assistant (XPG Sandbox)

---

## Phase 0 — Foundation

| ID | Title | Priority | Status | Assignee | Notes |
|---|---|---|---|---|---|
| T-001 | Create tracking documents | Must | ✅ Done | Orchestrator | |
| T-002 | Set up branch strategy | Must | 🔴 Not Started | Orchestrator | |
| T-003 | Verify environment & configuration | Must | 🔴 Not Started | Orchestrator | |

## Phase 1A — Backend Express API

| ID | Title | Priority | Status | Assignee | Notes |
|---|---|---|---|---|---|
| T-101 | Create Express server entry point | Must | ✅ Done | Backend Agent | Server running on port 4000, health route verified |
| T-102 | Create Supabase schema migration | Must | ✅ Done | Backend Agent | SQL migration for orders + transactions tables |
| T-103 | Build Xendit invoice service | Must | ✅ Done | Backend Agent | Mock fallback when XENDIT_SECRET_KEY not set |
| T-104 | Implement POST /api/chat | Must | ✅ Done | Backend Agent | Routes to AI handler, returns reply + invoice_url |
| T-105 | Implement POST /api/webhook/xendit | Must | ✅ Done | Backend Agent | Receives Xendit callbacks, updates order status |
| T-106 | Implement storage layer | Must | ✅ Done | Backend Agent | Supabase CRUD with in-memory fallback |

## Phase 1B — AI Agent Integration

| ID | Title | Priority | Status | Assignee | Notes |
|---|---|---|---|---|---|
| T-201 | Set up OpenAI client | Must | ✅ Done | AI Agent | OpenAI SDK initialized with function calling |
| T-202 | Define function calling schema | Must | ✅ Done | AI Agent | createXenditInvoice tool with amount + description params |
| T-203 | Implement XenBot system prompt | Must | ✅ Done | AI Agent | Per AGENT.md: professional, Indonesian, sandbox reminders |
| T-204 | Implement message handler | Must | ✅ Done | AI Agent | Orchestrates: user msg → LLM → tool call → invoice → response |
| T-205 | Edge case & validation logic | Should | ✅ Done | AI Agent | Min Rp10K, negative/zero rejection, off-topic redirect |

## Phase 1C — Frontend Chat UI

| ID | Title | Priority | Status | Assignee | Notes |
|---|---|---|---|---|---|
| T-301 | Update layout & branding | Must | ✅ Done | Frontend Agent | |
| T-302 | Build split-screen layout | Must | ✅ Done | Frontend Agent | |
| T-303 | Build Chat Room component | Must | ✅ Done | Frontend Agent | |
| T-304 | Build Invoice Viewer component | Must | ✅ Done | Frontend Agent | |
| T-305 | Implement "Simulate Success" button | Must | ✅ Done | Frontend Agent | |
| T-306 | Create chat API client service | Must | ✅ Done | Frontend Agent | |
| T-307 | Wire page.tsx with components | Must | ✅ Done | Frontend Agent | |

## Phase 2 — Integration

| ID | Title | Priority | Status | Assignee | Notes |
|---|---|---|---|---|---|
| T-401 | Frontend ↔ Backend integration | Must | ✅ Done | Orchestrator | Mimo AI working, simulate endpoint added |
| T-402 | AI ↔ Xendit integration | Must | 🟡 In Progress | Orchestrator | Xendit key needs Invoice permission in dashboard |
| T-403 | Webhook simulation flow | Must | ✅ Done | Orchestrator | POST /api/simulate working |
| T-404 | End-to-end smoke test | Must | ✅ Done | Orchestrator | Mimo AI → tool call → mock invoice confirmed |

## Phase 3 — Validation & Polish

| ID | Title | Priority | Status | Assignee | Notes |
|---|---|---|---|---|---|
| T-501 | Error handling hardening | Should | 🔴 Not Started | QA Agent | |
| T-502 | Security audit | Must | 🔴 Not Started | QA Agent | |
| T-503 | Documentation finalization | Should | 🔴 Not Started | QA Agent | |
| T-504 | Tracking document final sync | Must | 🔴 Not Started | QA Agent | |
