import { useEffect, useState } from "react";
import BackButton from "../../components/common/BackButton.jsx";
import { useAuth } from "../../hooks/useAuth.js";

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        role: "developer",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || "",
                username: user.username || "",
                role: user.role || "developer",
            });
        }
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setMessage("");

        try {
            await updateProfile(formData);
            setMessage("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            setMessage(error?.response?.data?.message || "Unable to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            full_name: user?.full_name || "",
            username: user?.username || "",
            role: user?.role || "developer",
        });
        setIsEditing(false);
        setMessage("");
    };

    return (
        <div className="mx-auto max-w-5xl">
            
            <main className="mx-auto max-w-5xl px-6 py-10">
                <BackButton />

                <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-paper">My Profile</h1>
                            <p className="mt-2 text-paper-dim">Your account information</p>
                        </div>

                        {!isEditing && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="rounded bg-cyan px-4 py-2 font-semibold text-black"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {message && (
                        <p className={`mt-4 text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
                            {message}
                        </p>
                    )}

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm text-paper-dim">Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-paper"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-paper-dim">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-paper"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-paper-dim">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-paper"
                                >
                                    <option value="developer">Developer</option>
                                    <option value="founder">Founder</option>
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="rounded bg-cyan px-4 py-2 font-semibold text-black disabled:opacity-60"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded border border-slate-600 px-4 py-2 font-semibold text-paper"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-8 grid gap-6">
                            <div>
                                <p className="text-sm text-paper-dim">Full Name</p>
                                <h2 className="text-xl font-semibold text-paper">{user?.full_name}</h2>
                            </div>

                            <div>
                                <p className="text-sm text-paper-dim">Username</p>
                                <h2 className="text-xl font-semibold text-paper">@{user?.username}</h2>
                            </div>

                            <div>
                                <p className="text-sm text-paper-dim">Email</p>
                                <h2 className="text-xl font-semibold text-paper">{user?.email}</h2>
                            </div>

                            <div>
                                <p className="text-sm text-paper-dim">Role</p>
                                <span
                                    className={`inline-block rounded px-3 py-1 text-sm font-semibold ${
                                        user?.role === "founder"
                                            ? "bg-yellow-500 text-black"
                                            : "bg-cyan text-black"
                                    }`}
                                >
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}