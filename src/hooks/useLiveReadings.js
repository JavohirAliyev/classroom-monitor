import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const delta = (range) => (Math.random() - 0.5) * range;

function makeMockReading(prev = null) {
  if (!prev) {
    return {
      temperature: 20 + Math.random() * 12,
      humidity: 45 + Math.random() * 30,
      light: 150 + Math.random() * 700,
      distance: 30 + Math.random() * 170,
      timestamp: new Date(Date.now() - Math.random() * 250000),
    };
  }
  return {
    temperature: clamp(prev.temperature + delta(2), 18, 32),
    humidity: clamp(prev.humidity + delta(3), 40, 80),
    light: clamp(prev.light + delta(80), 100, 900),
    distance: clamp(prev.distance + delta(10), 20, 200),
    timestamp: new Date(),
  };
}

function seedMock() {
  const readings = [];
  let prev = null;
  const now = Date.now();
  for (let i = 49; i >= 0; i--) {
    const r = prev ? makeMockReading(prev) : makeMockReading();
    r.timestamp = new Date(now - i * 5000);
    readings.push(r);
    prev = r;
  }
  return readings;
}

export function useLiveReadings() {
  const [readings, setReadings] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [firestoreConnected, setFirestoreConnected] = useState(false);
  const mockRef = useRef(null);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const q = query(
        collection(db, 'readings'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const unsub = onSnapshot(
        q,
        (snap) => {
          const docs = snap.docs
            .map((d) => ({
              ...d.data(),
              timestamp: d.data().timestamp?.toDate?.() ?? new Date(),
              id: d.id,
            }))
            .reverse();
          setReadings(docs);
          setLastUpdated(new Date());
          setFirestoreConnected(true);
        },
        () => setFirestoreConnected(false)
      );

      return unsub;
    } else {
      const seed = seedMock();
      mockRef.current = seed;
      setReadings(seed);
      setLastUpdated(new Date());

      const interval = setInterval(() => {
        mockRef.current = [
          ...mockRef.current.slice(-49),
          makeMockReading(mockRef.current[mockRef.current.length - 1]),
        ];
        setReadings([...mockRef.current]);
        setLastUpdated(new Date());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  return {
    readings,
    lastUpdated,
    firestoreConnected,
    isDemo: !isFirebaseConfigured,
  };
}
