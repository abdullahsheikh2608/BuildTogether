import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import FullScreenLoader from "../components/ui/FullScreenLoader.jsx";

const HOME_BY_ROLE = {
  founder: "/founder",
  developer: "/dashboard",
};

/** Usage: <Route element={<RoleRoute role="founder" />}>...</Route> */
export default function RoleRoute({ role }) {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;

  if (user?.role !== role) {
    return <Navigate to={HOME_BY_ROLE[user?.role] ?? "/login"} replace />;
  }

  return <Outlet />;
}
