import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import EmptyState from '../ui/EmptyState.jsx';

const AXIS_TICK_STYLE = { fill: 'var(--color-paper-faint)', fontSize: 12 };

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--color-blueprint-800)',
  border: '1px solid var(--color-blueprint-line)',
  borderRadius: '4px',
  color: 'var(--color-paper)',
  fontSize: '12px',
};

export default function StartupGrowthChart({ analytics }) {
  const monthlyGrowth = analytics?.monthlyStartupGrowth ?? [];

  const hasGrowthData = monthlyGrowth.some((entry) => entry.count > 0);

  return (
    <div className="blueprint-card flex flex-col gap-4 p-5">
      <h3 className="font-display text-base font-semibold text-paper">Startup Growth</h3>

      {hasGrowthData ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-blueprint-line)" />
              <XAxis dataKey="month" stroke="var(--color-blueprint-line)" tick={AXIS_TICK_STYLE} />
              <YAxis allowDecimals={false} stroke="var(--color-blueprint-line)" tick={AXIS_TICK_STYLE} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="count"
                name="Startups Posted"
                stroke="var(--color-cyan)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-cyan)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          title="No growth yet"
          body="Post startups over the coming months to see your growth trend take shape here."
        />
      )}
    </div>
  );
}