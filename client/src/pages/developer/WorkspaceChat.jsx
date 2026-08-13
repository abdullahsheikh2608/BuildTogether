import { useOutletContext } from "react-router-dom";
import ChatBox from "../../components/chat/ChatBox.jsx";

export default function WorkspaceChat() {
  const { project } = useOutletContext();

  if (!project) return <div />;

  return (
    <div className="h-[calc(100vh-14rem)] min-h-[32rem]">
      <ChatBox startupId={project.id} variant="page" />
    </div>
  );
}