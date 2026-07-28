import Button from "../ui/Button.jsx";

export default function DeveloperProjectCard({
    project,
    onOpen,
}) {
    return (
        <div className="blueprint-card animate-draft-in rounded-xl p-5">

            <div className="space-y-3">

                <div>

                    <h2 className="font-display text-xl font-semibold text-paper">
                        {project.title}
                    </h2>

                    <p className="mt-2 text-paper-dim">
                        {project.tagline}
                    </p>

                </div>

                <div className="flex items-center justify-between">

                    <span className="rounded bg-blueprint-800 px-3 py-1 text-xs font-semibold text-cyan">
                        Joined Project
                    </span>

                    <Button
                        onClick={() => onOpen(project)}
                    >
                        Open Workspace
                    </Button>

                </div>

            </div>

        </div>
    );
}