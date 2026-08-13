import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import StampBadge from '../../components/ui/StampBadge.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import { getStartupById } from '../../services/startup.service.js';

import {
  getStartupApplications,
  updateApplicationStatus,
  openApplicationResume,
} from '../../services/application.service.js';

const SEARCH_DEBOUNCE_MS = 500;
const DEFAULT_LIMIT = 10;

const SORT_OPTIONS = [
  { value: 'applied_at:DESC', label: 'Latest First' },
  { value: 'applied_at:ASC', label: 'Oldest First' },
];

export default function StartupApplications() {
  const { id } = useParams();

  const [startup, setStartup] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Raw text as typed by the user; debounced into `search` before hitting the API.
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('applied_at');
  const [order, setOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);

  // Startup details only need to load once per id — independent of filters.
  useEffect(() => {
    getStartupById(id)
      .then(setStartup)
      .catch(() => setError("Couldn't load applications. Refresh to try again."));
  }, [id]);

  // Debounce the search input by 500ms, then reset back to page 1.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    const [nextSortBy, nextOrder] = e.target.value.split(':');
    setSortBy(nextSortBy);
    setOrder(nextOrder);
    setPage(1);
  };

  // Refetch from the backend whenever any of the query dependencies change.
  useEffect(() => {
    let cancelled = false;

    const loadApplications = async () => {
      setLoading(true);
      setError('');

      try {
        const apps = await getStartupApplications(id, {
          search,
          status: status === 'all' ? '' : status,
          sortBy,
          order,
          page,
          limit,
        });

        if (!cancelled) {
          setApplications(Array.isArray(apps) ? apps : []);
        }
      } catch {
        if (!cancelled) {
          setError("Couldn't load applications. Refresh to try again.");
          setApplications([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, [id, search, status, sortBy, order, page, limit]);

  const handleDecision = async (applicationId, nextStatus) => {
    setUpdatingId(applicationId);
    try {
      const updated = await updateApplicationStatus(applicationId, nextStatus);
      setApplications((list) =>
        list.map((a) => (a.id === applicationId ? { ...a, status: updated.status } : a))
      );
    } catch {
      setError("Couldn't update that application. Try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const appList = Array.isArray(applications) ? applications : [];
  const hasActiveFilters = search.trim() !== '' || status !== 'all';

  const isFirstPage = page <= 1;
  const isLastPage = appList.length < limit;

  const goToPreviousPage = () => setPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setPage((prev) => prev + 1);

  return (
    <div className="w-full">
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

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Input
          id="application-review-search"
          placeholder="Search by name, username, or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <Select id="application-review-status-filter" value={status} onChange={handleStatusChange}>
          <option value="all" className="bg-blueprint-900">
            All statuses
          </option>
          <option value="pending" className="bg-blueprint-900">
            Pending
          </option>
          <option value="accepted" className="bg-blueprint-900">
            Accepted
          </option>
          <option value="rejected" className="bg-blueprint-900">
            Rejected
          </option>
          <option value="removed" className="bg-blueprint-900">
            Removed
          </option>
        </Select>

        <Select
          id="application-review-sort-filter"
          value={`${sortBy}:${order}`}
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-blueprint-900">
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {loading ? (
          <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading…</p>
        ) : appList.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? 'No matching applications' : 'No applications yet'}
            body={
              hasActiveFilters
                ? 'Try a different search term or clear your filters.'
                : 'Once developers apply to this startup, their applications will show up here for review.'
            }
          />
        ) : (
          appList.map((app) => (
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

              {app.relevant_experience && (
                <p className="rounded-sm bg-blueprint-800/40 px-3 py-2 text-sm text-paper-dim">
                  <span className="font-semibold text-paper">Experience: </span>
                  {app.relevant_experience}
                </p>
              )}

              {Array.isArray(app.skills) && app.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {app.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-cyan-dim px-2.5 py-1 text-xs font-medium text-cyan">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                {app.github_url && (
                  <a href={app.github_url} target="_blank" rel="noopener noreferrer" className="font-medium text-cyan hover:underline">
                    GitHub
                  </a>
                )}
                {app.portfolio_url && (
                  <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="font-medium text-cyan hover:underline">
                    Portfolio
                  </a>
                )}
                {app.resume_filename && (
                  <button
                    type="button"
                    onClick={() => openApplicationResume(app.id, app.resume_filename)}
                    className="font-medium text-cyan hover:underline"
                  >
                    {app.resume_filename}
                  </button>
                )}
              </div>

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

      {!loading && appList.length > 0 && (
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={goToPreviousPage} disabled={isFirstPage}>
            Previous
          </Button>

          <span className="font-mono text-xs uppercase tracking-widest text-paper-faint">
            Page {page}
          </span>

          <Button variant="outline" onClick={goToNextPage} disabled={isLastPage}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}