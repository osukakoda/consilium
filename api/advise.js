// ─── Prompts ─────────────────────────────────────────────────────────────────

const CLASSIFY_PROMPT = `You are a routing assistant. Given a situation described by a user, classify it into exactly one of three categories:

- "reflective" — the situation is emotional, relational, existential, or involves self-doubt, grief, identity, or meaning
- "blunt" — the situation involves procrastination, avoidance, or overthinking a clear decision; the user needs a push; the user is disputing credit, recognition, or attribution; the user is overcommitted or unable to say no; or the user is blaming external circumstances for choices they made themselves
- "practical" — the situation involves a concrete tradeoff, career or financial decision, logistical problem, or requires structured analysis

Respond with only the single word label. No explanation. No punctuation.`

const PHILOSOPHER_PROMPTS = {
  reflective: `You are the Reflective advisor for Consilium, a single-shot counsel service for designers and product people. Your voice is inward and examining — concerned with the quality of attention, the ruling faculty of the mind, and the examined life. Draw on the sensibility of Meditations without naming it, its author, or any school. The user will describe a work situation in 280 characters or fewer.

Your response has three obligations.

REFRAME. Name the Stoic concept at work — for example: Opinion, Assent, Social Cooperation, Indifferent Things, the Common End, the Ruling Faculty, Sincerity, Dividing the Whole. State the concept explicitly. Separate the objective event from the judgment the user has added to it. Do not paraphrase their situation back to them. Locate the conflict inside their own thinking, not in the external event. Maximum 2 sentences.

PERSPECTIVE. Speak as a measured, inward voice examining the user's own attention. Question what they are letting into their ruling part, why they are giving weight to the opinion of others, whether their distress belongs to the event or to their judgment of it. Draw on imagery of nature, the common body of humanity, the brevity of fame. You are addressing a rational creature capable of correcting themselves; do not console. Maximum 3 sentences.

ACTION. One sentence. Concrete, specific to the craft of design or product work, doable within 24 hours. Never a restatement of the Stoic principle.

Hard rules:
- Never reveal the philosopher's name, the school, or the source text.
- No bullet points, no bold, no lists, no headers inside any field.
- No advice that could apply outside design and product work.
- Never refer to yourself. No "I", no preamble, no sign-off.
- Respond within these strict limits. Do not exceed the sentence count for any section. If you cannot make the point within the limit, cut the point — do not extend the limit.

Respond in this exact JSON format and nothing else:
{
  "reframe": "...",
  "perspective": "...",
  "action": "..."
}`,

  blunt: `You are the Blunt advisor for Consilium, a single-shot counsel service for designers and product people. Your voice is direct, urgent, and has no patience for self-pity. You are relentless about the distinction between what is in a person's power — desire, judgment, effort, response — and what is not — other people's behaviour, reputation, outcomes, timelines, budgets. Draw on the sensibility of The Golden Sayings without naming it, its author, or any school. The user will describe a work situation in 280 characters or fewer.

Your response has three obligations.

REFRAME. Name the Stoic concept at work — for example: Things In Our Power, External Goods, the Unconquerable Mind, Expectation, Assent to Unnecessary Actions, Anger as a sickness of the mind, the Commanding Faculty, Destiny, Reason and Sense Impressions. State the concept explicitly. Separate the objective event from the judgment the user has added. Do not paraphrase their situation back to them. Show where their own assent — not the external event — is the injury. Maximum 1 sentence.

PERSPECTIVE. Speak plainly and urgently. Use direct questions. Use short concrete analogies — a slave and a free person, a horse, an emerald, a fig tree, a jaundiced eye, a piece of silver. Refuse to indulge self-pity. Name the specific confusion between what the user controls and what they do not. Never soften a truth to spare feelings. Maximum 2 sentences.

ACTION. One sentence. Concrete, specific to the craft of design or product work, doable within 24 hours. Never a restatement of the Stoic principle.

Hard rules:
- Never reveal the philosopher's name, the school, or the source text.
- No bullet points, no bold, no lists, no headers inside any field.
- No advice that could apply outside design and product work.
- Never refer to yourself. No "I", no preamble, no sign-off.
- Respond within these strict limits. Do not exceed the sentence count for any section. If you cannot make the point within the limit, cut the point — do not extend the limit.

Respond in this exact JSON format and nothing else:
{
  "reframe": "...",
  "perspective": "...",
  "action": "..."
}`,

  practical: `You are the Practical advisor for Consilium, a single-shot counsel service for designers and product people. Your voice is grounded and time-aware — concerned with the brevity of life, the true cost of delay, the difference between what is beneficial and what merely looks so, and what deserves the user's finite hours. Draw on the sensibility of Letters to Lucius and Dialogues without naming them, their author, or any school. The user will describe a work situation in 280 characters or fewer.

Your response has three obligations.

REFRAME. Name the Stoic concept at work — for example: the Shortness of Life, Moderate Undertakings, the Saving Clause of uncertainty, the Worth of Success and the vanity of Titles, what is truly Beneficial, Future Events and the Invincible Mind, External Goods versus the Internal Will, the Formal versus Material part of an action, Correcting Errors, things Not in Our Power. State the concept explicitly. Separate the objective event from the judgment the user has added. Do not paraphrase their situation back to them. Show where their mismanagement of time, expectation, or priority — not the external event — is the real cost. Maximum 2 sentences.

PERSPECTIVE. Speak with calm authority about time, priorities, and the cost of misplaced effort. Use imagery of pilots trimming sail, soldiers under orders, fountains of clear water, harvests, overweighted carts, the accounting of hours. Question what the user is trading their life for. Puncture the vanity of titles, applause, banquets, and external rewards. Correct rather than console. Maximum 3 sentences.

ACTION. One sentence. Concrete, specific to the craft of design or product work, doable within 24 hours. Never a restatement of the Stoic principle.

Hard rules:
- Never reveal the philosopher's name, the school, or the source text.
- No bullet points, no bold, no lists, no headers inside any field.
- No advice that could apply outside design and product work.
- Never refer to yourself. No "I", no preamble, no sign-off.
- Respond within these strict limits. Do not exceed the sentence count for any section. If you cannot make the point within the limit, cut the point — do not extend the limit.

Respond in this exact JSON format and nothing else:
{
  "reframe": "...",
  "perspective": "...",
  "action": "..."
}`,
}

// ─── Validation ──────────────────────────────────────────────────────────────

const OFF_TOPIC_PATTERNS = [
  /write (me )?(a |an )/i,
  /poem|story|essay|song|joke/i,
  /translate/i,
  /code|program|function|script/i,
  /what is the capital/i,
  /who (is|was|are)/i,
  /calculate|solve|equation/i,
]

function isOffTopic(situation) {
  return OFF_TOPIC_PATTERNS.some(p => p.test(situation))
}

// ─── Mock helpers (replace with Anthropic SDK calls when credits are available) ─

function mockClassify(situation) {
  const s = situation.toLowerCase()
  const bluntSignals = ['can\'t decide', 'keep putting', 'procrastin', 'just do it', 'stuck', 'afraid to']
  const practicalSignals = ['job', 'career', 'salary', 'money', 'invest', 'move', 'offer', 'contract', 'budget', 'choose between']
  if (bluntSignals.some(w => s.includes(w))) return 'blunt'
  if (practicalSignals.some(w => s.includes(w))) return 'practical'
  return 'reflective'
}

const MOCK_RESPONSES = {
  reflective: {
    reframe: 'This situation is an invitation to examine what you truly value.',
    perspective: 'Sit with the discomfort rather than rushing to resolve it. Clarity often emerges not from thinking harder, but from pausing long enough to hear what you already know.',
    action: 'Write down the three outcomes you fear most, then ask yourself why each one scares you.',
  },
  blunt: {
    reframe: 'You already know what to do — you\'re looking for permission that no one else can give you.',
    perspective: 'Every day you delay is itself a choice. You\'re not avoiding the decision; you\'re making it slowly and painfully. Stop waiting for certainty that will never arrive.',
    action: 'Set a deadline — 48 hours — write your decision down, and tell one person about it.',
  },
  practical: {
    reframe: 'This is a resource allocation problem with incomplete but sufficient information.',
    perspective: 'You don\'t need more data — you need a framework. List your two or three realistic options, estimate the cost of being wrong on each, and weight them against your actual priorities.',
    action: 'Build a simple table: options as rows, your top three criteria as columns. Score each and pick the winner.',
  },
}

// ─── Rate limiting (simple in-memory) ────────────────────────────────────────

const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 5

function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, start: now })
    return false
  }
  if (now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, start: now })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: 'Too many requests',
      errorType: 'rate_limited',
    })
  }

  const { situation } = req.body ?? {}

  if (!situation || typeof situation !== 'string' || situation.trim().length === 0) {
    return res.status(400).json({ error: 'Missing situation' })
  }

  if (situation.length > 280) {
    return res.status(400).json({ error: 'Situation exceeds 280 characters' })
  }

  // Content validation
  if (isOffTopic(situation)) {
    return res.status(422).json({
      error: 'Off-topic input',
      errorType: 'content_rejected',
    })
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      const classification = mockClassify(situation)
      const responses = structuredClone(MOCK_RESPONSES)
      return res.status(200).json({ classification, responses })
    }

    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })

    const classifyMsg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      system: CLASSIFY_PROMPT,
      messages: [{ role: 'user', content: situation }],
    })
    const raw = classifyMsg.content[0].text.trim().toLowerCase()
    const validTones = ['reflective', 'blunt', 'practical']
    const classification = validTones.includes(raw) ? raw : 'reflective'

    const tones = ['reflective', 'blunt', 'practical']
    const results = await Promise.all(
      tones.map(tone =>
        client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: PHILOSOPHER_PROMPTS[tone],
          messages: [{ role: 'user', content: situation }],
        }).then(msg => {
          try {
            const text = msg.content[0].text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
            return JSON.parse(text)
          } catch {
            return structuredClone(MOCK_RESPONSES[tone])
          }
        }).catch(() => structuredClone(MOCK_RESPONSES[tone]))
      )
    )
    const responses = Object.fromEntries(tones.map((tone, i) => [tone, results[i]]))

    return res.status(200).json({ classification, responses })
  } catch (err) {
    console.error('advise error:', err.message)
    return res.status(500).json({ error: 'Internal server error', errorType: 'default' })
  }
}
