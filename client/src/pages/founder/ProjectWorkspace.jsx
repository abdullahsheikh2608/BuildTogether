import { useParams } from "react-router-dom";

export default function ProjectWorkspace() {
    const { startupId } = useParams();

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <p className="font-mono text-xs uppercase tracking-widest text-cyan">
                    Project Workspace
                </p>

                <h1 className="mt-2 text-3xl font-bold text-paper">
                    Startup Workspace
                </h1>

                <p className="mt-2 text-paper-dim">
                    Startup ID: {startupId}
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Members */}
                <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
                    <h2 className="mb-4 text-xl font-semibold text-paper">
                        Team Members
                    </h2>

                    <div className="space-y-3">
                        <div className="rounded-lg bg-slate-800 p-3">
                            Abdullah
                        </div>

                        <div className="rounded-lg bg-slate-800 p-3">
                            Ali
                        </div>

                        <div className="rounded-lg bg-slate-800 p-3">
                            Ahmed
                        </div>
                    </div>
                </div>

                {/* Tasks */}
                <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-paper">
                            Tasks
                        </h2>

                        <button className="rounded bg-cyan px-4 py-2 font-semibold text-black">
                            Assign Task
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-lg bg-slate-800 p-4">
                            <h3 className="font-semibold text-paper">
                                Login API
                            </h3>

                            <p className="mt-1 text-paper-dim">
                                Status: Pending
                            </p>
                        </div>

                        <div className="rounded-lg bg-slate-800 p-4">
                            <h3 className="font-semibold text-paper">
                                Dashboard UI
                            </h3>

                            <p className="mt-1 text-paper-dim">
                                Status: In Progress
                            </p>
                        </div>

                        <div className="rounded-lg bg-slate-800 p-4">
                            <h3 className="font-semibold text-paper">
                                Notification Module
                            </h3>

                            <p className="mt-1 text-paper-dim">
                                Status: Completed
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}