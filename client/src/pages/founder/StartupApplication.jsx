import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import StampBadge from '../../components/ui/StampBadge.jsx';
import { getStartupById } from '../../services/startup.service.js';

import {
  getStartupApplications,
  updateApplicationStatus,
} from '../../services/application.service.js';

export default function StartupApplications() {
  const { id } = useParams();

  const [startup, setStartup] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    Promise.all([getStartupById(id), getStartupApplications(id)])
      .then(([startupData, apps]) => {
        setStartup(startupData);
        setApplications(apps);
      })
      .catch(() => setError("Couldn't load applications. Refresh to try again."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDecision = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      const updated = await updateApplicationStatus(applicationId, status);
      setApplications((list) =>
        list.map((a) => (a.id === applicationId ? { ...a, status: updated.status } : a))
      );
    } catch {
      setError("Couldn't update that application. Try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/founder"
        className="font-mono text-xs uppercase tracking-widest text-cyan hover:underline"
      >
        ← Your startups
      </Link>

      <div className="mt-4">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
          Applications
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold text-paper">
          {startup?.title ?? '…'}
        </h1>
      </div>

      {error && (
        <p className="mt-6 rounded-sm border border-ink-red/40 bg-ink-red/10 px-3 py-2 font-mono text-xs text-ink-red">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {loading ? (
          <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading…</p>
        ) : applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            body="Once developers apply to this startup, their applications will show up here for review."
          />
        ) : (
          applications.map((app) => (
            <div key={app.id} className="blueprint-card animate-draft-in flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold text-paper">
                    {app.full_name ?? app.email}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-paper-faint">
                    @{app.username} · {app.email}
                  </p>
                </div>
                <StampBadge status={app.status} />
              </div>

              {app.message && (
                <p className="rounded-sm bg-blueprint-800/60 px-3 py-2 text-sm text-paper-dim">
                  {app.message}
                </p>
              )}

              {app.status === 'pending' && (
                <div className="flex gap-3 border-t border-blueprint-line pt-3">
                  <Button
                    variant="outline"
                    className="px-3 py-1.5 text-xs"
                    loading={updatingId === app.id}
                    onClick={() => handleDecision(app.id, 'accepted')}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    className="px-3 py-1.5 text-xs"
                    loading={updatingId === app.id}
                    onClick={() => handleDecision(app.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
