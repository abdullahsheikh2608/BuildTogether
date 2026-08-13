import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import BackButton from '../../components/common/BackButton.jsx';
import ApplicationForm from '../../components/applications/ApplicationForm.jsx';
import StampBadge from '../../components/ui/StampBadge.jsx';
import { getApplicationById, updateApplicationDetails } from '../../services/application.service.js';

// Matches EDITABLE_APPLICATION_STATUSES on the backend: editing while
// "rejected" is a re-application and resets status back to "pending".
const EDITABLE_STATUSES = ['pending', 'rejected'];

export default function ApplicationEditPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    async function loadApp() {
      try {
        setLoading(true);
        const data = await getApplicationById(applicationId);
        setApplication(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load application details.');
      } finally {
        setLoading(false);
      }
    }

    if (applicationId) {
      loadApp();
    }
  }, [applicationId]);

  const handleSubmit = async (payload, resumeFile) => {
    setSubmitting(true);
    setSubmitError('');

    try {
      await updateApplicationDetails(applicationId, payload, resumeFile);
      navigate('/dashboard/applications');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Unable to update application. Try again.');
    } finally {
      setSubmitting(false);
    }
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

  const isEditable = EDITABLE_STATUSES.includes(application.status);

  if (!isEditable) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <BackButton />
        <div className="blueprint-card mt-6 p-8 text-center">
          <div className="mb-3 flex justify-center">
            <StampBadge status={application.status} />
          </div>
          <h2 className="font-display text-xl font-semibold text-paper">
            Application Cannot Be Edited
          </h2>
          <p className="mt-2 text-sm text-paper-dim">
            This application has status "
            <span className="font-semibold capitalize text-paper">{application.status}</span>".
            Only pending or rejected applications can be modified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <BackButton />

      <div className="mt-4 blueprint-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-cyan">Edit Application</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-paper">
              {application.startup_title}
            </h1>
          </div>
          <StampBadge status={application.status} />
        </div>
      </div>

      <div className="mt-6 blueprint-card p-6">
        {submitError && (
          <p className="mb-5 rounded-lg border border-ink-red/20 bg-ink-red/5 px-4 py-3 text-sm text-ink-red">
            {submitError}
          </p>
        )}

        <ApplicationForm
          startup={{
            id: application.startup_id,
            title: application.startup_title,
            tagline: application.startup_tagline,
          }}
          initialValues={{
            message: application.message || '',
            experience: application.experience || '',
            github_url: application.github_url || '',
            portfolio_url: application.portfolio_url || '',
            skills: application.skills || [],
          }}
          existingResumeName={application.resume_original_name}
          submitting={submitting}
          submitLabel="Save Changes"
          isEditing
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/applications')}
        />
      </div>
    </div>
  );
}