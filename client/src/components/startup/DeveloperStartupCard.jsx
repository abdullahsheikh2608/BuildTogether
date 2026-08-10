import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../ui/Button.jsx';
import StampBadge from '../ui/StampBadge.jsx';
import { useStartup } from '../../hooks/useStartup.js';

export default function DeveloperStartupCard({ startup: startupProp, startupId }) {
  const { getStartupById } = useStartup();
  const startup = startupProp || getStartupById(startupId);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!startup) return null;

  const description = startup.description || '';
  const isLongDescription = description.length > 120 || description.includes('\n');

  return (
    <div className="blueprint-card animate-draft-in flex h-full flex-col justify-between p-6 transition-all duration-200 hover:border-cyan/50 shadow-sm">
      <div className="space-y-4">
        {/* Header: Title, Tagline & Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-lg font-bold text-paper">
              {startup.title}
            </h3>
            {startup.tagline && (
              <p className="mt-1 line-clamp-1 text-sm font-medium text-paper-dim">
                {startup.tagline}
              </p>
            )}
          </div>
          {startup.status && (
            <div className="shrink-0">
              <StampBadge status={startup.status} />
            </div>
          )}
        </div>

        {/* Description Section with Line Clamping & Read More Toggle */}
        <div className="text-sm text-paper-dim leading-relaxed">
          <div className={`break-words whitespace-pre-line ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {description || 'No project description available.'}
          </div>

          {isLongDescription && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan hover:underline cursor-pointer focus:outline-none"
            >
              {isExpanded ? (
                <>
                  Read less <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Read more <ChevronDown size={14} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Tech Stack Pills */}
        {startup.tech_stack && startup.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {startup.tech_stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-cyan/20 bg-cyan/10 px-2.5 py-1 text-xs font-medium text-cyan"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: View Details Button aligned at bottom */}
      <div className="mt-6 flex items-center justify-between border-t border-blueprint-line pt-4">
        <span className="text-xs text-paper-faint font-mono uppercase tracking-wider">
          {startup.status === 'open' ? 'Open for applications' : 'View overview'}
        </span>
        <Button onClick={() => navigate(`/dashboard/startups/${startup.id}`)}>
          View Details
        </Button>
      </div>
    </div>
  );
}
