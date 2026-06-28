# Lectura — Classroom Scheduler (Plain React JS)

Frontend-only React JS rewrite. No backend; all data lives in `localStorage` via `src/store.js`.

## Run
```bash
npm install
npm run dev
```

## Demo accounts (auto-created on first load)
- admin@lectura.dev / password
- teacher@lectura.dev / password
- student@lectura.dev / password

Sign in picks the dashboard automatically based on the account's role.

## Pages
- `/` landing
- `/auth` sign-in / sign-up
- `/admin` users · courses · timetable · roles (tabbed)
- `/teacher` weekly schedule
- `/student` weekly schedule
