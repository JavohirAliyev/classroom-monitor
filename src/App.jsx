import { useState } from 'react';
import { useLiveReadings } from './hooks/useLiveReadings';
import { useMqtt } from './hooks/useMqtt';
import Header from './components/Header';
import StatusCard from './components/StatusCard';
import TrendChart from './components/TrendChart';
import RelayControl from './components/RelayControl';
import './App.css';

function getTempStatus(temp) {
  if (temp > 28) return { color: 'var(--red)', text: 'Too hot' };
  if (temp > 25) return { color: 'var(--amber)', text: 'Warm' };
  return { color: 'var(--green)', text: 'Normal' };
}

function getHumidityStatus(h) {
  if (h > 70) return { color: 'var(--red)', text: 'Too humid' };
  if (h > 60) return { color: 'var(--amber)', text: 'High' };
  return { color: 'var(--green)', text: 'Normal' };
}

function getLightStatus(l) {
  if (l < 200) return { color: 'var(--amber)', text: 'Low light' };
  return { color: 'var(--green)', text: 'Good' };
}

function getDistanceStatus(d) {
  if (d < 80) return { color: 'var(--blue)', text: 'Occupied' };
  return { color: 'var(--gray)', text: 'Clear' };
}

export default function App() {
  const { readings, lastUpdated, firestoreConnected, isDemo } = useLiveReadings();
  const { mqttConnected, publishRelay, isMqttConfigured } = useMqtt();
  const [relayOn, setRelayOn] = useState(false);

  const latest = readings[readings.length - 1] ?? null;

  const handleRelayToggle = (on) => {
    setRelayOn(on);
    publishRelay(on);
  };

  const tempStatus = latest ? getTempStatus(latest.temperature) : { color: 'var(--gray)', text: '—' };
  const humidStatus = latest ? getHumidityStatus(latest.humidity) : { color: 'var(--gray)', text: '—' };
  const lightStatus = latest ? getLightStatus(latest.light) : { color: 'var(--gray)', text: '—' };
  const distStatus = latest ? getDistanceStatus(latest.distance) : { color: 'var(--gray)', text: '—' };

  return (
    <div className="app">
      {isDemo && (
        <div className="demo-banner">
          ⚠ Demo mode — no Firebase configured. Showing simulated data.
        </div>
      )}

      <Header
        lastUpdated={lastUpdated}
        firestoreConnected={firestoreConnected || isDemo}
        isDemo={isDemo}
      />

      <section className="cards-grid">
        <StatusCard
          icon="🌡"
          label="Temperature"
          value={latest?.temperature ?? null}
          unit="°C"
          statusColor={tempStatus.color}
          statusText={tempStatus.text}
        />
        <StatusCard
          icon="💧"
          label="Humidity"
          value={latest?.humidity ?? null}
          unit="%"
          statusColor={humidStatus.color}
          statusText={humidStatus.text}
        />
        <StatusCard
          icon="☀"
          label="Light Level"
          value={latest ? Math.round(latest.light) : null}
          unit="ADC"
          statusColor={lightStatus.color}
          statusText={lightStatus.text}
        />
        <StatusCard
          icon="📡"
          label="Proximity"
          value={latest ? (latest.distance < 80 ? 'Occupied' : 'Clear') : null}
          unit={latest && latest.distance < 80 ? '' : ''}
          statusColor={distStatus.color}
          statusText={latest ? `${Math.round(latest.distance)} cm` : '—'}
        />
      </section>

      <TrendChart readings={readings} />

      <RelayControl
        mqttConnected={mqttConnected}
        isMqttConfigured={isMqttConfigured}
        relayOn={relayOn}
        onToggle={handleRelayToggle}
      />
    </div>
  );
}
