import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import DeveloperProjectCard from "../../components/project/DeveloperProjectCard.jsx";
import UpcomingDeadlines from "../../components/project/UpcomingDeadlines.jsx";
import Input from "../../components/ui/Input.jsx";
import { ProjectProvider } from "../../context/ProjectContext.jsx";

import { useDeveloper } from "../../hooks/useDeveloper.js";
import { useTask } from "../../hooks/useTask.js";

export default function DeveloperDashboard() {
    const navigate = useNavigate();

    const {
        projects,
        loading,
        error,
        loadProjects,
    } = useDeveloper();

    const {
        tasks,
        loadMyTasks,
    } = useTask();

    const [search, setSearch] = useState("");

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    useEffect(() => {
        loadMyTasks();
    }, [loadMyTasks]);

    const openWorkspace = (projectId) => {
        navigate(`/developer/workspace/${projectId}`);
    };

    const filteredProjects = projects.filter((project) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;

        return (
            project.title?.toLowerCase().includes(term) ||
            project.tagline?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="mx-auto max-w-7xl space-y-8">

            <div>

                <p className="font-mono text-xs uppercase tracking-widest text-cyan">
                    Developer Dashboard
                </p>

                <h1 className="mt-2 font-display text-3xl font-bold text-paper">
                    My Projects
                </h1>

                <p className="mt-3 text-paper-dim">
                    View all startups you have joined and continue working on your assigned tasks.
                </p>

            </div>

            <UpcomingDeadlines tasks={tasks} />

            {!loading && !error && projects.length > 0 && (
                <div className="relative max-w-sm">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-faint"
                    />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search your projects..."
                        className="[&>input]:pl-9"
                    />
                </div>
            )}

            {loading && (
                <div className="blueprint-card rounded-xl p-6">
                    <p className="text-paper-dim">
                        Loading projects...
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="rounded-xl border border-red-500 bg-red-500/10 p-6">
                    <p className="text-red-400">
                        {error}
                    </p>
                </div>
            )}

            {!loading && !error && projects.length === 0 && (
                <div className="blueprint-card rounded-xl p-8 text-center">

                    <h2 className="font-display text-2xl text-paper">
                        No Projects Found
                    </h2>

                    <p className="mt-3 text-paper-dim">
                        You haven't joined any startup yet.
                    </p>

                </div>
            )}

            {!loading && !error && projects.length > 0 && filteredProjects.length === 0 && (
                <div className="blueprint-card rounded-xl p-8 text-center">

                    <h2 className="font-display text-2xl text-paper">
                        No Matching Projects
                    </h2>

                    <p className="mt-3 text-paper-dim">
                        No projects match "{search}". Try a different search term.
                    </p>

                </div>
            )}

            {!loading && !error && filteredProjects.length > 0 && (

                <div className="grid gap-6 md:grid-cols-2">

                    {filteredProjects.map((project) => (

                        <ProjectProvider key={project.id} project={project}>
                            <DeveloperProjectCard
                                onOpen={openWorkspace}
                            />
                        </ProjectProvider>

                    ))}

                </div>

            )}

        </div>
    );
}