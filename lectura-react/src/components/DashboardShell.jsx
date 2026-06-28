import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import { signOut } from '../store.js';
import NotificationsBell from './NotificationsBell.jsx';

export default function DashboardShell({ role, title, subtitle, accent, children }) {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid place-items-center h-8 w-8 rounded-md bg-primary text-white">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">Lectura</span>
            <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${accent}`}>{role}</span>
          </Link>
          <div className="flex items-center gap-1">
            <NotificationsBell />
            <button onClick={() => { signOut(); nav('/auth'); }}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-medium hover:bg-stone-200 transition">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-stone-600">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
