import { Briefcase } from "lucide-react";
import FounderProjectPicker from "./FounderProjectPicker.jsx";

export default function Workspace() {
    return (
        <FounderProjectPicker
            icon={Briefcase}
            title="Workspace"
            subtitle="Pick a startup to open its project workspace."
            emptyBody="Create your first startup to open its workspace."
            buildPath={(startup) => `/founder/projects/${startup.id}`}
        />
    );
}