import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { globalSearch } from "../services/search.service.js";

const DEBOUNCE_DELAY = 400;

// Defines the group order/labels shown in the dropdown, independent of
// whatever order the backend happens to return results in.
const GROUP_CONFIG = [
    { type: "project", label: "Projects" },
    { type: "task", label: "Tasks" },
    { type: "startup", label: "Startups" },
    { type: "application", label: "Applications" },
];

// Reusable global search hook: debounces the query, calls the backend,
// and exposes both the flat results and grouped-by-type sections so any
// UI (Topbar dropdown, a full search page, etc.) can consume it.
export function useGlobalSearch() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const requestIdRef = useRef(0);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {

        // Don't call the API for an empty query — just clear state.
        if (!debouncedQuery) {
            abortControllerRef.current?.abort();
            setResults([]);
            setLoading(false);
            setError("");
            return;
        }

        const currentRequestId = ++requestIdRef.current;

        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError("");

        globalSearch(debouncedQuery, { signal: controller.signal })
            .then((data) => {
                if (currentRequestId !== requestIdRef.current) return;
                setResults(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                if (err?.code === "ERR_CANCELED") return;
                if (currentRequestId !== requestIdRef.current) return;

                setError(
                    err?.response?.data?.message ??
                    "Unable to search right now."
                );
                setResults([]);
            })
            .finally(() => {
                if (currentRequestId !== requestIdRef.current) return;
                setLoading(false);
            });

        return () => controller.abort();

    }, [debouncedQuery]);

    // Open the dropdown whenever there's something to search for; close
    // it once the query is cleared.
    useEffect(() => {
        setOpen(Boolean(query.trim()));
    }, [query]);

    const groupedResults = useMemo(() => {

        return GROUP_CONFIG
            .map((group) => ({
                ...group,
                items: results.filter((item) => item.type === group.type),
            }))
            .filter((group) => group.items.length > 0);

    }, [results]);

    const clear = useCallback(() => {
        abortControllerRef.current?.abort();
        setQuery("");
        setDebouncedQuery("");
        setResults([]);
        setOpen(false);
        setError("");
    }, []);

    return {
        query,
        setQuery,
        results,
        groupedResults,
        loading,
        error,
        open,
        setOpen,
        clear,
    };
}