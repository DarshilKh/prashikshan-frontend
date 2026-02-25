// src/components/layouts/IndustryLayout.jsx

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import Chatbot from "../Chatbot";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../context/PermissionsContext";
import { industryData } from "../../data/mockData";

const IndustryLayout = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  const { logout, user } = useAuth();
  const { refreshPermissions } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleFocus = () => {
      refreshPermissions();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshPermissions();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshPermissions]);

  const getCurrentPage = () => {
    const pathParts = location.pathname.split("/");
    if (pathParts[2] === "application" && pathParts[3]) {
      return "application-review";
    }
    if (pathParts[2] === "messages") {
      return "messages";
    }
    return pathParts[2] || "dashboard";
  };

  const handleNavigate = (page) => {
    navigate(`/industry/${page}`);
  };

  const handleLogout = () => {
    setShowLogoutMessage(true);
    setChatbotOpen(false);
    setTimeout(() => {
      setShowLogoutMessage(false);
      logout();
    }, 2000);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const userId = user?.id || `industry-${industryData.id}` || "industry-001";

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          navigate={handleNavigate}
          currentPage={getCurrentPage()}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          handleLogout={handleLogout}
          userRole="industry"
          userName={user?.name || industryData.contactPerson}
          userEmail={user?.email || industryData.email}
        />

        <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setSidebarOpen={setSidebarOpen}
            studentName={user?.name || industryData.contactPerson}
            userRole="industry"
            userId={userId}
            navigate={handleNavigate}
          />

          <main className="flex-1 overflow-y-auto">
            <Outlet
              context={{
                userRole: "industry",
                navigate: handleNavigate,
                userId: userId,
              }}
            />
          </main>
        </div>
      </div>

      <Chatbot
        chatbotOpen={chatbotOpen}
        setChatbotOpen={setChatbotOpen}
        isLoggedIn={true}
        userRole="industry"
      />

      <AnimatePresence>
        {showLogoutMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[rgb(var(--surface))] rounded-2xl p-8 text-center shadow-2xl border border-[rgb(var(--border))]"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-2">
                Successfully Logged Out
              </h3>
              <p className="text-[rgb(var(--muted))]">
                Redirecting to login page…
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IndustryLayout;