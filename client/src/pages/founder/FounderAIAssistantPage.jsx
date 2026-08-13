import { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import Button from '../../components/ui/Button.jsx';
import Select from '../../components/ui/Select.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import BackButton from '../../components/common/BackButton.jsx';
import { useStartup } from '../../hooks/useStartup.js';
import AiAssistantPanel from '../../components/project/AiAssistantPanel.jsx';

export default function FounderAIAssistantPage() {
  const { startupId: routeStartupId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStartupId = routeStartupId || searchParams.get('startupId');

  const { startups, loadStartups } = useStartup();
  const [projectFilter, setProjectFilter] = useState('all');

  useEffect(() => {
    if (startups.length === 0) {
      loadStartups();
    }
  }, [loadStartups, startups.length]);

  useEffect(() => {
    if (startups.length === 0) return;
    if (urlStartupId) {
      const match = startups.find((p) => String(p.id) === String(urlStartupId));
      if (match) {
        setProjectFilter(String(match.id));
      }
    }
  }, [startups, urlStartupId]);

  const handleFilterChange = (e) => {
    const val = e.target.value;
    setProjectFilter(val);
    if (val === 'all') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ startupId: val }, { replace: true });
    }
  };

  const selectedStartup = useMemo(
    () => startups.find((project) => String(project.id) === String(projectFilter)),
    [projectFilter, startups]
  );

  return (
    <div className="w-full space-y-6">
      <BackButton fallbackPath="/founder" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan">AI Assistant</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper">AI Assistant</h1>
          <p className="mt-1 text-sm text-paper-dim">
            Use AI tools for project summaries, reports, and insight generation.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[240px_auto]">
          <Select value={projectFilter} onChange={handleFilterChange}>
            <option value="all">All Projects</option>
            {startups.map((startup) => (
              <option key={startup.id} value={startup.id}>
                {startup.title}
              </option>
            ))}
          </Select>
          <Button variant="outline" as={Link} to={`/founder/workspace${projectFilter !== 'all' ? `?startupId=${projectFilter}` : ''}`}>
            <ChevronRight size={16} />
            Project Overview
          </Button>
        </div>
      </div>

      {selectedStartup ? (
        <AiAssistantPanel startupId={selectedStartup.id} />
      ) : (
        <div className="blueprint-card p-6">
          <EmptyState title="Select a project" body="Choose a startup above to activate AI tools for that project." />
        </div>
      )}
    </div>
  );
}