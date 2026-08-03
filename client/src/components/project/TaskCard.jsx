import { useState } from "react";
import { updateTaskStatus } from "../../services/task.service.js";
import { useToast } from "../../hooks/useToast.js";
import { getDeadlineStatus } from "../../utils/deadline.js";
import Modal from "../common/Modal.jsx";

const STATUS_LABELS = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Completed",
};

const STATUS_STYLES = {
    todo: "bg-blueprint-800 text-paper-dim",
    in_progress: "bg-amber-500/20 text-amber-300",
    done: "bg-emerald-500/20 text-emerald-300",
};

export default function TaskCard({
    task,
    isDeveloper = false,
    onDelete,
}) {
    const [status, setStatus] = useState(task.status);
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const { showToast } = useToast();

    const deadlineStatus = getDeadlineStatus(task.deadline, status);

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
        <>
            <div
                onClick={() => setShowDetails(true)}
                className="blueprint-card animate-draft-in cursor-pointer rounded-xl p-5 transition hover:border-cyan/50"
            >

                <div className="flex items-start justify-between">

                    <div className="min-w-0">

                        <h3 className="font-display text-xl font-semibold text-paper">
                            {task.title}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-paper-dim">
                            {task.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">

                            <span className="rounded bg-blueprint-800 px-3 py-1 text-xs font-semibold text-cyan">
                                {task.priority}
                            </span>

                            <span className="rounded bg-blueprint-800 px-3 py-1 text-xs font-semibold text-paper">
                                Deadline: {task.deadline?.slice(0, 10)}
                            </span>

                            <span className={`rounded px-3 py-1 text-xs font-semibold ${deadlineStatus.badgeClass}`}>
                                {deadlineStatus.label}
                            </span>

                        </div>

                    </div>

                    {!isDeveloper ? (

                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col items-end gap-2"
                        >

                            <span
                                className={`rounded px-3 py-1 text-xs font-semibold ${
                                    STATUS_STYLES[task.status] ?? STATUS_STYLES.todo
                                }`}
                            >
                                {STATUS_LABELS[task.status] ?? task.status}
                            </span>

                            {task.developer_name && (
                                <span className="text-xs text-paper-dim">
                                    Assigned to: {task.developer_name}
                                </span>
                            )}

                            <button
                                onClick={() => onDelete(task)}
                                className="rounded bg-red-500 px-3 py-2 text-sm font-semibold"
                            >
                                Delete
                            </button>

                        </div>

                    ) : (

                        <select
                            value={status}
                            disabled={loading}
                            onClick={(e) => e.stopPropagation()}
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

            <Modal
                open={showDetails}
                onClose={() => setShowDetails(false)}
                title={task.title}
            >

                <p className="whitespace-pre-wrap text-paper-dim">
                    {task.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">

                    <span className="rounded bg-blueprint-800 px-3 py-1 text-xs font-semibold text-cyan">
                        {task.priority}
                    </span>

                    <span className="rounded bg-blueprint-800 px-3 py-1 text-xs font-semibold text-paper">
                        Deadline: {task.deadline?.slice(0, 10)}
                    </span>

                    <span className={`rounded px-3 py-1 text-xs font-semibold ${deadlineStatus.badgeClass}`}>
                        {deadlineStatus.label}
                    </span>

                    <span
                        className={`rounded px-3 py-1 text-xs font-semibold ${
                            STATUS_STYLES[task.status] ?? STATUS_STYLES.todo
                        }`}
                    >
                        {STATUS_LABELS[task.status] ?? task.status}
                    </span>

                </div>

                {task.developer_name && (
                    <p className="mt-4 text-sm text-paper-dim">
                        Assigned to: {task.developer_name}
                    </p>
                )}

            </Modal>
        </>
    );
}