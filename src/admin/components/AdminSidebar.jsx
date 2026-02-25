// src/admin/components/AdminSidebar.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  Settings,
  ScrollText,
  LogOut,
  AlertTriangle,
  PanelLeftClose,
  PanelLeft,
  X,
  Megaphone, // Added for Messages/Broadcasts
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  const { admin, logout, hasPermission } = useAdmin();
  const location = useLocation();
  const [logoHovered, setLogoHovered] = useState(false);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      permission: null,
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      path: "/admin/users",
      permission: "MANAGE_USERS",
    },
    {
      id: "roles",
      label: "Roles & Permissions",
      icon: Shield,
      path: "/admin/roles",
      permission: "MANAGE_ROLES",
    },
    {
      id: "messages",
      label: "Broadcasts",
      icon: Megaphone,
      path: "/admin/messages",
      permission: null, // Or add a specific permission like "SEND_BROADCASTS"
    },
    {
      id: "reports",
      label: "Reports & Moderation",
      icon: AlertTriangle,
      path: "/admin/reports",
      permission: "VIEW_REPORTS",
    },
    {
      id: "logs",
      label: "Audit Logs",
      icon: ScrollText,
      path: "/admin/logs",
      permission: "VIEW_LOGS",
    },
    {
      id: "settings",
      label: "System Settings",
      icon: Settings,
      path: "/admin/settings",
      permission: "SYSTEM_SETTINGS",
    },
  ];

  const accessibleItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission),
  );

  const handleItemClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleExpandClick = () => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
      setLogoHovered(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed Position */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed ? 80 : 280,
          x: sidebarOpen
            ? 0
            : typeof window !== "undefined" && window.innerWidth < 1024
              ? -300
              : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-screen z-50 bg-[rgb(var(--surface))] border-r border-[rgb(var(--border))] flex flex-col"
      >
        {/* Logo Section */}
        <div
          className={`shrink-0 p-4 border-b border-[rgb(var(--border))] ${sidebarCollapsed ? "px-3" : "px-4"}`}
        >
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!sidebarCollapsed ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[rgb(var(--foreground))]">
                        Admin Panel
                      </h2>
                      <p className="text-xs text-[rgb(var(--muted))]">
                        Control Center
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      onClick={toggleCollapse}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden lg:flex p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-all"
                      title="Collapse sidebar"
                    >
                      <PanelLeftClose size={20} />
                    </motion.button>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="lg:hidden p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-full flex justify-center"
                >
                  <motion.button
                    onClick={handleExpandClick}
                    onMouseEnter={() => setLogoHovered(true)}
                    onMouseLeave={() => setLogoHovered(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center cursor-pointer transition-all relative overflow-hidden"
                    title="Expand sidebar"
                  >
                    <AnimatePresence mode="wait">
                      {logoHovered ? (
                        <motion.div
                          key="expand-icon"
                          initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <PanelLeft size={20} className="text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="shield-icon"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Shield size={20} className="text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
          {!sidebarCollapsed && (
            <p className="px-3 py-2 text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
              Menu
            </p>
          )}
          <div className="space-y-1">
            {accessibleItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={handleItemClick}
                  className="block"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative
                      ${sidebarCollapsed ? "justify-center" : ""}
                      ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                          : "text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))]"
                      }`}
                  >
                    <Icon
                      size={20}
                      className={`shrink-0 ${
                        isActive
                          ? "text-white"
                          : "text-[rgb(var(--muted))] group-hover:text-[rgb(var(--foreground))]"
                      }`}
                    />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {isActive && sidebarCollapsed && (
                      <motion.div
                        layoutId="adminActiveIndicator"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"
                      />
                    )}

                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap">
                        <span className="text-sm font-medium text-[rgb(var(--foreground))]">
                          {item.label}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Admin Info & Logout - Fixed at bottom */}
        <div
          className={`shrink-0 p-3 border-t border-[rgb(var(--border))] ${sidebarCollapsed ? "px-2" : ""}`}
        >
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 px-3 py-2 mb-2"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {admin?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[rgb(var(--foreground))] font-medium truncate text-sm">
                  {admin?.name}
                </p>
                <p className="text-[rgb(var(--muted))] text-xs truncate">
                  {admin?.email}
                </p>
              </div>
            </motion.div>
          )}

          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={sidebarCollapsed ? "Logout" : undefined}
            className="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 transition-all group relative"
          >
            <LogOut
              size={20}
              className="shrink-0 group-hover:-translate-x-0.5 transition-transform"
            />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>

            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap">
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  Logout
                </span>
              </div>
            )}
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
