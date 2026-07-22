import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useStartup } from '../../hooks/useStartup.js';

export default function StartupCard({ startupId, role = 'developer', onEdit, onDelete, onApply }) {
  const { getStartupById } = useStartup();
  const startup = getStartupById(startupId);
  const isOpen = startup?.status === 'open';

  if (!startup) return null;

  return (
    <div className="blueprint-card animate-draft-in flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-paper">{startup.title}</h3>

          <p className="mt-1 text-sm text-paper-dim">{startup.tagline}</p>
        </div>

        <span
          className={`shrink-0 rounded-sm border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest ${
            isOpen ? 'border-ink-green text-ink-green' : 'border-paper-faint text-paper-faint'
          }`}
        >
          {startup.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {startup.tech_stack?.map((tech) => (
          <span key={tech} className="rounded-sm bg-blueprint-800 px-2 py-1 font-mono text-xs text-cyan">
            {tech}
          </span>
        ))}
      </div>

      <div className="border-t border-blueprint-line pt-4">
        {role === 'founder' ? (
          <div className="flex flex-wrap gap-2">
            <Link to={`/founder/startups/${startup.id}/applications`}>
              <Button variant="outline">Applications</Button>
            </Link>

            <Button variant="ghost" onClick={() => onEdit(startup)}>
              Edit
            </Button>

            <Button variant="danger" className="ml-auto" onClick={() => onDelete(startup)}>
              Delete
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Link to={`/dashboard/startups/${startup.id}`}>
              <Button variant="outline">View Details</Button>
            </Link>

            <Button className="ml-auto" disabled={!isOpen} onClick={() => onApply(startup)}>
              Apply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
