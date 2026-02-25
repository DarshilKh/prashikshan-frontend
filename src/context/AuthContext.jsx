// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  isTokenValid,
} from "../utils/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const { token, role, userData } = getStoredAuth();

      if (token && isTokenValid(token)) {
        setUser({ ...userData, role });
        setIsAuthenticated(true);

        // Preload routes for the user's role after auth check
        preloadRoutesForRole(role);
      } else {
        // Clear invalid/expired token
        clearStoredAuth();
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Preload routes for a specific role
  const preloadRoutesForRole = (role) => {
    const routeImports = {
      student: [
        () => import("../pages/student/Dashboard"),
        () => import("../pages/student/Projects"),
      ],
      faculty: [
        () => import("../pages/faculty/Dashboard"),
        () => import("../pages/faculty/Students"),
      ],
      industry: [
        () => import("../pages/industry/Dashboard"),
        () => import("../pages/industry/Openings"),
      ],
    };

    const imports = routeImports[role] || [];

    // Preload after a short delay to not block initial render
    setTimeout(() => {
      imports.forEach((importFn) => {
        importFn().catch(() => {}); // Silently fail
      });
    }, 1000);
  };

  // Login function
  const login = useCallback(
    async (email, password, role) => {
      try {
        // Mock response - Replace with actual API response
        const mockToken = `mock-jwt-token-${role}-${Date.now()}`;
        const mockUserData = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split("@")[0],
          role,
        };

        // Store auth data
        setStoredAuth(mockToken, role, mockUserData);

        // Update state
        setUser({ ...mockUserData, role });
        setIsAuthenticated(true);

        // Preload routes for the user's role
        preloadRoutesForRole(role);

        // Redirect based on role
        const redirectPath = getRedirectPath(role);
        navigate(redirectPath, { replace: true });

        return { success: true };
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
      }
    },
    [navigate],
  );

  // Signup function
  const signup = useCallback(async (formData, role) => {
    try {
      // Simulate API call - Replace with actual API call
      console.log("Signup data:", { ...formData, role });

      // Mock successful signup
      return { success: true, message: "Account created successfully!" };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  // Get redirect path based on role
  const getRedirectPath = (role) => {
    switch (role) {
      case "student":
        return "/student/dashboard";
      case "faculty":
        return "/faculty/dashboard";
      case "industry":
        return "/industry/dashboard";
      default:
        return "/login";
    }
  };

  // Check if user has required role
  const hasRole = useCallback(
    (allowedRoles) => {
      if (!user || !user.role) return false;
      return allowedRoles.includes(user.role);
    },
    [user],
  );

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    hasRole,
    getRedirectPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
