import { useRef, useEffect } from 'react'
import ErrorBanner from './ErrorBanner'

const MAX_CHARS = 280

export default function InputScreen({ situation, onChange, onSubmit, loading, error }) {
  const textareaRef = useRef(null)
  const charCount = situation.length
  const remaining = MAX_CHARS - charCount
  const canSubmit = situation.trim().length > 0 && remaining >= 0 && !loading
  const hasText = charCount > 0

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [situation])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSubmit) onSubmit()
    }
    // Shift+Enter: browser default inserts a newline — no handler needed
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '520px',
        maxWidth: '100%',
        gap: '8px',
      }}
    >
      {/* Heading + card group */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Heading */}
      <div className="animate-fade-up">
        <h2
          className="serif"
          style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          What are you wrestling with?
        </h2>
      </div>

      {/* Error banner — between heading and card */}
      {error && (
        <div className="animate-fade-up">
          <ErrorBanner message={error} />
        </div>
      )}

      {/* Input card */}
      <div
        className="animate-fade-up delay-1"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          padding: '24px 24px 16px',
          backgroundColor: 'var(--card)',
          boxShadow: '0 1px 0 rgba(31, 28, 24, 0.02)',
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          maxLength={MAX_CHARS}
          value={situation}
          onChange={e => {
            const val = e.target.value
            if (val.length <= MAX_CHARS) onChange(val)
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Describe what's weighing on you…"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            color: 'var(--text)',
            outline: 'none',
            resize: 'none',
            overflow: 'hidden',
            width: '100%',
            minHeight: '84px',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-base)',
            caretColor: 'var(--accent)',
            fontFamily: 'inherit',
            fontWeight: 400,
            opacity: loading ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        />

        {/* Footer row: character count + submit button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '18px',
          }}
        >
          {/* Character count — only visible when typing */}
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 400,
              lineHeight: 'var(--leading-tight)',
              color: remaining < 20 ? 'var(--error)' : 'var(--text-secondary)',
              letterSpacing: '0.01em',
              opacity: hasText ? 1 : 0,
              transition: 'opacity 0.2s',
            }}
          >
            {charCount} / {MAX_CHARS}
          </span>

          {/* Circular submit button — 44×44 tap zone, 32×32 visual */}
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            aria-label="Submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              border: 'none',
              background: 'transparent',
              opacity: loading ? 0.4 : hasText ? 1 : 0.5,
              cursor: canSubmit ? 'pointer' : 'default',
              transition: 'opacity 0.2s',
              flexShrink: 0,
              padding: 0,
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '999px',
              backgroundColor: 'var(--submit-bg)',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="var(--submit-arrow)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      </div>
    </div>
  )
}
