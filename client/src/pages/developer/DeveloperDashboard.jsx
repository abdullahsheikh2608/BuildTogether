import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DeveloperProjectCard from "../../components/project/DeveloperProjectCard.jsx";

import { useDeveloper } from "../../hooks/useDeveloper.js";
import { ProjectProvider } from "../../context/ProjectContext.jsx";

export default function DeveloperDashboard() {
    const navigate = useNavigate();

    const {
        projects,
        loading,
        error,
        loadProjects,
    } = useDeveloper();

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const openWorkspace = (project) => {
        navigate(`/developer/workspace/${project.id}`);
    };

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

            {!loading && !error && projects.length > 0 && (

                <div className="grid gap-6 md:grid-cols-2">

                    {projects.map((project) => (

                        <ProjectProvider
                            key={project.id}
                            project={project}
                        >
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