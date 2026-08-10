import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BackButton from '../../components/common/BackButton.jsx';
import StampBadge from '../../components/ui/StampBadge.jsx';
import Button from '../../components/ui/Button.jsx';
import ResumeViewer from '../../components/applications/ResumeViewer.jsx';
import { getApplicationById } from '../../services/application.service.js';
import { Edit3, ExternalLink, Code2, Globe, Calendar, Clock } from 'lucide-react';

export default function DeveloperApplicationDetailsPage() {
  const { applicationId } = useParams();
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">
          Loading application details...
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

      {/* Startup Header Card */}
      <div className="blueprint-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan">
              Application Details
            </span>
            <h1 className="mt-1 font-display text-2xl font-bold text-paper">
              {application.startup_title}
            </h1>
            <p className="mt-1 text-sm text-paper-dim">{application.startup_tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            <StampBadge status={application.status} />
            {application.status === 'pending' && (
              <Link to={`/dashboard/applications/${application.id}/edit`}>
                <Button className="px-4 py-2 text-xs">
                  <Edit3 size={14} className="mr-1.5" />
                  Edit Application
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-blueprint-line pt-4 font-mono text-xs text-paper-faint">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-cyan" />
            <span>Submitted: {new Date(application.applied_at).toLocaleDateString()}</span>
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
          {application.message || 'No cover message provided.'}
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
        {/* Skills */}
        <div className="blueprint-card p-6 space-y-3">
          <h3 className="font-display text-lg font-semibold text-paper">Skills Submitted</h3>
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

        {/* External Links */}
        <div className="blueprint-card p-6 space-y-3">
          <h3 className="font-display text-lg font-semibold text-paper">Links & Profiles</h3>
          <div className="space-y-3">
            {application.github_url ? (
              <a
                href={application.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-blueprint-line bg-slate-900/60 p-3 text-sm text-paper hover:border-cyan transition-colors"
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
                className="flex items-center gap-2 rounded-lg border border-blueprint-line bg-slate-900/60 p-3 text-sm text-paper hover:border-cyan transition-colors"
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

      {/* Resume Viewer */}
      <div className="blueprint-card p-6">
        <ResumeViewer
          applicationId={application.id}
          fileName={application.resume_filename}
        />
      </div>
    </div>
  );
}
