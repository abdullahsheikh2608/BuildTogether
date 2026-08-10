import { useEffect, useState } from 'react';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { useStartup } from '../../hooks/useStartup.js';
import ChatBox from '../../components/chat/ChatBox.jsx';

export default function FounderChatPage() {
  const { startupId: routeStartupId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStartupId = routeStartupId || searchParams.get('startupId');

  const { startups, loadStartups } = useStartup();
  const [selectedStartupId, setSelectedStartupId] = useState('');

  useEffect(() => {
    if (startups.length === 0) {
      loadStartups();
    }
  }, [loadStartups, startups.length]);

  useEffect(() => {
    if (startups.length === 0) return;

    const match = startups.find((p) => String(p.id) === String(urlStartupId));
    const targetId = match ? String(match.id) : String(startups[0].id);

    setSelectedStartupId(targetId);

    if (searchParams.get('startupId') !== targetId) {
      setSearchParams({ startupId: targetId }, { replace: true });
    }
  }, [startups, urlStartupId, searchParams, setSearchParams]);

  const handleSelectStartup = (id) => {
    const newId = String(id);
    setSelectedStartupId(newId);
    setSearchParams({ startupId: newId }, { replace: true });
  };

  const selectedStartup = startups.find((startup) => String(startup.id) === String(selectedStartupId));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan">Team Chat</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper">Team Chat</h1>
          <p className="mt-1 text-sm text-paper-dim">A dedicated messaging workspace for your startup conversations.</p>
        </div>
        <Button variant="outline" as={Link} to={`/founder/workspace${selectedStartupId ? `?startupId=${selectedStartupId}` : ''}`}>
          <ChevronRight size={16} />
          Project Overview
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="blueprint-card p-5">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-cyan" />
            <h2 className="font-display text-lg font-semibold text-paper">Conversations</h2>
          </div>

          <div className="mt-5 space-y-3">
            {startups.length === 0 ? (
              <p className="text-sm text-paper-dim">Loading projects…</p>
            ) : (
              startups.map((startup) => (
                <button
                  type="button"
                  key={startup.id}
                  onClick={() => handleSelectStartup(startup.id)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                    String(startup.id) === String(selectedStartupId)
                      ? 'border-cyan bg-cyan-dim text-paper'
                      : 'border-blueprint-line bg-white text-paper hover:border-cyan/80 hover:bg-blueprint-800/40'
                  }`}
                >
                  <p className="font-semibold">{startup.title}</p>
                  <p className="mt-1 text-sm text-paper-dim truncate">{startup.tagline || 'Open this project chat.'}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        <main>
          {selectedStartup ? (
            <ChatBox startupId={selectedStartupId} />
          ) : (
            <div className="blueprint-card p-6">
              <EmptyState
                title="Select a conversation"
                body="Pick a startup from the left side to open its chat."
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
