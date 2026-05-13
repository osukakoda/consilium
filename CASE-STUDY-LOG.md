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

---

## Session log — 11 May 2026

### What was worked on

Two main threads: (1) formalising the typography scale into CSS custom
properties across the entire app, and (2) planning a Paper → Figma
migration.

---

### Type scale formalisation

The app was using a mix of hardcoded font-size and line-height values
across JSX inline styles. This session replaced all of them with a
formally defined Major Third (1.25×) scale at 16px base, defined as
CSS custom properties in `:root` of `index.css`.

**Token set defined**

Six size tokens:
- `--text-xs`: 13px — character count, small UI labels
- `--text-s`: 15px — mode pills, column headers
- `--text-base`: 16px — body text, input, situation truncation, perspective
- `--text-m`: 20px — wordmarks
- `--text-l`: clamp(20px, 3vw, 25px) — reframe paragraph
- `--text-xl`: clamp(20px, 5vw, 32px) — action line

Five line-height tokens:
- `--leading-tight`: 1.3 — wordmarks, pills, column headers
- `--leading-base`: 1.5 — input textarea, situation truncation
- `--leading-reading`: 1.6 — reframe, perspective, body prose
- `--leading-reading-mobile`: 1.65 — perspective on mobile
- `--leading-display`: 1.24 — action line (large italic serif)

**Files updated**
- `src/index.css` — tokens added to `:root`
- `src/App.jsx` — splash, offline, and invalid-link wordmarks
- `src/components/InputScreen.jsx` — wordmark, textarea, character count
- `src/components/ResponseScreen.jsx` — all text elements
- `src/components/ShareView.jsx` — wordmark, column labels, response text
- `consilium-ui-design-reference.md` — new `## Typography scale [LOCKED]`
  section added documenting the full scale with usage column and mobile
  adjustments

**Recurring problem solved**
Any property that needs a `@media` query override must live in a CSS
class, not a JSX `style={{}}` inline prop — inline always wins.
This pattern came up multiple times when implementing mobile overrides
for `response-perspective`, `response-sections` gap, the sticky footer
padding, and the Compare modes hide. All resolved by moving the relevant
property from inline to a CSS class, then overriding that class at the
breakpoint.

**Decision source:** [Conversation — tested in build]

---

### Paper → Figma migration — plan written

Goal: reproduce the Paper.design screens accurately in Figma as a proper
component library. Paper is the source of truth — not the live build,
which may differ.

**Constraints established**
- Light mode only — no dark mode tokens needed in Figma
- Mobile screens not yet designed in Paper — desktop only in scope
- The live build likely does not match Paper; a comparison pass is needed
  before migration begins

**Known challenge flagged**
Past attempts have had problems because Paper uses CSS flexbox and Figma
uses auto-layout. These are conceptually equivalent but have caused
translation errors before. The plan documents the explicit mapping:
`flex-direction: row/column` → `layoutMode: HORIZONTAL/VERTICAL`,
`gap` → `itemSpacing`, `flex: 1` on a child → `layoutGrow: 1`,
`align-items` → `counterAxisAlignItems`.

**Phase 0 (comparison) before any migration**
The first step is to compare the Paper design page against the current
build and present a written diff to Oscar for sign-off. Migration
begins only after that diff is approved.

Paper URL: `https://app.paper.design/file/01KN31AEJDEBX6C8N5QS858B3G/01KN31AEJDWVYKZ8KBQSRAFA5K`
Migration plan: `/Users/oscarabizanda/.claude/plans/velvet-gliding-crescent.md`

The Paper MCP server disconnected mid-session. Phase 0 is the first task
for the next session once Paper MCP is confirmed connected.

**Decision source:** [Conversation — not yet executed]

---

### Decisions made

- Major Third type scale formalised as CSS custom properties [shipped]
- `consilium-ui-design-reference.md` updated with `## Typography scale [LOCKED]`
  section — this section is now locked, do not explore alternatives
- Paper → Figma migration plan written: Phases 0–6, light mode only,
  desktop only, Phase 0 is a diff approval gate before any migration begins
- Figma migration target: pixel-accurate with components (not just layout)

---

### Known issues

**Blockers**
- Paper MCP server disconnects between sessions; must confirm connected
  at the start of any session that uses it
- Phase 0 (Paper vs build diff) not yet run — cannot begin migration
  until this is done and approved

**Polish**
- Type scale changes committed but not yet tested in production against
  the live deployed URL — verify clamp values render correctly at
  various viewport widths
- Sentence limits not yet tested against live API (carried from 23 April)
- Error banner position: carried over from 21 April
- Gold action line in Compare screen live build: carried over
- Mobile Compare stacked view spacing: carried over
- Wordmark navigation edge case during loading state: carried over

---

### Next steps

1. Confirm Paper MCP is connected in terminal
2. Run Phase 0: compare Paper design page against the build, report diff
3. Oscar approves diff, then begin Phases 1–6 of the migration plan
4. Test type scale clamp values at narrow/wide viewports in production
5. Test sentence limits against live API with Blunt scenario

---

## Session log — 12 May 2026

### Observation: two primary use contexts

A design conversation surfaced two distinct mental states that users arrive in:

**Scenario 1 — end of day, going home.** The person has had a bad day. They're on their phone, in transit, decompressing. They have space. They'll read slowly, maybe reread. Reflective mode maps closely to this state. The design can breathe.

**Scenario 2 — at work, something just happened.** The person is activated — mid-crisis, typing on their phone in a corridor or at their desk. They can't hold a long paragraph in their head. The action line is probably the only part they'll act on immediately. The reframe and perspective become things they return to later, if at all.

This raises a design question: does the current response hierarchy surface the action line prominently enough for scenario 2, without breaking the experience for scenario 1? No change made. Carried forward as an open question.

---

### Phase 2 idea: two response modes (deferred)

The observation prompted a brief discussion about splitting response modes:
- Short and immediately actionable — for the activated, at-work state
- Longer, with pointers to further reading — for the reflective, end-of-day state

Decision: deferred to Phase 2. The current short-response format and sentence constraints serve both cases reasonably. Further exploration only warranted if testing shows the action line is being missed in the activated state.

---

### What was shipped this session

- Error messages rewritten across all four error types — shorter, slightly Stoic register
- Off-topic and gibberish validation moved to the frontend (before fetch), so no Haiku tokens are spent on rejected input
- Gibberish detection: vowel-ratio check (< 15% vowels in alphabetic characters) catches random keyboard input
- `launch.json` updated with `--yes` flag for `vercel dev` to allow preview server to start cleanly

---

### Known issues

**Blockers**
- Paper MCP server disconnects between sessions (carried from 11 May)
- Phase 0 (Paper vs build diff) not yet run (carried from 11 May)

**Polish**
- Type scale clamp values not yet tested in production (carried from 11 May)
- Sentence limits not yet tested against live API (carried from 23 April)
- Error banner position (carried from 21 April)
- Gold action line in Compare screen live build (carried from 21 April)
- Mobile Compare stacked view spacing (carried from 21 April)
- Wordmark navigation edge case during loading state (carried from 23 April)

---

### Next steps

1. Confirm Paper MCP connected, run Phase 0 diff
2. Test type scale clamp values in production
3. Test sentence limits with live Blunt scenario
4. Consider whether action line visual weight is sufficient for the activated use context (Scenario 2)

---

## Session log — 13 May 2026

### What was worked on

Full design-to-code cycle for a new mode selector pattern. Replaced the
tab strip on the response screen with a dropdown menu on desktop and a
bottom sheet on mobile. Designed four states in Paper first, then built
and iterated until both patterns worked correctly.

---

### Design decision: tab strip → dropdown

The tab strip (Reflective · Blunt · Practical · Compare modes →) was the
established pattern from April. It worked functionally but raised a UX
problem: users see the three mode names on arrival, before they've read any
response. This front-loads a choice they aren't equipped to make yet.

The new pattern defers that reveal. A single label — the classified mode
name plus a chevron — appears below the response. The user reads first.
Only when they tap or click does the dropdown open and expose the other
modes with short descriptors. The choice becomes contextual rather than
upfront.

The model reference was Claude and ChatGPT's model selectors: a trigger
button showing the current selection that opens a list of alternatives.
Familiar pattern, applied to mode switching rather than model switching.

Decision source: [Conversation — informed by competitive reference]

---

### Paper design session

Four states designed before writing any code:
- Resting state (mode trigger + Start again)
- Desktop popover open (300px wide, 12px radius, three rows)
- Mobile resting (fixed footer)
- Mobile bottom sheet open (full-width, 20px radius top, dark overlay)

Descriptors written for each mode to appear below the mode name in the
options list:
- Reflective: "The question behind the question"
- Blunt: "No softening. Just the truth"
- Practical: "A path forward, not a place to sit"

Decisions locked in Paper before build began:
- No dividers between option rows — white space is sufficient
- Hover state: F0EBE2 background, #3A322B text (warm, not cold grey)
- Check slot (16px wide, flex-shrink: 0) for the active mode tick
- Mobile close affordance: X icon top-right of the sheet, not a text label

Decision source: [Paper — tested]

---

### Build: what shipped

**ResponseScreen.jsx — full restructure**
- Mode selector implemented: trigger button with ChevronDown, options
  popover/sheet, check mark on active mode, Cancel → X icon (Lucide)
- Click-outside detection: `document.addEventListener('pointerdown', ...)`
  with `useRef` on the selector container and `setTimeout(0)` defer.
  Defer is required because the click that opens the dropdown would
  otherwise fire the outside-click listener immediately and close it.
- `window.addEventListener('keydown', ...)` for Escape key dismiss.
- Overlay rendered at the ROOT level of ResponseScreen's return, outside
  all content containers. Required to escape the stacking context created
  by the response-enter animation on the content area wrapper.

**InputScreen.jsx**
- Enter key now submits. Shift+Enter inserts a newline (browser default).
  Previously Enter did nothing — the only submit path was the button.

**index.css — mode selector classes**
- Old tab CSS removed: `.response-tabs--beat3`, `.response-tabs-spacer`,
  `.compare-modes-btn`, `.response-start-again`
- New classes added: `.mode-selector-row`, `.mode-trigger`, `.mode-options`,
  `.mode-option-row`, `.mode-sheet-close`, `.mode-overlay`, etc.
- Mobile: `.mode-selector-row` becomes `position: fixed; bottom: 0` with
  `env(safe-area-inset-bottom)` padding and gradient fade above
- Mobile: `.mode-options` becomes `position: fixed; bottom: 0; border-radius:
  20px 20px 0 0`; `.mode-overlay` gains background and `pointer-events: auto`

---

### Iterations during build

**Mode trigger label colour**
Built with `var(--text)` (near-black) initially. Oscar noted it was drawing
too much attention at the bottom-left. Changed to `var(--text-secondary)`
(#7c7b79). The trigger recedes without disappearing.

**Gold pulse on loading removed**
During the waiting phase (API call in progress), the situation text was
pulsing and then turning gold (#b89a6e) at beat1 before the response
arrived. Oscar flagged this. The gold transition was removed — text stays
`var(--text)` throughout waiting and only the animation class (opacity
pulse) runs. The gold step added complexity to the beat sequence without
adding clarity.

**Response perspective body text**
Font size changed from 17px to 19px. Font weight changed from 400 to 500.
The paragraph was disappearing between the reframe and the action line.
The weight change pulls it into the reading path without competing with
the action line's size.

**Chevron micro-animation**
Added `transform: rotate(180deg)` on `.mode-trigger--open svg` and
`.mode-trigger:hover svg` with `transition: transform 350ms ease-in-out`.
350ms was chosen after testing 200ms (too mechanical) and discussing the
range — it needed to feel smooth rather than snappy because the popover
is a composed surface, not a simple disclosure.

---

### Recurring build problem: CSS stacking contexts

This session hit the stacking context problem three times:

1. Click-outside not working on desktop: the overlay was inside the
   mode-selector-row, which the `response-enter` animation (opacity)
   turns into a stacking context. Fixed by switching to document listener.

2. Overlay not visible on mobile: overlay was inside the fixed footer
   (z-10), so z-99 was scoped within that context and lost. Fixed by
   moving the overlay element to the root of ResponseScreen's return.

3. Sheet appearing behind overlay on mobile: the mode-selector-row
   (position: fixed; z-index: 10) creates its own stacking context.
   mode-options (z-100) is trapped inside it. Overlay at root level
   (z-99) wins. Fixed by adding `style={open ? { zIndex: 100 } : undefined}`
   to the mode-selector-row so it outranks the overlay when open.

The pattern: CSS animations with `opacity`, `position: fixed` with
`z-index`, and element nesting all create stacking context traps. The
reliable fix is to render shared surfaces (overlays, sheets, popovers)
at the topmost React component level, or to promote the containing
element's z-index at the moment of interaction.

---

### Decisions made

- Tab strip → dropdown/sheet pattern [shipped]
- Mode descriptors: one line per mode, written and locked [shipped]
- Hover state: F0EBE2 / #3A322B [shipped]
- Mobile close: X icon (Lucide, size 18, strokeWidth 1.5) [shipped]
- Mode trigger: text-secondary colour [shipped]
- Loading gold beat removed [shipped]
- Perspective: 19px / weight 500 [shipped]
- Chevron animation: 350ms ease-in-out [shipped]
- Enter submits, Shift+Enter newlines [shipped]
- Overlay at React root level to escape stacking contexts [shipped]
- mode-selector-row z-index promoted to 100 when open [shipped]

---

### Rejected decisions

- Dividers between option rows — visual noise, removed in Paper before build
- "Cancel" text label on mobile sheet close button — replaced with X icon
  to match the Paper design intent
- Gold transition during loading pulse — removed, added complexity
  without adding user value

---

### Known issues

**Blockers**
- None. App working end to end.

**Polish**
- Compare screen not yet updated to reflect the new pattern — Start again
  and Compare modes buttons from the old tab strip may still be present;
  verify in build
- Type scale clamp values not yet tested in production (carried from 11 May)
- Sentence limits not yet tested against live API (carried from 23 April)
- Error banner position (carried from 21 April)
- Gold action line in Compare screen live build (carried from 21 April)
- Mobile Compare stacked view spacing (carried from 21 April)
- Wordmark navigation edge case during loading state (carried from 23 April)

---

### Next steps

1. Verify Compare screen in live build — confirm old tab strip artefacts
   are not present
2. Test mode switching in both desktop and mobile Safari
3. Confirm Paper MCP connected, run Phase 0 diff
4. Test type scale clamp values in production
5. Test sentence limits with live Blunt scenario

---

### Oscar's note — end of session

Reviewed four tab strip variants (segmented track, underline tabs, refined
pills) against the core constraint that differentiation must happen at the
response state. Identified interactivity clarity as the threshold problem
across three of four variants — inactive tabs reading as labels rather than
controls. Resolved by moving to a dropdown pattern: resting state shows
current mode name with chevron, opens to a sheet (mobile) or popover
(desktop) with mode name, descriptor, and tick on selected option.

Descriptor copy iterated from functional labels to register-consistent
lines: "The question behind the question", "No softening. Just the truth",
"A path forward, not a place to sit". The internal echo between Reflective
and Practical ("question behind" / "not a place to sit") was intentional.

Typography: body text identified as Cormorant at 17px/400 — hairline
strokes insufficiently legible on warm off-white at body size. Resolved at
19px/500. Noted that Cormorant is a display typeface doing body text work;
acceptable at this size but worth revisiting if legibility complaints emerge
from non-retina users.

Placeholder copy resolved to "Start anywhere" — no punctuation. Ellipsis
rejected as implying hesitation; full stop rejected as over-formal for a
placeholder context.

Chevron micro animation added: 180-degree clockwise rotation on hover and
on open, 200ms ease-in-out, CSS transition. Stays up while dropdown is
open, returns on close.

**v1 shipped.**
