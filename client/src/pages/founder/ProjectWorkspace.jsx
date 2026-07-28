import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import WorkspaceHeader from "../../components/project/WorkspaceHeader.jsx";
import MemberCard from "../../components/project/MemberCard.jsx";
import TaskCard from "../../components/project/TaskCard.jsx";

import AssignTaskModal from "../../components/startup/AssignTaskModal.jsx";

import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

import { createTask, deleteTask } from "../../services/task.service.js";
import { removeMember } from "../../services/member.service.js";

import { useStartup } from "../../hooks/useStartup.js";
import { useTask } from "../../hooks/useTask.js";
import { useMember } from "../../hooks/useMember.js";
import { useToast } from "../../hooks/useToast.js";

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

    const { showToast } = useToast();

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [creatingTask, setCreatingTask] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deletingTask, setDeletingTask] = useState(false);

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

    const handleAssignTask = async (taskData) => {
        try {
            setCreatingTask(true);

            await createTask({
                ...taskData,
                startup_id: startupId,
            });

            await loadStartupTasks(startupId);

            setAssignModalOpen(false);

            showToast({
                type: "success",
                message: "Task assigned successfully.",
            });

        } catch (error) {

            showToast({
                type: "error",
                message:
                    error.response?.data?.message ??
                    "Unable to create task.",
            });

        } finally {
            setCreatingTask(false);
        }
    };

    const handleRemoveMember = async (member) => {

        const confirmed = window.confirm(
            `Remove ${member.full_name} from this project?`
        );

        if (!confirmed) return;

        try {

            await removeMember(startupId, member.id);

            await loadMembers(startupId);
            await loadStartupTasks(startupId);

            showToast({
                type: "success",
                message: "Member removed successfully.",
            });

        } catch (error) {

            showToast({
                type: "error",
                message:
                    error.response?.data?.message ??
                    "Unable to remove member.",
            });

        }
    };

    const handleDeleteTask = async () => {
        try {
            setDeletingTask(true);

            await deleteTask(deleteTarget.id);
            await loadStartupTasks(startupId);

            setDeleteTarget(null);

            showToast({
                type: "success",
                message: "Task deleted.",
            });

        } catch (error) {

            showToast({
                type: "error",
                message:
                    error.response?.data?.message ??
                    "Unable to delete task.",
            });

        } finally {
            setDeletingTask(false);
        }
    };

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
                                    onRemove={handleRemoveMember}
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
                                    onDelete={setDeleteTarget}
                                />

                            ))}

                        </div>

                    )}

                </div>

            </div>

            <AssignTaskModal
                key={assignModalOpen ? "open" : "closed"}
                open={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                members={members}
                onSubmit={handleAssignTask}
                loading={creatingTask}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteTask}
                confirming={deletingTask}
                title="Delete this task?"
                body={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
            />

        </div>
    );
}