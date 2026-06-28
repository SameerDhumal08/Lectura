import { useState } from 'react';
import DashboardShell from '../components/DashboardShell.jsx';
import {
  listUsersByRole, createUser, deleteUser, setRole,
  getAll, createCourse, toggleEnrollment, createLecture, deleteLecture, courseName,
} from '../store.js';
import { Trash2, ShieldCheck, ShieldOff, Plus } from 'lucide-react';

const TABS = ['Users', 'Courses', 'Timetable', 'Admin roles'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Admin() {
  const [tab, setTab] = useState('Users');
  const [, refresh] = useState(0); const bump = () => refresh(x => x + 1);
  return (
    <DashboardShell role="Admin" accent="bg-emerald-100 text-emerald-900"
      title="Admin dashboard" subtitle="Manage teachers, students, courses, and the timetable.">
      <div className="flex flex-wrap gap-1 border-b mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${tab === t ? 'border-primary text-primary' : 'border-transparent text-stone-500 hover:text-stone-900'}`}>
            {t}
          </button>
        ))}
      </div>
      {tab === 'Users'       && <UsersPane onChange={bump} />}
      {tab === 'Courses'     && <CoursesPane onChange={bump} />}
      {tab === 'Timetable'   && <TimetablePane onChange={bump} />}
      {tab === 'Admin roles' && <RolesPane onChange={bump} />}
    </DashboardShell>
  );
}

function Section({ title, children, action }) {
  return (
    <section className="rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{title}</h2>{action}
      </div>
      {children}
    </section>
  );
}

function UsersPane({ onChange }) {
  const [role, setRole] = useState('teacher');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const users = listUsersByRole(role);
  function add(e) {
    e.preventDefault();
    try { createUser({ ...form, role }); setForm({ name: '', email: '', password: '' }); onChange(); }
    catch (err) { alert(err.message); }
  }
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Section title="Add user">
        <div className="flex gap-2 mb-3">
          {['teacher','student'].map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`px-3 h-8 rounded-md text-xs font-medium ${role===r ? 'bg-primary text-white' : 'bg-stone-100'}`}>{r}</button>
          ))}
        </div>
        <form onSubmit={add} className="space-y-2">
          <Input placeholder="Full name" value={form.name} onChange={v => setForm({...form, name: v})} />
          <Input placeholder="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} />
          <Input placeholder="Temp password" type="password" value={form.password} onChange={v => setForm({...form, password: v})} />
          <button className="h-9 px-4 rounded-md bg-primary text-white text-sm font-medium inline-flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Create {role}
          </button>
        </form>
      </Section>
      <Section title={`${role[0].toUpperCase()+role.slice(1)}s`}>
        {users.length === 0 ? <p className="text-sm text-stone-500">None yet.</p> : (
          <ul className="divide-y">
            {users.map(u => (
              <li key={u.id} className="py-2 flex items-center justify-between">
                <div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-stone-500">{u.email}</p></div>
                <button onClick={() => { if(confirm(`Delete ${u.email}?`)) { deleteUser(u.id); onChange(); } }}
                  className="h-8 w-8 grid place-items-center rounded hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function CoursesPane({ onChange }) {
  const teachers = listUsersByRole('teacher');
  const students = listUsersByRole('student');
  const courses = getAll('courses');
  const enrollments = getAll('enrollments');
  const [form, setForm] = useState({ name: '', teacherId: teachers[0]?.id || '' });
  function add(e) {
    e.preventDefault();
    if (!form.name) return;
    createCourse(form); setForm({ name: '', teacherId: teachers[0]?.id || '' }); onChange();
  }
  return (
    <div className="space-y-6">
      <Section title="New course">
        <form onSubmit={add} className="grid md:grid-cols-3 gap-2">
          <Input placeholder="Course name" value={form.name} onChange={v => setForm({...form, name: v})} />
          <Select value={form.teacherId} onChange={v => setForm({...form, teacherId: v})}
            options={[{value:'', label:'No teacher'}, ...teachers.map(t => ({ value: t.id, label: t.name }))]} />
          <button className="h-9 rounded-md bg-primary text-white text-sm font-medium">Create course</button>
        </form>
      </Section>
      {courses.map(c => {
        const enrolled = new Set(enrollments.filter(e => e.courseId === c.id).map(e => e.studentId));
        return (
          <Section key={c.id} title={c.name}>
            <p className="text-xs text-stone-500 mb-3">Teacher: {teachers.find(t => t.id === c.teacherId)?.name || '—'}</p>
            <p className="text-xs font-medium mb-2">Roster</p>
            {students.length === 0 ? <p className="text-sm text-stone-500">No students yet.</p> : (
              <ul className="grid sm:grid-cols-2 gap-1">
                {students.map(s => (
                  <li key={s.id}>
                    <label className="flex items-center gap-2 text-sm py-1">
                      <input type="checkbox" checked={enrolled.has(s.id)} onChange={() => { toggleEnrollment(c.id, s.id); onChange(); }} />
                      <span>{s.name} <span className="text-stone-400 text-xs">· {s.email}</span></span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        );
      })}
    </div>
  );
}

function TimetablePane({ onChange }) {
  const courses = getAll('courses');
  const lectures = getAll('lectures').slice().sort((a,b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
  const [form, setForm] = useState({ courseId: courses[0]?.id || '', title: '', dayOfWeek: 1, startTime: '09:00', endTime: '10:00' });
  function add(e) {
    e.preventDefault();
    if (!form.courseId || !form.title) return;
    createLecture(form); setForm({ ...form, title: '' }); onChange();
  }
  return (
    <div className="space-y-6">
      <Section title="Schedule a lecture">
        <form onSubmit={add} className="grid md:grid-cols-6 gap-2">
          <Select value={form.courseId} onChange={v => setForm({...form, courseId: v})}
            options={courses.map(c => ({ value: c.id, label: c.name }))} />
          <Input placeholder="Title" value={form.title} onChange={v => setForm({...form, title: v})} className="md:col-span-2" />
          <Select value={form.dayOfWeek} onChange={v => setForm({...form, dayOfWeek: +v})}
            options={DAYS.map((d,i) => ({ value: i, label: d }))} />
          <Input type="time" value={form.startTime} onChange={v => setForm({...form, startTime: v})} />
          <Input type="time" value={form.endTime} onChange={v => setForm({...form, endTime: v})} />
          <button className="md:col-span-6 h-9 rounded-md bg-primary text-white text-sm font-medium">Add lecture (auto Meet link + notify)</button>
        </form>
      </Section>
      <Section title="All lectures">
        {lectures.length === 0 ? <p className="text-sm text-stone-500">No lectures scheduled.</p> : (
          <ul className="divide-y">
            {lectures.map(l => (
              <li key={l.id} className="py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{l.title} <span className="text-stone-400 font-normal">· {courseName(l.courseId)}</span></p>
                  <p className="text-xs text-stone-500">{DAYS[l.dayOfWeek]} {l.startTime}–{l.endTime} · <a href={l.meetUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{l.meetUrl}</a></p>
                </div>
                <button onClick={() => { deleteLecture(l.id); onChange(); }}
                  className="h-8 w-8 grid place-items-center rounded hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function RolesPane({ onChange }) {
  const all = ['admin','teacher','student'].flatMap(r => listUsersByRole(r));
  return (
    <Section title="Promote / demote">
      <ul className="divide-y">
        {all.map(u => (
          <li key={u.id} className="py-2 flex items-center justify-between gap-2">
            <div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-stone-500">{u.email} · {u.role}</p></div>
            <div className="flex gap-1">
              {u.role !== 'admin' ? (
                <button onClick={() => { setRole(u.id, 'admin'); onChange(); }}
                  className="h-8 px-2.5 rounded text-xs inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                  <ShieldCheck className="h-3.5 w-3.5" /> Make admin
                </button>
              ) : (
                <button onClick={() => { setRole(u.id, 'teacher'); onChange(); }}
                  className="h-8 px-2.5 rounded text-xs inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200">
                  <ShieldOff className="h-3.5 w-3.5" /> Revoke admin
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Input({ className = '', onChange, ...rest }) {
  return <input {...rest} onChange={e => onChange(e.target.value)}
    className={`h-9 px-3 rounded-md border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${className}`} />;
}
function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="h-9 px-2 rounded-md border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
      {options.map(o => <option key={String(o.value)} value={o.value}>{o.label}</option>)}
    </select>
  );
}
