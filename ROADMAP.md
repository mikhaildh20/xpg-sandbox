# ROADMAP — AI-Powered Payment Assistant (XPG Sandbox)

---

## Phase 0 — Foundation

| Status | Task | Date | Commit |
|---|---|---|---|
| 🟢 Done | T-001: Create tracking documents (ROADMAP, BACKLOG, DEVLOG) | 2026-06-30 | |
| 🔴 Not Started | T-002: Set up branch strategy (develop branch, naming convention) | | |
| 🔴 Not Started | T-003: Verify environment & configuration | | |

## Phase 1A — Backend Express API (xpg-backend)

| Status | Task | Date | Commit |
|---|---|---|---|
| 🟢 Done | T-101: Create Express server entry point (index.js) | 2026-06-30 | `b96e8c8`
| 🔴 Not Started | T-102: Create Supabase schema migration | | |
| 🔴 Not Started | T-103: Build Xendit invoice service | | |
| 🔴 Not Started | T-104: Implement POST /api/chat | | |
| 🔴 Not Started | T-105: Implement POST /api/webhook/xendit | | |
| 🔴 Not Started | T-106: Implement storage layer (Supabase CRUD) | | |

## Phase 1B — AI Agent Integration (OpenAI Function Calling)

| Status | Task | Date | Commit |
|---|---|---|---|
| 🔴 Not Started | T-201: Set up OpenAI client | | |
| 🔴 Not Started | T-202: Define function calling schema | | |
| 🔴 Not Started | T-203: Implement XenBot system prompt | | |
| 🔴 Not Started | T-204: Implement message handler | | |
| 🔴 Not Started | T-205: Edge case & validation logic | | |

## Phase 1C — Frontend Chat UI (xpg-frontend)

| Status | Task | Date | Commit |
|---|---|---|---|
| 🟢 Done | T-301: Update layout & branding | 2026-06-30 | `f9b2228` |
| 🟢 Done | T-302: Build split-screen layout | 2026-06-30 | `0cdbeda` |
| 🟢 Done | T-303: Build Chat Room component | 2026-06-30 | `de3445a` |
| 🟢 Done | T-304: Build Invoice Viewer component | 2026-06-30 | `6c9f07a` |
| 🟢 Done | T-305: Implement "Simulate Success" button | 2026-06-30 | `b48455d` |
| 🟢 Done | T-306: Create chat API client service | 2026-06-30 | `713b8bd` |
| 🟢 Done | T-307: Wire page.tsx with components | 2026-06-30 | `d4497fb` |

## Phase 2 — Integration

| Status | Task | Date | Commit |
|---|---|---|---|
| 🔴 Not Started | T-401: Frontend ↔ Backend integration | | |
| 🔴 Not Started | T-402: AI ↔ Xendit integration | | |
| 🔴 Not Started | T-403: Webhook simulation flow | | |
| 🔴 Not Started | T-404: End-to-end smoke test | | |

## Phase 3 — Validation & Polish

| Status | Task | Date | Commit |
|---|---|---|---|
| 🔴 Not Started | T-501: Error handling hardening | | |
| 🔴 Not Started | T-502: Security audit | | |
| 🔴 Not Started | T-503: Documentation finalization | | |
| 🔴 Not Started | T-504: Tracking document final sync | | |
