import { Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { AuthLayout } from '../components/AuthLayout.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return <AuthLayout eyebrow="Account recovery" title="Forgot your password?" description="Enter your email and we’ll send a one-time verification code if an account exists." footer={<>Remembered it? <Link className="font-semibold text-brand hover:underline" to="/login">Back to sign in</Link></>}>
    <form className="grid gap-5" onSubmit={submit}><Alert>{error}</Alert><Field id="email" label="Email address"><div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18}/><input id="email" className="input-icon-control" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required/></div></Field><Button type="submit" size="lg" loading={loading} loadingText="Sending code..." className="w-full">Send verification code</Button></form>
  </AuthLayout>;
};
