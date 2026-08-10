import { MessageSquare } from "lucide-react";
import FounderProjectPicker from "./FounderProjectPicker.jsx";

export default function TeamChat() {
    return (
        <FounderProjectPicker
            icon={MessageSquare}
            title="Team Chat"
            subtitle="Pick a startup to open its team chat."
            emptyBody="Create a startup to start chatting with your team."
            buildPath={(startup) => `/founder/projects/${startup.id}/chat`}
        />
    );
}