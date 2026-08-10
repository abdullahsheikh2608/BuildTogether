import { useEffect, useRef, useState } from "react";

export default function ExpandableText({
    text,
    title = "Task Description",
    maxLength = 140,
    className = "",
}) {
    const [showModal, setShowModal] = useState(false);
    const [isLong, setIsLong] = useState(false);

    const textRef = useRef(null);

    useEffect(() => {
        if (!textRef.current) return;

        const element = textRef.current;

        setIsLong(
            text.length > maxLength ||
            element.scrollHeight > element.clientHeight
        );
    }, [text, maxLength]);

    if (!text) return null;

    return (
        <>
            <div className={className}>
                <p
                    ref={textRef}
                    className="line-clamp-3"
                >
                    {text}
                </p>

                {isLong && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowModal(true);
                        }}
                        className="mt-2 text-sm font-medium text-cyan hover:text-cyan/80 hover:underline"
                    >
                        Read More
                    </button>
                )}
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(false);
                    }}
                >
                    <div
                        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b p-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {title}
                            </h2>

                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-lg p-2 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[65vh] overflow-y-auto p-6">
                            <p className="whitespace-pre-wrap leading-7 text-gray-700">
                                {text}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end border-t p-5">
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-lg bg-cyan px-5 py-2 text-white hover:bg-cyan/90"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}