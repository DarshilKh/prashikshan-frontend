// src/admin/pages/Users.jsx
// Replace all hardcoded dark classes with CSS variables

// REPLACE THESE PATTERNS:
// bg-slate-800 → bg-[rgb(var(--surface))]
// bg-slate-900 → bg-[rgb(var(--background))]
// bg-slate-700 → bg-[rgb(var(--border))]
// text-white → text-[rgb(var(--foreground))]
// text-slate-400 → text-[rgb(var(--muted))]
// text-slate-300 → text-[rgb(var(--foreground))]
// text-slate-500 → text-[rgb(var(--muted))]
// border-slate-700 → border-[rgb(var(--border))]
// border-slate-600 → border-[rgb(var(--border))]
// hover:bg-slate-700 → hover:bg-[rgb(var(--background))]

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  UserX,
  UserCheck,
  KeyRound,
  LogIn,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Users as UsersIcon,
  GraduationCap,
  Building2,
  BookOpen,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { adminUserService } from "../services/adminService";
import { useAdmin } from "../context/AdminContext";
import { Heading, Body } from "../../components/common/Typography";

const Users = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasPermission, startImpersonation, admin } = useAdmin();

  // State
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get("role") || "all",
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminUserService.getUsers({
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
      });
      setUsers(response.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
  };

  const filteredUsers = useMemo(() => {
    let result = [...users];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      );
    }
    return result;
  }, [users, searchQuery]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  // Role badge component
  const RoleBadge = ({ role }) => {
    const config = {
      student: {
        color:
          "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
        icon: GraduationCap,
      },
      faculty: {
        color:
          "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30",
        icon: BookOpen,
      },
      industry: {
        color:
          "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30",
        icon: Building2,
      },
    };
    const { color, icon: Icon } = config[role] || {
      color: "bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400",
      icon: UsersIcon,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
      >
        <Icon size={12} />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = {
      active:
        "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30",
      pending:
        "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30",
      suspended:
        "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30",
      inactive:
        "bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/30",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config[status] || config.inactive}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleAction = (action, user) => {
    setConfirmAction({ action, user });
    setShowConfirmModal(true);
    setActionMenuOpen(null);
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    setActionLoading(true);
    const { action, user } = confirmAction;

    try {
      switch (action) {
        case "activate":
          await adminUserService.updateUserStatus(user.id, "active");
          break;
        case "suspend":
          await adminUserService.updateUserStatus(
            user.id,
            "suspended",
            "Suspended by admin",
          );
          break;
        case "reset-password":
          await adminUserService.resetUserPassword(user.id, admin.email);
          break;
        case "verify":
          await adminUserService.verifyUser(user.id, admin.email);
          break;
        case "impersonate":
          const result = await startImpersonation(user);
          if (result.success) return;
          break;
      }
      await fetchUsers();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Heading level={2}>User Management</Heading>
          <Body className="text-[rgb(var(--muted))]">
            Manage all platform users
          </Body>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-lg bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))] transition-colors disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] rounded-lg hover:bg-[rgb(var(--background))] transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="faculty">Faculty</option>
          <option value="industry">Industry</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, color: "indigo" },
          {
            label: "Active",
            value: users.filter((u) => u.status === "active").length,
            color: "green",
          },
          {
            label: "Pending",
            value: users.filter((u) => u.status === "pending").length,
            color: "yellow",
          },
          {
            label: "Suspended",
            value: users.filter((u) => u.status === "suspended").length,
            color: "red",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl p-4"
          >
            <p className="text-[rgb(var(--muted))] text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-[rgb(var(--foreground))] mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-[rgb(var(--muted))]">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <UsersIcon className="w-12 h-12 text-[rgb(var(--muted))] mx-auto mb-4" />
            <p className="text-[rgb(var(--muted))]">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[rgb(var(--background))] border-b border-[rgb(var(--border))]">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      User
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      Role
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      Joined
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      Last Login
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, idx) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--background))] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-[rgb(var(--foreground))] font-medium">
                              {user.name}
                            </p>
                            <p className="text-[rgb(var(--muted))] text-sm">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="py-4 px-6 text-[rgb(var(--muted))] text-sm">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-[rgb(var(--muted))] text-sm">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative flex justify-end">
                          <button
                            onClick={() =>
                              setActionMenuOpen(
                                actionMenuOpen === user.id ? null : user.id,
                              )
                            }
                            className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {/* Action Menu */}
                          <AnimatePresence>
                            {actionMenuOpen === user.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setActionMenuOpen(null)}
                                />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 top-full mt-1 w-48 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl shadow-xl z-50 overflow-hidden"
                                >
                                  <button
                                    onClick={() => {
                                      setActionMenuOpen(null);
                                      navigate(`/admin/users/${user.id}`);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))] transition-colors"
                                  >
                                    <Eye size={16} />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAction("reset-password", user)
                                    }
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))] transition-colors"
                                  >
                                    <KeyRound size={16} />
                                    Reset Password
                                  </button>
                                  {user.status === "active" ? (
                                    <button
                                      onClick={() =>
                                        handleAction("suspend", user)
                                      }
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                      <UserX size={16} />
                                      Suspend User
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleAction("activate", user)
                                      }
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
                                    >
                                      <UserCheck size={16} />
                                      Activate User
                                    </button>
                                  )}
                                  {hasPermission("IMPERSONATE_USER") && (
                                    <button
                                      onClick={() =>
                                        handleAction("impersonate", user)
                                      }
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                                    >
                                      <LogIn size={16} />
                                      Login as User
                                    </button>
                                  )}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[rgb(var(--border))]">
                <p className="text-sm text-[rgb(var(--muted))]">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}{" "}
                  of {filteredUsers.length} users
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface))]"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !actionLoading && setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    confirmAction.action === "suspend"
                      ? "bg-red-100 dark:bg-red-500/20"
                      : confirmAction.action === "impersonate"
                        ? "bg-amber-100 dark:bg-amber-500/20"
                        : "bg-indigo-100 dark:bg-indigo-500/20"
                  }`}
                >
                  {confirmAction.action === "suspend" && (
                    <UserX
                      className="text-red-600 dark:text-red-400"
                      size={24}
                    />
                  )}
                  {confirmAction.action === "activate" && (
                    <UserCheck
                      className="text-green-600 dark:text-green-400"
                      size={24}
                    />
                  )}
                  {confirmAction.action === "reset-password" && (
                    <KeyRound
                      className="text-indigo-600 dark:text-indigo-400"
                      size={24}
                    />
                  )}
                  {confirmAction.action === "impersonate" && (
                    <LogIn
                      className="text-amber-600 dark:text-amber-400"
                      size={24}
                    />
                  )}
                  {confirmAction.action === "verify" && (
                    <Check
                      className="text-green-600 dark:text-green-400"
                      size={24}
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">
                    {confirmAction.action === "suspend" && "Suspend User"}
                    {confirmAction.action === "activate" && "Activate User"}
                    {confirmAction.action === "reset-password" &&
                      "Reset Password"}
                    {confirmAction.action === "impersonate" && "Login as User"}
                    {confirmAction.action === "verify" && "Verify User"}
                  </h3>
                  <p className="text-[rgb(var(--muted))] text-sm">
                    {confirmAction.user.name}
                  </p>
                </div>
              </div>

              <p className="text-[rgb(var(--foreground))] mb-6">
                {confirmAction.action === "suspend" &&
                  "Are you sure you want to suspend this user? They will not be able to access the platform."}
                {confirmAction.action === "activate" &&
                  "This will restore full access to the platform for this user."}
                {confirmAction.action === "reset-password" &&
                  "This will send a password reset email to the user."}
                {confirmAction.action === "impersonate" &&
                  "You will be logged in as this user. All actions will be logged."}
                {confirmAction.action === "verify" &&
                  "This will verify the user and activate their account."}
              </p>

              {confirmAction.action === "impersonate" && (
                <div className="flex items-center gap-2 p-3 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg mb-6">
                  <AlertTriangle
                    size={18}
                    className="text-amber-600 dark:text-amber-400"
                  />
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Impersonation sessions are logged for security.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] rounded-lg font-medium hover:bg-[rgb(var(--surface))] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={executeAction}
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                    confirmAction.action === "suspend"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : confirmAction.action === "impersonate"
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {actionLoading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
