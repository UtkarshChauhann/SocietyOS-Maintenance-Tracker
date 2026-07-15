import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { AuthLayout } from '../components/AuthLayout.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/complaints');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your community"
      description="Access your complaints, notices, and community updates in one secure place."
      footer={<>New to SocietyOS? <Link className="font-semibold text-brand hover:underline" to="/register">Join a society</Link><span className="mx-2">·</span><Link className="font-semibold text-brand hover:underline" to="/register-society">Create a society</Link></>}
    >
      <form className="grid gap-5" onSubmit={submit}>
        <Alert>{error}</Alert>
        <Field id="email" label="Email address">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              id="email"
              className="input-icon-control"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>
        </Field>
        <Field id="password" label="Password">
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              id="password"
              className="input-icon-control pr-12"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
            <button
              className="focus-ring absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted hover:text-ink"
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </Field>
        <div className="-mt-2 text-right"><Link className="text-sm font-semibold text-brand hover:underline" to="/forgot-password">Forgot password?</Link></div>
        <Button type="submit" size="lg" loading={loading} loadingText="Signing in..." className="mt-1 w-full">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
};
