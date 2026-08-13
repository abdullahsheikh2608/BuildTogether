import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../components/common/BackButton.jsx';
import StampBadge from '../../components/ui/StampBadge.jsx';
import Button from '../../components/ui/Button.jsx';
import ResumeViewer from '../../components/applications/ResumeViewer.jsx';
import { getApplicationById, updateApplicationStatus } from '../../services/application.service.js';
import { Code2, Globe, ExternalLink, User, Mail, Calendar, Clock, Check, X } from 'lucide-react';

export default function FounderApplicationDetailsPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

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

  const handleStatusChange = async (nextStatus) => {
    try {
      setUpdating(true);
      const updated = await updateApplicationStatus(applicationId, nextStatus);
      setApplication((prev) => ({ ...prev, status: updated.status }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">
          Loading applicant details...
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <BackButton />

      {/* Applicant & Startup Overview Header */}
      <div className="blueprint-card p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan/20 text-cyan font-bold text-xl border border-cyan/40">
              {application.developer_avatar ? (
                <img
                  src={application.developer_avatar}
                  alt={application.developer_name || 'Applicant'}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                (application.developer_name?.[0] || application.developer_email?.[0] || 'A').toUpperCase()
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold text-paper">
                  {application.developer_name || 'Applicant'}
                </h1>
                {application.developer_username && (
                  <span className="font-mono text-xs text-paper-dim">
                    @{application.developer_username}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-paper-dim flex items-center gap-1.5">
                <Mail size={12} className="text-cyan" />
                {application.developer_email}
              </p>
              <p className="mt-1 font-mono text-xs text-cyan">
                Applied for: <span className="text-paper font-semibold">{application.startup_title}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <StampBadge status={application.status} />

            {application.status === 'pending' && (
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  className="px-3 py-1.5 text-xs text-green-400 border-green-500/40 hover:bg-green-500/10"
                  loading={updating}
                  onClick={() => handleStatusChange('accepted')}
                >
                  <Check size={14} className="mr-1" />
                  Accept
                </Button>
                <Button
                  variant="danger"
                  className="px-3 py-1.5 text-xs"
                  loading={updating}
                  onClick={() => handleStatusChange('rejected')}
                >
                  <X size={14} className="mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-blueprint-line pt-4 font-mono text-xs text-paper-faint">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-cyan" />
            <span>Applied: {new Date(application.applied_at).toLocaleDateString()}</span>
          </div>
          {application.updated_at && (
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-cyan" />
              <span>Last updated: {new Date(application.updated_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cover Message */}
      <div className="blueprint-card p-6 space-y-3">
        <h3 className="font-display text-lg font-semibold text-paper">Cover Message</h3>
        <p className="whitespace-pre-wrap text-sm text-paper-dim leading-relaxed">
          {application.message || 'No message provided.'}
        </p>
      </div>

      {/* Relevant Experience */}
      {application.relevant_experience && (
        <div className="blueprint-card p-6 space-y-3">
          <h3 className="font-display text-lg font-semibold text-paper">Relevant Experience</h3>
          <p className="whitespace-pre-wrap text-sm text-paper-dim leading-relaxed">
            {application.relevant_experience}
          </p>
        </div>
      )}

      {/* Skills & Links */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="blueprint-card p-6 space-y-3">
          <h3 className="font-display text-lg font-semibold text-paper">Skills</h3>
          {Array.isArray(application.skills) && application.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {application.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-cyan/20 px-3 py-1 text-xs font-medium text-cyan"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-paper-faint">No specific skills listed.</p>
          )}

          {application.availability && (
            <div className="mt-4 border-t border-blueprint-line pt-3">
              <p className="text-xs font-mono uppercase text-paper-faint">Availability</p>
              <p className="text-sm font-medium text-paper mt-0.5">{application.availability}</p>
            </div>
          )}
        </div>

        <div className="blueprint-card p-6 space-y-3">
          <h3 className="font-display text-lg font-semibold text-paper">Links & Portfolios</h3>
          <div className="space-y-3">
            {application.github_url ? (
              <a
                href={application.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-blueprint-line bg-blueprint-800 p-3 text-sm text-paper transition-colors hover:border-cyan hover:bg-cyan-dim"
              >
                <Code2 size={18} className="text-cyan" />
                <span className="truncate">{application.github_url}</span>
                <ExternalLink size={14} className="ml-auto text-paper-faint" />
              </a>
            ) : (
              <p className="text-sm text-paper-faint">No GitHub URL provided.</p>
            )}

            {application.portfolio_url ? (
              <a
                href={application.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-blueprint-line bg-blueprint-800 p-3 text-sm text-paper transition-colors hover:border-cyan hover:bg-cyan-dim"
              >
                <Globe size={18} className="text-cyan" />
                <span className="truncate">{application.portfolio_url}</span>
                <ExternalLink size={14} className="ml-auto text-paper-faint" />
              </a>
            ) : (
              <p className="text-sm text-paper-faint">No Portfolio URL provided.</p>
            )}
          </div>
        </div>
      </div>

      {/* Resume Previewer / Downloader */}
      <div className="blueprint-card p-6">
        <ResumeViewer
          applicationId={application.id}
          fileName={application.resume_filename}
        />
      </div>
    </div>
  );
}