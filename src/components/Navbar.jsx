// src/components/Navbar.jsx

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  X,
  Check,
  Trash2,
  Mail,
} from "lucide-react";
import { projectsData, facultyData, industryData } from "../data/mockData";
import { useMessagesCount } from "../hooks/useMessagesCount";

const Navbar = ({
  darkMode,
  setDarkMode,
  setSidebarOpen,
  studentName,
  userRole,
  userId,
  navigate,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  // Get unread messages count from the hook
  const { count: unreadMessagesCount } = useMessagesCount();

  const [notifications, setNotifications] = useState(
    userRole === "student"
      ? [
          {
            id: 1,
            title: "Internship Approved",
            description: "Your application for AI Resume Screener was approved",
            time: "2 hours ago",
            read: false,
            type: "success",
          },
          {
            id: 2,
            title: "New Project Posted",
            description: "TechNova posted a new IoT internship",
            time: "5 hours ago",
            read: false,
            type: "info",
          },
          {
            id: 3,
            title: "Credit Updated",
            description: "Your credit score has been updated to 18/30",
            time: "1 day ago",
            read: true,
            type: "info",
          },
        ]
      : userRole === "faculty"
        ? [
            {
              id: 1,
              title: "Report Submitted",
              description: "Aarav Sharma uploaded project report",
              time: "1 hour ago",
              read: false,
              type: "info",
            },
            {
              id: 2,
              title: "New Internship",
              description: "Student applied for internship review",
              time: "3 hours ago",
              read: false,
              type: "warning",
            },
            {
              id: 3,
              title: "Meeting Reminder",
              description: "Faculty meeting at 3 PM today",
              time: "6 hours ago",
              read: true,
              type: "info",
            },
          ]
        : [
            {
              id: 1,
              title: "New Application",
              description: "New student applied for your opening",
              time: "30 mins ago",
              read: false,
              type: "info",
            },
            {
              id: 2,
              title: "Application Approved",
              description: "You approved Diya Patel for IoT project",
              time: "2 hours ago",
              read: true,
              type: "success",
            },
            {
              id: 3,
              title: "Profile Updated",
              description: "Your company profile was successfully updated",
              time: "1 day ago",
              read: true,
              type: "success",
            },
          ],
  );

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

  const getSearchPlaceholder = () => {
    if (userRole === "student") return "Search internships...";
    if (userRole === "faculty") return "Search students...";
    return "Search applicants...";
  };

  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];

    if (userRole === "student") {
      return (projectsData || []).filter(
        (p) =>
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.company?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else if (userRole === "faculty") {
      return (facultyData?.students || []).filter(
        (s) =>
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.branch?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else {
      return (industryData?.recentApplications || []).filter(
        (a) =>
          a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.project?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
  };

  const getRoleName = () => {
    if (userRole === "faculty") return facultyData?.name || "Faculty";
    if (userRole === "industry") return industryData?.companyName || "Company";
    return studentName || "Student";
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

  const searchResults = getSearchResults();

  // Handle messages button click
  const handleMessagesClick = () => {
    navigate("messages");
  };

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

          <h1 className="text-xl font-semibold text-[rgb(var(--foreground))]">
            Hi, {getRoleName()} 👋
          </h1>
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
              placeholder={getSearchPlaceholder()}
              className="w-64 px-4 py-2 pl-10 rounded-xl border bg-[rgb(var(--background))] border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
            />

            {/* Clear search button */}
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
                  className="absolute top-full mt-2 w-96 max-h-80 overflow-y-auto rounded-xl shadow-xl border bg-[rgb(var(--surface))] border-[rgb(var(--border))] z-50"
                >
                  <div className="p-2">
                    <p className="text-xs font-medium text-[rgb(var(--muted))] px-3 py-2">
                      {searchResults.length} result
                      {searchResults.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
                  <div className="border-t border-[rgb(var(--border))]">
                    {searchResults.map((result, idx) => (
                      <div
                        key={idx}
                        className="p-4 cursor-pointer hover:bg-[rgb(var(--background))] transition-all"
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearch(false);
                          if (userRole === "student") {
                            navigate("projects");
                          } else if (userRole === "faculty") {
                            navigate("students");
                          } else {
                            navigate("applications");
                          }
                        }}
                      >
                        <p className="font-semibold text-[rgb(var(--foreground))]">
                          {result.title || result.name}
                        </p>
                        <p className="text-sm text-[rgb(var(--muted))]">
                          {result.company || result.branch || result.project}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* No results */}
              {showSearch && searchQuery && searchResults.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-96 rounded-xl shadow-xl border bg-[rgb(var(--surface))] border-[rgb(var(--border))] z-50 p-6 text-center"
                >
                  <Search
                    size={32}
                    className="mx-auto text-[rgb(var(--muted))] mb-2"
                  />
                  <p className="text-[rgb(var(--muted))]">No results found</p>
                  <p className="text-sm text-[rgb(var(--muted))]">
                    Try a different search term
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Search Button */}
          <button className="md:hidden p-2 rounded-xl bg-[rgb(var(--background))] text-[rgb(var(--foreground))] hover:opacity-80 transition-all">
            <Search size={20} />
          </button>

          {/* Messages Button */}
          <button
            onClick={handleMessagesClick}
            className="p-2 rounded-xl bg-[rgb(var(--background))] text-[rgb(var(--foreground))] hover:opacity-80 transition-all relative"
            title="Messages"
          >
            <Mail size={20} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="p-2 rounded-xl bg-[rgb(var(--background))] text-[rgb(var(--foreground))] hover:opacity-80 transition-all relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
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
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          title="Mark all as read"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs text-red-600 dark:text-red-400 hover:underline"
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
                              ? "bg-blue-50/50 dark:bg-blue-500/5"
                              : ""
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                                notification.read
                                  ? "bg-transparent"
                                  : "bg-blue-600"
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
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                        }}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
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

          {/* Avatar */}
          <button
            onClick={() => navigate("profile")}
            className="w-10 h-10 rounded-full bg-linear-to-r from-blue-600 to-green-400 flex items-center justify-center text-white font-semibold hover:opacity-90 transition-all cursor-pointer"
            title="View Profile"
          >
            {userRole === "faculty"
              ? "PM"
              : userRole === "industry"
                ? "TN"
                : "AS"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
