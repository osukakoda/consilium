export default function CenteredMessage({ title, description, actionLabel, onAction }) {
  return (
    <div
      className="animate-fade-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '60vh',
        gap: '16px',
      }}
    >
      <p
        className="serif"
        style={{ fontSize: '36px', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.35, color: 'var(--text)' }}
      >
        {title}
      </p>
      <p
        style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '360px' }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            padding: '10px 28px',
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            marginTop: '12px',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--muted)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
