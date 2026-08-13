import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import EmptyState from '../ui/EmptyState.jsx';

const AXIS_TICK_STYLE = { fill: 'var(--color-paper-faint)', fontSize: 12 };

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--color-blueprint-800)',
  border: '1px solid var(--color-blueprint-line)',
  borderRadius: '4px',
  color: 'var(--color-paper)',
  fontSize: '12px',
};

export default function TasksBarChart({ analytics }) {
  const totalTasks = analytics?.totalTasks ?? 0;

  const taskStatusData = [
    { status: 'Completed', count: analytics?.completedTasks ?? 0 },
    { status: 'Pending', count: analytics?.pendingTasks ?? 0 },
  ];

  return (
    <div className="blueprint-card flex flex-col gap-4 p-5">
      <h3 className="font-display text-base font-semibold text-paper">Tasks by Status</h3>

      {totalTasks > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taskStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-blueprint-line)" />
              <XAxis dataKey="status" stroke="var(--color-blueprint-line)" tick={AXIS_TICK_STYLE} />
              <YAxis allowDecimals={false} stroke="var(--color-blueprint-line)" tick={AXIS_TICK_STYLE} />
              <Tooltip cursor={{ fill: 'var(--color-blueprint-800)' }} contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="var(--color-amber)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          title="No tasks yet"
          body="Task status will appear here once your projects have tasks assigned."
        />
      )}
    </div>
  );
}