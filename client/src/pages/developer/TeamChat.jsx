import { useEffect, useMemo, useState } from "react";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import EmptyState from "../../components/ui/EmptyState.jsx";
import ChatBox from "../../components/chat/ChatBox.jsx";
import { useDeveloper } from "../../hooks/useDeveloper.js";

export default function TeamChat() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlStartupId = searchParams.get("startupId") || searchParams.get("projectId");

    const { projects, loading, loadProjects } = useDeveloper();
    const [selectedProjectId, setSelectedProjectId] = useState('');

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const acceptedProjects = useMemo(
        () => projects.filter((project) => project.status === "accepted"),
        [projects]
    );

    useEffect(() => {
        if (acceptedProjects.length === 0) return;

        const match = acceptedProjects.find((p) => String(p.id) === String(urlStartupId));
        const targetId = match ? String(match.id) : String(acceptedProjects[0].id);

        setSelectedProjectId(targetId);

        if (searchParams.get("startupId") !== targetId) {
            setSearchParams({ startupId: targetId }, { replace: true });
        }
    }, [acceptedProjects, urlStartupId, searchParams, setSearchParams]);

    const handleSelectProject = (id) => {
        const strId = String(id);
        setSelectedProjectId(strId);
        setSearchParams({ startupId: strId }, { replace: true });
    };

    const selectedProject = acceptedProjects.find(
        (project) => String(project.id) === String(selectedProjectId)
    );

    return (
        <div className="w-full space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <div>
                <p className="text-sm font-medium text-cyan-600">Messaging</p>
                <h1 className="mt-1 font-display text-2xl font-semibold text-slate-900">Team Chat</h1>
                <p className="mt-1 text-sm text-slate-500">A dedicated messaging workspace for your project conversations.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 px-1 pb-3">
                        <MessageSquare size={16} className="text-cyan-600" />
                        <h2 className="text-sm font-semibold text-slate-900">Conversations</h2>
                    </div>

                    <div className="space-y-1.5">
                        {loading ? (
                            <p className="px-1 text-sm text-slate-500">Loading projects…</p>
                        ) : acceptedProjects.length === 0 ? (
                            <p className="px-1 text-sm text-slate-500">No accepted projects yet.</p>
                        ) : (
                            acceptedProjects.map((project) => (
                                <button
                                    type="button"
                                    key={project.id}
                                    onClick={() => handleSelectProject(project.id)}
                                    className={`w-full rounded-xl border px-3.5 py-3 text-left transition-colors duration-150 ${
                                        String(project.id) === String(selectedProjectId)
                                            ? 'border-cyan-200 bg-cyan-50'
                                            : 'border-transparent hover:bg-slate-50'
                                    }`}
                                >
                                    <p className={`text-sm font-medium truncate ${
                                        String(project.id) === String(selectedProjectId) ? 'text-cyan-700' : 'text-slate-900'
                                    }`}>
                                        {project.title}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500 truncate">{project.tagline || 'Open this project chat.'}</p>
                                </button>
                            ))
                        )}
                    </div>
                </aside>

                <main>
                    {selectedProject ? (
                        <ChatBox startupId={selectedProjectId} variant="page" title={selectedProject.title} />
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <EmptyState
                                icon={MessageSquare}
                                title="Select a conversation"
                                body="Pick a project from the left side to open its chat."
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}