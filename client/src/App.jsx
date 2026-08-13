import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectWorkspace from "./pages/founder/ProjectWorkspace.jsx";

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';

import DashboardLayout from './components/layout/DashboardLayout.jsx';

// Founder Pages
import FounderDashboard from './pages/founder/FounderDashboard.jsx';
import FounderStartups from './pages/founder/FounderStartups.jsx';
import FounderAnalytics from './pages/founder/FounderAnalytics.jsx';
import StartupApplications from './pages/founder/StartupApplication.jsx';
import FounderApplicationsPage from './pages/founder/FounderApplicationsPage.jsx';
import FounderApplicationDetailsPage from './pages/founder/FounderApplicationDetailsPage.jsx';
import FounderMembersPage from './pages/founder/FounderMembersPage.jsx';
import FounderTasksPage from './pages/founder/FounderTasksPage.jsx';
import FounderWorkspacePage from './pages/founder/FounderWorkspacePage.jsx';
import FounderChatPage from './pages/founder/FounderChatPage.jsx';
import FounderAIAssistantPage from './pages/founder/FounderAIAssistantPage.jsx';
import FounderProjectTeamMembers from './pages/founder/FounderProjectTeamMembers.jsx';
import FounderProjectTasks from './pages/founder/FounderProjectTasks.jsx';
import FounderProjectChat from './pages/founder/FounderProjectChat.jsx';
import FounderProjectAIAssistant from './pages/founder/FounderProjectAIAssistant.jsx';

// Developer Pages
import DeveloperDashboard from './pages/developer/DeveloperDashboard.jsx';
import BrowseStartups from './pages/developer/BrowseStartups.jsx';
import StartupDetails from './pages/developer/StartupDetails.jsx';
import ApplicationFormPage from './pages/developer/ApplicationFormPage.jsx';
import ApplicationEditPage from './pages/developer/ApplicationEditPage.jsx';
import DeveloperApplicationDetailsPage from './pages/developer/DeveloperApplicationDetailsPage.jsx';
import MyApplications from './pages/developer/MyApplications.jsx';
import MyProjects from './pages/developer/MyProjects.jsx';
import MyWorkspace from './pages/developer/MyWorkspace.jsx';
import TeamChat from './pages/developer/TeamChat.jsx';
import DeveloperProjectLayout from './pages/developer/DeveloperProjectLayout.jsx';
import WorkspaceOverview from './pages/developer/WorkspaceOverview.jsx';
import WorkspaceChat from './pages/developer/WorkspaceChat.jsx';
import WorkspaceAIAssistant from './pages/developer/WorkspaceAIAssistant.jsx';
import WorkspaceTasks from './pages/developer/WorkspaceTasks.jsx';
import WorkspaceMembers from './pages/developer/WorkspaceMembers.jsx';
import WorkspaceAnalytics from './pages/developer/WorkspaceAnalytics.jsx';
import DeveloperTasks from './pages/developer/DeveloperTasks.jsx';
import DeveloperAIAssistant from './pages/developer/DeveloperAIAssistant.jsx';

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
            <Route path="/founder/startups" element={<FounderStartups />} />
            <Route path="/founder/analytics" element={<FounderAnalytics />} />

            <Route
              path="/founder/applications"
              element={<FounderApplicationsPage />}
            />

            <Route
              path="/founder/applications/:applicationId"
              element={<FounderApplicationDetailsPage />}
            />

            <Route
              path="/founder/team-members"
              element={<FounderMembersPage />}
            />

            <Route
              path="/founder/tasks"
              element={<FounderTasksPage />}
            />

            <Route
              path="/founder/workspace"
              element={<FounderWorkspacePage />}
            />
            <Route
              path="/founder/workspace/:startupId"
              element={<FounderWorkspacePage />}
            />

            <Route
              path="/founder/chat"
              element={<FounderChatPage />}
            />
            <Route
              path="/founder/chat/:startupId"
              element={<FounderChatPage />}
            />

            <Route
              path="/founder/ai-assistant"
              element={<FounderAIAssistantPage />}
            />
            <Route
              path="/founder/ai-assistant/:startupId"
              element={<FounderAIAssistantPage />}
            />

            <Route
              path="/founder/projects/:startupId/team-members"
              element={<FounderProjectTeamMembers />}
            />

            <Route
              path="/founder/projects/:startupId/tasks"
              element={<FounderProjectTasks />}
            />

            <Route
              path="/founder/projects/:startupId/chat"
              element={<FounderProjectChat />}
            />

            <Route
              path="/founder/projects/:startupId/ai-assistant"
              element={<FounderProjectAIAssistant />}
            />

            <Route
              path="/founder/projects/:startupId"
              element={<ProjectWorkspace />}
            />

            <Route
              path="/founder/startups/:id/applications"
              element={<StartupApplications />}
            />
          </Route>

          {/* Developer Routes */}
          <Route element={<RoleRoute role="developer" />}>
            <Route path="/dashboard" element={<DeveloperDashboard />} />

            <Route
              path="/dashboard/projects"
              element={<MyProjects />}
            />

            <Route
              path="/dashboard/workspace"
              element={<MyWorkspace />}
            />

            <Route
              path="/dashboard/tasks"
              element={<DeveloperTasks />}
            />

            <Route
              path="/dashboard/chat"
              element={<TeamChat />}
            />

            <Route
              path="/dashboard/ai"
              element={<DeveloperAIAssistant />}
            />

            <Route
              path="/dashboard/workspace/:startupId"
              element={<MyWorkspace />}
            />

            <Route
              path="/dashboard/startups"
              element={<BrowseStartups />}
            />

            <Route
              path="/dashboard/startups/:id"
              element={<StartupDetails />}
            />

            <Route
              path="/dashboard/startups/:startupId/apply"
              element={<ApplicationFormPage />}
            />

            <Route
              path="/dashboard/applications"
              element={<MyApplications />}
            />

            <Route
              path="/dashboard/applications/:applicationId"
              element={<DeveloperApplicationDetailsPage />}
            />

            <Route
              path="/dashboard/applications/:applicationId/edit"
              element={<ApplicationEditPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;