# DEVLOG — AI-Powered Payment Assistant (XPG Sandbox)

Format: `YYYY-MM-DD HH:MM UTC — T-XXX — Agent`

---

## 2026-06-30 — T-001 — Orchestrator

**Completed:** Created ROADWAY.md, BACKLOG.md, DEVLOG.md tracking documents with full task breakdown across all phases.

**Decisions:**
- Using checkbox + commit hash format for ROADMAP traceability
- BACKLOG uses priority (MoSCoW) + status columns
- DEVLOG captures narrative: decisions, blockers, next steps

**Blockers:** None

**Next:** T-002 — Set up branch strategy (create develop branch)

## 2026-06-30 — T-301 — Frontend Agent

**Completed:** Updated layout.tsx with new metadata title/description, rewrote globals.css with sandbox theme (blues, greens, success colors) and split-layout grid utility.

**Decisions:** Used CSS grid for split layout instead of flexbox for more natural equal-column split. Kept layout.tsx as server component (no 'use client' needed).

**Blockers:** None

**Next:** T-302 — Build split-screen layout

## 2026-06-30 — T-302 — Frontend Agent

**Completed:** Created SplitLayout.tsx component with CSS grid-based two-panel layout. Left/right panels via children props. Uses the .split-layout class from globals.css for responsive behavior.

**Decisions:** Used CSS grid for equal column split. Left panel has right border divider. Client component for composition flexibility.

**Blockers:** None

**Next:** T-303 — Build Chat Room component

## 2026-06-30 — T-303 — Frontend Agent

**Completed:** Created ChatRoom.tsx component with scrollable message list, user/bot message styling, input field with send button, loading dots animation, and auto-scroll behavior.

**Decisions:** Used TailwindCSS for styling. Messages shown with bubble layout - user messages right-aligned (blue), bot messages left-aligned (gray) with XenBot name label. Loading indicator uses animated bouncing dots.

**Blockers:** None

**Next:** T-304 — Build Invoice Viewer component

## 2026-06-30 — T-304 — Frontend Agent

**Completed:** Created InvoiceView.tsx with invoice card showing amount, description, status badge (pending/paid/failed), and embedded iframe for Xendit invoice URL. Empty state placeholder shown when no invoice is active.

**Decisions:** Combined invoice display with simulate buttons in a single component. Used Indonesian currency formatting (IDR). Status badges use color-coded styling (yellow/green/red).

**Blockers:** None

**Next:** T-305 — Implement "Simulate Success" button

## 2026-06-30 — T-305 — Frontend Agent

**Completed:** Added simulate success and failure buttons to InvoiceView. Includes loading spinner while processing, checkmark/X animation on result, auto-dismiss after 3 seconds. Both buttons call parent callbacks with orderId.

**Decisions:** Combined with InvoiceView for cohesive UX. uses simulateResult state for feedback animation. Timeout auto-clears result after 3s.

**Blockers:** None

**Next:** T-306 — Create chat API client service

## 2026-06-30 — T-306 — Frontend Agent

**Completed:** Created chatApi.ts service with typed interfaces (ChatRequest, ChatResponse, SimulateRequest, SimulateResponse), sendMessage() and simulatePayment() functions, error handling with ChatApiError class, timeout support via AbortController, and configurable BASE_URL via NEXT_PUBLIC_API_URL env var.

**Decisions:** Used generic request() helper for DRY HTTP logic. Custom ChatApiError class for structured error handling. Timeout of 15s for requests.

**Blockers:** None

**Next:** T-307 — Wire page.tsx with all components

## 2026-06-30 — T-307 — Frontend Agent

**Completed:** Rewrote page.tsx as client component with full state management. Removed Supabase todos query. Composes SplitLayout (left: ChatRoom, right: InvoiceView). Handles sendMessage -> API call -> bot reply + invoice. Handles simulateSuccess/Failed -> API call -> status update + bot confirmation.

**Decisions:** Made page.tsx a client component ('use client') because it needs useState/useCallback for interactive state. Uses useCallback for memoized handlers.

**Blockers:** None

**Next:** Final build verification

## 2026-06-30 — T-307b — Frontend Agent

**Completed:** Build verification passed successfully after removing unused Supabase utils that referenced uninstalled @supabase/ssr package. All 7 tasks complete, build produces clean output.

**Decisions:** Removed old Supabase utility files since they are no longer needed by the frontend (page.tsx now uses custom chatApi service).

**Blockers:** None

**Next:** Phase 2 — Integration (T-401 onward)

---

## 2026-06-30 — T-101 — Orchestrator

**Completed:** Created Express server entry point (index.js) with CORS, JSON parser, health route, error handler. Routes scaffolded as stubs. Server verified on port 4000.

**Decisions:** Using Express 5 with Router pattern. CORS origin configurable via FRONTEND_URL env var.

**Blockers:** None

**Next:** T-102 — Create Supabase schema migration
