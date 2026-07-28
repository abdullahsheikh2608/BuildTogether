import { useContext } from "react";
import { DeveloperProjectsContext } from "../context/developer-projects-context.js";

export const useDeveloper = () => {
    const ctx = useContext(DeveloperProjectsContext);
    if (!ctx) {
        throw new Error(
            "useDeveloper must be used inside DeveloperProjectsProvider"
        );
    }
    return ctx;
};