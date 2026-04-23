# CLAUDE.md — Consilium

Read this file and `CASE-STUDY-LOG.md` before starting any work in this
project.

## What this project is

Consilium is a single-shot Stoic advisor for designers and product people.
The user describes a situation in 280 characters or less. The system
pre-classifies the input, assigns a Stoic philosopher persona, and returns
a short response: one reframe, one concrete action. No conversation history,
no accounts, no database.

It is a portfolio piece demonstrating product design, AI integration, and
design-to-code workflow. It is not a business venture.

## Tech stack

- Vite 6 + React 19 (no TypeScript, no router, no state management library)
- Tailwind CSS v4 (via @tailwindcss/vite plugin, no tailwind.config.js)
- CSS custom properties for theming
- Vercel serverless functions (`/api/advise.js`)
- Anthropic API (proxied through serverless functions)
- Fonts: Cormorant Garamond (serif headings), DM Sans (body)

## Commands

```bash
npm run dev       # Start Vite dev server (no API — use vercel dev instead)
vercel dev        # Start local dev with serverless functions on localhost:3000
npm run build     # Production build
npm run preview   # Preview production build
```

No test runner or linter is currently configured.

## Local development

Use `vercel dev` not `npm run dev`. Plain `npm run dev` only starts Vite —
the `/api/advise` serverless function won't run and submissions will 404.

Without `ANTHROPIC_API_KEY` set locally, the API automatically falls back
to mock responses. To use the real API locally, create a `.env.local` file:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Do not commit `.env.local` to git.

## Architecture

Single-page app with four states, managed by `App.jsx` via React hooks:

1. **Splash** — full-screen wordmark with fade-in/out animation on every visit
2. **Input** — `InputScreen.jsx` — text area with 280-char limit
3. **Response** — `ResponseScreen.jsx` — displays the classified tone's
   response with mode selector and compare navigation
4. **Share** — `ShareView.jsx` — three-column comparison on desktop,
   tabbed on mobile, accessed via URL param `?s=<encoded_situation>`

**API endpoint:** `POST /api/advise`
- Request: `{ "situation": "..." }`
- Response: `{ "classification": "reflective|blunt|practical", "responses": { ... } }`
- Each response has: `{ reframe, perspective, action }`
- Content filter rejects off-topic requests with 422
- Rate limited: 5 requests/min per IP (in-memory)
- Falls back to mock responses when `ANTHROPIC_API_KEY` is absent

**Theme system:** CSS variables toggled via `data-theme` attribute on `<html>`.
Dark mode is default. Persisted in `localStorage` as `consilium-theme`,
with system preference fallback on first load.

## Key files

- `consilium-ui-design-reference.md` — UI design principles, patterns to
  adopt, patterns to avoid. Read this before making any design decisions.
- `consilium-response-examples.md` — 30 curated situation-response examples
  across Reflective, Blunt, and Practical modes. Read this before modifying
  any system prompt in `api/advise.js`.
- `CASE-STUDY-LOG.md` — running log of design decisions and observations
  for the portfolio case study. Update this at the end of every session.

## Design principles

Do not make design decisions from scratch. Read
`consilium-ui-design-reference.md` first. The key rules:

- Warm off-white background (#F0EDE8 range), not pure white
- Dark theme: warm near-black (#1C1A18), not cold black
- Gold accent (#b89a6e dark / #9a7d52 light) used on:
  - Wordmark on the input screen
  - Situation truncation in response screen header
  - Compare screen column headers
  - Action line left border
- Response text: short prose only — one reframe, one concrete action
- No bullet points anywhere in response text
- No bold headers in response text
- Submit button never labelled in all-caps
- Character count only appears after the user starts typing
- All animations use the same fade (opacity ease-out) — no movement,
  no scaling, no bounce

Check `consilium-ui-design-reference.md` for status markers
([LOCKED] / [EXPLORING] / [OPEN]) on each design area before making
changes.

## When to ask for design advice

Before proposing a solution to any design or UX decision, check
`CASE-STUDY-LOG.md` and `consilium-ui-design-reference.md` first.
If the decision is already documented, implement it without asking.

Only escalate to the Design Workspace chat (Claude.ai) when:
- A decision conflicts with something already locked
- A new design problem has no precedent in the existing docs
- A build constraint requires changing a locked design decision

For pure build and debugging issues, diagnose and fix autonomously.
Do not relay error messages back to Oscar for diagnosis — read the
terminal output, identify the cause, and fix it. Only involve Oscar
when a build decision has design implications.

## Workflow

Design thinking and decisions happen in the Design Workspace project in
Claude.ai. Build and execution happen here in Claude Code.

One focused change per session. One commit per session.

## End of session log

At the end of every working session, before closing, add a dated journal
entry to `CASE-STUDY-LOG.md` covering:
- What was worked on
- Design or build decisions made, including what was rejected and why
- Decision source: [Paper — tested] or [Conversation — not yet mocked]
- Observations about what worked or didn't
- Known issues: split into Blockers and Polish
- Open questions or next steps

Write the entry in first person from Oscar's perspective. Ask Oscar to
confirm or edit before finishing.

If any decision in this session reverses a previously logged decision,
flag it explicitly under a **Reversals** heading. Name the original
decision, what replaced it, and why. Never let a new entry silently
contradict an old one.
