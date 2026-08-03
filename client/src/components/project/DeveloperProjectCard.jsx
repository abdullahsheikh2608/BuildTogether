import Button from "../ui/Button.jsx";
import StampBadge from "../ui/StampBadge.jsx";
import { useProject } from "../../context/ProjectContext.jsx";

export default function DeveloperProjectCard({
    onOpen,
}) {
    const project = useProject();
    const isAccepted = project.status === "accepted";

    return (
        <div className="blueprint-card rounded-xl p-6 flex items-center justify-between">
            <div>
                <h3 className="font-display text-xl font-semibold text-paper">
                    {project.title}
                </h3>

                <p className="mt-2 text-paper-dim">
                    {project.tagline}
                </p>

                <div className="mt-3">
                    <StampBadge status={project.status} />
                </div>
            </div>

            <Button
                onClick={() => onOpen(project.id)}
                disabled={!isAccepted}
                title={
                    isAccepted
                        ? undefined
                        : "Workspace unlocks once the founder accepts your application."
                }
            >
                Open Workspace
            </Button>
        </div>
    );
}