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
          fontSize: 'var(--text-s)',
          lineHeight: 'var(--leading-tight)',
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
            fontSize: 'var(--text-base)',
            fontWeight: 400,
            lineHeight: 'var(--leading-reading)',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {response.reframe}
        </p>

        {/* Stoic paragraph */}
        <p
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 400,
            lineHeight: 'var(--leading-reading)',
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
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            fontStyle: 'italic',
            lineHeight: 'var(--leading-display)',
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
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh',
        padding: '72px 20px',
      }}
    >
      {/* Three columns + button, centred as one group */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '72px',
          width: '1100px',
          maxWidth: '100%',
        }}
      >
        <div
          className="animate-fade-up flex flex-col md:flex-row gap-10 md:gap-10"
          style={{ width: '100%' }}
        >
          {TONES.map(t => (
            <Column key={t} tone={t} response={data.responses[t]} />
          ))}
        </div>

        {/* Start again — gold pill, centred */}
        <div className="animate-fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            borderRadius: '999px',
            padding: '8px 16px',
            border: '1px solid var(--submit-bg)',
            backgroundColor: 'var(--submit-bg)',
            color: 'var(--submit-arrow)',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.01em',
            lineHeight: '16px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 8A5 5 0 1 0 4 4.5M2.5 2v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Start again
        </button>
        </div>
      </div>
    </div>
  )
}
