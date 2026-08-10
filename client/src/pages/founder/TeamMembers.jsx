import { Users } from "lucide-react";
import FounderProjectPicker from "./FounderProjectPicker.jsx";

export default function TeamMembers() {
    return (
        <FounderProjectPicker
            icon={Users}
            title="Team Members"
            subtitle="Pick a startup to view and manage its team."
            emptyBody="Create a startup, then accept developers to build your team."
            buildPath={(startup) => `/founder/projects/${startup.id}#team-members`}
        />
    );
}