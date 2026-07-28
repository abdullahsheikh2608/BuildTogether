import { useCallback, useState } from "react";
import { DeveloperProjectsContext } from "./developer-projects-context.js";
import { getMyProjects } from "../services/developer.service";

export function DeveloperProjectsProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyProjects();

            setProjects(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError(
                err?.response?.data?.message ??
                "Unable to load projects."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <DeveloperProjectsContext.Provider
            value={{ projects, loading, error, loadProjects }}
        >
            {children}
        </DeveloperProjectsContext.Provider>
    );
}