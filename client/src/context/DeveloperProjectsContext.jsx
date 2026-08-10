import { useCallback, useRef, useState } from "react";
import { DeveloperProjectsContext } from "./developer-projects-context.js";
import { getMyProjects } from "../services/developer.service";

export function DeveloperProjectsProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fetchPromiseRef = useRef(null);

    const loadProjects = useCallback(async (force = false) => {
        if (fetchPromiseRef.current && !force) {
            return fetchPromiseRef.current;
        }

        const promise = (async () => {
            try {
                setLoading(true);
                setError("");

                const projectsData = await getMyProjects();
                const list = Array.isArray(projectsData) ? projectsData : [];
                setProjects(list);
                return list;
            } catch (err) {
                setError(
                    err?.response?.data?.message ??
                    "Unable to load projects."
                );
                return [];
            } finally {
                setLoading(false);
                fetchPromiseRef.current = null;
            }
        })();

        fetchPromiseRef.current = promise;
        return promise;
    }, []);

    return (
        <DeveloperProjectsContext.Provider
            value={{ projects, loading, error, loadProjects }}
        >
            {children}
        </DeveloperProjectsContext.Provider>
    );
}