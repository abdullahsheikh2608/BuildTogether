import { useEffect, useState } from 'react';
import { getDashboardAnalytics } from '../../services/dashboard.service.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import AnalyticsGrid from '../../components/analytics/AnalyticsGrid.jsx';
import ApplicationsPieChart from '../../components/analytics/ApplicationsPieChart.jsx';
import TasksBarChart from '../../components/analytics/TasksBarChart.jsx';
import StartupGrowthChart from '../../components/analytics/StartupGrowthChart.jsx';
import TopStatistics from '../../components/analytics/TopStatistics.jsx';

export default function FounderAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getDashboardAnalytics();
        setAnalytics(response.data);
      } catch {
        setError("Couldn't load analytics. Try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
          Founder · Console
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold text-paper">Analytics</h1>
        <p className="mt-1 text-sm text-paper-dim">
          A blueprint-level view of your startups, applications, and task progress.
        </p>
      </div>

      {loading && (
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-paper-faint">
          Loading analytics…
        </p>
      )}

      {!loading && error && (
        <p className="mt-6 rounded-sm border border-ink-red/40 bg-ink-red/10 px-3 py-2 font-mono text-xs text-ink-red">
          {error}
        </p>
      )}

      {!loading && !error && !analytics && (
        <div className="mt-6">
          <EmptyState
            title="No analytics yet"
            body="Post a startup and start collecting applications to see your analytics here."
          />
        </div>
      )}

      {!loading && !error && analytics && (
        <>
          <div className="mt-6">
            <AnalyticsGrid analytics={analytics} />
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <ApplicationsPieChart analytics={analytics} />
            <TasksBarChart analytics={analytics} />
          </div>

          <div className="mt-5">
            <StartupGrowthChart analytics={analytics} />
          </div>

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-paper">Top Statistics</h2>
            <div className="mt-4">
              <TopStatistics analytics={analytics} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}