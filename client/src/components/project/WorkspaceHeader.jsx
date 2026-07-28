import Button from "../ui/Button.jsx";

export default function WorkspaceHeader({
    startup,
    membersCount,
    tasksCount,
    onAssignTask,
}) {
    return (
        <div className="blueprint-card animate-draft-in rounded-xl p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-cyan">
                        Project Workspace
                    </p>

                    <h1 className="mt-2 font-display text-3xl font-bold text-paper">
                        {startup?.title || "Startup Workspace"}
                    </h1>

                    <p className="mt-2 max-w-2xl text-paper-dim">
                        {startup?.tagline ||
                            "Manage your project, assign tasks and collaborate with your team."}
                    </p>
                </div>

                <Button onClick={onAssignTask}>
                    Assign Task
                </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-blueprint-line bg-blueprint-800 p-4">
                    <p className="font-mono text-xs uppercase tracking-wider text-paper-faint">
                        Members
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-cyan">
                        {membersCount}
                    </h2>
                </div>

                <div className="rounded-lg border border-blueprint-line bg-blueprint-800 p-4">
                    <p className="font-mono text-xs uppercase tracking-wider text-paper-faint">
                        Tasks
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-amber">
                        {tasksCount}
                    </h2>
                </div>

                <div className="rounded-lg border border-blueprint-line bg-blueprint-800 p-4">
                    <p className="font-mono text-xs uppercase tracking-wider text-paper-faint">
                        Status
                    </p>

                    <h2 className="mt-2 text-lg font-bold text-ink-green">
                        Active
                    </h2>
                </div>
            </div>
        </div>
    );
}