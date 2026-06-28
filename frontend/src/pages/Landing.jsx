import { Link } from 'react-router-dom';
import { GraduationCap, CalendarRange, Video, Bell, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-8 w-8 rounded-md bg-primary text-white"><GraduationCap className="h-4 w-4" /></span>
            <span className="font-display text-lg font-bold tracking-tight">Lectura</span>
          </div>
          <Link to="/auth" className="text-sm font-medium hover:underline">Sign in →</Link>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-900 mb-6">Academic Modern</span>
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight">A calmer way to run<br/>your virtual classroom.</h1>
        <p className="mt-6 text-stone-600 max-w-xl mx-auto">
          Schedule lectures, generate Google Meet links, and keep teachers & students in sync — all in one place.
        </p>
        <Link to="/auth" className="inline-flex items-center gap-2 mt-8 h-11 px-6 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition">
          Get started <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
      <section id="features" className="mx-auto max-w-6xl px-4 pb-24 grid md:grid-cols-3 gap-4">
        <Feature icon={<CalendarRange className="h-5 w-5" />} title="Weekly timetable" desc="Admins schedule lectures by day and time slot." />
        <Feature icon={<Video className="h-5 w-5" />} title="Meet links auto-generated" desc="Every lecture gets a unique Google Meet URL." />
        <Feature icon={<Bell className="h-5 w-5" />} title="In-app notifications" desc="Teachers and students get notified about every class." />
      </section>
      <footer className="border-t py-8 text-center text-xs text-stone-500">Plain React JS export · Mock data only</footer>
    </div>
  );
}
function Feature({ icon, title, desc }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="h-10 w-10 grid place-items-center rounded-md bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="text-sm text-stone-600 mt-1">{desc}</p>
    </div>
  );
}
