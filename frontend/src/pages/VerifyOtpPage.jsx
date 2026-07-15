import { KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { AuthLayout } from '../components/AuthLayout.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';

export const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get('email') || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      navigate(`/reset-password?token=${encodeURIComponent(data.resetToken)}`);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return <AuthLayout eyebrow="Account recovery" title="Verify your code" description="Enter the six-digit code sent to your email. It expires in 10 minutes." footer={<>Need to start over? <Link className="font-semibold text-brand hover:underline" to="/forgot-password">Request a new code</Link></>}>
    <form className="grid gap-5" onSubmit={submit}><Alert>{error}</Alert><Field id="email" label="Email address"><input id="email" className="input-control" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required/></Field><Field id="otp" label="Verification code"><div className="relative"><KeyRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18}/><input id="otp" className="input-icon-control tracking-[.35em]" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} placeholder="000000" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} required/></div></Field><Button type="submit" size="lg" loading={loading} loadingText="Verifying..." className="w-full">Verify code</Button></form>
  </AuthLayout>;
};
