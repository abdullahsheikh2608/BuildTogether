import { createContext, useContext } from "react";

const ProjectContext = createContext(null);

export function ProjectProvider({ project, children }) {
    return (
        <ProjectContext.Provider value={project}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);

    if (!context) {
        throw new Error("useProject must be used inside ProjectProvider");
    }

    return context;
}