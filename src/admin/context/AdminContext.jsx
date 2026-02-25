// src/admin/context/AdminContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  adminAuthService,
  adminImpersonationService,
} from "../services/adminService";

// Storage keys
const ADMIN_TOKEN_KEY = "prashikshan_admin_token";
const ADMIN_USER_KEY = "prashikshan_admin_user";
const IMPERSONATION_KEY = "prashikshan_impersonation";

// Helper to safely parse JSON from localStorage
const safeJSONParse = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

// Create context
const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize from localStorage synchronously
  const [admin, setAdmin] = useState(() => safeJSONParse(ADMIN_USER_KEY));
  const [token, setToken] = useState(() =>
    localStorage.getItem(ADMIN_TOKEN_KEY),
  );
  const [impersonation, setImpersonation] = useState(() =>
    safeJSONParse(IMPERSONATION_KEY),
  );
  const [isLoading, setIsLoading] = useState(true);

  // Derived state
  const isAuthenticated = !!(token && admin);

  // Clear session helper
  const clearSession = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(IMPERSONATION_KEY);
    setAdmin(null);
    setToken(null);
    setImpersonation(null);
  }, []);

  // Validate session on mount
  useEffect(() => {
    const validate = async () => {
      const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
      const storedAdmin = safeJSONParse(ADMIN_USER_KEY);

      // If no token/admin in localStorage, we're done
      if (!storedToken || !storedAdmin) {
        setIsLoading(false);
        return;
      }

      try {
        const { valid } = await adminAuthService.validateSession(storedToken);
        if (valid) {
          setToken(storedToken);
          setAdmin(storedAdmin);
          // Restore impersonation if exists
          const storedImpersonation = safeJSONParse(IMPERSONATION_KEY);
          if (storedImpersonation) {
            setImpersonation(storedImpersonation);
          }
        } else {
          clearSession();
        }
      } catch (error) {
        // On network error, keep the session if data looks valid
        console.warn("Session validation failed:", error);
        if (storedAdmin && storedAdmin.role === "ADMIN") {
          setToken(storedToken);
          setAdmin(storedAdmin);
        } else {
          clearSession();
        }
      } finally {
        setIsLoading(false);
      }
    };

    validate();
  }, [clearSession]);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      const response = await adminAuthService.login(email, password);

      if (response.success) {
        // Store in localStorage first
        localStorage.setItem(ADMIN_TOKEN_KEY, response.token);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(response.admin));

        // Then update state
        setToken(response.token);
        setAdmin(response.admin);

        return { success: true };
      }

      return { success: false, error: "Login failed" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      if (impersonation) {
        await adminImpersonationService
          .endImpersonation(
            impersonation.impersonatedUser.id,
            impersonation.originalAdmin.email,
          )
          .catch(() => {});
      }
      await adminAuthService.logout().catch(() => {});
    } finally {
      clearSession();
      navigate("/admin/login", { replace: true });
    }
  }, [impersonation, clearSession, navigate]);

  // Permission checks
  const hasPermission = useCallback(
    (permission) => {
      return admin?.permissions?.includes(permission) ?? false;
    },
    [admin],
  );

  const hasAnyPermission = useCallback(
    (permissions) => {
      if (!admin?.permissions) return false;
      return permissions.some((p) => admin.permissions.includes(p));
    },
    [admin],
  );

  const hasAllPermissions = useCallback(
    (permissions) => {
      if (!admin?.permissions) return false;
      return permissions.every((p) => admin.permissions.includes(p));
    },
    [admin],
  );

  // Impersonation
  const startImpersonation = useCallback(
    async (user) => {
      if (!admin) return { success: false, error: "Not authenticated" };
      if (!hasPermission("IMPERSONATE_USER")) {
        return { success: false, error: "Permission denied" };
      }

      try {
        const response = await adminImpersonationService.startImpersonation(
          user.id,
          admin.email,
        );

        if (response.success) {
          const data = {
            originalAdmin: admin,
            impersonatedUser: response.impersonatedUser,
            startedAt: new Date().toISOString(),
          };
          localStorage.setItem(IMPERSONATION_KEY, JSON.stringify(data));
          setImpersonation(data);
          return { success: true, user: response.impersonatedUser };
        }

        return { success: false, error: "Failed to start impersonation" };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [admin, hasPermission],
  );

  const endImpersonation = useCallback(async () => {
    if (!impersonation) return { success: true };

    try {
      await adminImpersonationService.endImpersonation(
        impersonation.impersonatedUser.id,
        impersonation.originalAdmin.email,
      );
    } catch (error) {
      console.error("End impersonation error:", error);
    }

    localStorage.removeItem(IMPERSONATION_KEY);
    setImpersonation(null);
    return { success: true };
  }, [impersonation]);

  const getImpersonationRedirectPath = useCallback(() => {
    if (!impersonation) return null;
    const paths = {
      student: "/student/dashboard",
      faculty: "/faculty/dashboard",
      industry: "/industry/dashboard",
    };
    return paths[impersonation.impersonatedUser.role] || null;
  }, [impersonation]);

  const value = {
    admin,
    isLoading,
    isAuthenticated,
    impersonation,
    isImpersonating: !!impersonation,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    startImpersonation,
    endImpersonation,
    getImpersonationRedirectPath,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export default AdminContext;
