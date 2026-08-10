import { useOutletContext } from "react-router-dom";
import { Briefcase } from "lucide-react";

import EmptyState from "../../components/ui/EmptyState.jsx";
import TaskCard from "../../components/project/TaskCard.jsx";
import MemberCard from "../../components/project/MemberCard.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";

export default function WorkspaceOverview() {
  const { project, tasks = [], members = [], loading } = useOutletContext();

  if (!project) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Project not found"
        body="The selected project could not be located."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="blueprint-card p-6">
            <h2 className="font-display text-lg font-semibold text-paper">Project overview</h2>
            <p className="mt-2 text-sm text-paper-dim">{project.tagline}</p>
          </div>

          <div className="blueprint-card p-6">
            <h3 className="font-semibold text-paper">Recent activity</h3>
            <p className="mt-2 text-sm text-paper-dim">A short feed of recent updates will appear here.</p>
          </div>

          <div className="blueprint-card p-6">
            <h3 className="font-semibold text-paper">Task preview</h3>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-24 w-full" rounded="rounded-xl" />
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 3).map((t) => (
                  <TaskCard key={t.id} task={t} onClick={() => {}} />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="blueprint-card p-6">
            <h3 className="font-semibold text-paper">Quick stats</h3>
            <div className="mt-3 grid gap-3">
              <div>Total tasks: {tasks.length}</div>
              <div>Members: {members.length}</div>
            </div>
          </div>

          <div className="blueprint-card p-6">
            <h3 className="font-semibold text-paper">Members preview</h3>
            <div className="mt-3 space-y-3">
              {members.slice(0, 3).map((m) => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}