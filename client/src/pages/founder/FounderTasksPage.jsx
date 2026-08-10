import { useEffect, useMemo, useState } from 'react';
import { Search, ListChecks, ChevronRight, PlusCircle } from 'lucide-react';

import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import TaskCard from '../../components/project/TaskCard.jsx';
import TaskDetailsPanel from '../../components/project/TaskDetailsPanel.jsx';
import AssignTaskModal from '../../components/startup/AssignTaskModal.jsx';
import { useStartup } from '../../hooks/useStartup.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useTask } from '../../hooks/useTask.js';
import { useMember } from '../../hooks/useMember.js';
import { deleteTask, getStartupTasks, createTask } from '../../services/task.service.js';
import { getStartupMembers } from '../../services/member.service.js';
import { useToast } from '../../hooks/useToast.js';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const DEADLINE_OPTIONS = [
  { value: 'all', label: 'All deadlines' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due today' },
  { value: 'this_week', label: 'This week' },
  { value: 'no_deadline', label: 'No deadline' },
];

export default function FounderTasksPage() {
  const { startups, loadStartups } = useStartup();
  const { tasks, loading: tasksLoading, loadStartupTasks } = useTask();
  const { members, loadMembers } = useMember();
  const { showToast } = useToast();

  const [taskCache, setTaskCache] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);

  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [deadlineFilter, setDeadlineFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput, 400);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (startups.length === 0) {
      loadStartups();
    }
  }, [loadStartups, startups.length]);

  useEffect(() => {
    const loadTasksForStartup = async (startupId) => {
      setLoading(true);
      setError('');

      try {
        const result = await getStartupTasks(startupId, projectFilter === 'all' ? '' : search);
        setTaskCache((prev) => ({ ...prev, [startupId]: Array.isArray(result) ? result : [] }));
      } catch {
        setError("Couldn't load tasks.");
      } finally {
        setLoading(false);
      }
    };

    const loadAllTasks = async () => {
      setLoading(true);
      setError('');
      try {
        const results = await Promise.all(
          startups.map(async (startup) => {
            const list = await getStartupTasks(startup.id, '');
            return { startupId: startup.id, tasks: Array.isArray(list) ? list : [] };
          })
        );
        const merged = results.reduce((acc, item) => ({ ...acc, [item.startupId]: item.tasks }), {});
        setTaskCache(merged);
      } catch {
        setError("Couldn't load tasks.");
      } finally {
        setLoading(false);
      }
    };

    if (projectFilter === 'all') {
      loadAllTasks();
      return;
    }

    loadTasksForStartup(projectFilter);
  }, [projectFilter, search, startups]);

  useEffect(() => {
    if (projectFilter !== 'all') {
      loadMembers(projectFilter, '');
    }
  }, [projectFilter, loadMembers]);

  const displayedTasks = useMemo(() => {
    if (projectFilter === 'all') {
      return Object.values(taskCache).flat();
    }
    return taskCache[projectFilter] || tasks;
  }, [projectFilter, taskCache, tasks]);

  const filteredTasks = useMemo(() => {
    const now = new Date();
    const normalizedSearch = search.trim().toLowerCase();

    return displayedTasks
      .filter((task) => {
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        const deadline = task.deadline ? new Date(task.deadline) : null;
        const isOverdue = deadline && deadline < now && task.status !== 'done';
        const isToday = deadline && deadline.toDateString() === now.toDateString();
        const isThisWeek = deadline && deadline >= now && deadline <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const matchesDeadline =
          deadlineFilter === 'all' ||
          (deadlineFilter === 'overdue' && isOverdue) ||
          (deadlineFilter === 'today' && isToday) ||
          (deadlineFilter === 'this_week' && isThisWeek) ||
          (deadlineFilter === 'no_deadline' && !deadline);
        const matchesSearch =
          !normalizedSearch ||
          task.title?.toLowerCase().includes(normalizedSearch) ||
          task.description?.toLowerCase().includes(normalizedSearch);

        return matchesStatus && matchesPriority && matchesDeadline && matchesSearch;
      })
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [displayedTasks, statusFilter, priorityFilter, deadlineFilter, search]);

  const selectedStartup = useMemo(
    () => startups.find((startup) => String(startup.id) === String(projectFilter)),
    [startups, projectFilter]
  );

  const handleCreateTask = async (taskData) => {
    try {
      setCreatingTask(true);
      await createTask({ ...taskData, startup_id: projectFilter });
      await loadStartupTasks(projectFilter, '');
      setAssignModalOpen(false);
      showToast({ type: 'success', message: 'Task assigned successfully.' });
    } catch {
      showToast({ type: 'error', message: 'Unable to assign task.' });
    } finally {
      setCreatingTask(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingTask(true);
      await deleteTask(deleteTarget.id);
      await loadStartupTasks(projectFilter, '');
      setDeleteTarget(null);
      showToast({ type: 'success', message: 'Task deleted.' });
    } catch {
      showToast({ type: 'error', message: 'Unable to delete task.' });
    } finally {
      setDeletingTask(false);
    }
  };

  const isAssignEnabled = projectFilter !== 'all';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan">Tasks</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper">Tasks</h1>
          <p className="mt-1 text-sm text-paper-dim">
            Browse and manage project tasks in a dedicated task workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              if (!isAssignEnabled) {
                showToast({
                  type: 'error',
                  message: 'Select a specific project first to assign a task.',
                });
                return;
              }
              setAssignModalOpen(true);
            }}
            title={!isAssignEnabled ? 'Select a project first to assign a task' : undefined}
          >
            <PlusCircle size={16} />
            Assign Task
          </Button>
          <Button variant="outline" as="a" href="/founder/workspace">
            <ChevronRight size={16} />
            Project Overview
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-faint" size={16} />
          <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search tasks..." className="pl-10" />
        </div>

        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
          <option value="all">All Projects</option>
          {startups.map((startup) => (
            <option key={startup.id} value={startup.id}>
              {startup.title}
            </option>
          ))}
        </Select>

        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select value={deadlineFilter} onChange={(e) => setDeadlineFilter(e.target.value)}>
          {DEADLINE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {error && (
        <p className="rounded-lg border border-ink-red/20 bg-ink-red/5 px-4 py-3 text-sm text-ink-red">{error}</p>
      )}

      <div
        className={`grid gap-6 transition-all duration-300 ${
          selectedTask ? 'lg:grid-cols-[1fr_380px]' : 'lg:grid-cols-1'
        }`}
      >
        <div className="blueprint-card p-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-blueprint-line">
            <div>
              <h2 className="font-display text-lg font-semibold text-paper">Task list</h2>
              <p className="mt-1 text-sm text-paper-dim">
                {isAssignEnabled
                  ? `Tasks for ${selectedStartup?.title || 'the selected project'}`
                  : 'Select a project to enable assignment and see tasks.'}
              </p>
            </div>
            <span className="text-sm text-paper-faint">{filteredTasks.length} results</span>
          </div>

          <div className="mt-5 space-y-4">
            {loading ? (
              <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading tasks…</p>
            ) : filteredTasks.length === 0 ? (
              <EmptyState title="No tasks found" body="Try changing your filters or select a startup." />
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={setDeleteTarget}
                  onClick={() => setSelectedTask(task)}
                />
              ))
            )}
          </div>
        </div>

        {selectedTask && (
          <aside>
            <TaskDetailsPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
          </aside>
        )}
      </div>

      <AssignTaskModal
        key={assignModalOpen ? 'open' : 'closed'}
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        members={members}
        onSubmit={handleCreateTask}
        loading={creatingTask}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/60 p-4">
          <div className="blueprint-card w-full max-w-md p-6">
            <h2 className="font-display text-lg font-semibold text-paper">Delete this task?</h2>
            <p className="mt-3 text-sm text-paper-dim">"{deleteTarget.title}" will be removed permanently.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button onClick={handleDeleteTask} disabled={deletingTask}>
                {deletingTask ? 'Deleting…' : 'Delete task'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}