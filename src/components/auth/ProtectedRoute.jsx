import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-cyan-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase())) {
    // Redirect to appropriate dashboard if role doesn't match
    const userRole = user.role?.toLowerCase();
    if (userRole === "patient") return <Navigate to="/patient-dashboard" replace />;
    if (userRole === "therapist") return <Navigate to="/therapist-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
