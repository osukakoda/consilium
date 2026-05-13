import { useState, useEffect, useRef } from 'react'
import { ChevronDown, RotateCcw, Check, X } from 'lucide-react'

const TONES = ['reflective', 'blunt', 'practical']

const DESCRIPTORS = {
  reflective: 'The question behind the question',
  blunt: 'No softening. Just the truth',
  practical: 'A path forward, not a place to sit',
}

function truncate(text, maxLen = 72) {
  if (!text || text.length <= maxLen) return text
  return text.slice(0, maxLen) + '…'
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// phase: 'waiting' → 'beat1' (gold, 300ms) → 'beat2' (reposition, 200ms) → 'beat3' (response in)
export default function ResponseScreen({ data, situation, waiting, onBack }) {
  const [active, setActive] = useState('reflective')
  const [phase, setPhase] = useState('waiting')
  const [open, setOpen] = useState(false)
  const selectorRef = useRef(null)

  useEffect(() => {
    if (!waiting && data) {
      setActive(data.classification)
      setPhase('beat1')
      const t1 = setTimeout(() => setPhase('beat2'), 300)
      const t2 = setTimeout(() => setPhase('beat3'), 500)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [waiting, data])

  // Close on click outside (desktop) or Escape (both)
  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    function onKey(e) { if (e.key === 'Escape') setOpen(false) }
    // Defer so the click that opened the dropdown doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('keydown', onKey)
    }, 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function handleSelect(tone) {
    setActive(tone)
    setOpen(false)
    window.scrollTo(0, 0)
  }

  const response = data?.responses?.[active]

  const centredClasses = [
    'situation-centred',
    phase === 'waiting' && 'situation-pulse',
    phase === 'beat2'   && 'situation-centred--exiting',
  ].filter(Boolean).join(' ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>

      {/* Overlay — rendered at root level so it escapes the fixed footer's stacking context */}
      {open && phase === 'beat3' && (
        <div
          className="mode-overlay"
          onPointerDown={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Content area — vertically centred */}
      <div
        className={`px-4 sm:px-12 lg:px-[72px] pt-[72px] sm:pt-14 pb-20 sm:pb-40 response-content-area${phase === 'beat3' ? ' response-content-area--beat3' : ''}`}
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
            gap: '36px',
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
                  fontSize: 'var(--text-base)',
                  lineHeight: 'var(--leading-base)',
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
              <div className="response-sections" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p
                    key={`reframe-${active}`}
                    className="serif-body response-enter response-reframe"
                    style={{
                      fontSize: 'var(--text-l)',
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
                    className="serif-body response-enter response-enter--delay-1 response-perspective"
                    style={{
                      fontSize: '19px',
                      fontWeight: 500,
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
                    gap: '16px',
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

              {/* Mode selector row */}
              <div ref={selectorRef} className="response-enter response-enter--delay-3 mode-selector-row" style={open ? { zIndex: 100 } : undefined}>

                {/* Left: current mode + chevron */}
                <button
                  className={`mode-trigger${open ? ' mode-trigger--open' : ''}`}
                  onClick={() => setOpen(o => !o)}
                  aria-haspopup="listbox"
                  aria-expanded={open}
                >
                  {capitalize(active)}
                  <ChevronDown size={14} strokeWidth={1.8} />
                </button>

                {/* Right: start again */}
                <button className="mode-start-again" onClick={onBack}>
                  <RotateCcw size={14} strokeWidth={1.8} />
                  Start again
                </button>

                {/* Options — popover on desktop, bottom sheet on mobile */}
                {open && (
                  <div className="mode-options" role="listbox">
                    {/* Close button — mobile sheet only */}
                    <button className="mode-sheet-close" onClick={() => setOpen(false)} aria-label="Close">
                      <X size={18} strokeWidth={1.5} />
                    </button>
                    {TONES.map(tone => (
                      <button
                        key={tone}
                        className="mode-option-row"
                        role="option"
                        aria-selected={active === tone}
                        onClick={() => handleSelect(tone)}
                      >
                        <span className="mode-check-slot">
                          {active === tone && <Check size={14} strokeWidth={2} />}
                        </span>
                        <span className="mode-option-content">
                          <span className="mode-option-name">{capitalize(tone)}</span>
                          <span className="mode-option-desc">{DESCRIPTORS[tone]}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
