import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout.jsx';
import AuthInput from '../../components/auth/AuthInput.jsx';
import PasswordInput from '../../components/auth/PasswordInput.jsx';
import AuthButton from '../../components/auth/AuthButton.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form);
      const HOME_BY_ROLE = { founder: '/founder', developer: '/dashboard' };
      const redirectTo = location.state?.from?.pathname ?? HOME_BY_ROLE[user.role] ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="WELCOME BACK"
      title={
        <>
          Sign in to your account
          <span className="text-auth-blue-bright">.</span>
        </>
      }
      subtitle="Build better products. Together."
      visualVariant="login"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          required
        />
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-auth-text-dim">
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="h-4 w-4 rounded border-auth-border bg-auth-input text-auth-blue-bright focus:ring-auth-blue-bright/30"
            />
            Keep me signed in
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-auth-blue-bright hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        <AuthButton type="submit" variant="primary" loading={submitting} className="w-full">
          Sign in
          <ArrowRight size={16} />
        </AuthButton>
      </form>

      <p className="mt-7 text-center text-sm text-auth-text-dim">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-auth-blue-bright hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
