import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Rocket,
  BarChart3,
  ArrowRight,
  Users,
  FileText,
  ListChecks,
  ClipboardCheck,
  UserPlus,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import Button from '../../components/ui/Button.jsx';
import StampBadge from '../../components/ui/StampBadge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { SkeletonStat } from '../../components/ui/Skeleton.jsx';
import AnalyticsCard from '../../components/analytics/AnalyticsCard.jsx';

import { useAuth } from '../../hooks/useAuth.js';
import { useStartup } from '../../hooks/useStartup.js';
import { getDashboardAnalytics } from '../../services/dashboard.service.js';

const TASK_STATUS_COLORS = {
  todo: 'var(--color-paper-faint)',
  in_progress: 'var(--color-cyan)',
  done: 'var(--color-ink-green)',
};

const PROJECT_PILLS_VISIBLE_LIMIT = 8;

function timeAgo(dateString) {
  if (!dateString) return '';
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function FounderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { startups, loadStartups } = useStartup();

  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    loadStartups();
  }, [loadStartups]);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      setError('');

      try {
        const startupId = selectedProjectId === 'all' ? undefined : selectedProjectId;
        const response = await getDashboardAnalytics(startupId);
        setAnalytics(response.data);
      } catch {
        setError("Couldn't load your dashboard. Try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [selectedProjectId]);

  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const hasStartups = (analytics?.totalStartups ?? 0) > 0;

  const openTasks = (analytics?.pendingTasks ?? 0) + (analytics?.inProgressTasks ?? 0);

  const taskStatusData = analytics
    ? [
        { key: 'todo', name: 'To Do', value: analytics.pendingTasks ?? 0 },
        { key: 'in_progress', name: 'In Progress', value: analytics.inProgressTasks ?? 0 },
        { key: 'done', name: 'Completed', value: analytics.completedTasks ?? 0 },
      ]
    : [];

  const hasTaskData = taskStatusData.some((slice) => slice.value > 0);

  return (
    <div className="w-full">

      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-paper-dim">
            {selectedProjectId === 'all'
              ? "Here's what's happening across your startups today."
              : `Showing data for ${startups.find((s) => String(s.id) === String(selectedProjectId))?.title || 'this project'}.`}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-ink-red/20 bg-ink-red/5 px-4 py-3 text-sm text-ink-red">
          {error}
        </p>
      )}

      {/* Project filter */}

      {startups.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedProjectId('all')}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              selectedProjectId === 'all'
                ? 'border-cyan bg-cyan text-white shadow-sm'
                : 'border-blueprint-line bg-white text-paper-dim hover:border-cyan/40 hover:text-paper'
            }`}
          >
            All Projects
          </button>

          {(showAllProjects ? startups : startups.slice(0, PROJECT_PILLS_VISIBLE_LIMIT)).map((startup) => (
            <button
              type="button"
              key={startup.id}
              onClick={() => setSelectedProjectId(String(startup.id))}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                String(selectedProjectId) === String(startup.id)
                  ? 'border-cyan bg-cyan text-white shadow-sm'
                  : 'border-blueprint-line bg-white text-paper-dim hover:border-cyan/40 hover:text-paper'
              }`}
            >
              {startup.title}
            </button>
          ))}

          {startups.length > PROJECT_PILLS_VISIBLE_LIMIT && (
            <button
              type="button"
              onClick={() => setShowAllProjects((prev) => !prev)}
              className="shrink-0 whitespace-nowrap rounded-full border border-dashed border-blueprint-line bg-white px-4 py-2 text-sm font-medium text-cyan transition-all duration-200 hover:border-cyan/40 hover:bg-cyan-dim/40"
            >
              {showAllProjects ? 'Show less' : `+${startups.length - PROJECT_PILLS_VISIBLE_LIMIT} more`}
            </button>
          )}
        </div>
      )}

      {/* Stat cards */}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <AnalyticsCard icon={Rocket} color="blue" label="Active Startups" value={analytics?.totalStartups ?? 0} />
            <AnalyticsCard icon={FileText} color="green" label="Total Applications" value={analytics?.totalApplications ?? 0} />
            <AnalyticsCard icon={Users} color="purple" label="Team Members" value={analytics?.totalDevelopers ?? 0} />
            <AnalyticsCard icon={ListChecks} color="amber" label="Open Tasks" value={openTasks} />
          </>
        )}
      </div>

      {/* Quick actions */}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => navigate('/founder/startups')}>
          <Rocket size={16} />
          View Startups
        </Button>
        <Button variant="outline" onClick={() => navigate('/founder/analytics')}>
          <BarChart3 size={16} />
          Analytics
        </Button>
      </div>

      {!loading && !hasStartups ? (
        <div className="mt-8">
          <EmptyState
            icon={Rocket}
            title="No startups yet"
            body="Post your first startup idea to start seeing activity, applications, and progress here."
            action={<Button onClick={() => navigate('/founder/startups', { state: { openCreate: true } })}>Post your first startup</Button>}
          />
        </div>
      ) : (
        <>
          {/* My Startups + Recent Applications */}

          <div className="mt-8 grid gap-5 lg:grid-cols-3">

            <div className="blueprint-card flex flex-col p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-paper">My Startups</h3>
                <Link
                  to="/founder/startups"
                  className="flex items-center gap-1 text-xs font-medium text-cyan transition hover:text-cyan/80"
                >
                  View all
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="mt-4 flex flex-col divide-y divide-blueprint-line">
                {loading ? (
                  <p className="py-6 text-center text-sm text-paper-faint">Loading…</p>
                ) : (analytics?.startupsOverview ?? []).length === 0 ? (
                  <p className="py-6 text-center text-sm text-paper-faint">No startups yet.</p>
                ) : (
                  analytics.startupsOverview.map((startup) => (
                    <Link
                      key={startup.id}
                      to="/founder/startups"
                      className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 transition-colors duration-200 hover:bg-blueprint-800/40 rounded-lg px-2 -mx-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-paper">{startup.title}</p>
                          <span
                            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              startup.status === 'open'
                                ? 'bg-[#DCFCE7] text-ink-green'
                                : 'bg-blueprint-800 text-paper-faint'
                            }`}
                          >
                            {startup.status === 'open' ? 'Open' : 'Closed'}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-paper-dim">{startup.tagline}</p>
                      </div>

                      <div className="hidden shrink-0 gap-6 text-right sm:flex">
                        <div>
                          <p className="text-sm font-semibold text-paper">{startup.applicationsCount}</p>
                          <p className="text-[11px] text-paper-faint">Applications</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-paper">{startup.teamCount}</p>
                          <p className="text-[11px] text-paper-faint">Team</p>
                        </div>
                      </div>

                      <ArrowRight size={16} className="shrink-0 text-paper-faint" />
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="blueprint-card flex flex-col p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-paper">Recent Applications</h3>
                <Link
                  to="/founder/startups"
                  className="flex items-center gap-1 text-xs font-medium text-cyan transition hover:text-cyan/80"
                >
                  View all
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="mt-4 flex max-h-80 flex-col divide-y divide-blueprint-line overflow-y-auto pr-1">
                {loading ? (
                  <p className="py-6 text-center text-sm text-paper-faint">Loading…</p>
                ) : (analytics?.recentApplications ?? []).length === 0 ? (
                  <p className="py-6 text-center text-sm text-paper-faint">No applications yet.</p>
                ) : (
                  analytics.recentApplications.map((app) => (
                    <Link
                      key={app.id}
                      to={`/founder/startups/${app.startupId}/applications`}
                      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-paper">{app.applicantName}</p>
                        <p className="truncate text-xs text-paper-dim">{app.startupTitle}</p>
                      </div>
                      <StampBadge status={app.status} />
                    </Link>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Tasks Overview + Upcoming Deadlines */}

          <div className="mt-5 grid gap-5 lg:grid-cols-2">

            <div className="blueprint-card p-5">
              <h3 className="font-display text-base font-semibold text-paper">Tasks Overview</h3>

              {loading ? (
                <p className="py-10 text-center text-sm text-paper-faint">Loading…</p>
              ) : !hasTaskData ? (
                <p className="py-10 text-center text-sm text-paper-faint">No tasks yet.</p>
              ) : (
                <div className="mt-2 flex items-center gap-6">
                  <div className="relative h-40 w-40 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskStatusData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={48}
                          outerRadius={70}
                          paddingAngle={2}
                        >
                          {taskStatusData.map((slice) => (
                            <Cell key={slice.key} fill={TASK_STATUS_COLORS[slice.key]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--color-blueprint-900)',
                            border: '1px solid var(--color-blueprint-line)',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-2xl font-bold text-paper">
                        {analytics?.totalTasks ?? 0}
                      </span>
                      <span className="text-[11px] text-paper-faint">Total Tasks</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    {taskStatusData.map((slice) => (
                      <div key={slice.key} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: TASK_STATUS_COLORS[slice.key] }}
                          />
                          <span className="text-paper-dim">{slice.name}</span>
                        </div>
                        <span className="font-medium text-paper">{slice.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="blueprint-card p-5">
              <h3 className="font-display text-base font-semibold text-paper">Upcoming Deadlines</h3>

              <div className="mt-4 flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
                {loading ? (
                  <p className="py-6 text-center text-sm text-paper-faint">Loading…</p>
                ) : (analytics?.upcomingDeadlines ?? []).length === 0 ? (
                  <p className="py-6 text-center text-sm text-paper-faint">No upcoming deadlines.</p>
                ) : (
                  analytics.upcomingDeadlines.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 rounded-lg border border-blueprint-line p-3"
                    >
                      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-cyan-dim text-cyan">
                        <span className="text-[10px] font-semibold uppercase leading-none">
                          {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short' })}
                        </span>
                        <span className="text-sm font-bold leading-none">
                          {new Date(task.deadline).getDate()}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-paper">{task.title}</p>
                        <p className="truncate text-xs text-paper-dim">{task.startupTitle}</p>
                      </div>

                      <span className="shrink-0 rounded-full bg-blueprint-800 px-2.5 py-1 text-[11px] font-medium capitalize text-paper-dim">
                        {task.priority}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Recent Activity */}

          <div className="mt-5 blueprint-card p-5">
            <h3 className="font-display text-base font-semibold text-paper">Recent Activity</h3>

            <div className="mt-4 flex flex-col divide-y divide-blueprint-line">
              {loading ? (
                <p className="py-6 text-center text-sm text-paper-faint">Loading…</p>
              ) : (analytics?.recentActivity ?? []).length === 0 ? (
                <p className="py-6 text-center text-sm text-paper-faint">No recent activity yet.</p>
              ) : (
                analytics.recentActivity.map((event, index) => {
                  const isApplication = event.type === 'application';
                  const Icon = isApplication ? UserPlus : ClipboardCheck;

                  const text = isApplication
                    ? `${event.actorName} applied to ${event.startupTitle}`
                    : `${event.actorName ?? 'Someone'} completed "${event.detail}"`;

                  return (
                    <div key={`${event.type}-${index}`} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-dim text-cyan">
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-paper">{text}</p>
                        <p className="mt-0.5 text-xs text-paper-faint">
                          {event.startupTitle} · {timeAgo(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
