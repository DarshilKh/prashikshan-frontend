// src/utils/auth.js

const TOKEN_KEY = "prashikshan_token";
const ROLE_KEY = "prashikshan_role";
const USER_KEY = "prashikshan_user";
const EXPIRY_KEY = "prashikshan_token_expiry";

/**
 * Get stored auth data from localStorage
 */
export const getStoredAuth = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const role = localStorage.getItem(ROLE_KEY);
    const userDataStr = localStorage.getItem(USER_KEY);
    const userData = userDataStr ? JSON.parse(userDataStr) : null;

    return { token, role, userData };
  } catch (error) {
    console.error("Error reading auth data:", error);
    return { token: null, role: null, userData: null };
  }
};

/**
 * Set auth data in localStorage
 */
export const setStoredAuth = (token, role, userData, expiryHours = 24) => {
  try {
    const expiry = Date.now() + (expiryHours * 60 * 60 * 1000);
    
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(EXPIRY_KEY, expiry.toString());
  } catch (error) {
    console.error("Error storing auth data:", error);
  }
};

/**
 * Clear all auth data from localStorage
 */
export const clearStoredAuth = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

/**
 * Check if token is valid
 */
export const isTokenValid = (token) => {
  if (!token) return false;
  
  // Check custom expiry
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (expiry && Date.now() > parseInt(expiry)) {
    return false;
  }

  // For mock tokens
  if (token.startsWith("mock-jwt-token")) {
    return true;
  }

  // For real JWT tokens - decode and check expiry
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    const now = Date.now() / 1000;

    if (payload.exp && payload.exp < now) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get user role from storage
 */
export const getStoredRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const { token } = getStoredAuth();
  return isTokenValid(token);
};