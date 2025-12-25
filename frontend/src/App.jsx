import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitIssue from './pages/SubmitIssue';
import PublicDashboard from './pages/PublicDashboard';
import IssueDetails from './pages/IssueDetails'; // <--- हे import कर
import AdminDashboard from './pages/AdminDashboard'
import  VillageAdminDashboard from './pages/VillageAdminDashboard'
function App() {
  return (
    <div className="min-h-screen bg-green-50">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit" element={<SubmitIssue />} />
        <Route path="/issue-details/:id" element={<IssueDetails />} />
        <Route path="/public" element={<PublicDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/VillageAdminDashboard" element={<VillageAdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;