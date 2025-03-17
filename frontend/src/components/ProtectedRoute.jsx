import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  console.log("ProtectedRoute - Auth state:", {
    isAuthenticated,
    role: user?.role,
    allowedRoles,
    isLoading,
  });

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log("Auth is still loading, showing spinner");
    return <Spinner />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`User role ${user.role} not in allowed roles:`, allowedRoles);
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated and has required role, render the child routes
  console.log("User authenticated and authorized, rendering routes");
  return <Outlet />;
};

export default ProtectedRoute;
