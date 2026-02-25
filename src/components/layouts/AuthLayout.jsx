// src/components/layouts/AuthLayout.jsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";

const AuthLayout = () => {
  const { isAuthenticated, isLoading, user, getRedirectPath } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    const redirectPath = getRedirectPath(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-green-100 dark:from-slate-900 dark:to-slate-800">
      <Outlet />
    </div>
  );
};

export default AuthLayout;