export default function StatusCard({ icon, label, value, unit, statusColor, statusText }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <span className="dot" style={{ background: statusColor }} title={statusText} />
      </div>
      <div className="card-value">
        {value !== null && value !== undefined ? (
          <>
            <span className="card-number">{typeof value === 'number' ? value.toFixed(1) : value}</span>
            {unit && <span className="card-unit">{unit}</span>}
          </>
        ) : (
          <span className="card-number card-placeholder">—</span>
        )}
      </div>
      <div className="card-label">{label}</div>
      <div className="card-status" style={{ color: statusColor }}>{statusText}</div>
    </div>
  );
}
