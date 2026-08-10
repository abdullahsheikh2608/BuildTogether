import { useState } from "react";
import { Sparkles, TrendingUp, Loader2 } from "lucide-react";

import Modal from "../common/Modal.jsx";

import { useToast } from "../../hooks/useToast.js";

import {
    summarizeProjectDescription,
    generateWeeklyReport,
} from "../../services/ai.service.js";

// A small stat pill used inside the weekly report modal.
function StatPill({ label, value }) {
    return (
        <div className="rounded-lg border border-blueprint-line bg-blueprint-800/50 px-3 py-2.5 text-center">
            <p className="font-display text-lg font-semibold text-paper">
                {value}
            </p>
            <p className="text-[11px] font-medium text-paper-faint">
                {label}
            </p>
        </div>
    );
}

// A single clickable AI action tile — icon badge, title, short description.
// Clicking the whole card triggers the action, showing an inline spinner
// instead of navigating away, so it's obvious which action is running.
function AiActionCard({ icon: Icon, title, description, busy, disabled, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="card-interactive flex items-start gap-4 rounded-xl border border-blueprint-line bg-white p-5 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-dim">
                {busy ? (
                    <Loader2 size={18} className="animate-spin text-cyan" />
                ) : (
                    <Icon size={18} className="text-cyan" />
                )}
            </div>

            <div>
                <p className="font-semibold text-paper">{title}</p>
                <p className="mt-0.5 text-sm text-paper-dim">{description}</p>
            </div>
        </button>
    );
}

// Founder-facing AI Assistant panel for a single project workspace.
// Two actions — project summary and weekly report — both call the
// existing ai.service.js, and both render their result in the shared
// Modal component instead of pushing the page layout around.
export default function AiAssistantPanel({ startupId }) {
    const { showToast } = useToast();

    const [loadingType, setLoadingType] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [resultText, setResultText] = useState("");
    const [resultStats, setResultStats] = useState(null);

    const isBusy = loadingType !== null;

    const handleGenerateSummary = async () => {
        try {
            setLoadingType("summary");

            const data = await summarizeProjectDescription(startupId);

            setModalTitle("AI Project Summary");
            setResultStats(null);
            setResultText(data.summary);
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

            setModalTitle("Weekly Project Report");
            setResultStats(data.stats);
            setResultText(data.report);
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

    return (
        <div className="blueprint-card p-6">

            <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-cyan" />
                <h2 className="font-display text-lg font-semibold text-paper">
                    AI Assistant
                </h2>
            </div>

            <p className="mt-1.5 text-sm text-paper-dim">
                Generate an AI-written summary or progress report for this
                project, based on its current data.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <AiActionCard
                    icon={Sparkles}
                    title="Project Summary"
                    description="A concise AI overview of what this project is about."
                    busy={loadingType === "summary"}
                    disabled={isBusy}
                    onClick={handleGenerateSummary}
                />

                <AiActionCard
                    icon={TrendingUp}
                    title="Weekly Report"
                    description="Progress, overdue items, and what's coming up."
                    busy={loadingType === "report"}
                    disabled={isBusy}
                    onClick={handleGenerateWeeklyReport}
                />

            </div>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalTitle}
            >

                {resultStats && (
                    <div className="mb-5 grid grid-cols-3 gap-2">
                        <StatPill label="Total" value={resultStats.total} />
                        <StatPill label="Done" value={resultStats.completed} />
                        <StatPill label="Overdue" value={resultStats.overdueCount} />
                    </div>
                )}

                <p className="whitespace-pre-wrap text-sm leading-relaxed text-paper-dim">
                    {resultText}
                </p>

            </Modal>

        </div>
    );
}