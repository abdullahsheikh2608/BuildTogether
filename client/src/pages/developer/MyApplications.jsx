import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Eye, Edit } from 'lucide-react';

import EmptyState from '../../components/ui/EmptyState.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import StampBadge from '../../components/ui/StampBadge.jsx';
import BackButton from '../../components/common/BackButton.jsx';

import { getMyApplications } from '../../services/application.service.js';

const SEARCH_DEBOUNCE_MS = 500;
const DEFAULT_LIMIT = 10;
const EDITABLE_STATUSES = ['pending'];

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
    <div className="w-full">
      <BackButton fallbackPath="/dashboard" />
      <p className="text-sm font-medium text-cyan">Developer</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-paper">My Applications</h1>
      <p className="mt-1 text-sm text-paper-dim">Track all your submitted applications.</p>

      {error && (
        <p className="mt-6 rounded-lg border border-ink-red/20 bg-ink-red/5 px-4 py-3 text-sm text-ink-red">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-faint"
          />
          <Input
            id="application-search"
            placeholder="Search by title or tagline..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="[&>input]:pl-9"
          />
        </div>

        <Select id="application-status-filter" value={status} onChange={handleStatusChange}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </Select>

        <Select id="application-sort-filter" value={`${sortBy}:${order}`} onChange={handleSortChange}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading…</p>
        ) : applicationList.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications"
            body={
              hasActiveFilters
                ? 'Try a different search term or clear your filters.'
                : "You haven't applied to any startup yet."
            }
          />
        ) : (
          applicationList.map((application) => {
            const isEditable = EDITABLE_STATUSES.includes(application.status);

            return (
              <div key={application.id} className="blueprint-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-semibold text-paper">{application.title}</h2>
                    <p className="mt-1 text-sm text-paper-dim">{application.tagline}</p>
                  </div>
                  <StampBadge status={application.status} />
                </div>

                {application.resume_filename && (
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-paper-dim">
                    <FileText size={14} className="text-paper-faint" />
                    {application.resume_filename}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-blueprint-line pt-3">
                  <span className="text-xs text-paper-faint">
                    Updated {new Date(application.updated_at || application.applied_at).toLocaleDateString()}
                  </span>

                  <div className="flex gap-2">
                    <Button
                      as={Link}
                      to={`/dashboard/applications/${application.id}`}
                      variant="outline"
                      className="px-3 py-1.5 text-xs"
                    >
                      <Eye size={13} />
                      View
                    </Button>
                    {isEditable && (
                      <Button
                        as={Link}
                        to={`/dashboard/applications/${application.id}/edit`}
                        className="px-3 py-1.5 text-xs"
                      >
                        <Edit size={13} />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!loading && applicationList.length > 0 && (
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={goToPreviousPage} disabled={isFirstPage}>
            Previous
          </Button>
          <span className="text-sm text-paper-dim">Page {page}</span>
          <Button variant="outline" onClick={goToNextPage} disabled={isLastPage}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}