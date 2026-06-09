import { useState, useEffect, useRef, useCallback } from 'react';

const BROKER_URL = import.meta.env.VITE_HIVEMQ_BROKER_URL;
const MQTT_USERNAME = import.meta.env.VITE_HIVEMQ_USERNAME;
const MQTT_PASSWORD = import.meta.env.VITE_HIVEMQ_PASSWORD;
const CONTROL_TOPIC = import.meta.env.VITE_MQTT_CONTROL_TOPIC || 'env/classroom/control';

export function useMqtt() {
  const [mqttConnected, setMqttConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!BROKER_URL) return;

    let client;
    let cancelled = false;

    import('mqtt').then(({ default: mqtt }) => {
      if (cancelled) return;

      client = mqtt.connect(BROKER_URL, {
        username: MQTT_USERNAME || undefined,
        password: MQTT_PASSWORD || undefined,
        clientId: `classroom-monitor-${Math.random().toString(16).slice(2, 8)}`,
        clean: true,
        reconnectPeriod: 5000,
        connectTimeout: 10000,
      });

      clientRef.current = client;

      client.on('connect', () => setMqttConnected(true));
      client.on('close', () => setMqttConnected(false));
      client.on('error', () => setMqttConnected(false));
    });

    return () => {
      cancelled = true;
      if (client) client.end(true);
      clientRef.current = null;
      setMqttConnected(false);
    };
  }, []);

  const publishRelay = useCallback((on) => {
    if (clientRef.current && mqttConnected) {
      clientRef.current.publish(
        CONTROL_TOPIC,
        JSON.stringify({ relay: on }),
        { qos: 1 }
      );
    }
  }, [mqttConnected]);

  return { mqttConnected, publishRelay, isMqttConfigured: !!BROKER_URL };
}
