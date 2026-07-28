import { useCallback, useState } from "react";
import { getMyProjects } from "../services/developer.service";

export function useDeveloper() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyProjects();

            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err?.response?.data?.message ??
                "Unable to load projects."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        projects,
        loading,
        error,
        loadProjects,
    };
}