import { useEffect } from "react";

import { useTask } from "../../hooks/useTask.js";

import TaskCard from "../../components/project/TaskCard.jsx";

export default function DeveloperWorkspace() {
    const {
        tasks,
        loading,
        loadMyTasks,
    } = useTask();

    useEffect(() => {
        loadMyTasks();
    }, [loadMyTasks]);

    return (
        <div className="mx-auto max-w-7xl space-y-8">

            <div>

                <p className="font-mono text-xs uppercase tracking-widest text-cyan">
                    Developer Workspace
                </p>

                <h1 className="mt-2 font-display text-3xl font-bold text-paper">
                    My Assigned Tasks
                </h1>

                <p className="mt-3 text-paper-dim">
                    View and manage your assigned tasks.
                </p>

            </div>

            {loading ? (

                <div className="blueprint-card rounded-xl p-6">
                    <p className="text-paper-dim">
                        Loading tasks...
                    </p>
                </div>

            ) : tasks.length === 0 ? (

                <div className="blueprint-card rounded-xl p-8 text-center">

                    <h2 className="font-display text-2xl text-paper">
                        No Tasks Assigned
                    </h2>

                    <p className="mt-3 text-paper-dim">
                        You don't have any assigned tasks yet.
                    </p>

                </div>

            ) : (

                <div className="space-y-5">

                    {tasks.map((task) => (

                        <TaskCard
                            key={task.id}
                            task={task}
                            isDeveloper
                        />

                    ))}

                </div>

            )}

        </div>
    );
}