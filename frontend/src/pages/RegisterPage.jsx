import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { AuthLayout } from '../components/AuthLayout.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const strength = Math.min(3, [form.password.length >= 8, /[A-Z]/.test(form.password), /\d/.test(form.password)].filter(Boolean).length);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/complaints');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Resident access"
      title="Join your community"
      description="Create your resident account to report issues and follow every update from submission to resolution."
      footer={<>Already registered? <Link className="font-semibold text-brand hover:underline" to="/login">Sign in</Link></>}
    >
      <form className="grid gap-5" onSubmit={submit}>
        <Alert>{error}</Alert>
        <Field id="name" label="Full name">
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              id="name"
              className="input-icon-control"
              autoComplete="name"
              placeholder="Your full name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </div>
        </Field>
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
        <Field id="password" label="Password" hint="Use at least 8 characters.">
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              id="password"
              className="input-icon-control pr-12"
              type={showPassword ? 'text' : 'password'}
              minLength={8}
              autoComplete="new-password"
              placeholder="Create a secure password"
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
          {form.password ? (
            <div className="flex gap-1.5" aria-label={`Password strength ${strength} of 3`}>
              {[1, 2, 3].map((level) => (
                <span key={level} className={`h-1.5 flex-1 rounded-full ${strength >= level ? 'bg-brand' : 'bg-slate-200 dark:bg-slate-700'}`} />
              ))}
            </div>
          ) : null}
        </Field>
        <Button type="submit" size="lg" loading={loading} loadingText="Creating account..." className="mt-1 w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
};
