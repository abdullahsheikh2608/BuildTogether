import Button from "../ui/Button.jsx";

const getInitials = (name = "") =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

export default function MemberCard({
    member,
    onRemove,
}) {
    return (
        <div className="blueprint-card animate-draft-in p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-dim text-sm font-semibold text-cyan">
                        {getInitials(member.full_name)}
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-paper">
                            {member.full_name}
                        </h3>

                        <p className="truncate text-xs text-paper-dim">
                            @{member.username}
                        </p>

                        <span className="mt-1.5 inline-block rounded-full bg-blueprint-800 px-2 py-0.5 text-[11px] font-medium capitalize text-paper-dim">
                            {member.role}
                        </span>
                    </div>
                </div>

                {onRemove && (
                    <Button
                        variant="danger"
                        onClick={() => onRemove(member)}
                        className="shrink-0"
                    >
                        Remove
                    </Button>
                )}
            </div>
        </div>
    );
}