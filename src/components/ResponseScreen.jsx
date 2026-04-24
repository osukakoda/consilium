import { useState, useEffect } from 'react'

const TONES = ['reflective', 'blunt', 'practical']

function truncate(text, maxLen = 72) {
  if (!text || text.length <= maxLen) return text
  return text.slice(0, maxLen) + '…'
}

// phase: 'waiting' → 'beat1' (gold, 300ms) → 'beat2' (reposition, 200ms) → 'beat3' (response in)
export default function ResponseScreen({ data, situation, waiting, onBack, onCompare }) {
  const [active, setActive] = useState('reflective')
  const [phase, setPhase] = useState('waiting')

  useEffect(() => {
    if (!waiting && data) {
      setActive(data.classification)
      setPhase('beat1')
      const t1 = setTimeout(() => setPhase('beat2'), 300)
      const t2 = setTimeout(() => setPhase('beat3'), 500)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [waiting, data])

  const response = data?.responses?.[active]

  const centredClasses = [
    'situation-centred',
    phase === 'waiting'                      && 'situation-pulse',
    (phase === 'beat1' || phase === 'beat2') && 'situation-centred--gold',
    phase === 'beat2'                        && 'situation-centred--exiting',
  ].filter(Boolean).join(' ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>

      {/* Header: wordmark only */}
      <div className="px-5 sm:px-12 lg:px-[72px] pt-6 sm:pt-8">
        <p
          className="serif"
          onClick={onBack}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          style={{
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--text)',
            lineHeight: '20px',
            margin: 0,
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
          }}
        >
          Consilium
        </p>
      </div>

      {/* Content area — vertically centred */}
      <div
        className={`px-5 sm:px-12 lg:px-[72px] pt-10 sm:pt-14 pb-20 sm:pb-40 response-content-area${phase === 'beat3' ? ' response-content-area--beat3' : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <div
          className={phase === 'beat3' ? 'response-inner-column--beat3' : undefined}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '640px',
            maxWidth: '100%',
            gap: '40px',
          }}
        >

          {/* Waiting / transition beats: full situation text, centred */}
          {phase !== 'beat3' && (
            <p className={centredClasses}>
              {situation}
            </p>
          )}

          {/* Beat 3: response content fades in staggered */}
          {phase === 'beat3' && response && (
            <>
              {/* Situation truncation — context for the response */}
              <p
                className="response-enter"
                style={{
                  fontSize: '16px',
                  lineHeight: 1.4,
                  letterSpacing: '-0.005em',
                  color: 'var(--accent)',
                  fontWeight: 400,
                  margin: 0,
                  fontFamily: 'inherit',
                }}
              >
                {truncate(situation)}
              </p>

              {/* Response text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p
                    key={`reframe-${active}`}
                    className="serif-body response-enter"
                    style={{
                      fontSize: 'clamp(20px, 3vw, 24px)',
                      fontWeight: 600,
                      lineHeight: 1.33,
                      letterSpacing: '-0.005em',
                      color: 'var(--text)',
                      margin: 0,
                    }}
                  >
                    {response.reframe}
                  </p>
                  <p
                    key={`perspective-${active}`}
                    className="serif-body response-enter response-enter--delay-1"
                    style={{
                      fontSize: 'clamp(16px, 2.5vw, 18px)',
                      fontWeight: 400,
                      lineHeight: 1.33,
                      letterSpacing: '-0.002em',
                      color: 'var(--text)',
                      margin: 0,
                    }}
                  >
                    {response.perspective}
                  </p>
                </div>

                {/* Action line — gold border + italic serif */}
                <div
                  key={`action-${active}`}
                  className="response-enter response-enter--delay-2"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    gap: '20px',
                    paddingTop: '8px',
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
                      fontSize: 'clamp(24px, 4vw, 32px)',
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

              {/* Mode selector + compare */}
              <div
                className="response-enter response-enter--delay-3 response-tabs--beat3"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignSelf: 'stretch',
                }}
              >
                {TONES.map(t => (
                  <button
                    key={t}
                    onClick={() => setActive(t)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '999px',
                      padding: '8px 16px',
                      border: active === t ? 'none' : '1px solid var(--pill-inactive-border)',
                      background: active === t ? 'var(--pill-active-bg)' : 'var(--pill-inactive-bg)',
                      color: active === t ? 'var(--pill-active-text)' : 'var(--pill-inactive-text)',
                      boxShadow: 'none',
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '0.01em',
                      lineHeight: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textTransform: 'capitalize',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t}
                  </button>
                ))}

                <div className="compare-modes-btn">
                  <button
                    onClick={onCompare}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '999px',
                      padding: '8px 16px',
                      gap: '4px',
                      border: '1px solid var(--compare-pill-border)',
                      background: 'transparent',
                      color: 'var(--compare-pill-text)',
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '0.01em',
                      lineHeight: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Compare modes
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
