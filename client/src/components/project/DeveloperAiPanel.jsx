import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

import Modal from "../common/Modal.jsx";
import { useToast } from "../../hooks/useToast.js";
import { summarizeProjectDescription } from "../../services/ai.service.js";

export default function DeveloperAiPanel({ startupId }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [resultText, setResultText] = useState("");

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      const data = await summarizeProjectDescription(startupId);
      setResultText(data.summary);
      setModalOpen(true);
    } catch (err) {
      showToast({ type: "error", message: err?.response?.data?.message ?? "Unable to generate a summary right now." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blueprint-card p-6">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-cyan" />
        <h2 className="font-display text-lg font-semibold text-paper">AI Assistant</h2>
      </div>

      <p className="mt-1.5 text-sm text-paper-dim">Project Summary tools for developers.</p>

      <div className="mt-5">
        <button
          onClick={handleGenerateSummary}
          className="card-interactive flex items-start gap-4 rounded-xl border border-blueprint-line bg-white p-5 text-left transition-all duration-200"
          disabled={loading}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-dim">
            {loading ? <Loader2 size={18} className="animate-spin text-cyan" /> : <Sparkles size={18} className="text-cyan" />}
          </div>
          <div>
            <p className="font-semibold text-paper">Project Summary</p>
            <p className="mt-0.5 text-sm text-paper-dim">A concise AI overview of what this project is about.</p>
          </div>
        </button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="AI Project Summary">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-paper-dim">{resultText}</p>
      </Modal>
    </div>
  );
}
