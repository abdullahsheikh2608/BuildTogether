import { Sparkles } from "lucide-react";
import FounderProjectPicker from "./FounderProjectPicker.jsx";

export default function AIAssistant() {
    return (
        <FounderProjectPicker
            icon={Sparkles}
            title="AI Assistant"
            subtitle="Pick a startup to open its AI assistant."
            emptyBody="Create a startup to get AI-powered insights for it."
            buildPath={(startup) => `/founder/projects/${startup.id}/ai-assistant`}
        />
    );
}