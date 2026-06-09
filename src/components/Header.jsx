export default function Header({ lastUpdated, firestoreConnected, isDemo }) {
  const formatted = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  return (
    <header className="header">
      <div className="header-title-block">
        <h1 className="header-title">Classroom Environment Monitor</h1>
        <p className="header-subtitle">Live data · WIUT Building A</p>
      </div>
      <div className="header-meta">
        <span className="header-updated">Updated {formatted}</span>
        <span className="status-indicator">
          <span
            className="dot"
            style={{ background: firestoreConnected ? 'var(--green)' : 'var(--gray)' }}
          />
          {firestoreConnected ? 'Firestore live' : isDemo ? 'Demo mode' : 'Connecting…'}
        </span>
      </div>
    </header>
  );
}
