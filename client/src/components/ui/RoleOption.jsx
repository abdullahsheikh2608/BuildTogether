const ACCENTS = {
  founder: {
    ring: "border-amber",
    text: "text-amber",
    dot: "bg-amber",
  },
  developer: {
    ring: "border-cyan",
    text: "text-cyan",
    dot: "bg-cyan",
  },
};

export default function RoleOption({
  role,
  title,
  description,
  selected,
  onSelect,
}) {
  const accent = ACCENTS[role];

  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      aria-pressed={selected}
      className={`flex flex-col gap-1 rounded-sm border-2 p-4 text-left transition-colors duration-150
        ${selected ? accent.ring : "border-blueprint-line hover:border-paper-faint"}`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${selected ? accent.dot : "bg-paper-faint"}`}
        />
        <span
          className={`font-mono text-xs font-bold uppercase tracking-widest ${selected ? accent.text : "text-paper-dim"}`}
        >
          {title}
        </span>
      </span>
      <span className="text-xs text-paper-faint">{description}</span>
    </button>
  );
}
