import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, ArrowRight } from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout.jsx';
import AuthInput from '../../components/auth/AuthInput.jsx';
import AuthRoleSelect from '../../components/auth/AuthRoleSelect.jsx';
import PasswordInput from '../../components/auth/PasswordInput.jsx';
import AuthButton from '../../components/auth/AuthButton.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const INITIAL_FORM = {
  role: 'founder',
  full_name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = form;
      const user = await register(payload);
      const HOME_BY_ROLE = { founder: '/founder', developer: '/dashboard' };
      navigate(HOME_BY_ROLE[user.role] ?? '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="START FOR FREE"
      title={
        <>
          Create new account
          <span className="text-auth-blue-bright">.</span>
        </>
      }
      subtitle="Join thousands of builders creating the next big thing."
      visualVariant="register"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthRoleSelect value={form.role} onChange={handleChange} />

        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            id="full_name"
            name="full_name"
            label="Full name"
            placeholder="Abdullah Khan"
            icon={User}
            value={form.full_name}
            onChange={handleChange}
            required
          />
          <AuthInput
            id="username"
            name="username"
            label="Username"
            placeholder="abdullah"
            icon={User}
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="grid grid-cols-2 gap-4">
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            required
          />
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        <AuthButton type="submit" variant="primary" loading={submitting} className="w-full">
          Create account
          <ArrowRight size={16} />
        </AuthButton>
      </form>

      <p className="mt-7 text-center text-sm text-auth-text-dim">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-auth-blue-bright hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
