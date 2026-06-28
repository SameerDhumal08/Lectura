import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { signIn, signUp, currentUser } from '../store.js';

export default function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [err, setErr] = useState('');
  if (currentUser()) { nav(`/${currentUser().role}`); return null; }

  function submit(e) {
    e.preventDefault(); setErr('');
    try {
      const u = mode === 'signin' ? signIn(form.email, form.password) : signUp(form);
      nav(`/${u.role}`);
    } catch (e) { setErr(e.message); }
  }
  return (
    <div className="min-h-screen grid place-items-center px-4 bg-stone-50">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-6 justify-center">
          <span className="grid place-items-center h-8 w-8 rounded-md bg-primary text-white"><GraduationCap className="h-4 w-4" /></span>
          <span className="font-display text-lg font-bold tracking-tight">Lectura</span>
        </Link>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="font-display text-2xl font-bold">{mode === 'signin' ? 'Welcome back' : 'Create account'}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {mode === 'signin' ? 'Sign in to your dashboard.' : 'Sign up to enroll as a student.'}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-3">
            {mode === 'signup' && (
              <Field label="Full name" value={form.name} onChange={v => setForm({...form, name: v})} required />
            )}
            <Field label="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} required />
            <Field label="Password" type="password" value={form.password} onChange={v => setForm({...form, password: v})} required />
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button className="w-full h-10 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition">
              {mode === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          </form>
          <p className="text-sm text-stone-500 mt-4 text-center">
            {mode === 'signin' ? "No account? " : "Have an account? "}
            <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-primary hover:underline font-medium">
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        <div className="mt-4 text-xs text-stone-500 text-center">
          Demo: admin@lectura.dev · teacher@lectura.dev · student@lectura.dev (password: <code>password</code>)
        </div>
      </div>
    </div>
  );
}
function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        className="mt-1 w-full h-10 px-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </label>
  );
}
