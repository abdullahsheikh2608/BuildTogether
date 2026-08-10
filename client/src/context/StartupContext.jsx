import { useCallback, useMemo, useRef, useState } from "react";
import { StartupContext } from "./startup-context.js";
import { getAllStartups } from "../services/startup.service.js";

export function StartupProvider({ children }) {
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchPromiseRef = useRef(null);

  const loadStartups = useCallback(async (params = {}) => {
    if (fetchPromiseRef.current && Object.keys(params).length === 0) {
      return fetchPromiseRef.current;
    }

    const promise = (async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getAllStartups(params);
        const list = Array.isArray(data) ? data : [];
        setStartups(list);
        return list;
      } catch (err) {
        setError("Unable to load startups.");
        setStartups([]);
        return [];
      } finally {
        setLoading(false);
        fetchPromiseRef.current = null;
      }
    })();

    if (Object.keys(params).length === 0) {
      fetchPromiseRef.current = promise;
    }
    return promise;
  }, []);

  const getStartupById = useCallback(
    (id) => (Array.isArray(startups) ? startups.find((startup) => String(startup.id) === String(id)) : undefined),
    [startups]
  );

  const value = useMemo(
    () => ({
      startups,
      setStartups,
      selectedStartup,
      setSelectedStartup,
      loading,
      setLoading,
      error,
      setError,
      loadStartups,
      getStartupById,
    }),
    [startups, selectedStartup, loading, error, loadStartups, getStartupById]
  );

  return <StartupContext.Provider value={value}>{children}</StartupContext.Provider>;
}