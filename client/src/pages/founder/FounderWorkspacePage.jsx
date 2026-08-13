import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Search,
  MessageSquare,
  Sparkles,
  Users,
  ListChecks,
  ArrowRight,
  X,
  Minus,
  Code2,
  Clock,
  CheckCircle2,
  Circle,
  CalendarDays,
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ExpandableText from "../../components/ui/ExpandableText.jsx";
import StampBadge from "../../components/ui/StampBadge.jsx";
import { SkeletonCard } from "../../components/ui/Skeleton.jsx";
import BackButton from "../../components/common/BackButton.jsx";
import ChatBox from "../../components/chat/ChatBox.jsx";
import { useStartup } from "../../hooks/useStartup.js";
import { getWorkspaceOverview } from "../../services/workspace.service.js";
import { getInitials } from "../../utils/avatar.js";
import { getDeadlineStatus } from "../../utils/deadline.js";

const PRIORITY_STYLES = {
  low: "bg-blueprint-800 text-paper-dim",
  medium: "bg-amber-dim text-amber",
  high: "bg-[#FEE2E2] text-ink-red",
};

const TASK_STATUS_ICON = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
};

const TASK_STATUS_ICON_STYLES = {
  todo: "text-paper-faint",
  in_progress: "text-cyan",
  done: "text-ink-green",
};

const TECH_BADGE_LIMIT = 4;

export default function FounderWorkspacePage() {
  const { startupId: routeStartupId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStartupId = routeStartupId || searchParams.get("startupId") || searchParams.get("projectId");

  const { startups, loadStartups } = useStartup();

  const [selectedStartupId, setSelectedStartupId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewData, setOverviewData] = useState(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);

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

  // Reset any open chat overlay whenever the selected project changes so
  // it never shows a stale conversation for the previous startup.
  useEffect(() => {
    setChatOpen(false);
    setChatMinimized(false);
  }, [selectedStartupId]);

  const startup = overviewData?.project || startups.find((item) => String(item.id) === String(selectedStartupId));
  const members = overviewData?.members || [];
  const tasks = overviewData?.tasks || [];
  const displayedTasks = useMemo(() => {
    if (!searchInput.trim()) return tasks;
    const term = searchInput.toLowerCase();
    return tasks.filter((t) => t.title?.toLowerCase().includes(term) || t.description?.toLowerCase().includes(term));
  }, [tasks, searchInput]);

  const loading = overviewLoading;
  const completionRate = tasks.length ? Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100) : 0;
  const upcomingTasks = displayedTasks.slice(0, 5);
  const recentMembers = members.slice(0, 4);
  const techStack = startup?.tech_stack ?? [];
  const visibleTech = techStack.slice(0, TECH_BADGE_LIMIT);
  const extraTechCount = techStack.length - visibleTech.length;

  const openChat = () => {
    setChatOpen(true);
    setChatMinimized(false);
  };

  return (
    <div className="w-full space-y-6">
      <BackButton fallbackPath="/founder" />
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
            icon={Search}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="max-w-sm"
          />
          <Select value={selectedStartupId} onChange={handleStartupChange}>
            {startups.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {loading && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      )}

      {!loading && !startup && (
        <EmptyState
          icon={Briefcase}
          title="No startups available"
          body="Create or select a startup to see the workspace overview."
        />
      )}

      {!loading && startup && (
        <div className="space-y-6">
          {/* Project overview */}
          <div className="blueprint-card flex flex-col p-6 sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan text-xl font-bold text-white shadow-sm">
                  {getInitials(startup.title)}
                </div>

                <div className="min-w-0">
                  <StampBadge status={startup.status} />
                  <h2 className="mt-3 truncate font-display text-2xl font-semibold text-paper sm:text-3xl">
                    {startup.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-paper-dim">{startup.tagline || "No tagline available."}</p>
                </div>
              </div>

              <div className="w-full shrink-0 space-y-3 rounded-2xl border border-blueprint-line bg-blueprint-800/50 p-4 text-sm text-paper-dim sm:w-56">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <Users size={15} className="text-cyan" />
                    Members
                  </span>
                  <span className="font-semibold text-paper">{members.length}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <ListChecks size={15} className="text-cyan" />
                    Tasks
                  </span>
                  <span className="font-semibold text-paper">{tasks.length}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2">
                      <Sparkles size={15} className="text-cyan" />
                      Complete
                    </span>
                    <span className="font-semibold text-paper">{completionRate}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-blueprint-700">
                    <div
                      className="h-full rounded-full bg-cyan transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <ExpandableText
              text={startup.description || "No project description available."}
              title={`${startup.title} Description`}
              maxLength={180}
              className="mt-4 text-sm text-paper-dim"
            />

            {techStack.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-paper-faint">
                  <Code2 size={14} />
                  Tech stack
                </span>
                {visibleTech.map((tech) => (
                  <span key={tech} className="rounded-md bg-cyan-dim px-2.5 py-1 text-xs font-medium text-cyan">
                    {tech}
                  </span>
                ))}
                {extraTechCount > 0 && (
                  <span className="rounded-md bg-blueprint-800 px-2.5 py-1 text-xs font-medium text-paper-dim">
                    +{extraTechCount}
                  </span>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2.5 border-t border-blueprint-line pt-5">
              <Button onClick={openChat}>
                <MessageSquare size={16} />
                Open Chat
              </Button>
              <Button
                as={Link}
                to={`/founder/tasks${selectedStartupId ? `?startupId=${selectedStartupId}` : ""}`}
                variant="outline"
              >
                <ListChecks size={16} />
                View Tasks
              </Button>
              <Button
                as={Link}
                to={`/founder/team-members${selectedStartupId ? `?startupId=${selectedStartupId}` : ""}`}
                variant="outline"
              >
                <Users size={16} />
                Team Members
              </Button>
              <Button
                as={Link}
                to={`/founder/ai-assistant${selectedStartupId ? `?startupId=${selectedStartupId}` : ""}`}
                variant="outline"
              >
                <Sparkles size={16} />
                Open in AI
              </Button>
            </div>
          </div>

          {/* Recent Tasks + Recent Members */}
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="blueprint-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListChecks size={18} className="text-cyan" />
                  <h3 className="font-display text-lg font-semibold text-paper">Recent Tasks</h3>
                </div>
                <Link
                  to={`/founder/tasks${selectedStartupId ? `?startupId=${selectedStartupId}` : ""}`}
                  className="flex items-center gap-1 text-xs font-medium text-cyan transition hover:text-cyan/80"
                >
                  View all
                  <ArrowRight size={13} />
                </Link>
              </div>
              <div className="mt-5 space-y-2.5">
                {upcomingTasks.length === 0 ? (
                  <p className="text-sm text-paper-dim">No tasks available yet.</p>
                ) : (
                  upcomingTasks.map((task) => {
                    const StatusIcon = TASK_STATUS_ICON[task.status] ?? Circle;
                    const deadlineStatus = getDeadlineStatus(task.deadline, task.status);

                    return (
                      <div
                        key={task.id}
                        className="rounded-2xl border border-blueprint-line bg-blueprint-900/40 p-4 transition-colors duration-200 hover:border-cyan/30 hover:bg-cyan-dim/30"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-2.5">
                            <StatusIcon
                              size={17}
                              className={`mt-0.5 shrink-0 ${TASK_STATUS_ICON_STYLES[task.status] ?? "text-paper-faint"}`}
                            />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-paper">{task.title}</p>
                              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
                                    PRIORITY_STYLES[task.priority] ?? "bg-blueprint-800 text-paper-dim"
                                  }`}
                                >
                                  {task.priority} priority
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${deadlineStatus.badgeClass}`}
                                >
                                  <CalendarDays size={11} />
                                  {deadlineStatus.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          <StampBadge status={task.status} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="blueprint-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-cyan" />
                  <h3 className="font-display text-lg font-semibold text-paper">Recent Members</h3>
                </div>
                <Link
                  to={`/founder/team-members${selectedStartupId ? `?startupId=${selectedStartupId}` : ""}`}
                  className="flex items-center gap-1 text-xs font-medium text-cyan transition hover:text-cyan/80"
                >
                  View all
                  <ArrowRight size={13} />
                </Link>
              </div>
              <div className="mt-5 space-y-2.5">
                {recentMembers.length === 0 ? (
                  <p className="text-sm text-paper-dim">No team members yet.</p>
                ) : (
                  recentMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-blueprint-line bg-blueprint-900/40 p-4 transition-colors duration-200 hover:border-cyan/30 hover:bg-cyan-dim/30"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-dim text-sm font-semibold text-cyan">
                            {getInitials(member.full_name)}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-ink-green" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-paper">{member.full_name}</p>
                          <p className="truncate text-xs text-paper-dim">@{member.username}</p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-blueprint-800 px-2.5 py-1 text-[11px] font-medium capitalize text-paper-dim">
                        {member.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Chat modal */}
      {chatOpen && !chatMinimized && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-paper/60 px-4 py-8 backdrop-blur-sm"
          onClick={() => setChatOpen(false)}
        >
          <div
            className="blueprint-card animate-draft-in flex h-[85vh] max-h-[720px] w-full max-w-2xl flex-col overflow-hidden p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-blueprint-line p-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan text-sm font-bold text-white">
                  {getInitials(startup.title)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-semibold text-paper">{startup.title}</h3>
                  <p className="flex items-center gap-1.5 text-xs text-paper-dim">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-green" />
                    {members.length} members &middot; Online
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Link
                  to={`/founder/chat${selectedStartupId ? `?startupId=${selectedStartupId}` : ""}`}
                  className="hidden items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-cyan transition-colors duration-200 hover:bg-cyan-dim sm:inline-flex"
                >
                  View full chat
                  <ArrowRight size={13} />
                </Link>
                <button
                  type="button"
                  onClick={() => setChatMinimized(true)}
                  aria-label="Minimize"
                  title="Minimize"
                  className="rounded-lg p-2 text-paper-faint transition-colors duration-200 hover:bg-blueprint-800 hover:text-paper"
                >
                  <Minus size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  aria-label="Close"
                  title="Close"
                  className="rounded-lg p-2 text-paper-faint transition-colors duration-200 hover:bg-blueprint-800 hover:text-paper"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <ChatBox startupId={selectedStartupId} hideHeader className="flex-1 bg-white" />
          </div>
        </div>
      )}

      {/* Minimized chat pill */}
      {chatOpen && chatMinimized && (
        <button
          type="button"
          onClick={() => setChatMinimized(false)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-cyan px-4 py-3 text-sm font-medium text-white shadow-popover transition-all duration-200 hover:bg-cyan/90"
        >
          <MessageSquare size={16} />
          Team Chat
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setChatOpen(false);
              setChatMinimized(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                setChatOpen(false);
                setChatMinimized(false);
              }
            }}
            aria-label="Close chat"
            className="rounded-full p-1 hover:bg-white/20"
          >
            <X size={14} />
          </span>
        </button>
      )}
    </div>
  );
}