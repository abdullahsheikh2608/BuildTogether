import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Briefcase,
    CheckCircle2,
    Clock,
    RotateCcw,
    Loader2,
} from "lucide-react";

import DeveloperProjectCard from "../../components/project/DeveloperProjectCard.jsx";
import AnalyticsCard from "../../components/analytics/Analyticscard.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { SkeletonProjectCard } from "../../components/ui/Skeleton.jsx";
import { ProjectProvider } from "../../context/ProjectContext.jsx";

import { useDebounce } from "../../hooks/useDebounce.js";
import { useDeveloper } from "../../hooks/useDeveloper.js";

// Height of the scrollable project list. Once the list is taller than
// this, the browser's own scrollbar becomes the "slider" the person
// drags to move through their projects — the page itself stops growing.
const LIST_MAX_HEIGHT = "70vh";

export default function MyProjects() {
    const navigate = useNavigate();

    const {
        projects,
        loading,
        error,
        loadProjects,
    } = useDeveloper();

    // Every toolbar control has its own "live" value (so the input/select
    // reacts instantly) and the actual filtering only runs off the
    // debounced value below, 400ms after the person stops interacting.
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    const debouncedSearch = useDebounce(search, 400);
    const debouncedStatusFilter = useDebounce(statusFilter, 400);
    const debouncedSortOrder = useDebounce(sortOrder, 400);

    // True for the brief window between a keystroke/selection and the
    // debounced value catching up — drives the small "Filtering..." hint.
    const isDebouncing =
        search !== debouncedSearch ||
        statusFilter !== debouncedStatusFilter ||
        sortOrder !== debouncedSortOrder;

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const hasActiveFilters = Boolean(search) || statusFilter !== "all";

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setSortOrder("newest");
    };

    const filteredProjects = useMemo(() => {
        const term = debouncedSearch.trim().toLowerCase();

        return projects
            .filter((project) => {
                const matchesSearch =
                    !term ||
                    project.title?.toLowerCase().includes(term) ||
                    project.description?.toLowerCase().includes(term) ||
                    project.tagline?.toLowerCase().includes(term);

                const matchesStatus =
                    debouncedStatusFilter === "all" ||
                    project.status === debouncedStatusFilter;

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (debouncedSortOrder === "newest") {
                    return new Date(b.joined_at || 0) - new Date(a.joined_at || 0);
                }
                if (debouncedSortOrder === "oldest") {
                    return new Date(a.joined_at || 0) - new Date(b.joined_at || 0);
                }
                if (debouncedSortOrder === "name-asc") {
                    return a.title?.localeCompare(b.title) || 0;
                }
                if (debouncedSortOrder === "name-desc") {
                    return b.title?.localeCompare(a.title) || 0;
                }
                return 0;
            });
    }, [projects, debouncedSearch, debouncedStatusFilter, debouncedSortOrder]);

    const totalCount = projects.length;
    const acceptedCount = projects.filter((project) => project.status === "accepted").length;
    const pendingCount = projects.filter((project) => project.status === "pending").length;

    const handleOpenWorkspace = (projectId) => {
        navigate(`/dashboard/workspace/${projectId}`);
    };

    return (
        <div className="w-full">

            {/* Header */}

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-paper">
                        My Projects
                    </h1>
                    <p className="mt-1 text-sm text-paper-dim">
                        Startups you've joined. Continue working on your assigned projects.
                    </p>
                </div>

                <Button onClick={() => navigate("/dashboard/startups")}>
                    Explore Projects
                </Button>
            </div>

            {error && (
                <p className="mt-6 rounded-lg border border-ink-red/20 bg-ink-red/5 px-4 py-3 text-sm text-ink-red">
                    {error}
                </p>
            )}

            {/* Toolbar */}

            {!loading && !error && totalCount > 0 && (
                <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="relative flex-1">
                        <Search
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-faint"
                        />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by project name or description..."
                            className="[&>input]:pl-9"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full lg:w-44"
                        >
                            <option value="all">All statuses</option>
                            <option value="accepted">Accepted</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </Select>

                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full lg:w-44"
                        >
                            <option value="newest">Newest joined</option>
                            <option value="oldest">Oldest joined</option>
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                        </Select>

                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={resetFilters}
                                title="Reset filters"
                            >
                                <RotateCcw size={15} />
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Debounce indicator — makes the delay visible rather than
                the list silently doing nothing for 400ms */}

            {!loading && !error && totalCount > 0 && (
                <div className="mt-2 flex h-4 items-center gap-1.5">
                    {isDebouncing && (
                        <>
                            <Loader2 size={12} className="animate-spin text-paper-faint" />
                            <span className="text-xs text-paper-faint">Filtering...</span>
                        </>
                    )}
                </div>
            )}

            {/* Summary statistics — project-related only */}

            {!loading && !error && totalCount > 0 && (
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <AnalyticsCard
                        icon={Briefcase}
                        color="blue"
                        label="Total Projects"
                        value={totalCount}
                    />
                    <AnalyticsCard
                        icon={CheckCircle2}
                        color="green"
                        label="Accepted"
                        value={acceptedCount}
                    />
                    <AnalyticsCard
                        icon={Clock}
                        color="amber"
                        label="Pending"
                        value={pendingCount}
                    />
                </div>
            )}

            {/* Project list — scrolls internally once it grows past
                LIST_MAX_HEIGHT instead of pushing the rest of the page
                down. The scrollbar itself is the "slider". */}

            <div className="mt-8">
                {loading ? (
                    <div className="flex flex-col gap-5">
                        <SkeletonProjectCard />
                        <SkeletonProjectCard />
                    </div>
                ) : totalCount === 0 ? (
                    <EmptyState
                        icon={Briefcase}
                        title="No projects yet"
                        body="You haven't joined any startup yet. Browse open startups and apply to get started."
                        action={
                            <Button onClick={() => navigate("/dashboard/startups")}>
                                Explore Startups
                            </Button>
                        }
                    />
                ) : filteredProjects.length === 0 ? (
                    <EmptyState
                        icon={Search}
                        title="No matching projects"
                        body="No projects match your search or selected filters."
                        action={
                            <Button variant="outline" onClick={resetFilters}>
                                Reset filters
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <p className="mb-3 text-sm text-paper-dim">
                            Showing {filteredProjects.length} of {totalCount} project
                            {totalCount === 1 ? "" : "s"}
                        </p>

                        <div
                            className="flex flex-col gap-5 overflow-y-auto pr-2"
                            style={{ maxHeight: LIST_MAX_HEIGHT }}
                        >
                            {filteredProjects.map((project) => (
                                <ProjectProvider key={project.id} project={project}>
                                    <DeveloperProjectCard onOpen={handleOpenWorkspace} />
                                </ProjectProvider>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}