export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: theme === 'dark' ? 'var(--toggle-active)' : 'transparent',
          border: theme === 'dark' ? 'none' : '1px solid var(--toggle-inactive-border)',
          transition: 'all 0.2s',
        }}
      />
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: theme === 'light' ? 'var(--toggle-active)' : 'transparent',
          border: theme === 'light' ? 'none' : '1px solid var(--toggle-inactive-border)',
          transition: 'all 0.2s',
        }}
      />
    </button>
  )
}
