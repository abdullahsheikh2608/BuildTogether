import { useState } from "react";
import { Trash2, User } from "lucide-react";

import { updateTaskStatus } from "../../services/task.service.js";
import { useToast } from "../../hooks/useToast.js";
import { getDeadlineStatus } from "../../utils/deadline.js";
import ExpandableText from "../ui/ExpandableText.jsx";
import Select from "../ui/Select.jsx";

const STATUS_LABELS = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Completed",
};

const STATUS_STYLES = {
    todo: "bg-blueprint-800 text-paper-dim",
    in_progress: "bg-cyan-dim text-cyan",
    done: "bg-[#DCFCE7] text-ink-green",
};

const PRIORITY_STYLES = {
    low: "bg-blueprint-800 text-paper-dim",
    medium: "bg-amber-dim text-amber",
    high: "bg-[#FEE2E2] text-ink-red",
};

export default function TaskCard({
    task,
    isDeveloper = false,
    onDelete,
    onClick,
}) {
    const [status, setStatus] = useState(task.status);
    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();

    const deadlineStatus = getDeadlineStatus(
        task.deadline,
        status
    );

    const handleStatusChange = async (e) => {
        e.stopPropagation();

        const newStatus = e.target.value;
        const previousStatus = status;

        setStatus(newStatus);

        try {
            setLoading(true);

            await updateTaskStatus(
                task.id,
                newStatus
            );
        } catch (error) {
            setStatus(previousStatus);

            showToast({
                type: "error",
                message:
                    error.response?.data?.message ??
                    "Unable to update task status.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={onClick}
            className="blueprint-card card-interactive animate-draft-in cursor-pointer p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
            <div className="flex items-start justify-between gap-4">

                {/* Left Side */}

                <div className="min-w-0 flex-1">

                    <h3 className="font-display text-lg font-semibold text-paper">
                        {task.title}
                    </h3>

                    <ExpandableText
                        title={task.title}
                        text={task.description}
                        className="mt-2 text-sm text-paper-dim"
                    />

                    <div className="mt-4 flex flex-wrap gap-2">

                        <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                PRIORITY_STYLES[task.priority]
                            }`}
                        >
                            {task.priority}
                        </span>

                        <span className="rounded-full bg-blueprint-800 px-2.5 py-1 text-xs font-medium text-paper-dim">
                            Deadline: {task.deadline?.slice(0, 10)}
                        </span>

                        <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${deadlineStatus.badgeClass}`}
                        >
                            {deadlineStatus.label}
                        </span>

                    </div>

                    {task.developer_name && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-paper-dim">

                            <User size={13} />

                            <span>
                                Assigned to {task.developer_name}
                            </span>

                        </div>
                    )}

                </div>

                {/* Right Side */}

                {!isDeveloper ? (

                    <div className="flex shrink-0 flex-col items-end gap-3">

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                STATUS_STYLES[task.status]
                            }`}
                        >
                            {STATUS_LABELS[task.status]}
                        </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(task);
                            }}
                            className="rounded-lg p-2 transition hover:bg-red-50 hover:text-red-600"
                        >
                            <Trash2 size={17} />
                        </button>

                    </div>

                ) : (

                    <div
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Select
                            value={status}
                            disabled={loading}
                            onChange={handleStatusChange}
                            className="w-40"
                        >
                            <option value="todo">
                                To Do
                            </option>

                            <option value="in_progress">
                                In Progress
                            </option>

                            <option value="done">
                                Completed
                            </option>
                        </Select>
                    </div>

                )}

            </div>
        </div>
    );
}