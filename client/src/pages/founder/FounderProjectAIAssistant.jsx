import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Sparkles,
  TrendingUp,
  Shield,
  FileText,
  Users,
  Download,
  Gauge,
} from "lucide-react";

import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import BackButton from "../../components/common/BackButton.jsx";
import { useStartup } from "../../hooks/useStartup.js";
import { useToast } from "../../hooks/useToast.js";
import {
  summarizeProjectDescription,
  generateWeeklyReport,
} from "../../services/ai.service.js";

function AiActionCard({ icon: Icon, title, description, busy, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="card-interactive flex items-start gap-4 rounded-xl border border-blueprint-line bg-white p-5 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-dim text-cyan">
        {busy ? <span className="loading-dot" /> : <Icon size={20} />}
      </div>

      <div>
        <h3 className="font-semibold text-paper">{title}</h3>
        <p className="mt-1 text-sm text-paper-dim">{description}</p>
      </div>
    </button>
  );
}

export default function FounderProjectAIAssistant() {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { startups, loadStartups } = useStartup();

  const [loadingType, setLoadingType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [resultText, setResultText] = useState("");

  useEffect(() => {
    if (startups.length === 0) {
      loadStartups();
    }
  }, [loadStartups, startups.length]);

  const startup = useMemo(
    () => startups.find((project) => String(project.id) === String(startupId)),
    [startups, startupId]
  );

  const isBusy = loadingType !== null;

  const handleGenerateSummary = async () => {
    try {
      setLoadingType("summary");
      const data = await summarizeProjectDescription(startupId);
      setModalTitle("Project Summary");
      setResultText(data.summary || "No summary available.");
      setModalOpen(true);
    } catch (error) {
      showToast({
        type: "error",
        message:
          error.response?.data?.message ??
          "Unable to generate a summary right now.",
      });
    } finally {
      setLoadingType(null);
    }
  };

  const handleGenerateWeeklyReport = async () => {
    try {
      setLoadingType("report");
      const data = await generateWeeklyReport(startupId);
      setModalTitle("Weekly Report");
      setResultText(data.report || "No report available.");
      setModalOpen(true);
    } catch (error) {
      showToast({
        type: "error",
        message:
          error.response?.data?.message ??
          "Unable to generate a weekly report right now.",
      });
    } finally {
      setLoadingType(null);
    }
  };

  const handleComingSoon = (label) => {
    showToast({
      type: "info",
      message: `${label} is coming soon in the AI assistant workspace.`,
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <BackButton fallbackPath="/founder" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan">AI Assistant</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper">
            {startup?.title || "AI Assistant"}
          </h1>
          <p className="mt-1 text-sm text-paper-dim">
            Focused AI tools for this project: summaries, reports, and data-driven intelligence.
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate(`/founder/projects/${startupId}`)}>
          <ChevronRight size={16} />
          Project Overview
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AiActionCard
          icon={Sparkles}
          title="Project Summary"
          description="Generate a concise narrative overview of the current project."
          busy={loadingType === "summary"}
          disabled={isBusy}
          onClick={handleGenerateSummary}
        />

        <AiActionCard
          icon={TrendingUp}
          title="Weekly Report"
          description="Create a progress report for the last seven days."
          busy={loadingType === "report"}
          disabled={isBusy}
          onClick={handleGenerateWeeklyReport}
        />

        <AiActionCard
          icon={Shield}
          title="Risk Detection"
          description="Review project risks and highlight areas to watch."
          disabled={true}
          onClick={() => handleComingSoon("Risk Detection")}
        />

        <AiActionCard
          icon={FileText}
          title="Sprint Summary"
          description="Summarize the current sprint and upcoming focus areas."
          disabled={true}
          onClick={() => handleComingSoon("Sprint Summary")}
        />

        <AiActionCard
          icon={Users}
          title="Developer Performance"
          description="Track team contribution and productivity trends."
          disabled={true}
          onClick={() => handleComingSoon("Developer Performance")}
        />

        <AiActionCard
          icon={Download}
          title="Generate PDF"
          description="Export the latest project summary or weekly report as a PDF."
          disabled={true}
          onClick={() => handleComingSoon("Generate PDF")}
        />
      </div>

      <div className="blueprint-card p-6">
        <h2 className="font-display text-lg font-semibold text-paper">AI Summary</h2>
        <p className="mt-3 text-sm text-paper-dim">
          The AI Assistant page is the place for focused insight and generated reports. Use the cards above to keep this workspace clean and tool-driven.
        </p>
        {startup?.tagline && (
          <div className="mt-5 rounded-2xl border border-blueprint-line bg-blueprint-800/50 p-5">
            <p className="text-sm text-paper">{startup.tagline}</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/70 p-4 backdrop-blur-sm">
          <div className="blueprint-card w-full max-w-2xl p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-semibold text-paper">{modalTitle}</h2>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
            <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-paper-dim">
              {resultText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}