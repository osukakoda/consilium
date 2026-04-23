import ErrorBanner from './ErrorBanner'

const MAX_CHARS = 280

export default function InputScreen({ situation, onChange, onSubmit, loading, error }) {
  const charCount = situation.length
  const remaining = MAX_CHARS - charCount
  const canSubmit = situation.trim().length > 0 && remaining >= 0 && !loading
  const hasText = charCount > 0

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) onSubmit()
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '640px',
        maxWidth: '100%',
        gap: '32px',
      }}
    >
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
          What's your situation?
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
          padding: '20px 20px 16px',
          backgroundColor: 'var(--card)',
          boxShadow: '0 1px 0 rgba(31, 28, 24, 0.02)',
        }}
      >
        <textarea
          rows={3}
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
            color: 'var(--text)',
            outline: 'none',
            resize: 'none',
            width: '100%',
            minHeight: '84px',
            fontSize: '18px',
            lineHeight: 1.4,
            caretColor: 'var(--accent)',
            fontFamily: 'inherit',
            fontWeight: 400,
            opacity: loading ? 0.5 : 1,
            transition: 'opacity 0.2s',
            flex: 1,
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
              fontSize: '13px',
              fontWeight: 400,
              color: remaining < 20 ? 'var(--error)' : 'var(--text-secondary)',
              letterSpacing: '0.01em',
              opacity: hasText ? 1 : 0,
              transition: 'opacity 0.2s',
            }}
          >
            {charCount} / {MAX_CHARS}
          </span>

          {/* Circular submit button */}
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            aria-label="Submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: 'var(--submit-bg)',
              opacity: loading ? 0.4 : hasText ? 1 : 0.5,
              cursor: canSubmit ? 'pointer' : 'default',
              transition: 'opacity 0.2s',
              flexShrink: 0,
              padding: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="var(--submit-arrow)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
