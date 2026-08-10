import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Search, ExternalLink, Code2, Globe, Eye, Check, X } from 'lucide-react';

import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import StampBadge from '../../components/ui/StampBadge.jsx';

import { useStartup } from '../../hooks/useStartup.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { getStartupApplications, updateApplicationStatus, getResumeDownloadUrl } from '../../services/application.service.js';

const SORT_OPTIONS = [
  { value: 'applied_at:DESC', label: 'Latest First' },
  { value: 'applied_at:ASC', label: 'Oldest First' },
];

export default function FounderApplicationsPage() {
  const navigate = useNavigate();
  const { startups, loadStartups } = useStartup();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('applied_at:DESC');
  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput, 400);

  useEffect(() => {
    if (startups.length === 0) {
      loadStartups();
    }
  }, [loadStartups, startups.length]);

  // Default selected startup to the first one available if not selected yet
  useEffect(() => {
    if (startups.length > 0 && !selectedStartupId) {
      setSelectedStartupId(startups[0].id);
    }
  }, [startups, selectedStartupId]);

  const selectedStartup = useMemo(
    () => startups.find((s) => String(s.id) === String(selectedStartupId)),
    [startups, selectedStartupId]
  );

  useEffect(() => {
    const load = async () => {
      if (!selectedStartupId) {
        setApplications([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [sortBy, order] = sortOrder.split(':');
        const params = {
          search,
          status: statusFilter === 'all' ? '' : statusFilter,
          sortBy,
          order,
        };

        const apps = await getStartupApplications(selectedStartupId, params);
        setApplications(Array.isArray(apps) ? apps : []);
      } catch (err) {
        setError("Couldn't load applications for this startup.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [selectedStartupId, search, statusFilter, sortOrder]);

  const handleDecision = async (applicationId, nextStatus) => {
    setUpdatingId(applicationId);
    try {
      const updated = await updateApplicationStatus(applicationId, nextStatus);
      setApplications((list) =>
        list.map((a) => (a.id === applicationId ? { ...a, status: updated.status } : a))
      );
    } catch (err) {
      setError("Couldn't update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-cyan/20 p-2 text-cyan">
          <FileText size={22} />
        </div>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan">
            Founder Hub
          </p>
          <h1 className="font-display text-2xl font-bold text-paper">Applicant Reviews</h1>
          <p className="mt-0.5 text-sm text-paper-dim">
            Select a startup to review and manage incoming developer applications.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid gap-4 sm:grid-cols-4">
        {/* Startup Selection (Crucial!) */}
        <Select
          value={selectedStartupId}
          onChange={(e) => setSelectedStartupId(e.target.value)}
        >
          {startups.length === 0 ? (
            <option value="">No Startups Found</option>
          ) : (
            startups.map((startup) => (
              <option key={startup.id} value={startup.id}>
                {startup.title}
              </option>
            ))
          )}
        </Select>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-faint" size={16} />
          <Input
            placeholder="Search name, email, skills..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </Select>

        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Applications Cards */}
      <div className="space-y-4">
        {error && (
          <p className="rounded-lg border border-ink-red/30 bg-ink-red/10 p-3 text-sm text-ink-red">
            {error}
          </p>
        )}

        {loading ? (
          <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">
            Loading applications...
          </p>
        ) : applications.length === 0 ? (
          <EmptyState
            title={selectedStartup ? `No applications for ${selectedStartup.title}` : 'Select a Startup'}
            body="No developer applications match your current filter criteria."
          />
        ) : (
          applications.map((app) => (
            <div key={app.id} className="blueprint-card p-6 space-y-4">
              {/* Applicant Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan/20 font-bold text-cyan border border-cyan/30">
                    {(app.full_name?.[0] || app.email?.[0] || 'A').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-paper">
                      {app.full_name || app.email}
                    </h3>
                    <p className="font-mono text-xs text-paper-dim">
                      @{app.username || 'developer'} · {app.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StampBadge status={app.status} />
                </div>
              </div>

              {/* Cover Letter Preview */}
              {app.message && (
                <div className="rounded-lg border border-blueprint-line bg-blueprint-900/60 p-4">
                  <p className="font-mono text-xs uppercase text-paper-faint">Cover Letter</p>
                  <p className="mt-1 text-sm text-paper-dim line-clamp-3">{app.message}</p>
                </div>
              )}

              {/* Skills & Experience */}
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.isArray(app.skills) && app.skills.length > 0 && (
                  <div>
                    <p className="font-mono text-xs uppercase text-paper-faint">Skills</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {app.skills.map((skill) => (
                        <span key={skill} className="rounded bg-cyan/20 px-2.5 py-0.5 text-xs text-cyan">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {app.relevant_experience && (
                  <div>
                    <p className="font-mono text-xs uppercase text-paper-faint">Experience</p>
                    <p className="mt-1 text-xs text-paper-dim line-clamp-2">{app.relevant_experience}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons & Links */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blueprint-line pt-4">
                <div className="flex flex-wrap items-center gap-3">
                  {app.resume_filename && (
                    <a
                      href={getResumeDownloadUrl(app.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-cyan/10 px-3 py-1.5 text-xs font-medium text-cyan hover:bg-cyan/20 transition-colors"
                    >
                      <FileText size={14} />
                      View CV ({app.resume_filename})
                    </a>
                  )}

                  {app.github_url && (
                    <a
                      href={app.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-paper-dim hover:text-cyan"
                    >
                      <Code2 size={13} />
                      GitHub
                    </a>
                  )}

                  {app.portfolio_url && (
                    <a
                      href={app.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-paper-dim hover:text-cyan"
                    >
                      <Globe size={13} />
                      Portfolio
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/founder/applications/${app.id}`}>
                    <Button variant="outline" className="px-3 py-1.5 text-xs">
                      <Eye size={14} className="mr-1" />
                      Full Details
                    </Button>
                  </Link>

                  {app.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        className="px-3 py-1.5 text-xs text-green-400 border-green-500/40 hover:bg-green-500/10"
                        loading={updatingId === app.id}
                        onClick={() => handleDecision(app.id, 'accepted')}
                      >
                        <Check size={14} className="mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        className="px-3 py-1.5 text-xs"
                        loading={updatingId === app.id}
                        onClick={() => handleDecision(app.id, 'rejected')}
                      >
                        <X size={14} className="mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
