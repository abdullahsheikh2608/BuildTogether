import { useEffect, useState } from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';

import { getMyApplications } from '../../services/application.service.js';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch {
        setError('Unable to load your applications.');
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <main className="mx-auto max-w-5xl px-4 py-8">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan">
          Developer
        </span>

        <h1 className="mt-2 text-3xl font-bold text-paper">My Applications</h1>

        <p className="mt-2 text-paper-dim">Track all your submitted applications.</p>

        {error && (
          <p className="mt-6 rounded-lg border border-red-500 bg-red-500/10 p-3 text-red-400">
            {error}
          </p>
        )}

        <div className="mt-8">
          {applications.length === 0 ? (
            <EmptyState title="No Applications" body="You haven't applied to any startup yet." />
          ) : (
            <div className="space-y-5">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-xl border border-slate-700 bg-slate-900 p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-paper">{application.title}</h2>

                      <p className="mt-1 text-paper-dim">{application.tagline}</p>
                    </div>

                    <span
                      className={`rounded-md px-3 py-1 text-sm font-semibold ${
                        application.status === 'accepted'
                          ? 'bg-green-600 text-white'
                          : application.status === 'rejected'
                            ? 'bg-red-600 text-white'
                            : 'bg-yellow-500 text-black'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>

                  {application.message && (
                    <div className="mt-4 rounded-lg bg-slate-800 p-3">
                      <p className="text-sm text-paper-dim">
                        <span className="font-semibold">Message:</span> {application.message}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 border-t border-slate-700 pt-3 text-sm text-paper-dim">
                    Applied On: {new Date(application.applied_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
