import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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

function mockClassify(situation) {
  const s = situation.toLowerCase()
  const bluntSignals = ["can't decide", 'keep putting', 'procrastin', 'just do it', 'stuck', 'afraid to']
  const practicalSignals = ['job', 'career', 'salary', 'money', 'invest', 'move', 'offer', 'contract', 'budget', 'choose between']
  if (bluntSignals.some(w => s.includes(w))) return 'blunt'
  if (practicalSignals.some(w => s.includes(w))) return 'practical'
  return 'reflective'
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use('/api/advise', (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end('Method Not Allowed')
            return
          }
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const { situation } = JSON.parse(body)
              const classification = mockClassify(situation || '')
              const responses = structuredClone(MOCK_RESPONSES)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ classification, responses }))
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Bad request' }))
            }
          })
        })
      },
    },
  ],
})
