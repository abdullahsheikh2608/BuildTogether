import { useCallback, useState } from "react";
import { getStartupTasks, getMyTasks } from "../services/task.service";

export function useTask() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadStartupTasks = useCallback(async (startupId) => {
        try {
            setLoading(true);
            setError("");

            const data = await getStartupTasks(startupId);

            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Unable to load tasks."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMyTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyTasks();

            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Unable to load tasks."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        tasks,
        loading,
        error,
        loadStartupTasks,
        loadMyTasks,
        setTasks,
        setError,
    };
}