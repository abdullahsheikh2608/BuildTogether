import Button from "../ui/Button.jsx";
import StampBadge from "../ui/StampBadge.jsx";

export default function TaskCard({
    task,
    onEdit,
    onDelete,
}) {
    return (
        <div className="blueprint-card animate-draft-in rounded-xl p-5">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-paper">
                        {task.title}
                    </h3>

                    <p className="mt-2 text-sm text-paper-dim">
                        {task.description}
                    </p>
                </div>

                <StampBadge status={task.status} />
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-paper-faint">
                        Assigned To
                    </p>

                    <p className="font-medium text-paper">
                        {task.assignee_name || "Unassigned"}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => onEdit(task)}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="danger"
                        onClick={() => onDelete(task)}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}