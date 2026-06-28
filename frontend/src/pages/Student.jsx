import DashboardShell from '../components/DashboardShell.jsx';
import ScheduleView from '../components/ScheduleView.jsx';
import { currentUser } from '../store.js';
export default function Student() {
  const u = currentUser();
  return (
    <DashboardShell role="Student" accent="bg-sky-100 text-sky-900"
      title={`Hello, ${u.name.split(' ')[0]}`} subtitle="Your classes this week.">
      <ScheduleView audience="student" />
    </DashboardShell>
  );
}
