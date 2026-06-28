import DashboardShell from '../components/DashboardShell.jsx';
import ScheduleView from '../components/ScheduleView.jsx';
import { currentUser } from '../store.js';
export default function Teacher() {
  const u = currentUser();
  return (
    <DashboardShell role="Teacher" accent="bg-amber-100 text-amber-900"
      title={`Hello, ${u.name.split(' ')[0]}`} subtitle="Your upcoming lectures this week.">
      <ScheduleView audience="teacher" />
    </DashboardShell>
  );
}
