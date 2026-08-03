import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import TaskCard from "../../components/project/TaskCard.jsx";
import MemberCard from "../../components/project/MemberCard.jsx";
import ChatBox from "../../components/chat/ChatBox.jsx";

import { useTask } from "../../hooks/useTask.js";
import { useMember } from "../../hooks/useMember.js";
import { useDeveloper } from "../../hooks/useDeveloper.js";

export default function DeveloperWorkspace() {
    const { startupId } = useParams();

    const {
        projects,
        loadProjects,
    } = useDeveloper();

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

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    useEffect(() => {
        if (!startupId) return;

        loadStartupTasks(startupId);
        loadMembers(startupId);
    }, [startupId, loadStartupTasks, loadMembers]);

    const project = useMemo(() => {
        return projects.find(
            (item) => String(item.id) === String(startupId)
        );
    }, [projects, startupId]);

    const loading = tasksLoading || membersLoading;

    return (
        <div className="mx-auto max-w-7xl space-y-8">

            <div>
                <p className="font-mono text-xs uppercase tracking-widest text-cyan">
                    Developer Workspace
                </p>

                <h1 className="mt-2 font-display text-3xl font-bold text-paper">
                    {project?.title ?? "Project Workspace"}
                </h1>

                <p className="mt-3 text-paper-dim">
                    {project?.tagline ?? "View your team, tasks, and chat for this project."}
                </p>
            </div>

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
                                />

                            ))}

                        </div>

                    )}

                </div>

                {/* Tasks */}

                <div className="blueprint-card rounded-xl p-6 lg:col-span-2">

                    <h2 className="mb-5 font-display text-xl font-semibold text-paper">
                        Project Tasks
                    </h2>

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
                                    isDeveloper
                                />

                            ))}

                        </div>

                    )}

                </div>

            </div>

            {/* Team Chat */}

            <ChatBox startupId={startupId} />

        </div>
    );
}