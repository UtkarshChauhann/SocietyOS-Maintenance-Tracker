import { Copy, Eye, EyeOff, LockKeyhole, Mail, Building2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { AuthLayout } from '../components/AuthLayout.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const RegisterSocietyPage = () => {
  const { registerSociety } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ societyName: '', name: '', email: '', password: '' });
  const [result, setResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true);
    try { const data = await registerSociety(form); setResult(data.society); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return <AuthLayout eyebrow="Admin access" title="Create your society" description="Set up a private workspace and invite residents with a secure joining code." footer={<>Residents joining an existing society? <Link className="font-semibold text-brand hover:underline" to="/register">Join with a code</Link></>}>
    {result ? <div className="grid gap-5"><Alert type="success">Your society is ready. Share this code with residents.</Alert><div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-teal-950 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-100"><p className="text-sm">{result.name} joining code</p><div className="mt-2 flex items-center justify-between gap-2 text-xl font-bold tracking-widest"><span>{result.joiningCode}</span><button type="button" className="focus-ring rounded-md p-2 hover:bg-teal-100 dark:hover:bg-teal-900" onClick={() => navigator.clipboard?.writeText(result.joiningCode)} aria-label="Copy joining code"><Copy size={18} /></button></div></div><Button type="button" className="w-full" onClick={() => navigate('/admin/dashboard')}>Open dashboard</Button></div> : <form className="grid gap-5" onSubmit={submit}><Alert>{error}</Alert>
      <Field id="societyName" label="Society name"><div className="relative"><Building2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18}/><input id="societyName" className="input-icon-control" placeholder="Greenview Residency" value={form.societyName} onChange={update('societyName')} required/></div></Field>
      <Field id="name" label="Admin name"><div className="relative"><UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18}/><input id="name" className="input-icon-control" autoComplete="name" placeholder="Your full name" value={form.name} onChange={update('name')} required/></div></Field>
      <Field id="email" label="Admin email"><div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18}/><input id="email" className="input-icon-control" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required/></div></Field>
      <Field id="password" label="Password" hint="Use at least 8 characters."><div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18}/><input id="password" className="input-icon-control pr-12" type={showPassword ? 'text' : 'password'} minLength={8} autoComplete="new-password" value={form.password} onChange={update('password')} required/><button type="button" className="focus-ring absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></Field>
      <Button type="submit" size="lg" loading={loading} loadingText="Creating society..." className="w-full">Create society</Button>
    </form>}
  </AuthLayout>;
};
