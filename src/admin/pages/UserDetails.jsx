// src/admin/pages/UserDetails.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  Edit,
  Save,
  X,
  UserCheck,
  UserX,
  KeyRound,
  LogIn,
  Briefcase,
  GraduationCap,
  Building2,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { adminUserService, adminRolesService } from "../services/adminService";
import { useAdmin } from "../context/AdminContext";
import { Heading, Body } from "../../components/common/Typography";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { admin, hasPermission, startImpersonation } = useAdmin();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true",
  );
  const [editedRole, setEditedRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [roles, setRoles] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userData, rolesData] = await Promise.all([
          adminUserService.getUserById(userId),
          adminRolesService.getRoles(),
        ]);
        setUser(userData);
        setEditedRole(userData.role);
        setRoles(rolesData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/admin/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const handleSaveRole = async () => {
    if (editedRole === user.role) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await adminUserService.changeUserRole(userId, editedRole, admin.email);
      setUser({ ...user, role: editedRole });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusAction = async (action) => {
    setActionLoading(action);
    try {
      switch (action) {
        case "activate":
          await adminUserService.updateUserStatus(userId, "active");
          setUser({ ...user, status: "active" });
          break;
        case "suspend":
          await adminUserService.updateUserStatus(
            userId,
            "suspended",
            "Suspended by admin",
          );
          setUser({ ...user, status: "suspended" });
          break;
        case "verify":
          await adminUserService.verifyUser(userId, admin.email);
          setUser({ ...user, status: "active", isVerified: true });
          break;
        case "reset-password":
          await adminUserService.resetUserPassword(userId, admin.email);
          break;
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleImpersonate = async () => {
    setActionLoading("impersonate");
    try {
      const result = await startImpersonation(user);
      if (!result.success) {
        console.error("Impersonation failed:", result.error);
      }
    } catch (error) {
      console.error("Impersonation error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-[rgb(var(--muted))]">User not found</p>
      </div>
    );
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "student":
        return GraduationCap;
      case "faculty":
        return BookOpen;
      case "industry":
        return Building2;
      default:
        return User;
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="p-2 rounded-lg bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <Heading level={2}>User Details</Heading>
          <Body className="text-[rgb(var(--muted))]">
            View and manage user information
          </Body>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[rgb(var(--foreground))]">
                    {user.name}
                  </h2>
                  <p className="text-[rgb(var(--muted))]">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                        user.status === "active"
                          ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                          : user.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                            : user.status === "suspended"
                              ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                              : "bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {user.status === "active" && <CheckCircle size={14} />}
                      {user.status === "suspended" && <UserX size={14} />}
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                    {user.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                        <CheckCircle size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-[rgb(var(--background))] rounded-xl">
                <Mail className="text-[rgb(var(--muted))]" size={20} />
                <div>
                  <p className="text-[rgb(var(--muted))] text-sm">Email</p>
                  <p className="text-[rgb(var(--foreground))]">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[rgb(var(--background))] rounded-xl">
                <Calendar className="text-[rgb(var(--muted))]" size={20} />
                <div>
                  <p className="text-[rgb(var(--muted))] text-sm">Joined</p>
                  <p className="text-[rgb(var(--foreground))]">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[rgb(var(--background))] rounded-xl">
                <Clock className="text-[rgb(var(--muted))]" size={20} />
                <div>
                  <p className="text-[rgb(var(--muted))] text-sm">Last Login</p>
                  <p className="text-[rgb(var(--foreground))]">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[rgb(var(--background))] rounded-xl">
                <RoleIcon className="text-[rgb(var(--muted))]" size={20} />
                <div>
                  <p className="text-[rgb(var(--muted))] text-sm">Role</p>
                  <p className="text-[rgb(var(--foreground))] capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Role-specific Info */}
            {user.role === "student" && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
                <h4 className="text-blue-700 dark:text-blue-400 font-medium mb-3">
                  Student Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[rgb(var(--muted))]">College</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.college || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[rgb(var(--muted))]">Branch</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.branch || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[rgb(var(--muted))]">Credits Earned</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.credits || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[rgb(var(--muted))]">Applications</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.applications || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {user.role === "faculty" && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl">
                <h4 className="text-green-700 dark:text-green-400 font-medium mb-3">
                  Faculty Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[rgb(var(--muted))]">College</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.college || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[rgb(var(--muted))]">Department</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.department || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[rgb(var(--muted))]">Designation</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.designation || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[rgb(var(--muted))]">Students Managed</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.studentsManaged || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {user.role === "industry" && (
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl">
                <h4 className="text-purple-700 dark:text-purple-400 font-medium mb-3">
                  Industry Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[rgb(var(--muted))]">Company</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.companyName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[rgb(var(--muted))]">Contact Person</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.contactPerson || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[rgb(var(--muted))]">Sector</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.sector || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[rgb(var(--muted))]">Active Openings</p>
                    <p className="text-[rgb(var(--foreground))]">
                      {user.activeOpenings || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Role Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">
                Role Management
              </h3>
              {!isEditing && hasPermission("MANAGE_ROLES") && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors"
                >
                  <Edit size={18} />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <select
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.entries(roles)
                    .filter(([key, role]) => role.canBeAssigned)
                    .map(([key, role]) => (
                      <option key={key} value={key}>
                        {role.name}
                      </option>
                    ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedRole(user.role);
                    }}
                    className="flex-1 px-4 py-2 bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] rounded-lg hover:bg-[rgb(var(--surface))] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRole}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-[rgb(var(--background))] rounded-xl">
                <RoleIcon
                  className="text-indigo-600 dark:text-indigo-400"
                  size={24}
                />
                <div>
                  <p className="text-[rgb(var(--muted))] text-sm">
                    Current Role
                  </p>
                  <p className="text-[rgb(var(--foreground))] font-medium capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {user.status === "active" ? (
                <button
                  onClick={() => handleStatusAction("suspend")}
                  disabled={actionLoading === "suspend"}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "suspend" ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <UserX size={18} />
                  )}
                  Suspend User
                </button>
              ) : (
                <button
                  onClick={() => handleStatusAction("activate")}
                  disabled={actionLoading === "activate"}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "activate" ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <UserCheck size={18} />
                  )}
                  Activate User
                </button>
              )}

              {user.status === "pending" && !user.isVerified && (
                <button
                  onClick={() => handleStatusAction("verify")}
                  disabled={actionLoading === "verify"}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "verify" ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  Verify User
                </button>
              )}

              <button
                onClick={() => handleStatusAction("reset-password")}
                disabled={actionLoading === "reset-password"}
                className="w-full flex items-center gap-3 px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] rounded-xl hover:bg-[rgb(var(--surface))] transition-colors disabled:opacity-50"
              >
                {actionLoading === "reset-password" ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <KeyRound size={18} />
                )}
                Reset Password
              </button>

              {hasPermission("IMPERSONATE_USER") && (
                <button
                  onClick={handleImpersonate}
                  disabled={actionLoading === "impersonate"}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "impersonate" ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <LogIn size={18} />
                  )}
                  Login as User
                </button>
              )}
            </div>
          </motion.div>

          {/* Warning for suspended users */}
          {user.status === "suspended" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle
                  className="text-red-600 dark:text-red-400"
                  size={20}
                />
                <h4 className="text-red-700 dark:text-red-400 font-medium">
                  Account Suspended
                </h4>
              </div>
              <p className="text-sm text-red-600 dark:text-red-300">
                {user.suspendedReason ||
                  "This account has been suspended by an administrator."}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
