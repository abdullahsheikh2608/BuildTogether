import { useEffect, useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";

import WorkspaceHeader from "../../components/project/WorkspaceHeader.jsx";
import { useDeveloper } from "../../hooks/useDeveloper.js";
import { useTask } from "../../hooks/useTask.js";
import { useMember } from "../../hooks/useMember.js";

export default function DeveloperProjectLayout() {
  const { startupId } = useParams();

  const { projects, loadProjects } = useDeveloper();
  const { tasks, loadStartupTasks, loading: tasksLoading } = useTask();
  const { members, loadMembers, loading: membersLoading } = useMember();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (!startupId) return;
    loadStartupTasks(startupId);
    loadMembers(startupId);
  }, [startupId, loadStartupTasks, loadMembers]);

  const project = useMemo(
    () => projects.find((p) => String(p.id) === String(startupId)),
    [projects, startupId]
  );

  const loading = tasksLoading || membersLoading;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <WorkspaceHeader
        startup={project}
        membersCount={members.length}
        tasksCount={tasks.length}
      />

      {/* Provide project-level context (including projects list) to nested routes */}
      <Outlet context={{ project, projects, tasks, members, loading }} />
    </div>
  );
}
