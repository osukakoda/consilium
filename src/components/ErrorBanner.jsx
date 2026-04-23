export default function ErrorBanner({ message }) {
  if (!message) return null

  return (
    <div
      className="animate-fade-up"
      style={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '8px',
        padding: '8px 16px',
        gap: '4px',
        width: 'fit-content',
        outline: '1px solid var(--error-border)',
      }}
    >
      <p style={{
        fontFamily: 'inherit',
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--error)',
        lineHeight: '16px',
        letterSpacing: '0.01em',
        margin: 0,
      }}>
        {message}
      </p>
    </div>
  )
}
