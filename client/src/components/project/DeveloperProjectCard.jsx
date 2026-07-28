import Button from "../ui/Button.jsx";
import { useProject } from "../../context/ProjectContext.jsx";

export default function DeveloperProjectCard({
    onOpen,
}) {
    const project = useProject();

    return (
        <div className="blueprint-card rounded-xl p-6 flex items-center justify-between">
            <div>
                <h3 className="font-display text-xl font-semibold text-paper">
                    {project.title}
                </h3>

                <p className="mt-2 text-paper-dim">
                    {project.tagline}
                </p>
            </div>

            <Button onClick={() => onOpen(project.id)}>
                Open Workspace
            </Button>
        </div>
    );
}