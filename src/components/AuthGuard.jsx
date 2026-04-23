import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthGuard = ({ requiredRoleId, children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoleId && user?.roleId !== requiredRoleId) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthGuard;