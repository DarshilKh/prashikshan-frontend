// src/admin/components/AdminLayout.jsx

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import ImpersonationBanner from "./ImpersonationBanner";
import { useAdmin } from "../context/AdminContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const { isImpersonating, getImpersonationRedirectPath } = useAdmin();
  const navigate = useNavigate();

  // Track window width for responsive sidebar
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin_theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Update dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("admin_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("admin_theme", "light");
    }
  }, [darkMode]);

  // Load sidebar collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save sidebar collapsed state
  useEffect(() => {
    localStorage.setItem(
      "admin_sidebar_collapsed",
      JSON.stringify(sidebarCollapsed),
    );
  }, [sidebarCollapsed]);

  // If impersonating, redirect to the user's dashboard
  useEffect(() => {
    if (isImpersonating) {
      const redirectPath = getImpersonationRedirectPath();
      if (redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [isImpersonating, getImpersonationRedirectPath, navigate]);

  // Calculate margin based on sidebar state
  const getMainMargin = () => {
    if (windowWidth < 1024) return 0;
    return sidebarCollapsed ? 80 : 280;
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Impersonation Banner */}
      <AnimatePresence>
        {isImpersonating && <ImpersonationBanner />}
      </AnimatePresence>

      {/* Fixed Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area - This scrolls */}
      <div
        className="min-h-screen transition-all duration-300"
        style={{ marginLeft: getMainMargin() }}
      >
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-20">
          <AdminNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* Page Content - Scrollable */}
        <main
          className="p-6"
          style={{ paddingTop: isImpersonating ? "60px" : undefined }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
