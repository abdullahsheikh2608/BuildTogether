import { Inbox } from "lucide-react";

export default function EmptyState({ title, body, action, icon: Icon = Inbox }) {
  return (
    <div className="blueprint-card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-dim">
        <Icon size={22} className="text-cyan" strokeWidth={1.75} />
      </div>
      <h3 className="mt-1 font-display text-lg font-semibold text-paper">{title}</h3>
      <p className="max-w-sm text-sm text-paper-dim">{body}</p>
      {action}
    </div>
  );
}