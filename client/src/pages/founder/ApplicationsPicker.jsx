import { FileText } from "lucide-react";
import FounderProjectPicker from "./FounderProjectPicker.jsx";

export default function ApplicationsPicker() {
    return (
        <FounderProjectPicker
            icon={FileText}
            title="Applications"
            subtitle="Pick a startup to review the applications it received."
            emptyBody="Create a startup so developers can start applying to it."
            buildPath={(startup) => `/founder/startups/${startup.id}/applications`}
        />
    );
}