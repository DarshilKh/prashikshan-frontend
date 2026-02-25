// src/hooks/usePreload.js
import { useCallback, useRef } from "react";

/**
 * Map of route paths to their import functions for preloading
 * These must match the actual lazy imports in routes/index.jsx
 */
const routeImports = {
  // Student routes
  "student-dashboard": () => import("../pages/student/Dashboard"),
  "student-projects": () => import("../pages/student/Projects"),
  "student-my-applications": () => import("../pages/student/MyApplications"),
  "student-profile": () => import("../pages/student/Profile"),
  "student-settings": () => import("../pages/student/Settings"),

  // Faculty routes
  "faculty-dashboard": () => import("../pages/faculty/Dashboard"),
  "faculty-students": () => import("../pages/faculty/Students"),
  "faculty-reports": () => import("../pages/faculty/Reports"),
  "faculty-messages": () => import("../pages/faculty/Messages"),
  "faculty-profile": () => import("../pages/faculty/Profile"),
  "faculty-settings": () => import("../pages/faculty/Settings"),

  // Industry routes
  "industry-dashboard": () => import("../pages/industry/Dashboard"),
  "industry-openings": () => import("../pages/industry/Openings"),
  "industry-applications": () => import("../pages/industry/Applications"),
  "industry-messages": () => import("../pages/industry/Messages"),
  "industry-profile": () => import("../pages/industry/Profile"),
  "industry-settings": () => import("../pages/industry/Settings"),

  // Auth routes
  "auth-login": () => import("../pages/auth/Login"),
  "auth-signup": () => import("../pages/auth/Signup"),
  "auth-forgot-password": () => import("../pages/auth/ForgotPassword"),

  // Public routes
  landing: () => import("../pages/Landing"),
};

/**
 * Hook to preload routes on hover
 */
export const usePreload = () => {
  // Track already preloaded routes to avoid duplicate requests
  const preloadedRef = useRef(new Set());

  const preload = useCallback((routeKey) => {
    // Skip if already preloaded
    if (preloadedRef.current.has(routeKey)) {
      return;
    }

    const importFn = routeImports[routeKey];
    if (importFn) {
      // Mark as preloading
      preloadedRef.current.add(routeKey);

      // Trigger the import
      importFn().catch((error) => {
        // Remove from preloaded set on error so it can retry
        preloadedRef.current.delete(routeKey);
        if (process.env.NODE_ENV === "development") {
          console.warn(`Failed to preload ${routeKey}:`, error);
        }
      });
    }
  }, []);

  // Preload by role + page (e.g., "student", "dashboard")
  const preloadByRole = useCallback(
    (role, page) => {
      const routeKey = `${role}-${page}`;
      preload(routeKey);
    },
    [preload],
  );

  // Preload multiple routes at once
  const preloadMany = useCallback(
    (routeKeys) => {
      routeKeys.forEach(preload);
    },
    [preload],
  );

  // Preload routes for a specific role (useful after login)
  const preloadRoleRoutes = useCallback(
    (role) => {
      const roleRoutes = Object.keys(routeImports).filter((key) =>
        key.startsWith(`${role}-`),
      );
      roleRoutes.forEach(preload);
    },
    [preload],
  );

  return { preload, preloadByRole, preloadMany, preloadRoleRoutes };
};

export default usePreload;
