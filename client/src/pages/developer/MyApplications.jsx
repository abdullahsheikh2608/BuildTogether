import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import StampBadge from '../../components/ui/StampBadge.jsx';
import { getMyApplications } from '../../services/application.service.js';
import { FileText, Eye, Edit3, Calendar, Clock } from 'lucide-react';

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

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('applied_at');
  const [order, setOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);

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
    <div className="w-full space-y-6">
      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan">
          Developer
        </span>
        <h1 className="mt-1 font-display text-3xl font-bold text-paper">My Applications</h1>
        <p className="mt-1 text-sm text-paper-dim">Track and manage all your submitted startup applications.</p>
      </div>

      {error && (
        <p className="rounded-lg border border-ink-red/30 bg-ink-red/10 p-3 text-sm text-ink-red">
          {error}
        </p>
      )}

      {/* Search & Filters Bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          id="application-search"
          placeholder="Search applications..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <Select id="application-status-filter" value={status} onChange={handleStatusChange}>
          <option value="all" className="bg-blueprint-900">
            All Statuses
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

      {/* Applications List */}
      <div>
        {loading ? (
          <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading applications...</p>
        ) : applicationList.length === 0 ? (
          <EmptyState
            title="No Applications Found"
            body={
              hasActiveFilters
                ? 'Try adjusting your search terms or filters.'
                : "You haven't submitted any startup applications yet."
            }
          />
        ) : (
          <div className="space-y-4">
            {applicationList.map((application) => (
              <div
                key={application.id}
                className="blueprint-card p-5 transition-all hover:border-cyan/40"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-paper">
                      {application.title}
                    </h2>
                    {application.tagline && (
                      <p className="mt-1 text-sm text-paper-dim">{application.tagline}</p>
                    )}
                  </div>

                  <StampBadge status={application.status} />
                </div>

                {/* Cover Message Preview */}
                {application.message && (
                  <p className="mt-3 rounded-lg border border-blueprint-line bg-blueprint-900/60 p-3 text-sm text-paper-dim line-clamp-2">
                    {application.message}
                  </p>
                )}

                {/* Resume filename badge & timestamps */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-blueprint-line pt-3 text-xs text-paper-faint">
                  <div className="flex flex-wrap items-center gap-4">
                    {application.resume_filename && (
                      <span className="flex items-center gap-1.5 font-mono text-cyan">
                        <FileText size={14} />
                        {application.resume_filename}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      Applied: {new Date(application.applied_at).toLocaleDateString()}
                    </span>
                    {application.updated_at && (
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        Updated: {new Date(application.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link to={`/dashboard/applications/${application.id}`}>
                      <Button variant="outline" className="px-3 py-1 text-xs">
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                    </Link>

                    {application.status === 'pending' && (
                      <Link to={`/dashboard/applications/${application.id}/edit`}>
                        <Button className="px-3 py-1 text-xs">
                          <Edit3 size={14} className="mr-1" />
                          Edit
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && applicationList.length > 0 && (
        <div className="flex items-center justify-between pt-2">
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