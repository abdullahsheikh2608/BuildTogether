import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import RoleOption from "../../components/ui/RoleOption.jsx";
import { useAuth } from "../../hooks/useAuth.js";

const INITIAL_FORM = {
  role: "founder",
  full_name: "",
  username: "",
  email: "",
  password: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await register(form);
      const HOME_BY_ROLE = { founder: "/founder", developer: "/dashboard" };
      navigate(HOME_BY_ROLE[user.role] ?? "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Draft your profile"
      subtitle="Pick the role that matches what you're here to do."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <RoleOption
            role="founder"
            title="Founder"
            description="Post startups, review applicants."
            selected={form.role === "founder"}
            onSelect={(role) => setForm((f) => ({ ...f, role }))}
          />
          <RoleOption
            role="developer"
            title="Developer"
            description="Browse startups, apply to build."
            selected={form.role === "developer"}
            onSelect={(role) => setForm((f) => ({ ...f, role }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="full_name"
            name="full_name"
            label="Full name"
            placeholder="Abdullah Khan"
            value={form.full_name}
            onChange={handleChange}
            required
          />
          <Input
            id="username"
            name="username"
            label="Username"
            placeholder="abdullah"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && (
          <p className="rounded-sm border border-ink-red/40 bg-ink-red/10 px-3 py-2 font-mono text-xs text-ink-red">
            {error}
          </p>
        )}

        <Button type="submit" loading={submitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-paper-dim">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-cyan hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
