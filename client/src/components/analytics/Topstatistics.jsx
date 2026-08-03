import AnalyticsCard from './AnalyticsCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

// TODO: "Most Active Startup" needs a per-startup breakdown (applications or tasks
// grouped by startup) that GET /api/dashboard/analytics does not return yet. Once
// the backend adds that field, surface it here as an extra AnalyticsCard.
export default function TopStatistics({ analytics }) {
  if (!analytics) return null;

  const { totalApplications, acceptedApplications, totalStartups, totalTasks } = analytics;

  const acceptanceRate =
    totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : null;

  const averageTasksPerStartup =
    totalStartups > 0 ? (totalTasks / totalStartups).toFixed(1) : null;

  const hasAnyStat = acceptanceRate !== null || averageTasksPerStartup !== null;

  if (!hasAnyStat) {
    return (
      <EmptyState
        title="Not enough data yet"
        body="Top statistics will appear once you have startups and applications."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {acceptanceRate !== null && (
        <AnalyticsCard label="Acceptance Rate" value={acceptanceRate} suffix="%" />
      )}

      {averageTasksPerStartup !== null && (
        <AnalyticsCard label="Average Tasks per Startup" value={averageTasksPerStartup} />
      )}
    </div>
  );
}