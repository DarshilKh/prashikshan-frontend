// src/admin/routes/adminRoutes.jsx

import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AdminProvider } from "../context/AdminContext";
import AdminLayout from "../components/AdminLayout";
import AdminRoute from "../components/AdminRoute";
import PageLoader, {
  DashboardLoader,
  TableLoader,
  ProfileLoader,
} from "../../components/common/PageLoader";
import LazyErrorBoundary from "../../components/common/LazyErrorBoundary";

// Lazy load admin pages
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const RequestAccess = lazy(() => import("../pages/RequestAccess"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const Users = lazy(() => import("../pages/Users"));
const UserDetails = lazy(() => import("../pages/UserDetails"));
const RolesPermissions = lazy(() => import("../pages/RolesPermissions"));
const Reports = lazy(() => import("../pages/Reports"));
const AuditLogs = lazy(() => import("../pages/AuditLogs"));
const SystemSettings = lazy(() => import("../pages/SystemSettings"));
const AdminMessages = lazy(() => import("../pages/Messages")); // ADD THIS
const Forbidden = lazy(() => import("../pages/Forbidden"));

// Admin-specific loading component
const AdminLoader = () => (
  <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
      <p className="text-[rgb(var(--muted))] font-medium">Loading...</p>
    </div>
  </div>
);

// Messages loader
const MessagesLoader = () => (
  <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center animate-pulse">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </div>
      <p className="text-[rgb(var(--muted))] font-medium">
        Loading messages...
      </p>
    </div>
  </div>
);

// Form loader for Request Access page
const FormLoader = () => (
  <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center p-4">
    <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-8 w-full max-w-2xl">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgb(var(--border))]" />
          <div className="h-8 w-48 mx-auto rounded-lg bg-[rgb(var(--border))]" />
          <div className="h-4 w-64 mx-auto rounded bg-[rgb(var(--border))]" />
        </div>
        {/* Form fields skeleton */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 rounded-xl bg-[rgb(var(--border))]" />
            <div className="h-12 rounded-xl bg-[rgb(var(--border))]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 rounded-xl bg-[rgb(var(--border))]" />
            <div className="h-12 rounded-xl bg-[rgb(var(--border))]" />
          </div>
          <div className="h-24 rounded-xl bg-[rgb(var(--border))]" />
          <div className="h-12 rounded-xl bg-[rgb(var(--border))]" />
        </div>
      </div>
    </div>
  </div>
);

const SuspenseWrapper = ({ children, fallback = <AdminLoader /> }) => (
  <LazyErrorBoundary>
    <Suspense fallback={fallback}>{children}</Suspense>
  </LazyErrorBoundary>
);

// AdminProvider wraps all admin routes
const AdminRoutes = () => {
  return (
    <AdminProvider>
      <Routes>
        {/* Public Admin Routes (No Auth Required) */}

        {/* Admin Login */}
        <Route
          path="login"
          element={
            <SuspenseWrapper>
              <AdminLogin />
            </SuspenseWrapper>
          }
        />

        {/* Request Access - Public */}
        <Route
          path="request-access"
          element={
            <SuspenseWrapper fallback={<FormLoader />}>
              <RequestAccess />
            </SuspenseWrapper>
          }
        />

        {/* Forbidden Page - Public */}
        <Route
          path="forbidden"
          element={
            <SuspenseWrapper>
              <Forbidden />
            </SuspenseWrapper>
          }
        />

        {/* Protected Admin Routes (Auth Required) */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              <SuspenseWrapper fallback={<DashboardLoader />}>
                <AdminDashboard />
              </SuspenseWrapper>
            }
          />

          <Route
            path="users"
            element={
              <SuspenseWrapper fallback={<TableLoader />}>
                <Users />
              </SuspenseWrapper>
            }
          />

          <Route
            path="users/:userId"
            element={
              <SuspenseWrapper fallback={<ProfileLoader />}>
                <UserDetails />
              </SuspenseWrapper>
            }
          />

          <Route
            path="roles"
            element={
              <SuspenseWrapper fallback={<TableLoader />}>
                <RolesPermissions />
              </SuspenseWrapper>
            }
          />

          <Route
            path="reports"
            element={
              <SuspenseWrapper fallback={<TableLoader />}>
                <Reports />
              </SuspenseWrapper>
            }
          />

          <Route
            path="logs"
            element={
              <SuspenseWrapper fallback={<TableLoader />}>
                <AuditLogs />
              </SuspenseWrapper>
            }
          />

          {/* ADD MESSAGES ROUTE */}
          <Route
            path="messages"
            element={
              <SuspenseWrapper fallback={<MessagesLoader />}>
                <AdminMessages />
              </SuspenseWrapper>
            }
          />

          <Route
            path="settings"
            element={
              <SuspenseWrapper fallback={<ProfileLoader />}>
                <SystemSettings />
              </SuspenseWrapper>
            }
          />
        </Route>

        {/* Catch all - redirect to dashboard (will go to login if not authenticated) */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminProvider>
  );
};

export default AdminRoutes;
