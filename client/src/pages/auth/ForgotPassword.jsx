import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, KeyRound, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout.jsx';
import AuthInput from '../../components/auth/AuthInput.jsx';
import PasswordInput from '../../components/auth/PasswordInput.jsx';
import AuthButton from '../../components/auth/AuthButton.jsx';
import { forgotPassword, resetPassword } from '../../services/auth.service.js';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: request code, 2: reset password, 3: success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      if (response?.data?.resetCode) {
        setDemoCode(response.data.resetCode);
        setCode(response.data.resetCode); // Pre-fill for seamless user experience
      }
      setSuccessMsg(response.message || 'Verification code sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ email, code, newPassword: password });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please verify your code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="ACCOUNT RECOVERY"
      title={
        <>
          {step === 3 ? 'Password reset successfully' : 'Reset your password'}
          <span className="text-auth-blue-bright">.</span>
        </>
      }
      subtitle={
        step === 1
          ? "Enter your account email to receive a password reset verification code."
          : step === 2
          ? "Enter the 6-digit verification code and your new password."
          : "Your account security credentials have been updated."
      }
      visualVariant="login"
    >
      {step === 1 && (
        <form onSubmit={handleRequestCode} className="flex flex-col gap-5">
          <AuthInput
            id="reset-email"
            name="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/login" className="sm:flex-1">
              <AuthButton type="button" variant="secondary" className="w-full">
                <ArrowLeft size={16} />
                Back to Sign in
              </AuthButton>
            </Link>
            <AuthButton type="submit" variant="primary" loading={loading} className="sm:flex-1">
              Send Reset Code
              <ArrowRight size={16} />
            </AuthButton>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
          {successMsg && (
            <div className="rounded-lg border border-auth-blue-bright/30 bg-auth-blue/10 p-3.5 text-sm text-auth-text">
              <p className="font-medium text-auth-blue-bright">{successMsg}</p>
              {demoCode && (
                <div className="mt-2 flex items-center gap-2 rounded-md bg-auth-surface px-3 py-1.5 text-xs">
                  <ShieldCheck size={16} className="text-auth-blue-bright" />
                  <span>Your 6-digit verification code:</span>
                  <span className="font-mono text-sm font-bold text-auth-blue-bright tracking-wider">{demoCode}</span>
                </div>
              )}
            </div>
          )}

          <AuthInput
            id="reset-code"
            name="code"
            type="text"
            label="6-Digit Verification Code"
            placeholder="123456"
            icon={KeyRound}
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordInput
              id="new-password"
              name="password"
              label="New Password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordInput
              id="confirm-password"
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <AuthButton
              type="button"
              variant="secondary"
              onClick={() => {
                setStep(1);
                setError('');
              }}
              className="sm:flex-1"
            >
              <ArrowLeft size={16} />
              Change Email
            </AuthButton>
            <AuthButton type="submit" variant="primary" loading={loading} className="sm:flex-1">
              Set New Password
              <CheckCircle size={16} />
            </AuthButton>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center text-center py-4 gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle size={36} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-auth-text">Password Updated!</h3>
            <p className="mt-1 text-sm text-auth-text-dim max-w-sm">
              Your password has been successfully reset. You can now sign in to your BuildTogether account with your new password.
            </p>
          </div>
          <AuthButton
            type="button"
            variant="primary"
            onClick={() => navigate('/login', { replace: true })}
            className="w-full sm:w-auto px-8"
          >
            Sign In to Your Account
            <ArrowRight size={16} />
          </AuthButton>
        </div>
      )}

      {step !== 3 && (
        <p className="mt-7 text-center text-sm text-auth-text-dim">
          Remembered your password?{' '}
          <Link to="/login" className="font-medium text-auth-blue-bright hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}
