# Implementation Plan — AI-Powered Payment Assistant (XPG Sandbox)

---

## 📋 EXECUTIVE SUMMARY

**Project:** AI Payment Assistant (XPG Sandbox) — A web application where users type natural-language commands (e.g., "Beli sepatu Rp150.000"), an AI agent (XenBot) creates a Xendit Invoice via function calling, and users simulate payment success/failure in a sandbox environment.

**Architecture:** Next.js 16 frontend (`xpg-frontend`) → Express.js 5 backend (`xpg-backend`) → Xendit Sandbox API + OpenAI (function calling). Supabase for persistence.

**Baseline State:**
- `xpg-frontend/` — Next.js app scaffolded with TailwindCSS, Supabase utils (server/client/middleware), placeholder `page.tsx` querying `todos`
- `xpg-backend/` — Express project with Supabase & CORS deps installed, **no index.js**, no runtime code
- `docs/` — 8 documents covering PRD, FSD, HLD, TRD, ERD, OpenAPI, Wireframe, Agent Spec (XenBot)
- `ROADWAY.md`, `BACKLOG.md`, `DEVLOG.md` — **do not exist yet** (must be created in Phase 0)
- Git: single `init` commit at root; `xpg-frontend` has its own separate `.git`

**Tracking Governance:** Every task produces atomic commits, updates ROADMAP/BACKLOG/DEVLOG, and is independently verifiable.

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌──────────────────────┐     HTTP/Fetch      ┌──────────────────────┐     OpenAI API      ┌──────────────┐
│   xpg-frontend       │ ◄─────────────────► │   xpg-backend        │ ◄─────────────────► │  OpenAI API  │
│   (Next.js 16)       │    POST /api/chat    │   (Express.js 5)     │    function_call    │  (GPT-4o)    │
│   Chat UI + Invoice  │    POST /webhook     │   Xendit Service     │                    │              │
│   Simulator          │                      │   Supabase Client    │                    └──────────────┘
└──────────────────────┘                      └──────────┬───────────┘
                                                          │
                                                    Xendit API
                                                          │
                                                  ┌───────▼────────┐
                                                  │  Xendit Sandbox │
                                                  │  (Test Mode)    │
                                                  └────────────────┘
```

**Key Design Decisions:**
- Express.js backend as standalone API server (not Next.js API routes) per existing `xpg-backend` package.json
- Supabase for orders + transactions persistence (replaces in-memory storage)
- OpenAI function calling for AI invoice creation (XenBot persona)
- Split-screen UI: Chat (left) | Invoice Viewer + Simulate button (right)

---

## 📊 WORK BREAKDOWN STRUCTURE

### Phase 0 — Foundation (Sequential, must complete first)

| ID | Title | Description | Deliverables | Dependencies | Est. | Priority |
|---|---|---|---|---|---|---|
| T-001 | Create tracking documents | Create ROADMAP.md, BACKLOG.md, DEVLOG.md with templates per documentation charter | `ROADMAP.md`, `BACKLOG.md`, `DEVLOG.md` | None | S | Must |
| T-002 | Set up branch strategy & git governance | Create `develop` branch, protect `main`, define branch naming, create `.gitattributes` | Git branches, branch protection rules | T-001 | S | Must |
| T-003 | Verify environment & configuration | Validate `.env.local` vars exist, check Node versions, ensure deps installed | Verification report in devlog | None | S | Must |

### Phase 1A — Backend Express API (xpg-backend)

| ID | Title | Description | Deliverables | Dependencies | Est. | Priority |
|---|---|---|---|---|---|---|
| T-101 | Create Express server entry point | `index.js` with CORS, JSON body parser, error handler, `/api/health` endpoint | `xpg-backend/index.js` | T-003 | S | Must |
| T-102 | Create Supabase schema migration | SQL migration for `orders` + `transactions` tables (matching ERD) | Migration SQL file, Supabase schema applied | T-003 | S | Must |
| T-103 | Build Xendit invoice service | Service module wrapping Xendit API: `createInvoice(amount, description)` returns `{invoice_url, xendit_id}` | `xpg-backend/services/xendit.js` | T-101 | M | Must |
| T-104 | Implement POST /api/chat | Parses user message, calls AI function (delegates to Work Stream 1B), returns response | Route in `index.js` or `routes/chat.js` | T-101, T-201 | M | Must |
| T-105 | Implement POST /api/webhook/xendit | Receives Xendit callback, updates order status, returns 200 | Route in `index.js` or `routes/webhook.js` | T-101, T-102 | S | Must |
| T-106 | Implement storage layer | Supabase CRUD for orders + transactions, or local fallback | `xpg-backend/services/storage.js` | T-102 | M | Must |

### Phase 1B — AI Agent Integration (OpenAI Function Calling)

| ID | Title | Description | Deliverables | Dependencies | Est. | Priority |
|---|---|---|---|---|---|---|
| T-201 | Set up OpenAI client | OpenAI SDK init with `OPENAI_API_KEY`, configurable model | `xpg-backend/services/ai.js` | T-003 | S | Must |
| T-202 | Define function calling schema | `createXenditInvoice` tool with `{amount, description}` params, strict schema | Schema in `ai.js` or `tools/` | T-201 | S | Must |
| T-203 | Implement XenBot system prompt | Full system prompt with persona rules, constraints, edge case handling per AGENT.md | Prompt template in `ai.js` | T-201 | M | Must |
| T-204 | Implement message handler | Orchestrates: user msg → LLM call → parse tool call → execute → return response | `handleMessage()` in `ai.js` | T-202, T-203, T-103 | M | Must |
| T-205 | Edge case & validation logic | Amount < Rp10.000 rejection, off-topic detection, zero/negative handling | Validation in `ai.js` | T-204 | S | Should |

### Phase 1C — Frontend Chat UI (xpg-frontend)

| ID | Title | Description | Deliverables | Dependencies | Est. | Priority |
|---|---|---|---|---|---|---|
| T-301 | Update layout & branding | Metadata title → "AI Payment Assistant", update globals.css with sandbox theme | `app/layout.tsx`, `app/globals.css` | None | S | Must |
| T-302 | Build split-screen layout | CSS grid/flex layout: left panel (chat) + right panel (invoice) | `app/components/SplitLayout.tsx` | T-301 | S | Must |
| T-303 | Build Chat Room component | Message list, input field, send button, streaming response support | `app/components/ChatRoom.tsx` | T-302 | M | Must |
| T-304 | Build Invoice Viewer component | Embedded iframe for Xendit invoice URL, status badge, amount display | `app/components/InvoiceView.tsx` | T-302 | M | Must |
| T-305 | Implement "Simulate Success" button | POST to simulate endpoint, triggers webhook mock, updates UI | Button + handler in `InvoiceView.tsx` | T-304 | S | Must |
| T-306 | Create chat API client service | `fetch` wrapper for `POST /api/chat`, error handling, loading states | `app/services/chat.ts` | None | S | Must |
| T-307 | Wire page.tsx with components | Compose SplitLayout, ChatRoom, InvoiceView; manage state (messages, invoice) | `app/page.tsx` | T-302, T-303, T-304, T-306 | M | Must |

### Phase 2 — Integration

| ID | Title | Description | Deliverables | Dependencies | Est. | Priority |
|---|---|---|---|---|---|---|
| T-401 | Frontend ↔ Backend integration | Verify chat API calls reach backend, responses render correctly | Test report in devlog | T-104, T-307 | M | Must |
| T-402 | AI ↔ Xendit integration | Full flow: user message → AI creates invoice → invoice URL returned → displayed | Test report in devlog | T-103, T-204 | M | Must |
| T-403 | Webhook simulation flow | Simulate Success → webhook received → status updated → confirmation shown | Test report in devlog | T-105, T-305 | S | Must |
| T-404 | End-to-end smoke test | Complete user journey: type command → see invoice → simulate → see confirmation | E2E test script / manual test plan | T-401, T-402, T-403 | M | Must |

### Phase 3 — Validation & Polish

| ID | Title | Description | Deliverables | Dependencies | Est. | Priority |
|---|---|---|---|---|---|---|
| T-501 | Error handling hardening | Graceful error messages, network failure UI, timeout handling | Updated components + routes | T-404 | S | Should |
| T-502 | Security audit | Verify no API keys in client bundle, CORS locked, XSS prevention | Audit report in devlog | T-101 | S | Must |
| T-503 | Documentation finalization | README update, API docs sync, devlog retrospective | Updated README, final devlog | T-404 | S | Should |
| T-504 | Tracking document final sync | ROADMAP all [x], BACKLOG all Done, final commit | Updated ROADMAP/BACKLOG/DEVLOG | T-503 | S | Must |

---

## 🕸️ DEPENDENCY GRAPH

```
Phase 0 (Foundations)
├── T-001 [ROADMAP/BACKLOG/DEVLOG]
├── T-002 [Branch strategy]
└── T-003 [Env verification]
        │
        ▼
┌──────────────────────────────────────────┐
│          PARALLEL WORK STREAMS           │
│                                          │
│  Stream 1A (Backend)   Stream 1B (AI)   │
│  ┌────────────────┐   ┌──────────────┐  │
│  │ T-101 index.js │   │ T-201 AI cli │  │
│  │ T-102 Supa DDL │   │ T-202 Schema │  │
│  │ T-103 Xendit   │◄──│ T-203 Prompt │  │
│  │ T-106 Storage  │   │ T-204 Handler│  │
│  │ T-104 /api/chat│◄──│ T-205 Edge   │  │
│  │ T-105 /webhook │   └──────────────┘  │
│  └────────────────┘                      │
│                                          │
│  Stream 1C (Frontend)                    │
│  ┌────────────────┐                      │
│  │ T-301 Layout   │                      │
│  │ T-302 Split    │                      │
│  │ T-303 ChatRoom │                      │
│  │ T-304 Invoice  │                      │
│  │ T-305 Simulate │                      │
│  │ T-306 API svc  │                      │
│  │ T-307 Wireup   │                      │
│  └────────────────┘                      │
└──────────────────────────────────────────┘
        │
        ▼
    Phase 2 Integration
    ┌────────────────────────────────────┐
    │ T-401 FE↔BE   T-402 AI↔Xendit     │
    │ T-403 Webhook  T-404 E2E Smoke     │
    └────────────────────────────────────┘
        │
        ▼
    Phase 3 Validation
    ┌────────────────────────────────────┐
    │ T-501 Error handling              │
    │ T-502 Security audit              │
    │ T-503 Documentation               │
    │ T-504 Final sync                  │
    └────────────────────────────────────┘
```

**Critical Path:** T-001 → T-003 → T-101 → T-103 → T-204 → T-104 → T-401 → T-404 → T-502 → T-504

**Near-Critical Path:** T-301 → T-302 → T-303/304 → T-307 → T-401

**Zero-Dependency Pool (fully parallel):**
- T-301 (layout/branding) — independent of all backend work
- T-306 (chat API client) — just a fetch wrapper, no other frontend deps

---

## 🚀 PARALLEL EXECUTION PLAN

### Work Streams

| Stream | Focus | Tasks | Sub-agent | Branch |
|---|---|---|---|---|
| WS-0 | Foundation & Docs | T-001, T-002, T-003 | Orchestrator | `main` → `develop` |
| WS-1A | Backend Express API | T-101→T-106 | Backend Agent | `feature/backend-api` |
| WS-1B | AI Agent Integration | T-201→T-205 | AI Agent | `feature/ai-agent` |
| WS-1C | Frontend Chat UI | T-301→T-307 | Frontend Agent | `feature/frontend-ui` |
| WS-2 | Integration | T-401→T-404 | Integration Agent | `develop` |
| WS-3 | Validation | T-501→T-504 | QA Agent | `develop` |

### Branching Strategy

```
main          ●──────●─────────────────────────────── (protected, merged from develop only)
develop       ●──●─────●──────●────────────────────── (integration branch)
                │     │      │
feature/backend │────●──────●│────────────────────── (WS-1A)
feature/ai      │────●──────●│────────────────────── (WS-1B)
feature/frontend│────●──────●────────────────────── (WS-1C)
```

- **Naming convention:** `feature/{stream-name}`, `fix/{T-XXX}`
- **Merge protocol:** Feature branches → `develop` via squash-merge after code review. `develop` → `main` after Phase 3 exit criteria met.
- **Conflict resolution:** Owner = sub-agent who modified the file last. Escalate to orchestrator if same file modified in >1 stream.

### Progress Sync Interval

- Every task completion = immediate commit + push + ROADMAP/BACKLOG/DEVLOG update
- Max 30 min between syncs (auto-escalation if silent)
- Daily end-of-phase: orchestrator reviews all devlogs for consistency

---

## 📅 PHASED ROADMAP

### Phase 0 — Foundation (Estimated: 0.5h)
- **Entry:** Repository cloned, docs accessible
- **Tasks:** T-001, T-002, T-003
- **Exit criteria:** ROADMAP/BACKLOG/DEVLOG created with all tasks listed. `develop` branch exists. Env verified.
- **Documentation gate:** All 3 tracking documents written and committed.

### Phase 1 — Parallel Core (Estimated: 3-4h)
- **Entry:** Phase 0 complete, all agents briefed
- **Tasks:** T-101→T-106, T-201→T-205, T-301→T-307
- **Exit criteria:** Backend serves health check. AI returns valid responses. Frontend renders split-screen UI.
- **Documentation gate:** Each task has commit + devlog entry. ROADMAP updated per task completion.

### Phase 2 — Integration (Estimated: 1.5h)
- **Entry:** All 3 work streams complete, branches merged to `develop`
- **Tasks:** T-401→T-404
- **Exit criteria:** Full end-to-end flow verified: chat → invoice → simulate → confirmation.
- **Documentation gate:** Integration test results in devlog. Backlog items moved to `Done`.

### Phase 3 — Validation & Polish (Estimated: 1h)
- **Entry:** All core features integrated and working
- **Tasks:** T-501→T-504
- **Exit criteria:** No security issues. Error states handled. Documentation complete.
- **Documentation gate:** ROADMAP 100% complete. DEVLOG retrospective entry written. Final commit.

---

## 📝 DOCUMENTATION & VERSION CONTROL CHARTER

### ROADMAP.md Standard
```markdown
# ROADMAP

## Phase 0 — Foundation
- [x] T-001: Create tracking documents (2026-06-30) `abc1234`
- [ ] T-002: Set up branch strategy
```

### BACKLOG.md Standard
```markdown
# BACKLOG

| ID | Title | Priority | Status | Assignee | Notes |
|---|---|---|---|---|---|
| T-001 | Create tracking documents | Must | ✅ Done | Orchestrator | Committed `abc1234` |
| T-002 | Set up branch strategy | Must | 🔄 In Progress | Orchestrator | |
```

### DEVLOG.md Standard
```markdown
# DEVLOG

## 2026-06-30 14:00 UTC — T-001 — Orchestrator
**Completed:** Created ROADMAP.md, BACKLOG.md, DEVLOG.md templates
**Decisions:** Using checkbox + commit hash format for traceability
**Blockers:** None
**Next:** T-002 Branch strategy
```

### Commit Message Convention
```
type(scope): T-XXX - short description

type: feat | fix | docs | chore | refactor | test | security
scope: backend | frontend | ai | infra | docs

Examples:
feat(backend): T-101 - create Express server entry point
feat(ai): T-202 - define createXenditInvoice function schema
feat(frontend): T-303 - build Chat Room component
docs: T-001 - create tracking documents
```

### Auto-Tracking Rules
1. Each task's first commit must include `T-XXX: [start]` in devlog
2. Completion commit must update ROADMAP `[x]` + BACKLOG `Done` + DEVLOG entry
3. Blocked tasks: status `🔴 Blocked` in all 3 docs with reason
4. Pre-handoff checklist (sub-agent must confirm before marking complete):
   - [ ] All code committed with conventional message
   - [ ] ROADMAP task marked `[x]` with commit hash
   - [ ] BACKLOG status updated to `Done`
   - [ ] DEVLOG entry written with summary + decisions + next steps

---

## ⚠️ RISKS & MITIGATIONS

| Risk | Type | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| Xendit API key not available/expired | Technical | Medium | High | Use mock Xendit service in dev; document required env vars | Backend Agent |
| OpenAI API key missing | Technical | Medium | High | Fallback to rule-based extraction with regex; log warning | AI Agent |
| Supabase schema mismatch between streams | Coordination | Medium | Medium | Define DDL as single source of truth (T-102) before any CRUD work | Backend Agent |
| Merge conflicts on shared config files | Coordination | Low | Medium | `.env.*` in gitignore; config in separate files per stream | All agents |
| Silent failure (no commit > 30 min) | Coordination | Low | High | Orchestrator auto-escalation; mandatory sync interval | All agents |
| Next.js 16 API changes | Technical | Medium | Medium | Check `node_modules/next/dist/docs/` before writing code (per AGENTS.md) | Frontend Agent |
| Documentation drift | Documentation | Medium | Low | Devlog updates mandatory per task; orchestrator validates at phase gates | All + Orchestrator |

### Rollback Strategy
- Per-task rollback: `git revert <commit>` — each task is atomic
- Phase rollback: reset branch to last phase-gate commit on `develop`
- Full rollback: `git reset --hard <phase-0-commit>` and restore tracking docs

---

## ✅ DEFINITION OF DONE

A task is **Done** only when ALL these are true:

1. **Code complete:** All implementation files written and verified
2. **Tested:** Manual or automated verification passes (unit test or smoke test)
3. **Committed:** `git commit` with conventional message, pushed to remote
4. **ROADMAP updated:** Checkbox `[x]` with commit hash and timestamp
5. **BACKLOG synced:** Item moved to `Done` column
6. **DEVLOG entry written:** Timestamp, task-id, agent, summary, decisions, blockers, next steps
7. **No regression:** Existing features still work (smoke check)
8. **No secrets exposed:** Confirmed no API keys/tokens in committed code
9. **Integration verified** (Phase 2+): Works with dependent streams

---

## 🔄 CONTINUOUS TRACKING PROTOCOL

### Real-Time Progress Monitoring
- **Primary artifacts:** `git log --oneline`, `ROADMAP.md`, `BACKLOG.md`, `DEVLOG.md`
- **Sync interval:** Every task completion (max 30 min)
- **Audit command:** `git log --oneline --since="1 hour ago"` (verify recent activity)

### Escalation Path
1. Agent misses sync > 30 min → Orchestrator flags in devlog
2. Task blocked > 1 hour → Orchestrator re-assigns or unblocks
3. Phase gate not met → Phase extended with justification in devlog

### Audit Trail
Anyone should be able to determine project status by reading:
1. `git log` — chronological work history
2. `ROADMAP.md` — phase/feature completion status
3. `BACKLOG.md` — task-level tracking
4. `DEVLOG.md` — narrative of decisions, blockers, and rationale

No verbal handoff or undocumented progress is acceptable.
