import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useStartup } from '../../hooks/useStartup.js';

export default function DeveloperStartupCard({ startupId }) {
  const { getStartupById } = useStartup();
  const startup = getStartupById(startupId);
  const navigate = useNavigate();

  if (!startup) return null;

  return (
    <div className="blueprint-card animate-draft-in flex flex-col gap-4 p-5">
      <div>
        <h3 className="font-display text-lg font-semibold text-paper">{startup.title}</h3>

        <p className="mt-1 text-paper-dim">{startup.tagline}</p>
      </div>

      <p className="text-sm text-paper-dim">{startup.description}</p>

      <div className="flex flex-wrap gap-2">
        {startup.tech_stack?.map((tech) => (
          <span key={tech} className="rounded bg-cyan/10 px-2 py-1 text-xs text-cyan">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        <Button onClick={() => navigate(`/dashboard/startups/${startup.id}`)}>View Details</Button>
      </div>
    </div>
  );
}
