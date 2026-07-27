import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import WorkspaceHeader from "../../components/project/WorkspaceHeader.jsx";
import MemberCard from "../../components/project/MemberCard.jsx";
import TaskCard from "../../components/project/TaskCard.jsx";

import { useStartup } from "../../hooks/useStartup.js";
import { useTask } from "../../hooks/useTask.js";
import { useMember } from "../../hooks/useMember.js";

export default function ProjectWorkspace() {
    const { startupId } = useParams();

    const {
        startups,
        loadStartups,
    } = useStartup();

    const {
        tasks,
        loading: tasksLoading,
        loadStartupTasks,
    } = useTask();

    const {
        members,
        loading: membersLoading,
        loadMembers,
    } = useMember();

    const [assignModalOpen, setAssignModalOpen] = useState(false);

    useEffect(() => {
        loadStartups();
    }, [loadStartups]);

    useEffect(() => {
        if (!startupId) return;

        loadMembers(startupId);
        loadStartupTasks(startupId);
    }, [
        startupId,
        loadMembers,
        loadStartupTasks,
    ]);

    const startup = useMemo(() => {
        return startups.find(
            (item) => String(item.id) === String(startupId)
        );
    }, [startups, startupId]);

    const loading =
        tasksLoading ||
        membersLoading;

            return (
        <div className="mx-auto max-w-7xl space-y-8">

            <WorkspaceHeader
                startup={startup}
                membersCount={members.length}
                tasksCount={tasks.length}
                onAssignTask={() => setAssignModalOpen(true)}
            />

            <div className="grid gap-6 lg:grid-cols-3">

                {/* Team Members */}

                <div className="blueprint-card rounded-xl p-6">
                    <h2 className="mb-5 font-display text-xl font-semibold text-paper">
                        Team Members
                    </h2>

                    {loading ? (
                        <p className="text-paper-dim">
                            Loading members...
                        </p>
                    ) : members.length === 0 ? (
                        <p className="text-paper-dim">
                            No members found.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {members.map((member) => (
                                <MemberCard
                                    key={member.id}
                                    member={member}
                                    onRemove={(member) =>
                                        console.log("Remove", member)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Tasks */}

                <div className="blueprint-card rounded-xl p-6 lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="font-display text-xl font-semibold text-paper">
                            Project Tasks
                        </h2>
                    </div>

                    {loading ? (
                        <p className="text-paper-dim">
                            Loading tasks...
                        </p>
                    ) : tasks.length === 0 ? (
                        <p className="text-paper-dim">
                            No tasks available.
                        </p>
                    ) : (
                        <div className="space-y-5">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEdit={(task) =>
                                        console.log("Edit", task)
                                    }
                                    onDelete={(task) =>
                                        console.log("Delete", task)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>

                        {/* Assign Task Modal (Coming Soon) */}

            {assignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-md rounded-xl border border-blueprint-line bg-blueprint-900 p-6">
                        <h2 className="font-display text-2xl font-semibold text-paper">
                            Assign Task
                        </h2>

                        <p className="mt-3 text-paper-dim">
                            Task assignment form will be connected in the next
                            feature.
                        </p>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setAssignModalOpen(false)}
                                className="rounded bg-cyan px-4 py-2 font-semibold text-black"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}