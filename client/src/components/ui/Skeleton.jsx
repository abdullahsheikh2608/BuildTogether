export default function Skeleton({ className = "", rounded = "rounded-md" }) {
    return (
        <div className={`animate-pulse bg-blueprint-700/60 ${rounded} ${className}`} />
    );
}

export function SkeletonCard() {
    return (
        <div className="blueprint-card space-y-4 p-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-5 w-16" rounded="rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16" rounded="rounded-full" />
                <Skeleton className="h-6 w-16" rounded="rounded-full" />
            </div>
        </div>
    );
}

export function SkeletonStat() {
    return (
        <div className="blueprint-card space-y-2 p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-14" />
        </div>
    );
}

export function SkeletonProjectCard() {
    return (
        <div className="blueprint-card flex flex-col gap-5 p-5 md:flex-row md:items-center md:gap-6 md:p-6">
            <div className="flex min-w-0 flex-1 gap-4">
                <Skeleton className="h-12 w-12 flex-shrink-0" rounded="rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="h-3 w-4/5" />
                    <div className="flex gap-1.5 pt-1">
                        <Skeleton className="h-5 w-14" rounded="rounded-full" />
                        <Skeleton className="h-5 w-14" rounded="rounded-full" />
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 space-y-2 md:w-56">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/5" />
            </div>
            <div className="flex flex-shrink-0 items-center justify-between gap-4 md:w-48 md:flex-col md:items-end">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-9 w-32" rounded="rounded-lg" />
            </div>
        </div>
    );
}