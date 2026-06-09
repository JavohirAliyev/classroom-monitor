# Classroom Environment Monitor

A real-time IoT dashboard for monitoring classroom occupancy and environmental conditions. An ESP8266 NodeMCU publishes sensor data (temperature, humidity, light, proximity) via MQTT to HiveMQ Cloud; a Node.js bridge writes it to Firebase Firestore; this React app reads it live and lets you control a relay via MQTT.

## Prerequisites

- Node.js 18+
- Firebase project with Firestore enabled
- HiveMQ Cloud account (free tier works)

## Setup

```bash
git clone <your-repo-url>
cd classroom-monitor
npm install
cp .env.example .env
# Edit .env and fill in your Firebase + HiveMQ credentials
npm run dev
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `<project>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `<project>.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_HIVEMQ_BROKER_URL` | `wss://<host>:8884/mqtt` |
| `VITE_HIVEMQ_USERNAME` | HiveMQ credential username |
| `VITE_HIVEMQ_PASSWORD` | HiveMQ credential password |
| `VITE_MQTT_CONTROL_TOPIC` | Topic for relay commands (default: `env/classroom/control`) |
| `VITE_MQTT_DATA_TOPIC` | Topic the ESP publishes to (default: `env/classroom/data`) |

## Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # select your project, set public dir to "dist", SPA: yes
npm run build
firebase deploy
```

## Firestore security rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /readings/{doc} {
      allow read: if true;
      allow write: if request.auth == null;  // tighten for production
    }
  }
}
```

> For production, restrict writes to your Node.js bridge service account only and require auth for reads.

## MQTT notes

- HiveMQ free tier supports WebSocket connections on **port 8884** (WSS).
- In the HiveMQ Cloud console go to Cluster → Overview and enable the **WebSocket listener** if it is not already active.
- The relay control topic receives JSON: `{ "relay": true }` / `{ "relay": false }`.
- The ESP8266 should subscribe to `VITE_MQTT_CONTROL_TOPIC` and act on the `relay` field.

## Demo mode

If the Firebase env vars are empty the app runs in **Demo mode**: it seeds 50 synthetic readings and adds a new one every 5 seconds so you can explore the UI without a live backend.
