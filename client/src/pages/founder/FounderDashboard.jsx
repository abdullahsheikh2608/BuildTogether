import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import StartupCard from '../../components/startup/StartupCard.jsx';
import StartupFormModal from '../../components/startup/StartupFormModal.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useStartup } from '../../hooks/useStartup.js';
import {
  createStartup,
  updateStartup,
  deleteStartup,
} from '../../services/startup.service.js';

const SEARCH_DEBOUNCE_MS = 500;
const DEFAULT_LIMIT = 10;

const SORT_OPTIONS = [
  { value: 'created_at:DESC', label: 'Latest First' },
  { value: 'created_at:ASC', label: 'Oldest First' },
  { value: 'title:ASC', label: 'Title A-Z' },
  { value: 'title:DESC', label: 'Title Z-A' },
];

export default function FounderDashboard() {
  const { user } = useAuth();
  const {
    startups,
    loading,
    error: loadError,
    loadStartups,
    selectedStartup,
    setSelectedStartup,
    setStartups,
    setError,
  } = useStartup();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const openCreate = () => {
    setSelectedStartup(null);
    setFormOpen(true);
  };

  const openEdit = (startup) => {
    setSelectedStartup(startup);
    setFormOpen(true);
  };

  const startupList = Array.isArray(startups) ? startups : [];
  const hasActiveFilters = search.trim() !== '' || status !== 'all';

  const isFirstPage = page <= 1;
  const isLastPage = startupList.length < limit;

  const goToPreviousPage = () => setPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setPage((prev) => prev + 1);

  const handleFormSubmit = async (payload) => {
    if (selectedStartup) {
      const updated = await updateStartup(selectedStartup.id, payload);
      setStartups((list) =>
        (Array.isArray(list) ? list : []).map((s) => (s.id === updated.id ? updated : s))
      );
    } else {
      const created = await createStartup(payload);
      setStartups((list) => [created, ...(Array.isArray(list) ? list : [])]);
    }
    setFormOpen(false);
    setSelectedStartup(null);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteStartup(deleteTarget.id);
      setStartups((list) =>
        (Array.isArray(list) ? list : []).filter((s) => s.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
    } catch {
      setError("Couldn't delete that startup. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            Founder · Console
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper">Your startups</h1>
        </div>
        <Button onClick={openCreate}>New startup</Button>
      </div>

      {loadError && (
        <p className="mt-6 rounded-sm border border-ink-red/40 bg-ink-red/10 px-3 py-2 font-mono text-xs text-ink-red">
          {loadError}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-faint"
          />
          <Input
            id="founder-startup-search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search your startups..."
            className="[&>input]:pl-9"
          />
        </div>

        <Select id="founder-status-filter" value={status} onChange={handleStatusChange}>
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
          id="founder-sort-filter"
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
          <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading…</p>
        ) : startupList.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              title="No matching startups"
              body="Try a different search term or clear your filters."
            />
          ) : (
            <EmptyState
              title="No startups posted yet"
              body="Draft your first blueprint — add the tech stack and roles you need, and developers can start applying."
              action={<Button onClick={openCreate}>Post your first startup</Button>}
            />
          )
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {startupList.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                role="founder"
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && startupList.length > 0 && (
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

      <StartupFormModal
        key={formOpen ? (selectedStartup?.id ?? 'new') : 'closed'}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedStartup(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        confirming={deleting}
        title="Delete this startup?"
        body={`"${deleteTarget?.title}" and all its applications will be permanently removed. This can't be undone.`}
      />
    </div>
  );
}