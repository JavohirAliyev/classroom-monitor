export default function RelayControl({ mqttConnected, isMqttConfigured, relayOn, onToggle }) {
  const handleClick = () => {
    if (mqttConnected) onToggle(!relayOn);
  };

  const notConnectedTitle = isMqttConfigured ? 'MQTT not connected' : 'MQTT not configured';

  return (
    <div className="card relay-card">
      <h2 className="relay-title">Relay Control</h2>
      <div className="relay-row">
        <div className="relay-info">
          <span className="relay-icon">🌀</span>
          <div>
            <div className="relay-name">Ventilation Fan</div>
            <div className="relay-state" style={{ color: relayOn ? 'var(--green)' : 'var(--gray)' }}>
              {relayOn ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>
        <button
          className={`relay-btn ${relayOn ? 'relay-btn--on' : 'relay-btn--off'} ${!mqttConnected ? 'relay-btn--disabled' : ''}`}
          onClick={handleClick}
          disabled={!mqttConnected}
          title={!mqttConnected ? notConnectedTitle : undefined}
          aria-label={`Turn ventilation fan ${relayOn ? 'off' : 'on'}`}
        >
          {relayOn ? 'Turn OFF' : 'Turn ON'}
        </button>
      </div>
      <div className="mqtt-status">
        <span
          className="dot"
          style={{ background: mqttConnected ? 'var(--green)' : 'var(--gray)' }}
        />
        <span style={{ color: mqttConnected ? 'var(--green)' : 'var(--gray)' }}>
          {mqttConnected ? 'MQTT Connected' : isMqttConfigured ? 'Connecting…' : 'MQTT not configured'}
        </span>
      </div>
    </div>
  );
}
