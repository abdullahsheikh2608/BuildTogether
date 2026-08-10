import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, ChevronRight } from "lucide-react";

import ChatBox from "../../components/chat/ChatBox.jsx";
import BackButton from "../../components/common/BackButton.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";

import { useStartup } from "../../hooks/useStartup.js";

export default function FounderProjectChat() {
  const { startupId } = useParams();
  const navigate = useNavigate();

  const { startups, loadStartups } = useStartup();

  useEffect(() => {
    if (startups.length === 0) {
      loadStartups();
    }
  }, [loadStartups, startups.length]);

  const startup = startups.find((project) => String(project.id) === String(startupId));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <BackButton fallbackPath={`/founder/projects/${startupId}`} label="Back to Project Workspace" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan">Team Chat</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper">
            {startup?.title || "Project Chat"}
          </h1>
          <p className="mt-1 text-sm text-paper-dim">
            A focused messaging workspace for this startup. Conversation list on the left, chat history on the right.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate(`/founder/projects/${startupId}`)}>
            <ChevronRight size={16} />
            Project Overview
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="blueprint-card p-5">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-cyan" />
            <h2 className="font-display text-lg font-semibold text-paper">Conversations</h2>
          </div>

          <div className="mt-5 space-y-3">
            {startups.length === 0 ? (
              <>
                <Skeleton className="h-16 w-full" rounded="rounded-2xl" />
                <Skeleton className="h-16 w-full" rounded="rounded-2xl" />
              </>
            ) : (
              startups.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => navigate(`/founder/projects/${project.id}/chat`)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                    String(project.id) === String(startupId)
                      ? "border-cyan bg-cyan-dim text-paper"
                      : "border-blueprint-line bg-white text-paper hover:border-cyan/80 hover:bg-blueprint-800/40"
                  }`}
                >
                  <p className="font-medium truncate">{project.title}</p>
                  <p className="mt-1 text-xs text-paper-faint truncate">{project.tagline || "Open this project chat."}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="space-y-4">
          {startup ? (
            <ChatBox startupId={startupId} />
          ) : (
            <div className="blueprint-card p-6">
              <EmptyState
                title="Select a startup chat"
                body="Choose a conversation from the left to see messages for that project."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
