import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import ComplaintDetail from './pages/ComplaintDetail';
import Institutions from './pages/Institutions';
import InstitutionProfile from './pages/InstitutionProfile';
import Overlaps from './pages/Overlaps';
import OverlapDetail from './pages/OverlapDetail';
import Coordination from './pages/Coordination';
import CaseNetwork from './pages/CaseNetwork';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="complaints/:id" element={<ComplaintDetail />} />
        <Route path="institutions" element={<Institutions />} />
        <Route path="institutions/:id" element={<InstitutionProfile />} />
        <Route path="overlaps" element={<Overlaps />} />
        <Route path="overlaps/:id" element={<OverlapDetail />} />
        <Route path="coordination" element={<Coordination />} />
        <Route path="network" element={<CaseNetwork />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit-logs" element={<AuditLogs />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
