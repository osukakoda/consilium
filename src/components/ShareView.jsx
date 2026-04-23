const TONES = ['reflective', 'blunt', 'practical']

function Column({ tone, response }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: '20px',
      }}
    >
      {/* Tone header — gold */}
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.4,
          letterSpacing: '-0.02em',
          color: 'var(--accent)',
          fontWeight: 400,
          margin: 0,
          textTransform: 'capitalize',
        }}
      >
        {tone}
      </p>

      {/* Response content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Reframe */}
        <p
          className="serif-body"
          style={{
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: 1.4,
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {response.reframe}
        </p>

        {/* Stoic paragraph */}
        <p
          style={{
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 1.5,
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {response.perspective}
        </p>
      </div>

      {/* Action line — gold border + italic serif */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: '14px',
          paddingTop: '4px',
        }}
      >
        <div
          style={{
            width: '2px',
            flexShrink: 0,
            borderRadius: '1px',
            backgroundColor: 'var(--accent)',
          }}
        />
        <p
          className="serif-body"
          style={{
            fontSize: 'clamp(20px, 3vw, 24px)',
            fontWeight: 600,
            fontStyle: 'italic',
            lineHeight: 1.24,
            letterSpacing: '-0.002em',
            color: 'var(--text)',
            margin: 0,
            padding: '2px 0',
          }}
        >
          {response.action}
        </p>
      </div>
    </div>
  )
}

export default function ShareView({ data, situation, onBack }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
      }}
    >
      {/* Header: wordmark only */}
      <div className="animate-fade-up px-5 sm:px-12 lg:px-[72px] pt-6 sm:pt-8">
        <p
          className="serif"
          onClick={onBack}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          style={{
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--muted)',
            lineHeight: '28px',
            margin: 0,
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
          }}
        >
          Consilium
        </p>
      </div>

      {/* Three columns — stack on mobile */}
      <div
        className="px-5 sm:px-12 lg:px-[72px] pt-10 sm:pt-14 pb-12 sm:pb-20"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <div
          className="animate-fade-up delay-1 flex flex-col md:flex-row gap-10 md:gap-10"
          style={{
            width: '1100px',
            maxWidth: '100%',
          }}
        >
          {TONES.map(t => (
            <Column key={t} tone={t} response={data.responses[t]} />
          ))}
        </div>
      </div>

      {/* Back button */}
      <div className="animate-fade-up delay-2 px-5 sm:px-12 lg:px-[72px] pb-8 sm:pb-10">
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '13px',
            cursor: 'pointer',
            padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          ← Start over
        </button>
      </div>
    </div>
  )
}
