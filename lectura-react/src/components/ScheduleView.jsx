import { CalendarDays, Video } from 'lucide-react';
import { lecturesForUser, currentUser, courseName } from '../store.js';
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function ScheduleView({ audience }) {
  const u = currentUser();
  const rows = lecturesForUser(u).slice().sort((a,b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <CalendarDays className="h-8 w-8 mx-auto text-stone-400" />
        <p className="mt-3 font-medium">No lectures yet</p>
        <p className="text-sm text-stone-500 mt-1">
          {audience === 'teacher' ? "You haven't been assigned to any lectures." : "You aren't enrolled in any lectures yet."}
        </p>
      </div>
    );
  }
  const today = new Date().getDay();
  return (
    <div className="space-y-5">
      {DAYS.map((day, idx) => {
        const items = rows.filter(r => r.dayOfWeek === idx);
        if (items.length === 0) return null;
        const isToday = idx === today;
        return (
          <div key={idx} className="rounded-xl border bg-white overflow-hidden">
            <div className={`px-5 py-2.5 flex items-center justify-between ${isToday ? 'bg-primary text-white' : 'bg-stone-100'}`}>
              <p className="text-sm font-semibold">{day}</p>
              {isToday && <span className="text-xs font-medium">Today</span>}
            </div>
            <ul className="divide-y">
              {items.map(l => (
                <li key={l.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{l.title}</p>
                    <p className="text-xs text-stone-500">{courseName(l.courseId)} • {l.startTime}–{l.endTime}</p>
                  </div>
                  <a href={l.meetUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition shrink-0">
                    <Video className="h-4 w-4" /> {audience === 'teacher' ? 'Start' : 'Join'}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
