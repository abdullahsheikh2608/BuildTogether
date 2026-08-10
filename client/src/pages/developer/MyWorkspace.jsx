import { useEffect, useMemo, useState } from "react";
import { Briefcase, Sparkles, MessageSquare, Users, ListChecks, ArrowRight } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ExpandableText from "../../components/ui/ExpandableText.jsx";
import { useDeveloper } from "../../hooks/useDeveloper.js";
import { getWorkspaceOverview } from "../../services/workspace.service.js";

export default function MyWorkspace() {
  const { startupId: routeStartupId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStartupId = routeStartupId || searchParams.get("startupId") || searchParams.get("projectId");

  const { projects, loadProjects } = useDeveloper();

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const acceptedProjects = useMemo(
    () => projects.filter((project) => project.status === "accepted"),
    [projects]
  );

  useEffect(() => {
    if (acceptedProjects.length === 0) return;
    const match = acceptedProjects.find((p) => String(p.id) === String(urlStartupId));
    const targetId = match ? String(match.id) : String(acceptedProjects[0].id);
    setSelectedProjectId((current) => current || targetId);
  }, [acceptedProjects, urlStartupId]);

  const handleProjectChange = (e) => {
    const newId = e.target.value;
    setSelectedProjectId(newId);
    setSearchParams({ startupId: newId }, { replace: true });
  };

  useEffect(() => {
    if (!selectedProjectId) return;

    let isMounted = true;
    setOverviewLoading(true);

    getWorkspaceOverview(selectedProjectId)
      .then((data) => {
        if (isMounted) {
          setOverviewData(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load workspace overview:", err);
      })
      .finally(() => {
        if (isMounted) {
          setOverviewLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

  const project = overviewData?.project || acceptedProjects.find((item) => String(item.id) === String(selectedProjectId));
  const members = overviewData?.members || [];
  const tasks = overviewData?.tasks || [];
  const messages = overviewData?.messages || [];

  const displayedTasks = useMemo(() => {
    if (!searchInput.trim()) return tasks;
    const term = searchInput.toLowerCase();
    return tasks.filter((t) => t.title?.toLowerCase().includes(term) || t.description?.toLowerCase().includes(term));
  }, [tasks, searchInput]);

  const loading = overviewLoading;
  const completionRate = tasks.length
    ? Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100)
    : 0;
  const upcomingTasks = displayedTasks.slice(0, 5);
  const recentMembers = members.slice(0, 4);
  const previewMessages = messages.slice(-3);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan">Workspace</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper">Project Overview</h1>
          <p className="mt-1 text-sm text-paper-dim">
            A concise dashboard for the selected project with quick access to recent work and insights.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="max-w-sm"
          />
          <select
            value={selectedProjectId}
            onChange={handleProjectChange}
            className="rounded-lg border border-blueprint-line bg-white py-2 px-3 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
          >
            {acceptedProjects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading overview…</p>
      )}

      {!loading && !project && (
        <EmptyState
          icon={Briefcase}
          title="No workspaces available"
          body="Accepted projects will appear here once you join a team."
        />
      )}

      {!loading && project && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
            <div className="blueprint-card p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan">
                    <Briefcase size={16} />
                    {project.status}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-paper">{project.title}</h2>
                  <p className="mt-2 text-sm text-paper-dim">{project.tagline || "No tagline available."}</p>
                  <ExpandableText
                    text={project.description || "No project description available."}
                    title={`${project.title} Description`}
                    maxLength={180}
                    className="mt-3 text-sm text-paper-dim"
                  />
                </div>
                <div className="space-y-2 rounded-2xl border border-blueprint-line bg-blueprint-800/50 p-4 text-sm text-paper-dim">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{members.length} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ListChecks size={16} />
                    <span>{tasks.length} tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>{completionRate}% complete</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="blueprint-card p-6">
                <div className="flex items-start gap-3">
                  <Sparkles size={18} className="text-cyan" />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper">Quick AI Summary</h3>
                    <p className="mt-1 text-sm text-paper-dim">Open the AI Assistant to generate your project summary or weekly report.</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <Button as={Link} to={`/dashboard/ai${selectedProjectId ? `?startupId=${selectedProjectId}` : ""}`}>
                    Open AI Assistant
                  </Button>
                </div>
              </div>

              <div className="blueprint-card p-6">
                <div className="flex items-start gap-3">
                  <MessageSquare size={18} className="text-cyan" />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper">Quick Chat Preview</h3>
                    <p className="mt-1 text-sm text-paper-dim">See the latest few messages and continue the conversation in Team Chat.</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {previewMessages.length === 0 ? (
                    <p className="text-sm text-paper-dim">No messages yet.</p>
                  ) : (
                    previewMessages.map((message) => (
                      <div key={message.id} className="rounded-2xl border border-blueprint-line bg-blueprint-900/40 p-3">
                        <p className="text-sm text-paper">{message.message}</p>
                        <p className="mt-1 text-xs text-paper-faint">{message.sender_name || "Team member"}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-5">
                  <Button as={Link} to={`/dashboard/chat${selectedProjectId ? `?startupId=${selectedProjectId}` : ""}`}>
                    Open Team Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="blueprint-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListChecks size={18} className="text-cyan" />
                  <h3 className="font-display text-lg font-semibold text-paper">Recent Tasks</h3>
                </div>
                <Link
                  to={`/dashboard/tasks${selectedProjectId ? `?startupId=${selectedProjectId}` : ""}`}
                  className="flex items-center gap-1 text-xs font-medium text-cyan transition hover:text-cyan/80"
                >
                  View all
                  <ArrowRight size={13} />
                </Link>
              </div>
              <div className="mt-5 space-y-3">
                {upcomingTasks.length === 0 ? (
                  <p className="text-sm text-paper-dim">No tasks available yet.</p>
                ) : (
                  upcomingTasks.map((task) => (
                    <Link
                      key={task.id}
                      to={`/dashboard/tasks?taskId=${task.id}&startupId=${selectedProjectId}`}
                      className="block rounded-2xl border border-blueprint-line bg-blueprint-900/40 p-4 transition-colors hover:bg-blueprint-800/60"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-paper">{task.title}</p>
                          <p className="mt-1 text-sm text-paper-dim">{task.priority} priority</p>
                        </div>
                        <span className="rounded-full bg-blueprint-800 px-2 py-1 text-xs font-medium text-paper-dim">{task.status}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="blueprint-card p-6">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-cyan" />
                <h3 className="font-display text-lg font-semibold text-paper">Recent Members</h3>
              </div>
              <div className="mt-5 space-y-3">
                {recentMembers.length === 0 ? (
                  <p className="text-sm text-paper-dim">No team members yet.</p>
                ) : (
                  recentMembers.map((member) => (
                    <div key={member.id} className="rounded-2xl border border-blueprint-line bg-blueprint-900/40 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-paper">{member.full_name}</p>
                          <p className="mt-1 text-sm text-paper-dim">@{member.username}</p>
                        </div>
                        <span className="rounded-full bg-blueprint-800 px-2 py-1 text-xs font-medium text-paper-dim">{member.role}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}