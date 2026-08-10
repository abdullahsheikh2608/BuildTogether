import {
    X,
    Calendar,
    User,
    ClipboardList,
    Flag,
} from "lucide-react";

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

export default function TaskDetailsPanel({
    task,
    onClose,
}) {

    if (!task) return null;

    return (

        <aside
            className="
                h-fit
                sticky
                top-8
                w-full
                rounded-2xl
                border
                border-blueprint-line
                bg-white
                shadow-xl
                animate-draft-in
                overflow-hidden
            "
        >

            {/* Header */}

            <div className="flex items-start justify-between border-b border-blueprint-line px-6 py-5">

                <div>

                    <p className="text-xs uppercase tracking-widest text-paper-faint">
                        Task Details
                    </p>

                    <h2 className="mt-2 font-display text-2xl font-bold text-paper">
                        {task.title}
                    </h2>

                </div>

                <button
                    onClick={onClose}
                    className="
                        rounded-lg
                        p-2
                        transition
                        hover:bg-blueprint-800
                    "
                >
                    <X size={20} />
                </button>

            </div>

            {/* Content */}

            <div className="space-y-6 p-6">


                                {/* Status */}

                <div className="blueprint-card p-4">

                    <div className="mb-4 flex items-center gap-2">

                        <ClipboardList
                            size={18}
                            className="text-cyan"
                        />

                        <h3 className="font-semibold text-paper">
                            Task Information
                        </h3>

                    </div>

                    <div className="space-y-4">

                        <div className="flex items-center justify-between">

                            <span className="text-paper-dim">
                                Status
                            </span>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    STATUS_STYLES[task.status]
                                }`}
                            >
                                {STATUS_LABELS[task.status]}
                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-paper-dim">
                                Priority
                            </span>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                    PRIORITY_STYLES[task.priority]
                                }`}
                            >
                                {task.priority}
                            </span>

                        </div>

                        <div className="flex items-center gap-3">

                            <Calendar
                                size={16}
                                className="text-cyan"
                            />

                            <div>

                                <p className="text-xs text-paper-faint">
                                    Deadline
                                </p>

                                <p className="text-sm font-medium text-paper">

                                    {task.deadline
                                        ? task.deadline.slice(0, 10)
                                        : "No deadline"}

                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-3">

                            <User
                                size={16}
                                className="text-cyan"
                            />

                            <div>

                                <p className="text-xs text-paper-faint">
                                    Assigned To
                                </p>

                                <p className="text-sm font-medium text-paper">

                                    {task.developer_name ??
                                        "Unassigned"}

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Description */}

                <div className="blueprint-card p-4">

                    <div className="mb-4 flex items-center gap-2">

                        <Flag
                            size={18}
                            className="text-cyan"
                        />

                        <h3 className="font-semibold text-paper">
                            Description
                        </h3>

                    </div>

                    <div
                        className="
                            max-h-[350px]
                            overflow-y-auto
                            whitespace-pre-wrap
                            leading-7
                            text-paper-dim
                            pr-2
                        "
                    >

                        {task.description}

                    </div>

                </div>
                            </div>

            {/* Footer */}

            <div className="border-t border-blueprint-line px-6 py-4">

                <button
                    onClick={onClose}
                    className="
                        w-full
                        rounded-xl
                        bg-cyan
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:opacity-90
                    "
                >
                    Close
                </button>

            </div>

        </aside>

    );

}
            