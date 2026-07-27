import { useCallback, useState } from "react";
import {
    getStartupMembers,
    getMyProjects,
} from "../services/member.service";

export function useMember() {
    const [members, setMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadMembers = useCallback(async (startupId) => {
        try {
            setLoading(true);
            setError("");

            const data = await getStartupMembers(startupId);

            setMembers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Unable to load members."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyProjects();

            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Unable to load projects."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        members,
        projects,
        loading,
        error,
        loadMembers,
        loadProjects,
        setMembers,
        setProjects,
        setError,
    };
}