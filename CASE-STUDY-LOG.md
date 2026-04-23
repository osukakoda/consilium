# Consilium — case study log

This file is a running capture document. It is not a finished case study.
It is a log of decisions, reasoning, and observations made during the build
of Consilium, to be used as raw material when writing the portfolio case
study later.

**How to use this file**
- Add entries as the project progresses, not retrospectively
- Date each entry
- Claude Code: at the end of every working session, append a dated journal
  entry covering what was worked on, decisions made, what was rejected and
  why, and open questions. Ask Oscar to confirm before saving.
- Oscar: when something feels like a breakthrough or a dead end, write it
  down immediately — the raw observation is more valuable than a polished
  summary later.

---

## Session log — 17 April 2026

### What we worked on

Full design exploration and iteration cycle for Consilium, from competitive
research through to a live deployed build. The product went from a
half-built MVP with no design direction to a working, deployed application
with a coherent visual identity.

---

### Competitive research

Reviewed Claude, ChatGPT, Gemini, Grok, and Pi using the same prompt across
all five to make comparison direct.

Key conclusion: the input state is a solved problem. Every product has
converged on the same pattern — centred card, warm or neutral background,
bottom-anchored submit. No differentiation to be made there. The response
state is where Consilium earns its distinctiveness.

ChatGPT, Gemini, Grok, and Claude all default to structured responses with
headers, bullets, and numbered sections. That pattern is correct for
task-completion products and wrong for a reflection tool.

Pi was the most useful reference. Warm background, short prose response, no
structure, full-width AI response, right-aligned user bubble. Three
sentences. No bullets. That is the benchmark.

---

### Design decisions made and locked

**Input empty state**
- Remove "A moment of counsel" label — noise
- Remove "Take your time." — noise
- Submit button present in empty state at reduced opacity, signals readiness

**Input filled state**
- Character count inside card, bottom-left, only visible once typing starts
- Hard cap at 280 characters enforced in input handler
- Submit button activates to full gold (#b89a6e) when content present

**Response state**
- Reframe paragraph: regular weight, not bold
- Stoic paragraph: regular weight
- Action line: gold (#b89a6e) left border and text, italic serif, sized
  between body and heading — the focal point of the product
- Mode selector: single row — Reflective · Blunt · Practical · Compare modes →
- Active mode: dark filled pill
- Inactive modes: identical outline treatment
- Compare modes: outline with chevron, signals navigation not selection
- Situation truncation in header: gold, muted, correct weight

**Compare screen**
- Three columns: Reflective, Blunt, Practical headers in gold
- Action line in each column: gold treatment matching response screen
- Desktop: three columns side by side
- Mobile: stacked vertically with Start over at bottom

**Error states**
- Banner position: between heading and input card
- Terracotta fill, no outline border
- Copy confirmed on-tone for all three states

**Mode selector interaction model**
- No mode selector on input screen
- User submits, system classifies, one response delivered
- Mode selector appears on response screen after response
- Switching mode replaces response with that mode's reading
- Compare navigates to three-column view

---

### Rejected decisions

- "A moment of counsel" label — noise, removed
- "Take your time." filler — noise, removed
- Save / Copy / Share actions — wrong tone, not a social platform
- Roman numerals as column headers — replaced with mode names
- Mode selector on input screen — mode is a system output, not a user
  selection
- Two-row mode selector — consolidated to single row
- Bold reframe paragraph — regular weight, action line is the anchor
- Outlined error banner — replaced with soft terracotta fill

---

### Documentation created this session

- `consilium-ui-design-reference.md` — design principles, patterns to adopt
  and avoid, per-product reference table, status markers
- `CASE-STUDY-LOG.md` — this file
- `CLAUDE.md` — project governance file with architecture, commands, design
  principles, workflow split, end-of-session log instruction

---

### Current state of the live build

Deployed at consilium-kappa.vercel.app. Working end to end.

What is confirmed working:
- Input empty state — clean, no noise, correct proportions
- Input filled state — character count, gold submit button, hard cap
- Response state — all three modes switching correctly, action line in gold,
  mode selector single row, Compare modes navigating correctly
- Compare screen — three columns desktop, stacked mobile, gold column
  headers, gold action lines, Start over navigation
- Classification routing — Reflective, Blunt, Practical all producing
  distinct tones and responses
- Response quality — short, direct, no bullets, Stoic register consistent
  across modes

Known issues carried into next session:
- Error banner position needs verification across all three error states
  in the live build
- Gold action line colour in Compare screen needs checking in live build
- Mobile Compare stacked view spacing needs review

---

### Response quality observation

The live API responses are producing the right register. Short, direct,
no padding. Examples from testing:

Reflective: "This situation is an invitation to examine what you truly
value. Sit with the discomfort rather than rushing to resolve it. Clarity
often emerges not from thinking harder, but from pausing long enough to
hear what you already know."

Blunt: "You already know what to do — you're looking for permission that
no one else can give you. Every day you delay is itself a choice."

Practical: "This is a resource allocation problem with incomplete but
sufficient information. You don't need more data — you need a framework."

The classification is routing correctly. The tone difference between the
three modes is clear and meaningful.

---

### Next steps carried forward

1. Verify error banner position in live build across all three error states
2. Verify gold action line colour in Compare screen live build
3. Review mobile Compare stacked view spacing
4. Consider adding Consilium to the portfolio as a side project card
5. Write the portfolio case study card title and subtitle using the same
   outcomes-forward format as the three main case studies

---

## Session log — 21 April 2026

### What we worked on

Wired up the live Anthropic API, resolved a series of environment and
credential issues, rewrote the three philosopher system prompts using
the NotebookLM examples as a quality benchmark, tuned the classification
prompt, and confirmed the app is working end to end with real API responses.

---

### What was completed

**API integration**
- Wired up the live Anthropic API path in api/advise.js
- Added fallback to mock responses when ANTHROPIC_API_KEY is absent
- All four calls use claude-haiku-4-5-20251001
- Classification and three philosopher responses confirmed working
- JSON fence stripping added to handle occasional markdown wrapping
  from the model
- Per-tone try/catch added so a single bad JSON parse does not kill
  all three columns

**Credentials**
- Created consilium-vercel-prod API key in console.anthropic.com
- Added $5 credit balance to Anthropic account
- Added ANTHROPIC_API_KEY to Vercel environment variables
  (Production and Preview)
- Resolved account mismatch that was causing "credit balance too low"
  error despite credits being present

**System prompt rewrite**
- All three philosopher system prompts rewritten using
  consilium-response-examples.md as the quality benchmark
- JSON key renamed from advice to perspective across api/advise.js,
  ResponseScreen.jsx, and ShareView.jsx
- New prompts instruct the model to: name the Stoic concept, strip
  the objective event from the user's judgment, apply the specific
  philosopher's voice, end with one concrete action
- 120-word output cap enforced
- No bullets, no bold headers, no philosopher name revealed to user

**Classification prompt tuning**
- Added three new trigger categories to the Blunt classification:
  credit/recognition/attribution disputes, overcommitment and
  inability to say no, blaming external circumstances for own choices
- Verified routing: "My manager gave credit for my work to another
  designer" now correctly routes to Blunt instead of Reflective

---

### Response quality confirmed

First live API response tested against:
"I keep saying yes to extra work because I don't want to seem
difficult, and now I'm drowning and starting to resent everyone
around me."

All three modes produced distinct, philosophically grounded responses.
The depth problem from the mock responses is resolved. Selected examples:

Blunt: "A slave blames the master. A free person names what they
will and will not do. Which are you?"

Practical: "A ship does not refuse to be loaded; it sinks. You are
confusing compliance with virtue."

The elenctic reasoning structure is working — concept named, event
stripped from judgment, philosopher's voice applied, concrete action
delivered.

---

### Decisions made

- Model: claude-haiku-4-5-20251001 for all calls — sufficient quality,
  significantly cheaper than Sonnet or Opus
- Cost per submission: approximately $0.01 across four API calls
- Remaining balance: ~$4.99, sufficient for the entire job search period
- Mock fallback retained for local development without a key

---

### Rejected decisions

- Response library (Option B) as alternative to live API — rejected once
  credits confirmed affordable at $0.01 per submission
- RAG approach (Option A) — rejected as infrastructure overhead not
  justified for a portfolio piece at this usage level

---

### New files added to project

- `consilium-response-examples.md` — 30 curated situation-response
  examples across Reflective, Blunt, and Practical modes, grounded in
  primary Stoic texts. Added to project root. Referenced in CLAUDE.md.

---

### Known issues to carry into next session

**Blockers**
- None. App is working end to end.

**Polish**
- Error banner position: verify it sits between heading and input card
  across all three error states in the live build (desktop Chrome and
  mobile Safari)
- Gold action line colour: verify in Compare screen live build
- Mobile Compare stacked view: spacing review needed

---

### Next steps

1. UI polish pass — error banner, gold action line in Compare,
   mobile spacing
2. Dark theme pass — verify warm near-black and gold accent rendering
3. Add Consilium to portfolio as a side project card
4. Write portfolio case study card title and subtitle
5. Consider Claude Design for remaining UI exploration now that it
   is available in the sidebar

---

## Session log — 23 April 2026

### What we worked on

UI fixes to the response and compare screens, Paper.design exploration
of tab bar positioning, system prompt sentence limits, and tab position
implementation in code. Also updated project documentation and workflow
instructions across both CLAUDE.md and the Design Workspace project.

---

### Code changes shipped

**Wordmark as navigation — ResponseScreen.jsx and ShareView.jsx**
Added onClick={onBack}, cursor: pointer, and opacity-to-0.6 hover on
the Consilium wordmark in both the response and compare screens. Gives
users a second instinctive "start over" affordance alongside the
explicit Start over button. Input screen wordmark unchanged — not a
navigation element there.
Decision source: [Conversation — not yet tested against users]

**Situation truncation removed from compare screen header**
The compare screen header now shows the Consilium wordmark only.
The situation text was creating noise at the top of a screen where
the three column headers already provide context.
Decision source: [Conversation — not yet mocked]

**System prompt sentence limits — api/advise.js**
Added per-section sentence limits to all three philosopher prompts.
Removed the 120-word combined cap — it conflicted with the sentence
limits and was the less precise constraint.

Per-mode limits:
- Reflective: Reframe max 2 sentences, Perspective max 3, Action max 1
- Blunt: Reframe max 1 sentence, Perspective max 2, Action max 1
- Practical: Reframe max 2 sentences, Perspective max 3, Action max 1

Enforcement instruction added to hard rules in each prompt:
"Do not exceed the sentence count for any section. If you cannot
make the point within the limit, cut the point."
Decision source: [Conversation — not yet tested against live API]

**Tab position fix — ResponseScreen.jsx and index.css**
Implemented Variant B: flex container bottom anchor on desktop.
Three coordinated changes, desktop only via @media (min-width: 768px):
- Content area: justify-content switches from center to flex-start
  at beat3 so inner column fills from top
- Inner column: flex: 1 at beat3 so it stretches to fill content area
- Tab container: margin-top: auto at beat3 pushes tabs to bottom
justifyContent moved from inline style to CSS class so desktop
override can take effect. Mobile layout unchanged.
Decision source: [Paper — tested, Variant B confirmed]

---

### Paper.design exploration — tab bar positioning

**Problem**
Mode selector tabs sit in document flow. Their vertical position
shifts with response text length — up to 22% viewport drift between
short and long content.

**Research**
Reviewed AI product screenshots in the documentation page:
- Grok: persistent mode bar pinned to viewport bottom — informs A
- Pi: full-height flex column, input pushed to bottom — informs B
- Claude/ChatGPT/Gemini: no persistent mode selectors
- No AI product uses document flow for persistent controls

**Three variants explored**

Variant A — Fixed to viewport bottom
Eliminated on desktop. At 1440px viewport with 640px content column,
tabs float with ~400px dead space on each side. Completely
disconnected from the content. No visual connection to the response.

Variant B — Flex container bottom anchor
Selected for desktop. With sentence limits applied, content height
stays within ~420px. The flex spacer absorbs the remainder. Both
short and long content versions show tabs landing at the same Y
position. Confirmed in Paper.design before building.

Variant C — Document flow (current behaviour)
Eliminated. Annotation callouts showed 52% to 82% viewport drift
between short and long content. No AI product uses this pattern.

**Mobile**
Sticky footer, three pills only, no Compare modes. Already decided
and not in question. All three mobile variants were identical.

---

### Decisions made

- Wordmark as Start over on response and compare screens [shipped]
- Compare screen header: wordmark only [shipped]
- Sentence limits per mode, 120-word cap removed [shipped]
- Variant B flex bottom anchor for desktop tabs [shipped]
- Mobile: sticky footer, Reflective/Blunt/Practical only [Paper — not yet shipped]
- No Compare modes on mobile — too much scrolling for a reflection
  tool, wrong context [Conversation — not yet shipped]
- Variant A fixed viewport bottom rejected for desktop [locked]
- Variant C document flow rejected [locked]

---

### Reversals

- 120-word combined cap removed from all three system prompts.
  Original decision: cap responses at 120 words total.
  Replaced by: per-section sentence limits per mode.
  Reason: sentence limits are more precise and actionable for the
  model. The two constraints conflicted when sentences ran long.

---

### Workflow changes

- CLAUDE.md updated with new "When to ask for design advice" section
  instructing Claude Code to diagnose and fix build issues
  autonomously rather than relaying errors back to Oscar.
- Design Workspace project instructions updated with "Build
  escalation" section to reduce ping-pong between chat and Claude Code.
- Local development instructions added to CLAUDE.md — use vercel dev
  not npm run dev, mock fallback behaviour documented.

---

### Known issues

**Blockers**
- None. App working end to end.

**Polish**
- Sentence limits not yet tested against live API — deploy and test
  with Blunt situation to verify counts are respected
- Mobile sticky footer not yet shipped to code
- Error banner position: carried over from 21 April
- Gold action line in Compare screen live build: carried over
- Mobile Compare stacked view spacing: carried over
- Wordmark navigation edge case: not yet tested during loading state

---

### Next steps

1. Deploy sentence limit changes and test Blunt response against
   "I said yes to a freelance project I don't have time for and
   now the deadline is next week and I haven't started"
2. Ship mobile sticky footer — three pills, no Compare modes
3. Ship wordmark as Start over on mobile
4. Verify error banner, gold action line in Compare, mobile spacing
5. Begin thinking about Consilium portfolio card title and subtitle
