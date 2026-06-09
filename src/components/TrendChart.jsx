import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function formatTime(ts) {
  if (!ts) return '';
  const d = ts instanceof Date ? ts : new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function TrendChart({ readings }) {
  const data = readings.map((r) => ({
    time: formatTime(r.timestamp),
    temp: parseFloat(r.temperature?.toFixed(1)),
    humidity: parseFloat(r.humidity?.toFixed(1)),
    lightNorm: parseFloat(((r.light / 1023) * 100).toFixed(1)),
  }));

  return (
    <div className="card chart-card">
      <h2 className="chart-title">Sensor Trends</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#2a2d3a' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#2a2d3a' }}
          />
          <Tooltip
            contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 8, color: '#fff' }}
            labelStyle={{ color: '#9ca3af', marginBottom: 4 }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 12, fontSize: 12, color: '#9ca3af' }}
          />
          <Line
            type="monotone"
            dataKey="temp"
            name="Temperature (°C)"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            name="Humidity (%)"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="lightNorm"
            name="Light (scaled 0–100)"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
