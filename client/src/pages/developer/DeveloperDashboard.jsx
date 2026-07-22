import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getMyApplications } from "../../services/application.service.js";

export default function DeveloperDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

  const [applications, setApplications] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    let mounted = true;

    const loadApplications = async () => {
        try {
            const data = await getMyApplications();

            if (mounted) {
                setApplications(data);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);

            if (mounted) {
                setLoading(false);
            }
        }
    };

    loadApplications();

    return () => {
        mounted = false;
    };
}, []);

// useEffect(() => {
//     fetchApplications();
// }, []);

    const totalApplications = applications.length;

    const pendingApplications = applications.filter(
        (app) => app.status === "pending"
    ).length;

    const acceptedApplications = applications.filter(
        (app) => app.status === "accepted"
    ).length;

    const rejectedApplications = applications.filter(
        (app) => app.status === "rejected"
    ).length;

return (
    <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan">
                Developer Dashboard
            </span>

            <h1 className="mt-2 text-3xl font-bold text-paper">
                Welcome, {user?.full_name}
            </h1>

            <p className="mt-2 text-paper-dim">
                Find startups, apply to projects and track your applications.
            </p>
        </div>

        {/* Stats */}

        <div className="grid gap-6 md:grid-cols-4">

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
                <h3 className="text-sm text-paper-dim">
                    Total Applications
                </h3>

                <p className="mt-3 text-3xl font-bold text-paper">
                    {loading ? "..." : totalApplications}
                </p>
            </div>

            <div className="rounded-xl border border-yellow-600 bg-slate-900 p-6">
                <h3 className="text-sm text-paper-dim">
                    Pending
                </h3>

                <p className="mt-3 text-3xl font-bold text-yellow-400">
                    {loading ? "..." : pendingApplications}
                </p>
            </div>

            <div className="rounded-xl border border-green-600 bg-slate-900 p-6">
                <h3 className="text-sm text-paper-dim">
                    Accepted
                </h3>

                <p className="mt-3 text-3xl font-bold text-green-400">
                    {loading ? "..." : acceptedApplications}
                </p>
            </div>

            <div className="rounded-xl border border-red-600 bg-slate-900 p-6">
                <h3 className="text-sm text-paper-dim">
                    Rejected
                </h3>

                <p className="mt-3 text-3xl font-bold text-red-500">
                    {loading ? "..." : rejectedApplications}
                </p>
            </div>

        </div>

        {/* Quick Actions */}

        <div className="mt-10">

            <h2 className="mb-5 text-xl font-semibold text-paper">
                Quick Actions
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

                <button
                    onClick={() => navigate("/dashboard/startups")}
                    className="rounded-xl border border-cyan bg-slate-900 p-6 text-left transition hover:bg-slate-800"
                >
                    <h3 className="text-lg font-semibold text-paper">
                        Browse Startups
                    </h3>

                    <p className="mt-2 text-sm text-paper-dim">
                        Explore available startups and apply.
                    </p>
                </button>

                <button
                    onClick={() => navigate("/dashboard/applications")}
                    className="rounded-xl border border-purple-500 bg-slate-900 p-6 text-left transition hover:bg-slate-800"
                >
                    <h3 className="text-lg font-semibold text-paper">
                        My Applications
                    </h3>

                    <p className="mt-2 text-sm text-paper-dim">
                        Track the status of your submitted applications.
                    </p>
                </button>

            </div>

        </div>

        {/* Recent Activity */}

        <div className="mt-10 rounded-xl border border-slate-700 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold text-paper">
                Recent Activity
            </h2>

            {applications.length === 0 ? (

                <p className="mt-4 text-paper-dim">
                    No recent activity.
                </p>

            ) : (

                <div className="mt-5 space-y-4">

                    {applications.slice(0, 3).map((app) => (

                        <div
                            key={app.id}
                            className="rounded-lg border border-slate-700 p-4"
                        >

                            <h3 className="font-semibold text-paper">
                                {app.title}
                            </h3>

                            <p className="text-sm text-paper-dim">
                                {app.tagline}
                            </p>

                            <span
                                className={`mt-3 inline-block rounded px-3 py-1 text-xs font-semibold ${
                                    app.status === "accepted"
                                        ? "bg-green-600 text-white"
                                        : app.status === "rejected"
                                        ? "bg-red-600 text-white"
                                        : "bg-yellow-500 text-black"
                                }`}
                            >
                                {app.status}
                            </span>

                        </div>

                    ))}

                </div>

            )}

        </div>

    </div>
);
}