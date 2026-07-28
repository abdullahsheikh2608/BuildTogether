import { useState } from "react";
import { updateTaskStatus } from "../../services/task.service.js";
import { useToast } from "../../hooks/useToast.js";

export default function TaskCard({
    task,
    isDeveloper = false,
    onDelete,
}) {
    const [status, setStatus] = useState(task.status);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        const previousStatus = status;

        // Update optimistically so the select feels instant, revert on failure.
        setStatus(newStatus);

        try {
            setLoading(true);
            await updateTaskStatus(task.id, newStatus);
        } catch (error) {
            setStatus(previousStatus);
            showToast({
                type: "error",
                message:
                    error.response?.data?.message ?? "Unable to update task status.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blueprint-card animate-draft-in rounded-xl p-5">

            <div className="flex items-start justify-between">

                <div>

                    <h3 className="font-display text-xl font-semibold text-paper">
                        {task.title}
                    </h3>

                    <p className="mt-2 text-paper-dim">
                        {task.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                        <span className="rounded bg-blueprint-800 px-3 py-1 text-xs font-semibold text-cyan">
                            {task.priority}
                        </span>

                        <span className="rounded bg-blueprint-800 px-3 py-1 text-xs font-semibold text-paper">
                            Deadline: {task.deadline?.slice(0, 10)}
                        </span>

                    </div>

                </div>

                {!isDeveloper ? (

                    <button
                        onClick={() => onDelete(task)}
                        className="rounded bg-red-500 px-3 py-2 text-sm font-semibold"
                    >
                        Delete
                    </button>

                ) : (

                    <select
                        value={status}
                        disabled={loading}
                        onChange={handleStatusChange}
                        className="rounded border border-blueprint-line bg-blueprint-800 px-3 py-2 text-paper"
                    >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Completed</option>
                    </select>

                )}

            </div>

        </div>
    );
}