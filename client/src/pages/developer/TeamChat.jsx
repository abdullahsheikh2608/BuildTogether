import { useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import EmptyState from "../../components/ui/EmptyState.jsx";
import ChatBox from "../../components/chat/ChatBox.jsx";
import { useDeveloper } from "../../hooks/useDeveloper.js";

export default function TeamChat() {
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
        <div className="mx-auto max-w-7xl space-y-6">
            <div>
                <p className="text-sm font-medium text-cyan">Team Chat</p>
                <h1 className="mt-2 font-display text-2xl font-semibold text-paper">Team Chat</h1>
                <p className="mt-1 text-sm text-paper-dim">A dedicated messaging workspace for your project conversations.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                <aside className="blueprint-card p-5">
                    <div className="flex items-center gap-2">
                        <MessageSquare size={18} className="text-cyan" />
                        <h2 className="font-display text-lg font-semibold text-paper">Conversations</h2>
                    </div>

                    <div className="mt-5 space-y-3">
                        {loading ? (
                            <p className="text-sm text-paper-dim">Loading projects…</p>
                        ) : acceptedProjects.length === 0 ? (
                            <p className="text-sm text-paper-dim">No accepted projects yet.</p>
                        ) : (
                            acceptedProjects.map((project) => (
                                <button
                                    type="button"
                                    key={project.id}
                                    onClick={() => handleSelectProject(project.id)}
                                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                                        String(project.id) === String(selectedProjectId)
                                            ? 'border-cyan bg-cyan-dim text-paper'
                                            : 'border-blueprint-line bg-white text-paper hover:border-cyan/80 hover:bg-blueprint-800/40'
                                    }`}
                                >
                                    <p className="font-semibold">{project.title}</p>
                                    <p className="mt-1 text-sm text-paper-dim truncate">{project.tagline || 'Open this project chat.'}</p>
                                </button>
                            ))
                        )}
                    </div>
                </aside>

                <main>
                    {selectedProject ? (
                        <ChatBox startupId={selectedProjectId} />
                    ) : (
                        <div className="blueprint-card p-6">
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