import { useEffect, useMemo, useState } from "react";
import { Briefcase, Search, MessageSquare, Sparkles, Users, ListChecks } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { useStartup } from "../../hooks/useStartup.js";
import { getWorkspaceOverview } from "../../services/workspace.service.js";

export default function FounderWorkspacePage() {
  const { startupId: routeStartupId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStartupId = routeStartupId || searchParams.get("startupId") || searchParams.get("projectId");

  const { startups, loadStartups } = useStartup();

  const [selectedStartupId, setSelectedStartupId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    loadStartups();
  }, [loadStartups]);

  useEffect(() => {
    if (startups.length === 0) return;

    const match = startups.find((p) => String(p.id) === String(urlStartupId));
    const targetId = match ? String(match.id) : String(startups[0].id);

    setSelectedStartupId(targetId);

    if (searchParams.get("startupId") !== targetId) {
      setSearchParams({ startupId: targetId }, { replace: true });
    }
  }, [startups, urlStartupId, searchParams, setSearchParams]);

  const handleStartupChange = (e) => {
    const newId = e.target.value;
    setSelectedStartupId(newId);
    setSearchParams({ startupId: newId }, { replace: true });
  };

  useEffect(() => {
    if (!selectedStartupId) return;

    let isMounted = true;
    setOverviewLoading(true);

    getWorkspaceOverview(selectedStartupId)
      .then((data) => {
        if (isMounted) {
          setOverviewData(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load founder workspace overview:", err);
      })
      .finally(() => {
        if (isMounted) {
          setOverviewLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedStartupId]);

  const startup = overviewData?.project || startups.find((item) => String(item.id) === String(selectedStartupId));
  const members = overviewData?.members || [];
  const tasks = overviewData?.tasks || [];
  const messages = overviewData?.messages || [];

  const displayedTasks = useMemo(() => {
    if (!searchInput.trim()) return tasks;
    const term = searchInput.toLowerCase();
    return tasks.filter((t) => t.title?.toLowerCase().includes(term) || t.description?.toLowerCase().includes(term));
  }, [tasks, searchInput]);

  const loading = overviewLoading;
  const completionRate = tasks.length ? Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100) : 0;
  const upcomingTasks = displayedTasks.slice(0, 5);
  const recentMembers = members.slice(0, 4);
  const previewMessages = messages.slice(-3);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan">Workspace</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper">Project Overview</h1>
          <p className="mt-1 text-sm text-paper-dim">
            A concise dashboard for the selected startup with quick access to recent work and insights.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search startups..."
            className="max-w-sm"
          />
          <select
            value={selectedStartupId}
            onChange={handleStartupChange}
            className="rounded-lg border border-blueprint-line bg-white py-2 px-3 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
          >
            {startups.map((startup) => (
              <option key={startup.id} value={startup.id}>
                {startup.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading overview…</p>
      )}

      {!loading && !startup && (
        <EmptyState
          title="No startups available"
          body="Create or select a startup to see the workspace overview."
        />
      )}

      {!loading && startup && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
            <div className="blueprint-card p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan">
                    <Briefcase size={16} />
                    {startup.status}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-paper">{startup.title}</h2>
                  <p className="mt-2 text-sm text-paper-dim">{startup.tagline || "No project description available."}</p>
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
                  <Button as={Link} to={`/founder/ai-assistant${selectedStartupId ? `?startupId=${selectedStartupId}` : ""}`}>
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
                  <Button as={Link} to={`/founder/chat${selectedStartupId ? `?startupId=${selectedStartupId}` : ""}`}>
                    Open Team Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="blueprint-card p-6">
              <div className="flex items-center gap-2">
                <ListChecks size={18} className="text-cyan" />
                <h3 className="font-display text-lg font-semibold text-paper">Recent Tasks</h3>
              </div>
              <div className="mt-5 space-y-3">
                {upcomingTasks.length === 0 ? (
                  <p className="text-sm text-paper-dim">No tasks available yet.</p>
                ) : (
                  upcomingTasks.map((task) => (
                    <div key={task.id} className="rounded-2xl border border-blueprint-line bg-blueprint-900/40 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-paper">{task.title}</p>
                          <p className="mt-1 text-sm text-paper-dim">{task.priority} priority</p>
                        </div>
                        <span className="rounded-full bg-blueprint-800 px-2 py-1 text-xs font-medium text-paper-dim">{task.status}</span>
                      </div>
                    </div>
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
