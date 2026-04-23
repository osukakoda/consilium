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
- Anthropic API (proxied through serverless functions, currently mock — awaiting credits)
- Fonts: Cormorant Garamond (serif headings), DM Sans (body)

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
```

No test runner or linter is currently configured.

## Architecture

Single-page app with three states, managed by `App.jsx` via React hooks:

1. **Input** — `InputScreen.jsx` — text area with 280-char limit
2. **Response** — `ResponseScreen.jsx` — displays the classified tone's advice, expandable to see all three
3. **Share** — `ShareView.jsx` — three-column comparison, accessed via URL param `?s=<encoded_situation>`

**API endpoint:** `POST /api/advise`
- Request: `{ "situation": "..." }`
- Response: `{ "classification": "reflective|blunt|practical", "responses": { ... } }`
- Content filter rejects off-topic requests (code, essays, translations) with 422
- Rate limited: 5 requests/min per IP (in-memory)

**Theme system:** CSS variables toggled via `data-theme` attribute on `<html>`.
Dark mode is default. Persisted in `localStorage` as `consilium-theme`,
with system preference fallback on first load.

## Key files

- `consilium-ui-design-reference.md` — UI design principles, patterns to
  adopt, patterns to avoid. Read this before making any design decisions or
  working in Paper.design.
- `CASE-STUDY-LOG.md` — running log of design decisions and observations
  for the portfolio case study. Update this at the end of every session.

## Design principles

Do not make design decisions from scratch. Read
`consilium-ui-design-reference.md` first. The key rules:

- Warm off-white background (#F0EDE8 range), not pure white
- Dark theme: warm near-black (#1C1A18), not cold black
- Gold accent: #b89a6e (dark) / #9a7d52 (light)
- Response text: short prose only — one reframe, one concrete action
- No bullet points anywhere in response text
- No bold headers in response text
- Submit button never labelled in all-caps
- Character count only appears after the user starts typing

Colour values and visual treatment listed above are currently under
exploration in Paper.design. Treat them as working assumptions, not locked
decisions. Check `consilium-ui-design-reference.md` for current status
markers on each area.

## Workflow

Design thinking and decisions happen in the Design Workspace project in
Claude.ai. Build and execution happen here in Claude Code.

When working in Paper.design via MCP:
- Read consilium-ui-design-reference.md before starting
- Do not modify existing screens — duplicate first, then explore
- Label all variants clearly

## End of session log

At the end of every working session, before closing, add a dated journal
entry to `CASE-STUDY-LOG.md` covering:
- What was worked on
- Design or build decisions made, including what was rejected and why
- Observations about what worked or didn't
- Open questions or next steps

Write the entry in first person from Oscar's perspective. Ask Oscar to
confirm or edit before finishing.

If any decision in this session reverses a previously logged decision,
flag it explicitly under a **Reversals** heading. Name the original
decision, what replaced it, and why. Never let a new entry silently
contradict an old one.
