import { useState } from "react";

// Reusable truncate-with-toggle text block. Clamps to 3 lines by default
// and reveals a "Read More" / "Show Less" toggle only when the text is
// actually long enough to need it.
export default function ExpandableText({
    text,
    maxLength = 140,
    className = "",
}) {
    const [expanded, setExpanded] = useState(false);

    if (!text) {
        return null;
    }

    const isLong = text.length > maxLength;

    return (
        <div className={className}>

            <p className={!expanded && isLong ? "line-clamp-3" : ""}>
                {text}
            </p>

            {isLong && (
                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="mt-1 font-mono text-xs font-semibold text-cyan hover:underline"
                >
                    {expanded ? "Show Less" : "Read More"}
                </button>
            )}

        </div>
    );
}