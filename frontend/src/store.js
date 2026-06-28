// Tiny localStorage-backed mock store. Replace with a real API later.
const K = 'lectura.db.v1';
const SESSION = 'lectura.session.v1';

const uid = () => Math.random().toString(36).slice(2, 10);

function read() {
  try { return JSON.parse(localStorage.getItem(K) || 'null'); } catch { return null; }
}
function write(db) { localStorage.setItem(K, JSON.stringify(db)); }

export function seed() {
  if (read()) return;
  const adminId = uid(), teacherId = uid(), studentId = uid();
  const courseId = uid();
  const db = {
    users: [
      { id: adminId,   email: 'admin@lectura.dev',   name: 'Ada Admin',   password: 'password', role: 'admin' },
      { id: teacherId, email: 'teacher@lectura.dev', name: 'Tina Teacher', password: 'password', role: 'teacher' },
      { id: studentId, email: 'student@lectura.dev', name: 'Sam Student',  password: 'password', role: 'student' },
    ],
    courses: [{ id: courseId, name: 'Intro to Algorithms', teacherId }],
    enrollments: [{ courseId, studentId }],
    lectures: [
      { id: uid(), courseId, title: 'Big-O & Asymptotics', dayOfWeek: 1, startTime: '09:00', endTime: '10:00', meetUrl: meetLink() },
      { id: uid(), courseId, title: 'Sorting Lab',         dayOfWeek: 3, startTime: '11:00', endTime: '12:30', meetUrl: meetLink() },
    ],
    notifications: [
      { id: uid(), userId: teacherId, title: 'Welcome to Lectura', body: 'Your demo schedule is ready.', link: null, read: false, createdAt: Date.now() },
      { id: uid(), userId: studentId, title: 'You are enrolled in Intro to Algorithms', body: 'Check your weekly schedule.', link: null, read: false, createdAt: Date.now() },
    ],
  };
  write(db);
}

function meetLink() {
  const seg = (n) => Array.from({ length: n }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random()*26)]).join('');
  return `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
}

// ---- auth ----
export function signIn(email, password) {
  const db = read();
  const u = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!u) throw new Error('Invalid email or password');
  localStorage.setItem(SESSION, JSON.stringify({ userId: u.id }));
  return u;
}
export function signUp({ email, password, name }) {
  const db = read();
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) throw new Error('Email already in use');
  const user = { id: uid(), email, password, name, role: 'student' };
  db.users.push(user);
  write(db);
  localStorage.setItem(SESSION, JSON.stringify({ userId: user.id }));
  return user;
}
export function signOut() { localStorage.removeItem(SESSION); }
export function currentUser() {
  const s = JSON.parse(localStorage.getItem(SESSION) || 'null');
  if (!s) return null;
  return read().users.find(u => u.id === s.userId) || null;
}

// ---- generic helpers ----
export function getAll(table) { return read()[table]; }
export function listUsersByRole(role) { return read().users.filter(u => u.role === role); }
export function createUser({ email, name, password, role }) {
  const db = read();
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) throw new Error('Email exists');
  const user = { id: uid(), email, name, password, role };
  db.users.push(user); write(db); return user;
}
export function deleteUser(id) {
  const db = read();
  db.users = db.users.filter(u => u.id !== id);
  db.enrollments = db.enrollments.filter(e => e.studentId !== id);
  db.courses = db.courses.map(c => c.teacherId === id ? { ...c, teacherId: null } : c);
  write(db);
}
export function setRole(userId, role) {
  const db = read();
  const u = db.users.find(u => u.id === userId);
  if (u) { u.role = role; write(db); }
}
export function createCourse({ name, teacherId }) {
  const db = read(); const c = { id: uid(), name, teacherId };
  db.courses.push(c); write(db); return c;
}
export function toggleEnrollment(courseId, studentId) {
  const db = read();
  const i = db.enrollments.findIndex(e => e.courseId === courseId && e.studentId === studentId);
  if (i >= 0) db.enrollments.splice(i, 1);
  else db.enrollments.push({ courseId, studentId });
  write(db);
}
export function createLecture({ courseId, title, dayOfWeek, startTime, endTime }) {
  const db = read();
  const lec = { id: uid(), courseId, title, dayOfWeek: +dayOfWeek, startTime, endTime, meetUrl: meetLink() };
  db.lectures.push(lec);
  // notifications fan-out
  const c = db.courses.find(c => c.id === courseId);
  const recipients = new Set();
  if (c?.teacherId) recipients.add(c.teacherId);
  db.enrollments.filter(e => e.courseId === courseId).forEach(e => recipients.add(e.studentId));
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  recipients.forEach(userId => db.notifications.push({
    id: uid(), userId, title: `New lecture: ${title}`,
    body: `${c?.name ?? 'Course'} • ${DAYS[lec.dayOfWeek]} ${startTime}–${endTime}`,
    link: lec.meetUrl, read: false, createdAt: Date.now(),
  }));
  write(db); return lec;
}
export function deleteLecture(id) {
  const db = read(); db.lectures = db.lectures.filter(l => l.id !== id); write(db);
}
export function lecturesForUser(user) {
  const db = read();
  if (user.role === 'admin') return db.lectures;
  if (user.role === 'teacher') {
    const myCourses = new Set(db.courses.filter(c => c.teacherId === user.id).map(c => c.id));
    return db.lectures.filter(l => myCourses.has(l.courseId));
  }
  const myCourses = new Set(db.enrollments.filter(e => e.studentId === user.id).map(e => e.courseId));
  return db.lectures.filter(l => myCourses.has(l.courseId));
}
export function notificationsFor(userId) {
  return read().notifications.filter(n => n.userId === userId).sort((a,b) => b.createdAt - a.createdAt);
}
export function markNotifRead(id) {
  const db = read(); const n = db.notifications.find(n => n.id === id); if (n) { n.read = true; write(db); }
}
export function markAllNotifRead(userId) {
  const db = read(); db.notifications.forEach(n => { if (n.userId === userId) n.read = true; }); write(db);
}
export function courseName(id) { return read().courses.find(c => c.id === id)?.name ?? 'Course'; }
