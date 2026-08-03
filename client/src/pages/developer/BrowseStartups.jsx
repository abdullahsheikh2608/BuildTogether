import { useEffect, useState } from 'react';
import DeveloperStartupCard from '../../components/startup/DeveloperStartupCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import { useStartup } from '../../hooks/useStartup.js';

const SEARCH_DEBOUNCE_MS = 500;
const DEFAULT_LIMIT = 10;

const SORT_OPTIONS = [
  { value: 'created_at:DESC', label: 'Latest First' },
  { value: 'created_at:ASC', label: 'Oldest First' },
  { value: 'title:ASC', label: 'Title A-Z' },
  { value: 'title:DESC', label: 'Title Z-A' },
];

export default function BrowseStartups() {
  const { startups, loading, error, loadStartups } = useStartup();

  // Raw text as typed by the user; debounced into `search` before hitting the API.
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
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
    loadStartups({
      search,
      status: status === 'all' ? '' : status,
      sortBy,
      order,
      page,
      limit,
    });
  }, [search, status, sortBy, order, page, limit, loadStartups]);

  const startupList = Array.isArray(startups) ? startups : [];
  const hasActiveFilters = search.trim() !== '' || status !== 'all';

  const isFirstPage = page <= 1;
  const isLastPage = startupList.length < limit;

  const goToPreviousPage = () => setPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setPage((prev) => prev + 1);

  return (
    <div className="mx-auto max-w-6xl">
      <main className="mx-auto max-w-6xl px-6 py-10">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan">
          Developer
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold text-paper">Startups</h1>
        <p className="mt-2 text-paper-dim">Find startups that match your skills.</p>
        {error && <p className="mt-6 text-red-500">{error}</p>}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Input
            id="startup-search"
            placeholder="Search by title or tagline..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <Select id="status-filter" value={status} onChange={handleStatusChange}>
            <option value="all" className="bg-blueprint-900">
              All statuses
            </option>
            <option value="open" className="bg-blueprint-900">
              Open
            </option>
            <option value="closed" className="bg-blueprint-900">
              Closed
            </option>
          </Select>

          <Select
            id="sort-filter"
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
          ) : startupList.length === 0 ? (
            <EmptyState
              title="No matching startups"
              body={
                hasActiveFilters
                  ? 'Try a different search term or clear your filters.'
                  : 'There are currently no startups accepting developers.'
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {startupList.map((startup) => (
                <DeveloperStartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          )}
        </div>

        {!loading && startupList.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousPage}
              disabled={isFirstPage}
            >
              Previous
            </Button>

            <span className="font-mono text-xs uppercase tracking-widest text-paper-faint">
              Page {page}
            </span>

            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={isLastPage}
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}