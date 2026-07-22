import { useCallback, useMemo, useState } from "react";
import { StartupContext } from "./startup-context.js";
import { getAllStartups } from "../services/startup.service.js";

export function StartupProvider({ children }) {
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStartups = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllStartups();
      setStartups(data);
      return data;
    } catch (err) {
      setError("Unable to load startups.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getStartupById = useCallback(
    (id) => startups.find((startup) => startup.id === id),
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
