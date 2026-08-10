import { useOutletContext } from "react-router-dom";
import DeveloperAiPanel from "../../components/project/DeveloperAiPanel.jsx";

export default function WorkspaceAIAssistant() {
  const { project } = useOutletContext();

  if (!project) return <div />;

  return (
    <div className="space-y-6">
      <div className="blueprint-card p-6">
        <h2 className="font-display text-lg font-semibold text-paper">AI Assistant</h2>
        <p className="mt-2 text-sm text-paper-dim">Project-specific AI tools.</p>
      </div>

      <div>
        <DeveloperAiPanel startupId={project.id} />
      </div>
    </div>
  );
}
