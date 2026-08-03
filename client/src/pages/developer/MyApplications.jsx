import { useEffect, useState } from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';

import { getMyApplications } from '../../services/application.service.js';

const SEARCH_DEBOUNCE_MS = 500;
const DEFAULT_LIMIT = 10;

const SORT_OPTIONS = [
  { value: 'applied_at:DESC', label: 'Latest First' },
  { value: 'applied_at:ASC', label: 'Oldest First' },
];

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Raw text as typed by the user; debounced into `search` before hitting the API.
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('applied_at');
  const [order, setOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);

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
        const data = await getMyApplications({
          search,
          status: status === 'all' ? '' : status,
          sortBy,
          order,
          page,
          limit,
        });

        if (!cancelled) {
          setApplications(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load your applications.');
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
  }, [search, status, sortBy, order, page, limit]);

  const applicationList = Array.isArray(applications) ? applications : [];
  const hasActiveFilters = search.trim() !== '' || status !== 'all';

  const isFirstPage = page <= 1;
  const isLastPage = applicationList.length < limit;

  const goToPreviousPage = () => setPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setPage((prev) => prev + 1);

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

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Input
            id="application-search"
            placeholder="Search by title or tagline..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <Select id="application-status-filter" value={status} onChange={handleStatusChange}>
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
          </Select>

          <Select
            id="application-sort-filter"
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

        <div className="mt-8">
          {loading ? (
            <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading...</p>
          ) : applicationList.length === 0 ? (
            <EmptyState
              title="No Applications"
              body={
                hasActiveFilters
                  ? 'Try a different search term or clear your filters.'
                  : "You haven't applied to any startup yet."
              }
            />
          ) : (
            <div className="space-y-5">
              {applicationList.map((application) => (
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

        {!loading && applicationList.length > 0 && (
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
      </main>
    </div>
  );
}