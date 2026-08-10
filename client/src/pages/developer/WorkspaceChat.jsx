import { useOutletContext } from "react-router-dom";
import ChatBox from "../../components/chat/ChatBox.jsx";

export default function WorkspaceChat() {
  const { project } = useOutletContext();

  if (!project) return <div />;

  return (
    <div className="space-y-4">
      <div className="blueprint-card p-6">
        <h2 className="font-display text-lg font-semibold text-paper">Team Chat</h2>
        <div className="mt-4">
          <ChatBox startupId={project.id} />
        </div>
      </div>
    </div>
  );
}