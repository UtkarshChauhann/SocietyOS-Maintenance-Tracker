import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { AuthLayout } from '../components/AuthLayout.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setError(''); setSuccess('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try { const { data } = await api.post('/auth/reset-password', { resetToken: params.get('token'), password }); setSuccess(data.message); setTimeout(() => navigate('/login'), 1200); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return <AuthLayout eyebrow="Account recovery" title="Set a new password" description="Choose a strong password for your SocietyOS account." footer={<>Back to <Link className="font-semibold text-brand hover:underline" to="/login">sign in</Link></>}>
    <form className="grid gap-5" onSubmit={submit}><Alert>{error}</Alert><Alert type="success">{success}</Alert><Field id="password" label="New password" hint="Use at least 8 characters."><div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18}/><input id="password" className="input-icon-control pr-12" type={showPassword ? 'text' : 'password'} minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required/><button type="button" className="focus-ring absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></Field><Field id="confirmPassword" label="Confirm password"><input id="confirmPassword" className="input-control" type={showPassword ? 'text' : 'password'} minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required/></Field><Button type="submit" size="lg" loading={loading} loadingText="Updating password..." className="w-full">Update password</Button></form>
  </AuthLayout>;
};
