import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { currentUser } from './store.js';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Admin from './pages/Admin.jsx';
import Teacher from './pages/Teacher.jsx';
import Student from './pages/Student.jsx';

function Protected({ role, children }) {
  const u = currentUser();
  const loc = useLocation();
  if (!u) return <Navigate to="/auth" state={{ from: loc }} replace />;
  if (role && u.role !== role) return <Navigate to={`/${u.role}`} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin/*" element={<Protected role="admin"><Admin /></Protected>} />
      <Route path="/teacher" element={<Protected role="teacher"><Teacher /></Protected>} />
      <Route path="/student" element={<Protected role="student"><Student /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
