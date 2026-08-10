import { Users, ListChecks, CircleDot } from "lucide-react";
import Button from "../ui/Button.jsx";

export default function WorkspaceHeader({
    startup,
    membersCount,
    tasksCount,
    onAssignTask,
}) {
    return (
        <div className="blueprint-card animate-draft-in p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-cyan">
                        Project Workspace
                    </p>

                    <h1 className="mt-1 font-display text-3xl font-bold text-paper">
                        {startup?.title || "Startup Workspace"}
                    </h1>

                    <p className="mt-1.5 max-w-2xl text-sm text-paper-dim">
                        {startup?.tagline ||
                            "Manage your project, assign tasks and collaborate with your team."}
                    </p>
                </div>

                {onAssignTask && (
                    <Button onClick={onAssignTask}>
                        Assign Task
                    </Button>
                )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-blueprint-line bg-blueprint-800/50 p-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-paper-faint">
                        <Users size={14} />
                        <span>Members</span>
                    </div>

                    <p className="mt-2 font-display text-2xl font-bold text-paper">
                        {membersCount}
                    </p>
                </div>

                <div className="rounded-lg border border-blueprint-line bg-blueprint-800/50 p-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-paper-faint">
                        <ListChecks size={14} />
                        <span>Tasks</span>
                    </div>

                    <p className="mt-2 font-display text-2xl font-bold text-paper">
                        {tasksCount}
                    </p>
                </div>

                <div className="rounded-lg border border-blueprint-line bg-blueprint-800/50 p-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-paper-faint">
                        <CircleDot size={14} />
                        <span>Status</span>
                    </div>

                    <p className="mt-2 font-display text-lg font-bold text-ink-green">
                        Active
                    </p>
                </div>
            </div>
        </div>
    );
}