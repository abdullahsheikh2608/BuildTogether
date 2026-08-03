import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import EmptyState from '../ui/EmptyState.jsx';

const STATUS_COLORS = {
  Pending: 'var(--color-cyan)',
  Accepted: 'var(--color-ink-green)',
  Rejected: 'var(--color-ink-red)',
};

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--color-blueprint-800)',
  border: '1px solid var(--color-blueprint-line)',
  borderRadius: '4px',
  color: 'var(--color-paper)',
  fontSize: '12px',
};

export default function ApplicationsPieChart({ analytics }) {
  const statusData = [
    { name: 'Pending', value: analytics?.pendingApplications ?? 0 },
    { name: 'Accepted', value: analytics?.acceptedApplications ?? 0 },
    { name: 'Rejected', value: analytics?.rejectedApplications ?? 0 },
  ];

  const hasApplications = statusData.some((entry) => entry.value > 0);

  return (
    <div className="blueprint-card flex flex-col gap-4 p-5">
      <h3 className="font-display text-base font-semibold text-paper">Applications by Status</h3>

      {hasApplications ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend formatter={(value) => <span className="text-xs text-paper-dim">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          title="No applications yet"
          body="Once developers start applying to your startups, the status breakdown will show up here."
        />
      )}
    </div>
  );
}