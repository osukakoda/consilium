import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { situation, philosopher } = req.body

  if (!situation) {
    return res.status(400).json({ error: 'Missing situation' })
  }

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    system: `You are a ${philosopher ?? 'reflective'} advisor.`,
    messages: [{ role: 'user', content: situation }],
  })

  return res.status(200).json({ response: message.content[0].text })
}
