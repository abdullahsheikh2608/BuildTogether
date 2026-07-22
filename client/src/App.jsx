import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';

import DashboardLayout from './components/layout/DashboardLayout.jsx';

// Founder Pages
import FounderDashboard from './pages/founder/FounderDashboard.jsx';
import StartupApplications from './pages/founder/StartupApplication.jsx';

// Developer Pages
import DeveloperDashboard from './pages/developer/DeveloperDashboard.jsx';
import BrowseStartups from './pages/developer/BrowseStartups.jsx';
import StartupDetails from './pages/developer/StartupDetails.jsx';
import MyApplications from './pages/developer/MyApplications.jsx';

// Profile
import Profile from './pages/profile/Profile.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Shared Layout (ONLY ONE) */}
        <Route element={<DashboardLayout />}>
          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Founder Routes */}
          <Route element={<RoleRoute role="founder" />}>
            <Route path="/founder" element={<FounderDashboard />} />

            <Route path="/founder/startups/:id/applications" element={<StartupApplications />} />
          </Route>

          {/* Developer Routes */}
          <Route element={<RoleRoute role="developer" />}>
            <Route path="/dashboard" element={<DeveloperDashboard />} />

            <Route path="/dashboard/startups" element={<BrowseStartups />} />

            <Route path="/dashboard/startups/:id" element={<StartupDetails />} />

            <Route path="/dashboard/applications" element={<MyApplications />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
