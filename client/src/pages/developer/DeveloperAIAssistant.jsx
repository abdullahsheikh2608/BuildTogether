import { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import Button from '../../components/ui/Button.jsx';
import Select from '../../components/ui/Select.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import BackButton from '../../components/common/BackButton.jsx';
import { useDeveloper } from '../../hooks/useDeveloper.js';
import AiAssistantPanel from '../../components/project/AiAssistantPanel.jsx';

export default function DeveloperAIAssistant() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStartupId = searchParams.get('startupId') || searchParams.get('projectId');

  const { projects, loadProjects } = useDeveloper();
  const [projectFilter, setProjectFilter] = useState('all');

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const acceptedProjects = useMemo(
    () => projects.filter((project) => project.status === 'accepted'),
    [projects]
  );

  useEffect(() => {
    if (acceptedProjects.length === 0) return;

    const match = acceptedProjects.find((p) => String(p.id) === String(urlStartupId));
    const targetId = match ? String(match.id) : String(acceptedProjects[0].id);

    setProjectFilter(targetId);

    if (searchParams.get('startupId') !== targetId) {
      setSearchParams({ startupId: targetId }, { replace: true });
    }
  }, [acceptedProjects, urlStartupId, searchParams, setSearchParams]);

  const handleProjectFilterChange = (e) => {
    const newId = e.target.value;
    setProjectFilter(newId);
    setSearchParams({ startupId: newId }, { replace: true });
  };

  const selectedProject = useMemo(
    () => acceptedProjects.find((project) => String(project.id) === String(projectFilter)),
    [projectFilter, acceptedProjects]
  );

  return (
    <div className="w-full space-y-6">
      <BackButton fallbackPath="/dashboard" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan">AI Assistant</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper">AI Assistant</h1>
          <p className="mt-1 text-sm text-paper-dim">
            Use AI tools for project summaries and progress reports.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[240px_auto]">
          <Select value={projectFilter} onChange={handleProjectFilterChange}>
            {acceptedProjects.length === 0 && <option value="all">No projects</option>}
            {acceptedProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </Select>
          <Button variant="outline" as={Link} to={`/dashboard/workspace${selectedProject ? `?startupId=${selectedProject.id}` : ''}`}>
            <ChevronRight size={16} />
            Project Overview
          </Button>
        </div>
      </div>

      {selectedProject ? (
        <AiAssistantPanel startupId={selectedProject.id} />
      ) : (
        <div className="blueprint-card p-6">
          <EmptyState title="Select a project" body="Choose a project above to activate AI tools for it." />
        </div>
      )}
    </div>
  );
}