import { useContext } from "react";
import { StartupContext } from "../context/startup-context.js";

export const useStartup = () => {
  const context = useContext(StartupContext);
  if (!context) {
    throw new Error("useStartup must be used inside StartupProvider");
  }
  return context;
};
