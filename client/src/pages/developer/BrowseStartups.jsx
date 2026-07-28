import { useEffect, useMemo, useState } from 'react';
import DeveloperStartupCard from '../../components/startup/DeveloperStartupCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import { useStartup } from '../../hooks/useStartup.js';

export default function BrowseStartups() {
  const { startups, loading, error, loadStartups } = useStartup();

  const [search, setSearch] = useState('');
  const [techFilter, setTechFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadStartups();
  }, [loadStartups]);

  const startupList = Array.isArray(startups) ? startups : [];

  const techOptions = useMemo(() => {
    const techs = new Set();

    startupList.forEach((startup) => {
      (startup.tech_stack ?? []).forEach((tech) => techs.add(tech));
    });

    return Array.from(techs).sort((a, b) => a.localeCompare(b));
  }, [startupList]);

  const filteredStartups = useMemo(() => {
    const query = search.trim().toLowerCase();

    return startupList.filter((startup) => {
      const matchesSearch =
        !query ||
        startup.title?.toLowerCase().includes(query) ||
        startup.tagline?.toLowerCase().includes(query) ||
        startup.description?.toLowerCase().includes(query);

      const matchesTech =
        techFilter === 'all' ||
        (startup.tech_stack ?? []).includes(techFilter);

      const matchesStatus =
        statusFilter === 'all' || startup.status === statusFilter;

      return matchesSearch && matchesTech && matchesStatus;
    });
  }, [startupList, search, techFilter, statusFilter]);

  const hasActiveFilters =
    search.trim() !== '' || techFilter !== 'all' || statusFilter !== 'all';

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
            placeholder="Search by title, tagline, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            id="tech-filter"
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
          >
            <option value="all" className="bg-blueprint-900">
              All tech stacks
            </option>
            {techOptions.map((tech) => (
              <option key={tech} value={tech} className="bg-blueprint-900">
                {tech}
              </option>
            ))}
          </Select>

          <Select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
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
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading...</p>
          ) : startupList.length === 0 ? (
            <EmptyState
              title="No startups available"
              body="There are currently no startups accepting developers."
            />
          ) : filteredStartups.length === 0 ? (
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
              {filteredStartups.map((startup) => (
                <DeveloperStartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}