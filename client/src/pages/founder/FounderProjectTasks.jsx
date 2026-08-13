import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, ListChecks, Plus, ChevronRight } from "lucide-react";

import TaskCard from "../../components/project/TaskCard.jsx";
import BackButton from "../../components/common/BackButton.jsx";
import AssignTaskModal from "../../components/startup/AssignTaskModal.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";

import { useStartup } from "../../hooks/useStartup.js";
import { useTask } from "../../hooks/useTask.js";
import { useMember } from "../../hooks/useMember.js";
import { useToast } from "../../hooks/useToast.js";
import { createTask, deleteTask } from "../../services/task.service.js";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Completed" },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "All priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const DEADLINE_OPTIONS = [
  { value: "all", label: "Any deadline" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "this_week", label: "This week" },
  { value: "no_deadline", label: "No deadline" },
];

export default function FounderProjectTasks() {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { startups, loadStartups } = useStartup();
  const { tasks, loading: tasksLoading, loadStartupTasks } = useTask();
  const { members, loadMembers } = useMember();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [deadlineFilter, setDeadlineFilter] = useState("all");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingTask, setDeletingTask] = useState(false);

  useEffect(() => {
    if (startups.length === 0) {
      loadStartups();
    }
  }, [loadStartups, startups.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!startupId) return;
    loadStartupTasks(startupId, debouncedSearch);
    loadMembers(startupId);
  }, [startupId, debouncedSearch, loadStartupTasks, loadMembers]);

  const startup = useMemo(
    () => startups.find((project) => String(project.id) === String(startupId)),
    [startups, startupId]
  );

  const today = useMemo(() => new Date(), []);
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      const deadlineDate = task.deadline ? new Date(task.deadline) : null;
      const isOverdue = deadlineDate && deadlineDate < today && task.status !== "done";
      const isToday =
        deadlineDate &&
        deadlineDate.toDateString() === today.toDateString();
      const isThisWeek =
        deadlineDate &&
        deadlineDate >= today &&
        deadlineDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const hasNoDeadline = !deadlineDate;

      const matchesDeadline =
        deadlineFilter === "all" ||
        (deadlineFilter === "overdue" && isOverdue) ||
        (deadlineFilter === "today" && isToday) ||
        (deadlineFilter === "this_week" && isThisWeek) ||
        (deadlineFilter === "no_deadline" && hasNoDeadline);

      return matchesStatus && matchesPriority && matchesDeadline;
    });
  }, [tasks, statusFilter, priorityFilter, deadlineFilter, today]);

  const handleAssignTask = async (taskData) => {
    try {
      setCreatingTask(true);
      await createTask({ ...taskData, startup_id: startupId });
      await loadStartupTasks(startupId, debouncedSearch);
      setAssignModalOpen(false);
      showToast({ type: "success", message: "Task assigned successfully." });
    } catch (error) {
      showToast({
        type: "error",
        message:
          error.response?.data?.message ??
          "Unable to create task.",
      });
    } finally {
      setCreatingTask(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingTask(true);
      await deleteTask(deleteTarget.id);
      await loadStartupTasks(startupId, debouncedSearch);
      setDeleteTarget(null);
      showToast({ type: "success", message: "Task deleted." });
    } catch (error) {
      showToast({
        type: "error",
        message:
          error.response?.data?.message ??
          "Unable to delete task.",
      });
    } finally {
      setDeletingTask(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <BackButton fallbackPath={`/founder/projects/${startupId}`} label="Back to Project Workspace" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan">Tasks</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper">
            {startup?.title || "Project Tasks"}
          </h1>
          <p className="mt-1 text-sm text-paper-dim">
            Manage and assign tasks from a focused project task workspace.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setAssignModalOpen(true)}>
            <Plus size={16} />
            Assign Task
          </Button>
          <Button variant="outline" onClick={() => navigate(`/founder/projects/${startupId}`)}>
            <ChevronRight size={16} />
            Project Overview
          </Button>
        </div>
      </div>

      <div className="blueprint-card p-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-faint" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-lg border border-blueprint-line bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-blueprint-line bg-white py-2 px-3 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-blueprint-line bg-white py-2 px-3 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={deadlineFilter}
            onChange={(e) => setDeadlineFilter(e.target.value)}
            className="rounded-lg border border-blueprint-line bg-white py-2 px-3 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
          >
            {DEADLINE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="blueprint-card p-6">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-blueprint-line">
            <div>
              <h2 className="font-display text-lg font-semibold text-paper">Task list</h2>
              <p className="mt-1 text-sm text-paper-dim">
                Search, filter, and scroll within the task panel without losing context.
              </p>
            </div>
            <span className="text-sm text-paper-faint">{filteredTasks.length} tasks</span>
          </div>

          <div className="mt-5 max-h-[650px] overflow-y-auto pr-2 space-y-4">
            {tasksLoading ? (
              <>
                <Skeleton className="h-28 w-full" rounded="rounded-2xl" />
                <Skeleton className="h-28 w-full" rounded="rounded-2xl" />
                <Skeleton className="h-28 w-full" rounded="rounded-2xl" />
              </>
            ) : filteredTasks.length === 0 ? (
              <EmptyState
                icon={ListChecks}
                title="No tasks match your filters"
                body="Try a broader search or assign a task to this project."
                action={
                  <Button onClick={() => setAssignModalOpen(true)}>
                    Assign Task
                  </Button>
                }
              />
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={setDeleteTarget}
                  onClick={() => navigate(`/founder/projects/${startupId}/tasks`)}
                />
              ))
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="blueprint-card p-6">
            <h3 className="font-display text-base font-semibold text-paper">Task controls</h3>
            <p className="mt-2 text-sm text-paper-dim">
              Assign new tasks, delete outdated items, and keep the task list focused on this project.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Button onClick={() => setAssignModalOpen(true)}>
                <Plus size={16} />
                Assign Task
              </Button>
              <Button variant="outline" onClick={() => navigate(`/founder/projects/${startupId}`)}>
                <ChevronRight size={16} />
                Back to Workspace
              </Button>
            </div>
          </div>

          <div className="blueprint-card p-6">
            <h3 className="font-display text-base font-semibold text-paper">Sorting & filters</h3>
            <p className="mt-2 text-sm text-paper-dim">
              Filter by status, priority, deadline window, and search terms. The task section scrolls independently.
            </p>
          </div>
        </aside>
      </div>

      <AssignTaskModal
        key={assignModalOpen ? "open" : "closed"}
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        members={members}
        onSubmit={handleAssignTask}
        loading={creatingTask}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/60 p-4">
          <div className="blueprint-card w-full max-w-md p-6">
            <h2 className="font-display text-lg font-semibold text-paper">Delete this task?</h2>
            <p className="mt-3 text-sm text-paper-dim">
              "{deleteTarget.title}" will be permanently removed. This can't be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button onClick={handleDeleteTask} disabled={deletingTask}>
                {deletingTask ? "Deleting…" : "Delete task"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
