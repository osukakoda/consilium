import { useState, useEffect, useCallback, useRef } from 'react'
import InputScreen from './components/InputScreen'
import ResponseScreen from './components/ResponseScreen'
import ShareView from './components/ShareView'
import ThemeToggle from './components/ThemeToggle'
import CenteredMessage from './components/CenteredMessage'

const ERROR_MESSAGES = {
  content_rejected: "We can't advise on this type of situation. Please describe a personal dilemma, decision, or challenge you're facing.",
  rate_limited: "You've asked too many questions recently. Take a breath and try again in a few minutes.",
  network: 'Something went wrong. Please try again.',
  default: 'Something went wrong. Please try again.',
}

// ── Client-side mock (used when VITE_USE_MOCK=true or in dev without vercel) ──

const MOCK_RESPONSES = {
  reflective: {
    reframe: 'This situation is an invitation to examine what you truly value.',
    perspective: 'Sit with the discomfort rather than rushing to resolve it. Clarity often emerges not from thinking harder, but from pausing long enough to hear what you already know.',
    action: 'Write down the three outcomes you fear most, then ask yourself why each one scares you.',
  },
  blunt: {
    reframe: "You already know what to do — you're looking for permission that no one else can give you.",
    perspective: "Every day you delay is itself a choice. You're not avoiding the decision; you're making it slowly and painfully. Stop waiting for certainty that will never arrive.",
    action: 'Set a deadline — 48 hours — write your decision down, and tell one person about it.',
  },
  practical: {
    reframe: 'This is a resource allocation problem with incomplete but sufficient information.',
    perspective: "You don't need more data — you need a framework. List your two or three realistic options, estimate the cost of being wrong on each, and weight them against your actual priorities.",
    action: 'Build a simple table: options as rows, your top three criteria as columns. Score each and pick the winner.',
  },
}

function mockClassify(situation) {
  const s = situation.toLowerCase()
  if (['can\'t decide','keep putting','procrastin','stuck','afraid to'].some(w => s.includes(w))) return 'blunt'
  if (['job','career','salary','money','invest','offer','contract','budget','choose between'].some(w => s.includes(w))) return 'practical'
  return 'reflective'
}

async function localMock(text) {
  await new Promise(r => setTimeout(r, 800))
  return { classification: mockClassify(text), responses: MOCK_RESPONSES }
}

const USE_MOCK = import.meta.env.DEV

function getInitialTheme() {
  const stored = localStorage.getItem('consilium-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [situation, setSituation] = useState('')
  const [loading, setLoading] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [autoLoading, setAutoLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [splash, setSplash] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [screen, setScreen] = useState('input')
  const [theme, setTheme] = useState(getInitialTheme)
  const [offline, setOffline] = useState(!navigator.onLine)
  const abortRef = useRef(null)

  useEffect(() => {
    if (!splash) return
    const timer = setTimeout(() => setSplash(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('consilium-theme', theme)
  }, [theme])

  useEffect(() => {
    const goOnline = () => setOffline(false)
    const goOffline = () => setOffline(true)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('s')
    if (encoded) {
      const decoded = decodeURIComponent(encoded)
      setSituation(decoded)
      setAutoLoading(true)
      fetchAdvice(decoded, true)
        .catch(() => setScreen('invalid-link'))
        .finally(() => setAutoLoading(false))
    }
  }, [])

  // Used by the shared-link path only
  const fetchAdvice = useCallback(async (text, goToShare = false) => {
    if (!navigator.onLine) {
      setOffline(true)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const json = USE_MOCK
        ? await localMock(text)
        : await fetch('/api/advise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ situation: text }),
          }).then(async res => {
            const data = await res.json()
            if (!res.ok) throw new Error(ERROR_MESSAGES[data.errorType] || ERROR_MESSAGES.default)
            return data
          })
      setData(json)
      setScreen(goToShare ? 'share' : 'response')
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setOffline(true)
      } else {
        setError(err.message || ERROR_MESSAGES.default)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Immediate transition: response screen shows before API responds
  function handleSubmit() {
    if (!situation.trim()) return
    if (!navigator.onLine) { setOffline(true); return }

    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setScreen('response')
    setData(null)
    setWaiting(true)
    setError(null)

    const signal = abortRef.current.signal

    const request = USE_MOCK
      ? localMock(situation)
      : fetch('/api/advise', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ situation }),
          signal,
        }).then(async res => {
          const data = await res.json()
          if (!res.ok) throw new Error(ERROR_MESSAGES[data.errorType] || ERROR_MESSAGES.default)
          return data
        })

    request
      .then(json => {
        if (signal.aborted) return
        setData(json)
        setWaiting(false)
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setOffline(true)
        } else {
          setError(err.message || ERROR_MESSAGES.default)
        }
        setScreen('input')
        setWaiting(false)
      })
  }

  function handleCompare() {
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('s', encodeURIComponent(situation))
    window.history.pushState({}, '', url)
    setScreen('share')
  }

  function handleBack() {
    if (abortRef.current) abortRef.current.abort()
    setWaiting(false)
    setData(null)
    setSituation('')
    setError(null)
    setScreen('input')
    window.history.pushState({}, '', window.location.pathname)
  }

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  function handleRetryOffline() {
    setOffline(false)
    if (situation.trim()) fetchAdvice(situation)
  }

  // ── Splash screen ──
  if (splash) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p
          className="serif splash-wordmark"
          style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--muted)', lineHeight: '28px', margin: 0 }}
        >
          Consilium
        </p>
      </div>
    )
  }

  // ── Offline screen ──
  if (offline) {
    return (
      <div className="mx-auto px-5 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20" style={{ maxWidth: '640px' }}>
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <p className="serif" style={{ fontSize: '22px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '-0.01em' }}>
            Consilium
          </p>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <CenteredMessage
          title="No connection."
          description="Consilium needs an internet connection to think. Check your network and try again."
          actionLabel="Retry"
          onAction={handleRetryOffline}
        />
      </div>
    )
  }

  // ── Invalid share link screen ──
  if (screen === 'invalid-link') {
    return (
      <div className="mx-auto px-5 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20" style={{ maxWidth: '640px' }}>
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <p className="serif" style={{ fontSize: '22px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '-0.01em' }}>
            Consilium
          </p>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <CenteredMessage
          title="This link didn't work."
          description="The shared situation couldn't be loaded. It may have been malformed or the request failed."
          actionLabel="Start fresh →"
          onAction={handleBack}
        />
      </div>
    )
  }

  // ── Auto-loading spinner (shared link) ──
  if (autoLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="serif text-lg italic" style={{ color: 'var(--muted)' }}>
          Consilium
        </p>
        <p className="dot-pulse text-xs" style={{ color: 'var(--muted)', letterSpacing: '0.1em' }}>
          <span>.</span><span>.</span><span>.</span>
        </p>
      </div>
    )
  }

  // ── Input screen — vertically centred ──
  if (screen === 'input') {
    return (
      <div className="input-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div
          className="px-5 sm:px-12 lg:px-[72px] pb-10 sm:pb-[60px]"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <InputScreen
            situation={situation}
            onChange={setSituation}
            onSubmit={handleSubmit}
            loading={waiting}
            error={error}
          />
        </div>
      </div>
    )
  }

  // ── Response screen — renders immediately, data may arrive later ──
  if (screen === 'response') {
    return (
      <ResponseScreen
        data={data}
        situation={situation}
        waiting={waiting}
        onBack={handleBack}
        onCompare={handleCompare}
      />
    )
  }

  // ── Compare screen ──
  if (screen === 'share' && data) {
    return (
      <ShareView
        data={data}
        situation={situation}
        onBack={handleBack}
      />
    )
  }

  return null
}
