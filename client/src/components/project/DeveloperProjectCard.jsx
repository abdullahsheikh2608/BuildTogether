import { Users, ListChecks, Calendar, ArrowRight, Rocket } from "lucide-react";

import Button from "../ui/Button.jsx";
import StampBadge from "../ui/StampBadge.jsx";
import { useProject } from "../../context/ProjectContext.jsx";

// Deterministic accent colour per project, purely presentational — gives
// each card a distinct identity in the list without needing any backend
// "colour" field.
const ICON_STYLES = [
  { bg: "#0F766E", fg: "#FFFFFF" }, // teal
  { bg: "#1E1B4B", fg: "#F472B6" }, // navy / pink
  { bg: "#1D4ED8", fg: "#FFFFFF" }, // blue
  { bg: "#7C3AED", fg: "#FFFFFF" }, // violet
  { bg: "#B45309", fg: "#FFFFFF" }, // amber
];

function getIconStyle(id = "") {
  const sum = String(id)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ICON_STYLES[sum % ICON_STYLES.length];
}

function formatDate(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function DeveloperProjectCard({ onOpen }) {
  const project = useProject();
  const isAccepted = project.status === "accepted";
  const iconStyle = getIconStyle(project.id);

  const techStack = project.tech_stack ?? [];
  const visibleTech = techStack.slice(0, 3);
  const extraTechCount = techStack.length - visibleTech.length;

  const hasTasks = (project.tasks_count ?? 0) > 0;
  const progressPercent = hasTasks
    ? Math.round((project.completed_tasks_count / project.tasks_count) * 100)
    : null;

  const joinedLabel = formatDate(project.joined_at);

  return (
    <div className="blueprint-card flex flex-col gap-5 p-5 transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:border-cyan/30 md:flex-row md:items-center md:gap-6 md:p-6">

      {/* Left: identity */}

      <div className="flex min-w-0 flex-1 gap-4">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconStyle.bg, color: iconStyle.fg }}
        >
          <Rocket size={20} strokeWidth={2} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-display text-base font-semibold text-paper">
              {project.title}
            </h3>
            <StampBadge status={project.status} />
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-paper-dim">
            {project.description || project.tagline || "No description available."}
          </p>

          {techStack.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {visibleTech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-cyan-dim px-2.5 py-1 text-xs font-medium text-cyan"
                >
                  {tech}
                </span>
              ))}
              {extraTechCount > 0 && (
                <span className="rounded-full bg-blueprint-800 px-2.5 py-1 text-xs font-medium text-paper-faint">
                  +{extraTechCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: real project metadata */}

      <div className="flex flex-shrink-0 items-center gap-5 border-blueprint-line md:w-56 md:flex-col md:items-stretch md:gap-3 md:border-x md:px-6">
        {hasTasks ? (
          <div className="w-full">
            <div className="flex items-center justify-between text-xs">
              <span className="text-paper-dim">Progress</span>
              <span className="font-medium text-paper">{progressPercent}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-blueprint-800">
              <div
                className="h-full rounded-full bg-cyan transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-paper-faint md:w-full">No tasks assigned yet.</p>
        )}

        <div className="flex items-center gap-4 text-sm md:mt-1">
          <span className="flex items-center gap-1.5 text-paper-dim">
            <Users size={14} className="text-paper-faint" />
            <span className="font-medium text-paper">{project.members_count ?? 0}</span> Members
          </span>
          <span className="flex items-center gap-1.5 text-paper-dim">
            <ListChecks size={14} className="text-paper-faint" />
            <span className="font-medium text-paper">{project.tasks_count ?? 0}</span> Tasks
          </span>
        </div>
      </div>

      {/* Right: joined date + action */}

      <div className="flex flex-shrink-0 items-center justify-between gap-4 md:w-48 md:flex-col md:items-end">
        {joinedLabel && (
          <span className="flex items-center gap-1.5 text-xs text-paper-faint">
            <Calendar size={13} />
            Joined {joinedLabel}
          </span>
        )}

        <Button
          className="shrink-0"
          onClick={() => onOpen(project.id)}
          disabled={!isAccepted}
          title={
            isAccepted
              ? undefined
              : "Workspace unlocks once the founder accepts your application."
          }
        >
          Open Workspace
          <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
}