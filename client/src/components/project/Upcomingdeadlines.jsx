import { getDeadlineStatus } from "../../utils/deadline.js";

const MAX_VISIBLE_TASKS = 5;

// Shows the tasks with the nearest upcoming deadlines, excluding completed
// ones. Reusable anywhere a list of `tasks` (each with title/deadline/status)
// is available — currently used on the developer dashboard.
export default function UpcomingDeadlines({ tasks = [] }) {
    const upcomingTasks = tasks
        .filter((task) => task.deadline && task.status !== "done")
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, MAX_VISIBLE_TASKS);

    if (upcomingTasks.length === 0) {
        return null;
    }

    return (
        <div className="blueprint-card rounded-xl p-6">

            <h2 className="font-display text-lg font-semibold text-paper">
                Upcoming Deadlines
            </h2>

            <div className="mt-4 flex flex-col gap-3">

                {upcomingTasks.map((task) => {
                    const deadlineStatus = getDeadlineStatus(task.deadline, task.status);

                    return (
                        <div
                            key={task.id}
                            className="flex items-center justify-between gap-4 rounded-lg border border-blueprint-line px-4 py-3"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-paper">
                                    {task.title}
                                </p>
                                <p className="mt-0.5 truncate text-xs text-cyan">
                                    {task.startup_title}
                                </p>
                                <p className="mt-0.5 text-xs text-paper-dim">
                                    Due {task.deadline?.slice(0, 10)}
                                </p>
                            </div>

                            <span className={`shrink-0 rounded px-3 py-1 text-xs font-semibold ${deadlineStatus.badgeClass}`}>
                                {deadlineStatus.label}
                            </span>
                        </div>
                    );
                })}

            </div>

        </div>
    );
}