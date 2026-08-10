import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import {
    Users,
    ListChecks,
    Search,
} from "lucide-react";

import BackButton from "../../components/common/BackButton.jsx";
import WorkspaceHeader from "../../components/project/WorkspaceHeader.jsx";
import MemberCard from "../../components/project/MemberCard.jsx";
import TaskCard from "../../components/project/TaskCard.jsx";
import TaskDetailsPanel from "../../components/project/TaskDetailsPanel.jsx";

import Button from "../../components/ui/Button.jsx";
import AssignTaskModal from "../../components/startup/AssignTaskModal.jsx";

import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import ChatBox from "../../components/chat/ChatBox.jsx";
import AiAssistantPanel from "../../components/project/AiAssistantPanel.jsx";

import EmptyState from "../../components/ui/EmptyState.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";

import {
    createTask,
    deleteTask,
} from "../../services/task.service.js";

import {
    removeMember,
} from "../../services/member.service.js";

import { useStartup } from "../../hooks/useStartup.js";
import { useTask } from "../../hooks/useTask.js";
import { useMember } from "../../hooks/useMember.js";
import { useToast } from "../../hooks/useToast.js";

export default function ProjectWorkspace() {

    const { startupId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

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

    const [selectedTask, setSelectedTask] = useState(null);

    const [memberSearch, setMemberSearch] = useState("");

    const [taskSearch, setTaskSearch] = useState("");

    const [debouncedMemberSearch, setDebouncedMemberSearch] =
        useState("");

    const [debouncedTaskSearch, setDebouncedTaskSearch] =
        useState("");

    useEffect(() => {

        loadStartups();

    }, [loadStartups]);

    useEffect(() => {

        const timer = setTimeout(() => {

            setDebouncedMemberSearch(memberSearch);

        }, 400);

        return () => clearTimeout(timer);

    }, [memberSearch]);

        useEffect(() => {

        const timer = setTimeout(() => {

            setDebouncedTaskSearch(taskSearch);

        }, 400);

        return () => clearTimeout(timer);

    }, [taskSearch]);

    useEffect(() => {

        if (!startupId) return;

        loadMembers(
            startupId,
            debouncedMemberSearch
        );

    }, [
        startupId,
        debouncedMemberSearch,
        loadMembers,
    ]);

    useEffect(() => {

        if (!startupId) return;

        loadStartupTasks(
            startupId,
            debouncedTaskSearch
        );

    }, [
        startupId,
        debouncedTaskSearch,
        loadStartupTasks,
    ]);

    // Global search deep-links here with ?taskId=... so the target task
    // opens automatically once it's loaded.
    useEffect(() => {

        const taskId = searchParams.get("taskId");

        if (!taskId || tasks.length === 0) return;

        const target = tasks.find(
            (task) => String(task.id) === String(taskId)
        );

        if (!target) return;

        setSelectedTask(target);

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("taskId");
        setSearchParams(nextParams, { replace: true });

    }, [tasks, searchParams, setSearchParams]);

    const startup = useMemo(() => {

        return startups.find(
            (item) =>
                String(item.id) === String(startupId)
        );

    }, [startups, startupId]);

    const loading =
        tasksLoading ||
        membersLoading;

    // Deep-linking by hash removed in favor of route-based pages.

    const handleAssignTask = async (taskData) => {

        try {

            setCreatingTask(true);

            await createTask({
                ...taskData,
                startup_id: startupId,
            });

            await loadStartupTasks(
                startupId,
                debouncedTaskSearch
            );

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

            await removeMember(
                startupId,
                member.id
            );

            await loadMembers(
                startupId,
                debouncedMemberSearch
            );

            await loadStartupTasks(
                startupId,
                debouncedTaskSearch
            );

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

            await loadStartupTasks(
                startupId,
                debouncedTaskSearch
            );

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

        <div className="mx-auto max-w-7xl space-y-6">
            <BackButton fallbackPath="/founder/startups" label="Back to Startups" />

            <WorkspaceHeader
                startup={startup}
                membersCount={members.length}
                tasksCount={tasks.length}
                onAssignTask={() =>
                    setAssignModalOpen(true)
                }
            />

            <div
                className={`grid gap-6 transition-all duration-300 ${
                    selectedTask
                        ? "lg:grid-cols-[1fr_380px]"
                        : "lg:grid-cols-1"
                }`}
            >

                {/* Left Content */}

                <div className="space-y-6">

                    <div className="grid gap-6 lg:grid-cols-3">

                        {/* Team Members */}

                        <div id="team-members" className="blueprint-card p-6">

                            <h2 className="mb-5 font-display text-lg font-semibold text-paper">
                                Team Members
                            </h2>

                            <div className="relative mb-4">

                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-paper-faint"
                                />

                                <input
                                    type="text"
                                    value={memberSearch}
                                    onChange={(e) =>
                                        setMemberSearch(e.target.value)
                                    }
                                    placeholder="Search members..."
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-blueprint-line
                                        bg-white
                                        py-2
                                        pl-10
                                        pr-3
                                        text-sm
                                        outline-none
                                        focus:border-cyan
                                        focus:ring-2
                                        focus:ring-cyan/20
                                    "
                                />

                            </div>

                            {loading ? (

                                <div className="space-y-3">

                                    <Skeleton
                                        className="h-16 w-full"
                                        rounded="rounded-xl"
                                    />

                                    <Skeleton
                                        className="h-16 w-full"
                                        rounded="rounded-xl"
                                    />

                                </div>

                            ) : members.length === 0 ? (

                                <EmptyState
                                    icon={Users}
                                    title="No members found"
                                    body="Try another search or invite developers."
                                />

                            ) : (

                                <div className="max-h-[520px] overflow-y-auto pr-2 space-y-3">

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

                        {/* Project Tasks */}

                        <div id="tasks" className="blueprint-card p-6 lg:col-span-2">

                            <h2 className="mb-5 font-display text-lg font-semibold text-paper">
                                Project Tasks
                            </h2>

                            <div className="relative mb-4">

                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-paper-faint"
                                />

                                <input
                                    type="text"
                                    value={taskSearch}
                                    onChange={(e) =>
                                        setTaskSearch(e.target.value)
                                    }
                                    placeholder="Search tasks..."
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-blueprint-line
                                        bg-white
                                        py-2
                                        pl-10
                                        pr-3
                                        text-sm
                                        outline-none
                                        focus:border-cyan
                                        focus:ring-2
                                        focus:ring-cyan/20
                                    "
                                />

                            </div>

                                                        {loading ? (

                                <div className="space-y-3">

                                    <Skeleton
                                        className="h-24 w-full"
                                        rounded="rounded-xl"
                                    />

                                    <Skeleton
                                        className="h-24 w-full"
                                        rounded="rounded-xl"
                                    />

                                </div>

                            ) : tasks.length === 0 ? (

                                <EmptyState
                                    icon={ListChecks}
                                    title="No tasks found"
                                    body="Try another search or assign a new task."
                                    action={
                                        <Button
                                            onClick={() =>
                                                setAssignModalOpen(true)
                                            }
                                        >
                                            Assign Task
                                        </Button>
                                    }
                                />

                            ) : (

                                <div className="max-h-[520px] overflow-y-auto pr-2 space-y-4">

                                    {tasks.map((task) => (

                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onDelete={setDeleteTarget}
                                            onClick={() =>
                                                setSelectedTask(task)
                                            }
                                        />

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>

                    {/* AI Assistant */}

                    <div id="ai-assistant">
                        <AiAssistantPanel
                            startupId={startupId}
                        />
                    </div>

                    {/* Team Chat */}

                    <div id="team-chat">
                        <ChatBox
                            startupId={startupId}
                        />
                    </div>

                </div>

                {/* Right ClickUp Panel */}

                {selectedTask && (

                    <TaskDetailsPanel
                        task={selectedTask}
                        onClose={() =>
                            setSelectedTask(null)
                        }
                    />

                )}

            </div>

            <AssignTaskModal
                key={
                    assignModalOpen
                        ? "open"
                        : "closed"
                }
                open={assignModalOpen}
                onClose={() =>
                    setAssignModalOpen(false)
                }
                members={members}
                onSubmit={handleAssignTask}
                loading={creatingTask}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() =>
                    setDeleteTarget(null)
                }
                onConfirm={handleDeleteTask}
                confirming={deletingTask}
                title="Delete this task?"
                body={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
            />
                    </div>

    );

}