import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Briefcase, ListChecks, CheckCircle2, Clock, ArrowRight, UserPlus, ClipboardList } from "lucide-react";

import UpcomingDeadlines from "../../components/project/Upcomingdeadlines.jsx";
import AnalyticsCard from "../../components/analytics/Analyticscard.jsx";
import StampBadge from "../../components/ui/StampBadge.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { SkeletonStat } from "../../components/ui/Skeleton.jsx";
import { getDeadlineStatus } from "../../utils/deadline.js";

import { useAuth } from "../../hooks/useAuth.js";
import { useDeveloper } from "../../hooks/useDeveloper.js";
import { useTask } from "../../hooks/useTask.js";

const RECENT_PROJECTS_LIMIT = 15;
const MY_TASKS_LIMIT = 15;
const RECENT_ACTIVITY_LIMIT = 15;

const PRIORITY_STYLES = {
    low: "bg-blueprint-800 text-paper-dim",
    medium: "bg-amber-dim text-amber",
    high: "bg-[#FEE2E2] text-ink-red",
};

function timeAgo(dateString) {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString();
}

export default function DeveloperDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        projects,
        loading: projectsLoading,
        error: projectsError,
        loadProjects,
    } = useDeveloper();

    const {
        tasks,
        loading: tasksLoading,
        loadMyTasks,
    } = useTask();

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    useEffect(() => {
        loadMyTasks();
    }, [loadMyTasks]);

    const loading = projectsLoading || tasksLoading;
    const firstName = user?.full_name?.split(" ")[0] || "there";

    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "done").length;
    const pendingTasks = tasks.filter((t) => t.status !== "done").length;

    const recentProjects = projects.slice(0, RECENT_PROJECTS_LIMIT);

    const myTasks = [...tasks]
        .filter((t) => t.status !== "done")
        .sort((a, b) => new Date(a.deadline ?? 0) - new Date(b.deadline ?? 0))
        .slice(0, MY_TASKS_LIMIT);

    // Recent activity — built from real events we already have (task
    // assignments and project joins), not a fabricated feed. Each source
    // is tagged, merged, and sorted by timestamp so the most recent
    // events surface first regardless of which type they are.
    const taskEvents = tasks.map((task) => ({
        id: `task-${task.id}`,
        type: "task",
        text: `You were assigned to "${task.title}"`,
        sub: task.startup_title,
        timestamp: task.created_at,
    }));

    const projectEvents = projects.map((project) => ({
        id: `project-${project.id}`,
        type: "project",
        text: `You joined "${project.title}"`,
        sub: null,
        timestamp: project.joined_at,
    }));

    const recentActivity = [...taskEvents, ...projectEvents]
        .filter((event) => event.timestamp)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, RECENT_ACTIVITY_LIMIT);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-paper">
                        Welcome back, {firstName}
                    </h1>
                    <p className="mt-1 text-sm text-paper-dim">
                        Here's what's happening with your projects today.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => navigate("/dashboard/startups")}>
                        <Rocket size={16} />
                        Startups
                    </Button>
                    <Button onClick={() => navigate("/dashboard/projects")}>
                        <Briefcase size={16} />
                        My Projects
                    </Button>
                </div>
            </div>

            {projectsError && (
                <p className="mt-6 rounded-lg border border-ink-red/20 bg-ink-red/5 px-4 py-3 text-sm text-ink-red">
                    {projectsError}
                </p>
            )}

            {/* Stat cards */}
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {loading ? (
                    <>
                        <SkeletonStat />
                        <SkeletonStat />
                        <SkeletonStat />
                        <SkeletonStat />
                    </>
                ) : (
                    <>
                        <AnalyticsCard icon={Briefcase} color="blue" label="My Projects" value={totalProjects} />
                        <AnalyticsCard icon={ListChecks} color="green" label="Total Tasks" value={totalTasks} />
                        <AnalyticsCard icon={CheckCircle2} color="purple" label="Completed Tasks" value={completedTasks} />
                        <AnalyticsCard icon={Clock} color="amber" label="Pending Tasks" value={pendingTasks} />
                    </>
                )}
            </div>

            {!loading && totalProjects === 0 ? (
                <div className="mt-8">
                    <EmptyState
                        icon={Briefcase}
                        title="No projects yet"
                        body="You haven't joined any startup yet. Browse open startups and apply to get started."
                        action={<Button onClick={() => navigate("/dashboard/startups")}>Startups</Button>}
                    />
                </div>
            ) : (
                <>
                    {/* Row 1: My Tasks + Recent Projects */}
                    <div className="mt-8 grid gap-5 lg:grid-cols-3">
                        <div className="blueprint-card flex flex-col p-5 lg:col-span-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-display text-base font-semibold text-paper">My Tasks</h3>
                                <button
                                    onClick={() => navigate("/dashboard/tasks")}
                                    className="flex items-center gap-1 text-xs font-medium text-cyan transition hover:text-cyan/80 cursor-pointer"
                                >
                                    View all tasks
                                    <ArrowRight size={13} />
                                </button>
                            </div>

                            <div className="mt-4 flex max-h-80 flex-col divide-y divide-blueprint-line overflow-y-auto pr-1">
                                {loading ? (
                                    <p className="py-6 text-center text-sm text-paper-faint">Loading…</p>
                                ) : myTasks.length === 0 ? (
                                    <p className="py-6 text-center text-sm text-paper-faint">No pending tasks. You're all caught up.</p>
                                ) : (
                                    myTasks.map((task) => {
                                        const deadlineStatus = getDeadlineStatus(task.deadline, task.status);

                                        return (
                                            <div
                                                key={task.id}
                                                onClick={() => navigate(`/dashboard/tasks?taskId=${task.id}`)}
                                                className="flex items-center gap-4 py-3.5 px-2 first:pt-2 last:pb-2 cursor-pointer hover:bg-blueprint-800/40 rounded-xl transition-colors"
                                            >
                                                <span
                                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                                        PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.low
                                                    }`}
                                                >
                                                    {task.priority}
                                                </span>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-paper">{task.title}</p>
                                                    <p className="truncate text-xs text-paper-dim">{task.startup_title}</p>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <p className="text-xs text-paper-dim">{task.deadline?.slice(0, 10) ?? "No deadline"}</p>
                                                    <span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[11px] font-medium ${deadlineStatus.badgeClass}`}>
                                                        {deadlineStatus.label}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="blueprint-card flex flex-col p-5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-display text-base font-semibold text-paper">Recent Projects</h3>
                                <button
                                    onClick={() => navigate("/dashboard/projects")}
                                    className="flex items-center gap-1 text-xs font-medium text-cyan transition hover:text-cyan/80 cursor-pointer"
                                >
                                    View all
                                    <ArrowRight size={13} />
                                </button>
                            </div>

                            <div className="mt-4 flex max-h-80 flex-col gap-1 overflow-y-auto pr-1">
                                {loading ? (
                                    <p className="py-6 text-center text-sm text-paper-faint">Loading…</p>
                                ) : recentProjects.length === 0 ? (
                                    <p className="py-6 text-center text-sm text-paper-faint">No projects yet.</p>
                                ) : (
                                    recentProjects.map((project) => (
                                        <button
                                            key={project.id}
                                            onClick={() => navigate(`/dashboard/workspace/${project.id}`)}
                                            className="flex items-center justify-between gap-3 rounded-lg px-2 py-3 text-left transition-colors duration-200 hover:bg-blueprint-800 cursor-pointer"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-paper">{project.title}</p>
                                            </div>
                                            <StampBadge status={project.status} />
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Upcoming Deadlines + Recent Activity */}
                    <div className="mt-5 grid gap-5 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            {!loading && <UpcomingDeadlines tasks={tasks} />}
                        </div>

                        <div className="blueprint-card flex flex-col p-5">
                            <h3 className="font-display text-base font-semibold text-paper">Recent Activity</h3>

                            <div className="mt-4 flex max-h-80 flex-col gap-4 overflow-y-auto pr-1">
                                {loading ? (
                                    <p className="py-6 text-center text-sm text-paper-faint">Loading…</p>
                                ) : recentActivity.length === 0 ? (
                                    <p className="py-6 text-center text-sm text-paper-faint">No recent activity yet.</p>
                                ) : (
                                    recentActivity.map((event) => {
                                        const Icon = event.type === "task" ? ClipboardList : UserPlus;

                                        return (
                                            <div key={event.id} className="flex items-start gap-3">
                                                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-dim text-cyan">
                                                    <Icon size={14} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-paper">{event.text}</p>
                                                    <p className="mt-0.5 text-xs text-paper-faint">
                                                        {event.sub ? `${event.sub} · ` : ""}
                                                        {timeAgo(event.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}