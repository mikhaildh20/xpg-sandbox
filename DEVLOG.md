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
