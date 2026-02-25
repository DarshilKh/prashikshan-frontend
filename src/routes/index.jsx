import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../components/layouts/AuthLayout";
import StudentLayout from "../components/layouts/StudentLayout";
import FacultyLayout from "../components/layouts/FacultyLayout";
import IndustryLayout from "../components/layouts/IndustryLayout";

import ProtectedRoute from "../components/common/ProtectedRoute";
import PageLoader, {
  DashboardLoader,
  TableLoader,
  CardsLoader,
  ProfileLoader,
  AuthLoader,
} from "../components/common/PageLoader";
import LazyErrorBoundary from "../components/common/LazyErrorBoundary";

// ================= PUBLIC PAGES =================
const LandingPage = lazy(() => import("../pages/Landing"));
const NotFoundPage = lazy(() => import("../pages/NotFound"));

// ================= AUTH PAGES =================
const LoginPage = lazy(() => import("../pages/auth/Login"));
const SignupPage = lazy(() => import("../pages/auth/Signup"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPassword"));

// ================= STUDENT PAGES =================
const StudentDashboard = lazy(() => import("../pages/student/Dashboard"));
const StudentProjects = lazy(() => import("../pages/student/Projects"));
const StudentMyApplications = lazy(
  () => import("../pages/student/MyApplications"),
);
const StudentMessages = lazy(() => import("../pages/student/Messages"));
const StudentProfile = lazy(() => import("../pages/student/Profile"));
const StudentSettings = lazy(() => import("../pages/student/Settings"));

// ================= FACULTY PAGES =================
const FacultyDashboard = lazy(() => import("../pages/faculty/Dashboard"));
const FacultyStudents = lazy(() => import("../pages/faculty/Students"));
const FacultyStudentDetails = lazy(
  () => import("../pages/faculty/StudentDetails"),
);
const FacultyReports = lazy(() => import("../pages/faculty/Reports"));
const FacultyMessages = lazy(() => import("../pages/faculty/Messages"));
const FacultyProfile = lazy(() => import("../pages/faculty/Profile"));
const FacultySettings = lazy(() => import("../pages/faculty/Settings"));

// ================= INDUSTRY PAGES =================
const IndustryDashboard = lazy(() => import("../pages/industry/Dashboard"));
const IndustryOpenings = lazy(() => import("../pages/industry/Openings"));
const IndustryApplications = lazy(
  () => import("../pages/industry/Applications"),
);
const IndustryApplicationReview = lazy(
  () => import("../pages/industry/ApplicationReview"),
);
const IndustryMessages = lazy(() => import("../pages/industry/Messages"));
const IndustryProfile = lazy(() => import("../pages/industry/Profile"));
const IndustrySettings = lazy(() => import("../pages/industry/Settings"));

// ================= ADMIN ROUTES =================
const AdminRoutes = lazy(() => import("../admin/routes/adminRoutes"));

// ================= SUSPENSE WRAPPER =================
const SuspenseWrapper = ({ children, fallback = <PageLoader /> }) => (
  <LazyErrorBoundary>
    <Suspense fallback={fallback}>{children}</Suspense>
  </LazyErrorBoundary>
);

// ================= APP ROUTES =================
const AppRoutes = () => {
  return (
    <Routes>
      {/* ========== PUBLIC ========== */}
      <Route
        path="/"
        element={
          <SuspenseWrapper
            fallback={<PageLoader message="Loading Prashikshan..." />}
          >
            <LandingPage />
          </SuspenseWrapper>
        }
      />

      {/* ========== AUTH ========== */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <SuspenseWrapper fallback={<AuthLoader />}>
              <LoginPage />
            </SuspenseWrapper>
          }
        />
        <Route
          path="/signup"
          element={
            <SuspenseWrapper fallback={<AuthLoader />}>
              <SignupPage />
            </SuspenseWrapper>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <SuspenseWrapper fallback={<AuthLoader />}>
              <ForgotPasswordPage />
            </SuspenseWrapper>
          }
        />
      </Route>

      {/* ========== STUDENT ========== */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <SuspenseWrapper fallback={<DashboardLoader />}>
              <StudentDashboard />
            </SuspenseWrapper>
          }
        />
        <Route
          path="projects"
          element={
            <SuspenseWrapper fallback={<CardsLoader />}>
              <StudentProjects />
            </SuspenseWrapper>
          }
        />
        <Route
          path="my-applications"
          element={
            <SuspenseWrapper fallback={<TableLoader />}>
              <StudentMyApplications />
            </SuspenseWrapper>
          }
        />
        <Route
          path="messages"
          element={
            <SuspenseWrapper fallback={<TableLoader />}>
              <StudentMessages />
            </SuspenseWrapper>
          }
        />
        <Route
          path="messages/:threadId"
          element={
            <SuspenseWrapper fallback={<TableLoader />}>
              <StudentMessages />
            </SuspenseWrapper>
          }
        />
        <Route
          path="profile"
          element={
            <SuspenseWrapper fallback={<ProfileLoader />}>
              <StudentProfile />
            </SuspenseWrapper>
          }
        />
        <Route
          path="settings"
          element={
            <SuspenseWrapper fallback={<ProfileLoader />}>
              <StudentSettings />
            </SuspenseWrapper>
          }
        />
      </Route>

      {/* ========== FACULTY ========== */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <SuspenseWrapper fallback={<DashboardLoader />}>
              <FacultyDashboard />
            </SuspenseWrapper>
          }
        />
        <Route
          path="students"
          element={
            <SuspenseWrapper fallback={<TableLoader />}>
              <FacultyStudents />
            </SuspenseWrapper>
          }
        />
        <Route
          path="student/:studentId"
          element={
            <SuspenseWrapper fallback={<ProfileLoader />}>
              <FacultyStudentDetails />
            </SuspenseWrapper>
          }
        />
        <Route
          path="reports"
          element={
            <SuspenseWrapper fallback={<DashboardLoader />}>
              <FacultyReports />
            </SuspenseWrapper>
          }
        />
        <Route
          path="messages"
          element={
            <SuspenseWrapper fallback={<TableLoader />}>
              <FacultyMessages />
            </SuspenseWrapper>
          }
        />
        <Route
          path="messages/:threadId"
          element={
            <SuspenseWrapper fallback={<TableLoader />}>
              <FacultyMessages />
            </SuspenseWrapper>
          }
        />
        <Route
          path="profile"
          element={
            <SuspenseWrapper fallback={<ProfileLoader />}>
              <FacultyProfile />
            </SuspenseWrapper>
          }
        />
        <Route
          path="settings"
          element={
            <SuspenseWrapper fallback={<ProfileLoader />}>
              <FacultySettings />
            </SuspenseWrapper>
          }
        />
      </Route>

      {/* ========== INDUSTRY ========== */}
      <Route
        path="/industry"
        element={
          <ProtectedRoute allowedRoles={["industry"]}>
            <IndustryLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <SuspenseWrapper fallback={<DashboardLoader />}>
              <IndustryDashboard />
            </SuspenseWrapper>
          }
        />
        <Route
          path="openings"
          element={
            <SuspenseWrapper fallback={<CardsLoader />}>
              <IndustryOpenings />
            </SuspenseWrapper>
          }
        />
        <Route
          path="applications"
          element={
            <SuspenseWrapper fallback={<TableLoader />}>
              <IndustryApplications />
            </SuspenseWrapper>
          }
        />
        <Route
          path="application/:applicationId"
          element={
            <SuspenseWrapper fallback={<ProfileLoader />}>
              <IndustryApplicationReview />
            </SuspenseWrapper>
          }
        />
        <Route
          path="messages"
          element={
            <SuspenseWrapper fallback={<TableLoader />}>
              <IndustryMessages />
            </SuspenseWrapper>
          }
        />
        <Route
          path="messages/:threadId"
          element={
            <SuspenseWrapper fallback={<TableLoader />}>
              <IndustryMessages />
            </SuspenseWrapper>
          }
        />
        <Route
          path="profile"
          element={
            <SuspenseWrapper fallback={<ProfileLoader />}>
              <IndustryProfile />
            </SuspenseWrapper>
          }
        />
        <Route
          path="settings"
          element={
            <SuspenseWrapper fallback={<ProfileLoader />}>
              <IndustrySettings />
            </SuspenseWrapper>
          }
        />
      </Route>

      {/* ========== ADMIN ========== */}
      <Route
        path="/admin/*"
        element={
          <SuspenseWrapper
            fallback={<PageLoader message="Loading Admin Panel..." />}
          >
            <AdminRoutes />
          </SuspenseWrapper>
        }
      />

      {/* ========== 404 NOT FOUND ========== */}
      <Route
        path="*"
        element={
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
