// src/admin/components/AdminNavbar.jsx

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Settings,
  Menu,
  Moon,
  Sun,
  X,
  Check,
  Trash2,
  ChevronDown,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const AdminNavbar = ({ darkMode, setDarkMode, setSidebarOpen }) => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New User Registration",
      description: "EduCore Systems is pending approval",
      time: "5 min ago",
      read: false,
      type: "info",
    },
    {
      id: 2,
      title: "Report Submitted",
      description: "Content flagged for review",
      time: "1 hour ago",
      read: false,
      type: "warning",
    },
    {
      id: 3,
      title: "System Backup",
      description: "Daily backup completed successfully",
      time: "2 hours ago",
      read: true,
      type: "success",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const getNotificationTypeStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400";
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
      case "error":
        return "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400";
      default:
        return "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400";
    }
  };

  // Mock search results
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];

    const mockResults = [
      {
        id: 1,
        title: "Aarav Sharma",
        type: "User",
        path: "/admin/users/user-001",
      },
      {
        id: 2,
        title: "System Settings",
        type: "Page",
        path: "/admin/settings",
      },
      { id: 3, title: "User Reports", type: "Page", path: "/admin/reports" },
    ];

    return mockResults.filter((r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const searchResults = getSearchResults();

  return (
    <nav className="border-b px-6 py-4 bg-[rgb(var(--surface))] border-[rgb(var(--border))]">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--foreground))] transition-all"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-[rgb(var(--foreground))]">
              Welcome back, {admin?.name?.split(" ")[0]} 👋
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-medium">
              <Shield size={12} />
              Admin
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearch(e.target.value.length > 0);
              }}
              placeholder="Search users, settings..."
              className="w-64 px-4 py-2 pl-10 rounded-xl border bg-[rgb(var(--background))] border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
            />

            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearch(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
              >
                <X size={16} />
              </button>
            )}

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearch && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-80 max-h-80 overflow-y-auto rounded-xl shadow-xl border bg-[rgb(var(--surface))] border-[rgb(var(--border))] z-50"
                >
                  <div className="p-2">
                    <p className="text-xs font-medium text-[rgb(var(--muted))] px-3 py-2">
                      {searchResults.length} result
                      {searchResults.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
                  <div className="border-t border-[rgb(var(--border))]">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-4 cursor-pointer hover:bg-[rgb(var(--background))] transition-all"
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearch(false);
                          navigate(result.path);
                        }}
                      >
                        <p className="font-semibold text-[rgb(var(--foreground))]">
                          {result.title}
                        </p>
                        <p className="text-sm text-[rgb(var(--muted))]">
                          {result.type}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {showSearch && searchQuery && searchResults.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-80 rounded-xl shadow-xl border bg-[rgb(var(--surface))] border-[rgb(var(--border))] z-50 p-6 text-center"
                >
                  <Search
                    size={32}
                    className="mx-auto text-[rgb(var(--muted))] mb-2"
                  />
                  <p className="text-[rgb(var(--muted))]">No results found</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Search Button */}
          <button className="md:hidden p-2 rounded-xl bg-[rgb(var(--background))] text-[rgb(var(--foreground))] hover:opacity-80 transition-all">
            <Search size={20} />
          </button>

          {/* System Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-500/20 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 dark:text-green-400 text-sm font-medium">
              Online
            </span>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="p-2 rounded-xl bg-[rgb(var(--background))] text-[rgb(var(--foreground))] hover:opacity-80 transition-all relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden rounded-xl shadow-xl border bg-[rgb(var(--surface))] border-[rgb(var(--border))] z-50"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-[rgb(var(--border))] flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[rgb(var(--foreground))]">
                        Notifications
                      </h3>
                      <p className="text-xs text-[rgb(var(--muted))]">
                        {unreadCount} unread
                      </p>
                    </div>
                    {notifications.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={markAllAsRead}
                          className="p-1.5 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
                          title="Mark all as read"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={clearAllNotifications}
                          className="p-1.5 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-red-500"
                          title="Clear all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--background))] transition-all cursor-pointer ${
                            !notification.read
                              ? "bg-indigo-50/50 dark:bg-indigo-500/5"
                              : ""
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                                notification.read
                                  ? "bg-transparent"
                                  : "bg-indigo-600"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-[rgb(var(--foreground))] text-sm">
                                  {notification.title}
                                </p>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getNotificationTypeStyles(
                                    notification.type,
                                  )}`}
                                >
                                  {notification.type}
                                </span>
                              </div>
                              <p className="text-sm text-[rgb(var(--muted))] truncate">
                                {notification.description}
                              </p>
                              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                                {notification.time}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-[rgb(var(--muted))] hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell
                          size={32}
                          className="mx-auto text-[rgb(var(--muted))] mb-2"
                        />
                        <p className="text-[rgb(var(--muted))]">
                          No notifications
                        </p>
                        <p className="text-sm text-[rgb(var(--muted))]">
                          You're all caught up!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-[rgb(var(--border))] text-center">
                      <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        View all notifications
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-xl bg-[rgb(var(--background))] text-[rgb(var(--foreground))] hover:opacity-80 transition-all"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <motion.div
              initial={false}
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.div>
          </button>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[rgb(var(--background))] hover:opacity-80 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {admin?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "A"}
              </div>
              <ChevronDown
                size={16}
                className={`text-[rgb(var(--muted))] transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl border bg-[rgb(var(--surface))] border-[rgb(var(--border))] z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-[rgb(var(--border))]">
                    <p className="font-medium text-[rgb(var(--foreground))]">
                      {admin?.name}
                    </p>
                    <p className="text-sm text-[rgb(var(--muted))] truncate">
                      {admin?.email}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/admin/settings");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))] transition-colors"
                    >
                      <User size={18} />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/admin/settings");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))] transition-colors"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="py-2 border-t border-[rgb(var(--border))]">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
