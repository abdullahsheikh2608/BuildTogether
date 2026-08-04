import { useState } from "react";

import Button from "../ui/Button.jsx";
import Modal from "../common/Modal.jsx";

import { useToast } from "../../hooks/useToast.js";

import {
    summarizeProjectDescription,
    generateWeeklyReport,
} from "../../services/ai.service.js";

// A small stat pill used inside the weekly report modal.
function StatPill({ label, value }) {
    return (
        <div className="rounded-sm border border-white/10 bg-blueprint-800/50 px-3 py-2 text-center">
            <p className="font-display text-lg font-semibold text-paper">
                {value}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper-faint">
                {label}
            </p>
        </div>
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
        <div className="blueprint-card rounded-xl p-6">

            <h2 className="font-display text-xl font-semibold text-paper">
                AI Assistant
            </h2>

            <p className="mt-2 text-sm text-paper-dim">
                Generate an AI-written summary or progress report for this
                project, based on its current data.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

                <Button
                    variant="outline"
                    onClick={handleGenerateSummary}
                    loading={loadingType === "summary"}
                    disabled={isBusy}
                >
                    Generate Summary
                </Button>

                <Button
                    variant="outline"
                    onClick={handleGenerateWeeklyReport}
                    loading={loadingType === "report"}
                    disabled={isBusy}
                >
                    Generate Weekly Report
                </Button>

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

                <p className="whitespace-pre-wrap text-sm text-paper-dim">
                    {resultText}
                </p>

            </Modal>

        </div>
    );
}