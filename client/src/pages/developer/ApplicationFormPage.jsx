import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BackButton from '../../components/common/BackButton.jsx';
import ApplicationForm from '../../components/applications/ApplicationForm.jsx';
import { getStartupById } from '../../services/startup.service.js';
import { applyToStartup, getMyApplications } from '../../services/application.service.js';
import Button from '../../components/ui/Button.jsx';
import { CheckCircle2 } from 'lucide-react';

export default function ApplicationFormPage() {
  const { startupId } = useParams();
  const navigate = useNavigate();

  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [startupData, myApps] = await Promise.all([
          getStartupById(startupId),
          getMyApplications().catch(() => []),
        ]);

        setStartup(startupData);

        const applied = Array.isArray(myApps) && myApps.some((app) => app.startup_id === startupId);
        setAlreadyApplied(applied);
      } catch (err) {
        setError('Failed to load startup details.');
      } finally {
        setLoading(false);
      }
    }

    if (startupId) {
      loadData();
    }
  }, [startupId]);

  const handleSubmit = async (formData) => {
    await applyToStartup(formData);
    navigate('/dashboard/applications');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">
          Loading application form...
        </p>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <BackButton fallbackPath="/dashboard/startups" />
        <p className="mt-6 text-ink-red">{error || 'Startup not found.'}</p>
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="mx-auto max-w-2xl py-12 px-6">
        <BackButton fallbackPath="/dashboard/startups" />
        <div className="blueprint-card mt-6 text-center p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber/20 text-amber">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-paper">
            You've Already Applied to {startup.title}
          </h2>
          <p className="mt-2 text-sm text-paper-dim">
            You have a pending or processed application for this startup. You can view or update your existing application from your dashboard.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/dashboard/applications">
              <Button>View My Applications</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <BackButton />
      <div className="mt-6">
        <ApplicationForm startup={startup} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
