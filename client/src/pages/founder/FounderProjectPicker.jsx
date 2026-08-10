import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { SkeletonCard } from "../../components/ui/Skeleton.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import StampBadge from "../../components/ui/StampBadge.jsx";
import { useStartup } from "../../hooks/useStartup.js";

// Reusable "pick a startup, then jump into that feature" screen for the
// founder side — mirrors developer/ProjectPicker.jsx. The founder-scoped
// GET /startups endpoint already returns only startups this founder owns,
// so no extra filtering is needed here.
export default function FounderProjectPicker({
    icon: Icon,
    title,
    subtitle,
    emptyBody,
    buildPath,
}) {
    const navigate = useNavigate();

    const {
        startups,
        loading,
        error,
        loadStartups,
    } = useStartup();

    useEffect(() => {
        loadStartups();
    }, [loadStartups]);

    return (
        <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-dim text-cyan">
                        <Icon size={20} />
                    </div>
                )}
                <div>
                    <h1 className="font-display text-2xl font-semibold text-paper">{title}</h1>
                    <p className="mt-1 text-sm text-paper-dim">{subtitle}</p>
                </div>
            </div>

            {error && (
                <p className="mt-6 rounded-lg border border-ink-red/20 bg-ink-red/5 px-4 py-3 text-sm text-ink-red">
                    {error}
                </p>
            )}

            <div className="mt-8">
                {loading ? (
                    <div className="space-y-3">
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : startups.length === 0 ? (
                    <EmptyState
                        icon={Icon}
                        title="No startups yet"
                        body={emptyBody}
                    />
                ) : (
                    <div className="flex flex-col divide-y divide-blueprint-line rounded-2xl border border-blueprint-line bg-white">
                        {startups.map((startup) => (
                            <button
                                key={startup.id}
                                onClick={() => navigate(buildPath(startup))}
                                className="flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-blueprint-800 cursor-pointer first:rounded-t-2xl last:rounded-b-2xl"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-paper">{startup.title}</p>
                                    {startup.tagline && (
                                        <p className="truncate text-sm text-paper-dim">{startup.tagline}</p>
                                    )}
                                </div>
                                <StampBadge status={startup.status} />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}