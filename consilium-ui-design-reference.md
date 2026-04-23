# Consilium — UI design reference

This document captures design principles, patterns to adopt, and patterns to avoid for Consilium. It is based on a comparative analysis of Claude, ChatGPT, Gemini, Grok, and Pi — the five most relevant AI chat interfaces — evaluated specifically against Consilium's product intent: a single-shot Stoic advisor for reflection, not task completion.

Reference this document when making design decisions in Paper.design or when building UI in code.

---

## Status markers

Each section is tagged with a status:

- **[LOCKED]** — decision made, do not explore alternatives
- **[EXPLORING]** — active exploration in Paper.design, values may change
- **[OPEN]** — not yet decided

---

## What Consilium is (and isn't) [LOCKED]

Consilium is a **reflection interface**, not a task-completion interface. The user arrives with something weighing on them. They describe it. They receive a Stoic reframe, a perspective, and one concrete action. That's the complete interaction.

This is fundamentally different from Claude, ChatGPT, Gemini, and Grok, which are all built around open-ended, multi-turn task assistance. Their design patterns — numbered sections, bullet points, bold headers, follow-up prompts — are optimised for task delivery. Those patterns are wrong for Consilium.

Pi is the closest reference point. It was designed as a companion, not a tool. Its response restraint, warm palette, and conversational register are the most relevant benchmarks.

---

## Background and colour [EXPLORING]

**Do this:**
- Warm off-white base: `#F0EDE8` or similar. Pi and Consilium share this instinct and it's correct. It reads as considered, calm, and human rather than clinical.
- Dark theme: use a warm near-black, not a cold one. `#1A1A1A` with a very slight warm cast rather than pure `#000000` or cool `#0A0A0A`. The current dark theme is too cold — it reads as generic SaaS dark mode rather than contemplative.
- Keep backgrounds flat. No gradients, no noise texture in the main content area (noise is appropriate for marketing surfaces, not the interaction itself).

**Avoid:**
- Pure white (`#FFFFFF`). ChatGPT uses it and it reads as a blank document, not a considered space.
- Cool blue-grey (Gemini's approach). It's recognisable as Google and wrong for this tone.
- High-contrast stark backgrounds that compete with the text.

---

## Layout and spatial structure [LOCKED]

**Do this:**
- Vertically centre the content cluster in the viewport on the input state. The content — heading + input — should sit in the visual centre of the page, not the upper third. The whitespace below is intentional and communicates patience and space.
- Constrain content width. The input and response should sit within a column of roughly 600–700px on desktop. Wider than that and prose loses its reading quality.
- Anchor the input to the bottom of the viewport in the response state (post-submission). This is the standard pattern across all five products and users now expect it.
- Give the response generous top padding. The philosopher's response should feel like it arrives with weight, not like it snaps into place immediately below the input.

**Avoid:**
- Left-aligning content to the upper-left corner of the viewport (the current build does this). It reads as unfinished.
- Full-width inputs that span the entire viewport. They look like forms, not conversations.
- Tight vertical spacing between the heading, input, and surrounding whitespace. The emptiness is doing real work — don't compress it.

---

## The input state [EXPLORING]

**Do this:**
- Use a contained input card, not a borderless textarea. The card gives the input gravity and defines the interaction zone. Soft border or very subtle elevation — Claude and Pi both do this well.
- Placeholder text should be a question or an invitation, not a label. "What's your situation?" (current) is correct. Don't change it to "Type here" or "Describe your problem."
- Character count: only show it once the user starts typing. A count sitting at 280 before any text has been entered is noise. It should appear at around 200 characters remaining and become more prominent as the limit approaches.
- Submit button: visible but not dominant. A filled circle with an arrow (Pi's approach) is softer than a labelled rectangle. The current "ADVISE ME" button in all-caps with a hard border reads as a form submission, not a conversational cue.
- The submit button can be present in the empty state — Pi keeps it visible always, signalling readiness. This is preferable to hiding it entirely.

**Avoid:**
- All-caps button labels. They read as shouting in a space that should feel quiet.
- Hard rectangular button borders. Soften with border-radius or remove the border entirely and rely on fill.
- Showing the character count before the user has typed anything.
- Multiple CTAs or helper text around the input. One input, one action.

---

## The response state [LOCKED]

This is where Consilium must differentiate. Every major AI product uses the same structural pattern for responses: bold headers, numbered sections, bullet points, nested lists. That pattern is correct for task-completion. It is wrong for reflection.

**Do this:**
- Display the user's input as a right-aligned bubble with a slightly warmer or lighter background tint than the page. This is Pi's approach and it creates clear visual separation without the user's message feeling like a chat bubble in a messaging app.
- Display the philosopher's response as full-width prose, left-aligned, no bubble treatment. It should feel like reading, not receiving a message.
- Keep the response to three distinct parts, visually separated by spacing rather than headers:
  1. The reframe (one or two sentences acknowledging what's actually happening)
  2. The Stoic perspective (two or three sentences of philosophical framing)
  3. The one concrete action (a single sentence, set apart with slightly more top margin)
- Use a slightly larger or more generous line-height for the response text than for the input. This signals that the response deserves to be read slowly.
- Consider a subtle typographic treatment for the concrete action — not bold, not a bullet, but perhaps a slightly different text colour or a 2px left border (consistent with the pull quote treatment on the portfolio).

**Avoid:**
- Bullet points in the response. No exceptions.
- Numbered lists. No exceptions.
- Bold section headers inside the response.
- Responses longer than approximately 120 words. If the AI is producing more than that, the system prompt needs tightening.
- Showing which Stoic philosopher persona was assigned. The persona is a routing mechanism, not a feature. Users don't need to know.

---

## Typography [EXPLORING]

**Do this:**
- Maintain the current serif heading for "What's your situation?" — the italic serif creates the right tone of quiet invitation.
- Body text for both input and response should be a clean humanist sans or the same serif at a lighter weight. The current body text reads well — don't change it.
- Response text size should be the same as or slightly larger than input text. It should never be smaller.
- Line length for the response: 60–70 characters. Longer than that and the prose loses reading comfort.

**Avoid:**
- Mixing too many type sizes in the response. The response should feel like a single voice, not a structured document.
- Using the same italic serif for the response text as for the heading. The heading is an invitation; the response is counsel. They should feel distinct.

---

## Interaction and motion [EXPLORING]

**Do this:**
- The transition from input state to response state should feel like turning a page, not loading a result. A gentle fade or a slow upward reveal of the response is appropriate.
- The submit action should have a brief, calm loading state — not a spinner, but something that signals the system is thinking. A subtle pulse on the philosopher's avatar or wordmark is appropriate.
- Keep all animations slow and deliberate. 300–500ms ease-in-out. Nothing should snap or bounce.

**Avoid:**
- Skeleton loaders. They look like SaaS loading patterns and break the contemplative register.
- Progress bars or percentage indicators.
- Rapid or bouncy animations. Nothing should feel urgent.

---

## What to take from each reference product [LOCKED]

| Product | What to take | What to avoid |
|---|---|---|
| **Pi** | Warm background, response brevity, full-width prose response, bottom-anchored input, breathing room in layout | Emojis, overly casual register |
| **Claude** | Input card treatment, submit button activation on content, warm off-white background, asymmetric message/response layout | Sidebar, suggested prompts below input |
| **ChatGPT** | Input card growth on content, clean filled input state | Structured response with headers and bullets, pure white background |
| **Gemini** | Two-line greeting hierarchy (label + heading), tonal background colour as brand decision | Cool blue-grey palette, dense structured responses |
| **Grok** | Opening prose paragraph before structure in response (emotional acknowledgement first) | Minimal empty state with no warmth, nested bullet structures |

---

## Summary of the core principle [LOCKED]

The five major AI products have converged on identical input patterns. The differentiation in Consilium is not in the input state — that is a solved problem. The differentiation is entirely in the **response state**.

A Stoic advisor does not produce bullet points. It does not produce numbered action plans. It does not produce bold section headers. It produces unhurried prose that reframes the situation, offers a philosophical perspective, and names one thing to do. That response — in the right typographic treatment, with the right whitespace, at the right length — is what makes Consilium feel like a different kind of product.

Design every decision in service of that response.
