import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import TaskCard from '../../components/project/TaskCard.jsx';
import TaskDetailsPanel from '../../components/project/TaskDetailsPanel.jsx';
import { useTask } from '../../hooks/useTask.js';
import { useDeveloper } from '../../hooks/useDeveloper.js';
import { useDebounce } from '../../hooks/useDebounce.js';

const PAGE_SIZE = 10;

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

export default function DeveloperTasks() {
  const [searchParams] = useSearchParams();
  const urlTaskId = searchParams.get('taskId');
  const urlStartupId = searchParams.get('startupId') || searchParams.get('projectId');

  const { projects, loadProjects } = useDeveloper();
  const { tasks, loading: tasksLoading, loadMyTasks, pagination } = useTask();

  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [deadlineFilter, setDeadlineFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [page, setPage] = useState(1);

  const search = useDebounce(searchInput, 400);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (!urlStartupId || projects.length === 0) return;
    const match = projects.find((p) => String(p.id) === String(urlStartupId));
    if (match) {
      setProjectFilter(String(match.id));
    }
  }, [urlStartupId, projects]);

  // Any filter change starts the list back at page 1.
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, priorityFilter, deadlineFilter, projectFilter]);

  useEffect(() => {
    loadMyTasks({
      search,
      status: statusFilter,
      priority: priorityFilter,
      deadline: deadlineFilter,
      project: projectFilter,
      page,
      limit: PAGE_SIZE,
    });
  }, [loadMyTasks, search, statusFilter, priorityFilter, deadlineFilter, projectFilter, page]);

  useEffect(() => {
    if (!urlTaskId || tasks.length === 0) return;
    const target = tasks.find((t) => String(t.id) === String(urlTaskId));
    if (target) {
      setSelectedTask(target);
    }
  }, [urlTaskId, tasks]);

  const totalPages = pagination?.totalPages ?? 1;
  const totalTasks = pagination?.total ?? tasks.length;

  return (
    <div className="w-full space-y-6">
      <div>
        <p className="text-sm font-medium text-cyan">Tasks</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-paper">My Tasks</h1>
        <p className="mt-1 text-sm text-paper-dim">
          Manage your tasks with focused filtering and task details.
        </p>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-center w-full">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-faint" size={16} />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10 w-full"
          />
        </div>

        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
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

      <div
        className={`grid gap-6 transition-all duration-300 ${
          selectedTask ? 'lg:grid-cols-[1fr_380px]' : 'lg:grid-cols-1'
        }`}
      >
        <div className="space-y-4">
          <div className="max-h-[640px] space-y-4 overflow-y-auto pr-2">
            {tasksLoading ? (
              <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">Loading tasks…</p>
            ) : tasks.length === 0 ? (
              <EmptyState
                title="No tasks found"
                body="Try adjusting your project, status, priority, or deadline filters."
              />
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isDeveloper
                  onClick={() => setSelectedTask(task)}
                />
              ))
            )}
          </div>

          {!tasksLoading && tasks.length > 0 && totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-blueprint-line pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-paper-faint">
                Page {pagination.page} of {totalPages} · {totalTasks} tasks
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>

        {selectedTask && (
          <aside>
            <TaskDetailsPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
          </aside>
        )}
      </div>
    </div>
  );
}