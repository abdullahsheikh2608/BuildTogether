import Button from "../ui/Button.jsx";

export default function MemberCard({
    member,
    onRemove,
}) {
    return (
        <div className="blueprint-card animate-draft-in rounded-xl p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-paper">
                        {member.full_name}
                    </h3>

                    <p className="mt-1 text-sm text-paper-dim">
                        @{member.username}
                    </p>

                    <span className="mt-3 inline-block rounded bg-blueprint-800 px-3 py-1 text-xs font-semibold text-cyan">
                        {member.role}
                    </span>
                </div>

                {onRemove && (
                    <Button
                        variant="danger"
                        onClick={() => onRemove(member)}
                    >
                        Remove
                    </Button>
                )}
            </div>
        </div>
    );
}