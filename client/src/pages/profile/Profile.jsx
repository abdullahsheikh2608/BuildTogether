import { useEffect, useState } from 'react';
import {
  User,
  AtSign,
  Mail,
  ShieldCheck,
  Pencil,
  Save,
  X,
} from 'lucide-react';

import BackButton from '../../components/common/BackButton.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setMessage('');

    try {
      await updateProfile({
        ...formData,
        role: user?.role,
      });

      setMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      setMessage(
        error?.response?.data?.message || 'Unable to update profile'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      username: user?.username || '',
    });

    setIsEditing(false);
    setMessage('');
  };

  const getRoleBadgeClass = () => {
    if (user?.role === 'founder') {
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    }

    return 'bg-cyan-100 text-cyan-700 border border-cyan-200';
  };

  return (
    <div className="min-h-full bg-slate-50">
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Back Button */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 px-8 py-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  My Profile
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Your account information
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setMessage('');
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Pencil size={17} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Message */}
            {message && (
              <div
                className={`mt-5 rounded-lg border px-4 py-3 text-sm font-medium ${
                  message.includes('success')
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {message}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {isEditing ? (
              /* =========================
                 EDIT PROFILE
              ========================= */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={19}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="full_name"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <AtSign
                      size={19}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Email - Read Only */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 py-3 pl-10 pr-4 text-slate-500"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Email address cannot be changed.
                  </p>
                </div>

                {/* Role - Read Only */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Role
                  </label>

                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <ShieldCheck
                      size={19}
                      className="text-slate-400"
                    />

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleBadgeClass()}`}
                    >
                      {user?.role || 'user'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={17} />

                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    <X size={17} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* =========================
                 PROFILE VIEW
              ========================= */
              <div className="space-y-4">
                {/* Full Name */}
                <div className="flex items-center gap-5 rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300 hover:bg-slate-50">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <User size={24} className="text-blue-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Full Name
                    </p>

                    <p className="mt-1 truncate text-lg font-semibold text-slate-900">
                      {user?.full_name || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Username */}
                <div className="flex items-center gap-5 rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300 hover:bg-slate-50">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-100">
                    <AtSign size={24} className="text-violet-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Username
                    </p>

                    <p className="mt-1 truncate text-lg font-semibold text-slate-900">
                      {user?.username
                        ? `@${user.username}`
                        : 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-5 rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300 hover:bg-slate-50">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Mail size={24} className="text-emerald-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Email
                    </p>

                    <p className="mt-1 truncate text-lg font-semibold text-slate-900">
                      {user?.email || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center gap-5 rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300 hover:bg-slate-50">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100">
                    <ShieldCheck size={24} className="text-orange-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Role
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${getRoleBadgeClass()}`}
                    >
                      {user?.role || 'user'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}