import { ListChecks } from "lucide-react";
import FounderProjectPicker from "./FounderProjectPicker.jsx";

export default function Tasks() {
    return (
        <FounderProjectPicker
            icon={ListChecks}
            title="Tasks"
            subtitle="Pick a startup to view and manage its tasks."
            emptyBody="Create a startup, then assign tasks to your team."
            buildPath={(startup) => `/founder/projects/${startup.id}/tasks`}
        />
    );
}