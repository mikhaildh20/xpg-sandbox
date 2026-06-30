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
| T-101 | Create Express server entry point | Must | 🔴 Not Started | Backend Agent | |
| T-102 | Create Supabase schema migration | Must | 🔴 Not Started | Backend Agent | |
| T-103 | Build Xendit invoice service | Must | 🔴 Not Started | Backend Agent | |
| T-104 | Implement POST /api/chat | Must | 🔴 Not Started | Backend Agent | |
| T-105 | Implement POST /api/webhook/xendit | Must | 🔴 Not Started | Backend Agent | |
| T-106 | Implement storage layer | Must | 🔴 Not Started | Backend Agent | |

## Phase 1B — AI Agent Integration

| ID | Title | Priority | Status | Assignee | Notes |
|---|---|---|---|---|---|
| T-201 | Set up OpenAI client | Must | 🔴 Not Started | AI Agent | |
| T-202 | Define function calling schema | Must | 🔴 Not Started | AI Agent | |
| T-203 | Implement XenBot system prompt | Must | 🔴 Not Started | AI Agent | |
| T-204 | Implement message handler | Must | 🔴 Not Started | AI Agent | |
| T-205 | Edge case & validation logic | Should | 🔴 Not Started | AI Agent | |

## Phase 1C — Frontend Chat UI

| ID | Title | Priority | Status | Assignee | Notes |
|---|---|---|---|---|---|
| T-301 | Update layout & branding | Must | ✅ Done | Frontend Agent | |
| T-302 | Build split-screen layout | Must | ✅ Done | Frontend Agent | |
| T-303 | Build Chat Room component | Must | ✅ Done | Frontend Agent | |
| T-304 | Build Invoice Viewer component | Must | ✅ Done | Frontend Agent | |
| T-305 | Implement "Simulate Success" button | Must | 🔴 Not Started | Frontend Agent | |
| T-306 | Create chat API client service | Must | 🔴 Not Started | Frontend Agent | |
| T-307 | Wire page.tsx with components | Must | 🔴 Not Started | Frontend Agent | |

## Phase 2 — Integration

| ID | Title | Priority | Status | Assignee | Notes |
|---|---|---|---|---|---|
| T-401 | Frontend ↔ Backend integration | Must | 🔴 Not Started | Integration Agent | |
| T-402 | AI ↔ Xendit integration | Must | 🔴 Not Started | Integration Agent | |
| T-403 | Webhook simulation flow | Must | 🔴 Not Started | Integration Agent | |
| T-404 | End-to-end smoke test | Must | 🔴 Not Started | Integration Agent | |

## Phase 3 — Validation & Polish

| ID | Title | Priority | Status | Assignee | Notes |
|---|---|---|---|---|---|
| T-501 | Error handling hardening | Should | 🔴 Not Started | QA Agent | |
| T-502 | Security audit | Must | 🔴 Not Started | QA Agent | |
| T-503 | Documentation finalization | Should | 🔴 Not Started | QA Agent | |
| T-504 | Tracking document final sync | Must | 🔴 Not Started | QA Agent | |
