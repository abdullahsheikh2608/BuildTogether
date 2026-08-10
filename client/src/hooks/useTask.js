import { useCallback, useState } from "react";

import {
    getStartupTasks,
    getMyTasks,
} from "../services/task.service.js";

export function useTask() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState(null);

    const loadStartupTasks = useCallback(async (
    startupId,
    search = ""
    ) => {
        try {
            setLoading(true);
            setError("");

            const data = await getStartupTasks(
            startupId,
            search
        );

            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err?.response?.data?.message ??
                "Unable to load startup tasks."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMyTasks = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError("");

            const { tasks: data, pagination: paginationData } = await getMyTasks(params);

            setTasks(Array.isArray(data) ? data : []);
            setPagination(paginationData ?? null);
        } catch (err) {
            setError(
                err?.response?.data?.message ??
                "Unable to load your tasks."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        tasks,
        loading,
        error,
        pagination,
        loadStartupTasks,
        loadMyTasks,
        setTasks,
    };
}