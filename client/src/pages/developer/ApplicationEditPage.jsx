import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../components/common/BackButton.jsx';
import ApplicationForm from '../../components/applications/ApplicationForm.jsx';
import { getApplicationById, updateApplication } from '../../services/application.service.js';
import StampBadge from '../../components/ui/StampBadge.jsx';

export default function ApplicationEditPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadApp() {
      try {
        setLoading(true);
        const data = await getApplicationById(applicationId);
        setApplication(data);
      } catch (err) {
        setError('Failed to load application details.');
      } finally {
        setLoading(false);
      }
    }

    if (applicationId) {
      loadApp();
    }
  }, [applicationId]);

  const handleSubmit = async (formData) => {
    await updateApplication(applicationId, formData);
    navigate('/dashboard/applications');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">
          Loading application...
        </p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <BackButton />
        <p className="mt-6 text-ink-red">{error || 'Application not found.'}</p>
      </div>
    );
  }

  if (application.status !== 'pending') {
    return (
      <div className="mx-auto max-w-2xl py-12 px-6">
        <BackButton />
        <div className="blueprint-card mt-6 p-8 text-center">
          <div className="flex justify-center mb-3">
            <StampBadge status={application.status} />
          </div>
          <h2 className="font-display text-xl font-semibold text-paper">
            Application Cannot Be Edited
          </h2>
          <p className="mt-2 text-sm text-paper-dim">
            This application has status "<span className="capitalize font-semibold text-paper">{application.status}</span>". Only pending applications can be modified.
          </p>
        </div>
      </div>
    );
  }

  const startupMock = {
    id: application.startup_id,
    title: application.startup_title,
    tagline: application.startup_tagline,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <BackButton />
      <div className="mt-6">
        <ApplicationForm
          startup={startupMock}
          initialData={application}
          onSubmit={handleSubmit}
          isEditing={true}
        />
      </div>
    </div>
  );
}
