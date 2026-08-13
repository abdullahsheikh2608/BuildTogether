import AnalyticsCard from './AnalyticsCard.jsx';

const KPI_CARD_CONFIG = [
  { key: 'totalStartups', label: 'Total Startups' },
  { key: 'totalApplications', label: 'Total Applications' },
  { key: 'pendingApplications', label: 'Pending Applications' },
  { key: 'acceptedApplications', label: 'Accepted Applications' },
  { key: 'rejectedApplications', label: 'Rejected Applications' },
  { key: 'totalDevelopers', label: 'Total Developers' },
  { key: 'totalTasks', label: 'Total Tasks' },
  { key: 'completedTasks', label: 'Completed Tasks' },
  { key: 'pendingTasks', label: 'Pending Tasks' },
  { key: 'completionRate', label: 'Completion Rate', suffix: '%' },
];

export default function AnalyticsGrid({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {KPI_CARD_CONFIG.map(({ key, label, suffix }) => (
        <AnalyticsCard key={key} label={label} value={analytics[key] ?? 0} suffix={suffix} />
      ))}
    </div>
  );
}