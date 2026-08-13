import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton.jsx';
import Button from '../../components/ui/Button.jsx';

import { getStartupById } from '../../services/startup.service.js';
import { applyToStartup, getMyApplications } from '../../services/application.service.js';

export default function StartupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [startupData, applications] = await Promise.all([
          getStartupById(id),
          getMyApplications(),
        ]);

        setStartup(startupData);

        const applied = Array.isArray(applications) && applications.some((app) => app.startup_id === id);

        setAlreadyApplied(applied);
      } catch {
        setError('Unable to load startup.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  function handleApply() {
    navigate(`/dashboard/startups/${id}/apply`);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <BackButton fallbackPath="/dashboard/startups" />
        <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading startup details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <BackButton fallbackPath="/dashboard/startups" />
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <BackButton fallbackPath="/dashboard/startups" />

        <h1 className="mt-6 text-3xl font-bold text-paper">{startup.title}</h1>

        <p className="mt-2 text-paper-dim">{startup.tagline}</p>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-paper">Description</h2>

          <p className="mt-3 text-paper-dim">{startup.description}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-paper">Tech Stack</h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {startup.tech_stack?.map((tech) => (
              <span key={tech} className="rounded bg-cyan/20 px-3 py-1 text-cyan">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-paper">Required Roles</h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {startup.required_roles?.map((role) => (
              <span key={role} className="rounded bg-indigo/15 px-3 py-1 font-medium text-indigo">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Button onClick={handleApply} disabled={applying || alreadyApplied}>
            {alreadyApplied ? 'Already Applied' : applying ? 'Applying...' : 'Apply Now'}
          </Button>
        </div>
      </main>
    </div>
  );
}