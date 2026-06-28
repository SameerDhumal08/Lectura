import { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { currentUser, notificationsFor, markNotifRead, markAllNotifRead } from '../store.js';

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const user = currentUser();
  function load() { if (user) setItems(notificationsFor(user.id)); }
  useEffect(() => { load(); const t = setInterval(load, 1500); return () => clearInterval(t); }, []);
  const unread = items.filter(i => !i.read).length;
  if (!user) return null;
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} aria-label="Notifications"
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-stone-200 transition">
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold grid place-items-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 z-40 rounded-lg border bg-white shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <p className="text-sm font-semibold">Notifications</p>
              {unread > 0 && (
                <button onClick={() => { markAllNotifRead(user.id); load(); }}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <p className="p-4 text-sm text-stone-500">No notifications yet.</p>
              ) : (
                <ul className="divide-y">
                  {items.map(n => (
                    <li key={n.id} className={`p-3 text-sm ${n.read ? '' : 'bg-amber-50'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium">{n.title}</p>
                          {n.body && <p className="text-xs text-stone-500">{n.body}</p>}
                          {n.link && <a href={n.link} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Open link →</a>}
                        </div>
                        {!n.read && (
                          <button onClick={() => { markNotifRead(n.id); load(); }}
                            className="shrink-0 inline-flex items-center justify-center h-6 w-6 rounded hover:bg-stone-200" aria-label="Mark read">
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
