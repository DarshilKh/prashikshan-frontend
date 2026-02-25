// src/admin/pages/RolesPermissions.jsx

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Lock,
  Check,
  X,
  Search,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Eye,
  ChevronDown,
  Settings,
  UserCog,
  Briefcase,
  MessageSquare,
  FileText,
} from "lucide-react";
import { adminRolesService } from "../services/adminService";
import { useAdmin } from "../context/AdminContext";
import { Heading, Body } from "../../components/common/Typography";

const RolesPermissions = () => {
  const { admin, hasPermission } = useAdmin();
  const [roles, setRoles] = useState({});
  const [originalRoles, setOriginalRoles] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const canEditRoles = hasPermission("MANAGE_ROLES");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, permissionsData] = await Promise.all([
          adminRolesService.getRoles(),
          adminRolesService.getPermissions(),
        ]);
        setRoles(JSON.parse(JSON.stringify(rolesData)));
        setOriginalRoles(JSON.parse(JSON.stringify(rolesData)));
        setPermissions(permissionsData);
      } catch (error) {
        console.error("Failed to fetch roles/permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const changed = JSON.stringify(roles) !== JSON.stringify(originalRoles);
    setHasChanges(changed);
  }, [roles, originalRoles]);

  // Get permissions available for a specific role
  const getPermissionsForRole = useMemo(() => {
    return (roleKey) => {
      if (roleKey === "ADMIN") {
        return permissions.filter((p) => p.isAdmin);
      }
      return permissions.filter((perm) => {
        if (perm.isAdmin) return false;
        const roleCategories = {
          student: ["Student", "Shared"],
          faculty: ["Faculty", "Shared"],
          industry: ["Industry", "Shared"],
        };
        return roleCategories[roleKey]?.includes(perm.category) || false;
      });
    };
  }, [permissions]);

  // Get count of granted permissions for a role (only count permissions that belong to this role)
  const getGrantedCount = useMemo(() => {
    return (roleKey) => {
      if (!roles[roleKey]) return 0;

      const availablePermissions = getPermissionsForRole(roleKey);
      const availablePermissionIds = availablePermissions.map((p) => p.id);

      // Only count permissions that are both granted AND available for this role
      return roles[roleKey].permissions.filter((p) =>
        availablePermissionIds.includes(p),
      ).length;
    };
  }, [roles, getPermissionsForRole]);

  // Get grouped permissions for a role (with search filter)
  const getGroupedPermissionsForRole = useMemo(() => {
    return (roleKey) => {
      const rolePermissions = getPermissionsForRole(roleKey);
      const filtered = rolePermissions.filter((perm) => {
        return (
          perm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          perm.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      return filtered.reduce((acc, perm) => {
        if (!acc[perm.category]) {
          acc[perm.category] = [];
        }
        acc[perm.category].push(perm);
        return acc;
      }, {});
    };
  }, [getPermissionsForRole, searchQuery]);

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return Shield;
      case "student":
        return GraduationCap;
      case "faculty":
        return BookOpen;
      case "industry":
        return Building2;
      default:
        return Users;
    }
  };

  const getRoleConfig = (role) => {
    switch (role) {
      case "ADMIN":
        return {
          gradient: "from-red-500 to-orange-500",
          bgLight: "bg-red-50 dark:bg-red-500/10",
          border: "border-red-200 dark:border-red-500/30",
          text: "text-red-700 dark:text-red-400",
          ring: "ring-red-500",
        };
      case "student":
        return {
          gradient: "from-blue-500 to-cyan-500",
          bgLight: "bg-blue-50 dark:bg-blue-500/10",
          border: "border-blue-200 dark:border-blue-500/30",
          text: "text-blue-700 dark:text-blue-400",
          ring: "ring-blue-500",
        };
      case "faculty":
        return {
          gradient: "from-green-500 to-emerald-500",
          bgLight: "bg-green-50 dark:bg-green-500/10",
          border: "border-green-200 dark:border-green-500/30",
          text: "text-green-700 dark:text-green-400",
          ring: "ring-green-500",
        };
      case "industry":
        return {
          gradient: "from-purple-500 to-pink-500",
          bgLight: "bg-purple-50 dark:bg-purple-500/10",
          border: "border-purple-200 dark:border-purple-500/30",
          text: "text-purple-700 dark:text-purple-400",
          ring: "ring-purple-500",
        };
      default:
        return {
          gradient: "from-gray-500 to-slate-500",
          bgLight: "bg-gray-50 dark:bg-gray-500/10",
          border: "border-gray-200 dark:border-gray-500/30",
          text: "text-gray-700 dark:text-gray-400",
          ring: "ring-gray-500",
        };
    }
  };

  const getPermissionIcon = (permissionId) => {
    if (permissionId.includes("VIEW")) return Eye;
    if (permissionId.includes("EDIT") || permissionId.includes("MANAGE"))
      return Edit3;
    if (permissionId.includes("MESSAGE")) return MessageSquare;
    if (permissionId.includes("REPORT")) return FileText;
    if (permissionId.includes("SETTING")) return Settings;
    if (permissionId.includes("USER")) return UserCog;
    if (permissionId.includes("ROLE")) return Shield;
    if (permissionId.includes("OPENING") || permissionId.includes("INTERN"))
      return Briefcase;
    return Check;
  };

  const togglePermission = (roleKey, permissionId) => {
    if (!canEditRoles || roles[roleKey]?.isProtected) return;

    setRoles((prev) => {
      const updated = { ...prev };
      const currentPermissions = [...updated[roleKey].permissions];

      if (currentPermissions.includes(permissionId)) {
        updated[roleKey] = {
          ...updated[roleKey],
          permissions: currentPermissions.filter((p) => p !== permissionId),
        };
      } else {
        updated[roleKey] = {
          ...updated[roleKey],
          permissions: [...currentPermissions, permissionId],
        };
      }

      return updated;
    });
  };

  const addCategoryPermissions = (roleKey, category) => {
    if (!canEditRoles || roles[roleKey]?.isProtected) return;

    const categoryPermissions = getPermissionsForRole(roleKey)
      .filter((p) => p.category === category)
      .map((p) => p.id);

    setRoles((prev) => {
      const updated = { ...prev };
      const currentPermissions = new Set(updated[roleKey].permissions);
      categoryPermissions.forEach((p) => currentPermissions.add(p));
      updated[roleKey] = {
        ...updated[roleKey],
        permissions: Array.from(currentPermissions),
      };
      return updated;
    });
  };

  const removeCategoryPermissions = (roleKey, category) => {
    if (!canEditRoles || roles[roleKey]?.isProtected) return;

    const categoryPermissions = getPermissionsForRole(roleKey)
      .filter((p) => p.category === category)
      .map((p) => p.id);

    setRoles((prev) => {
      const updated = { ...prev };
      updated[roleKey] = {
        ...updated[roleKey],
        permissions: updated[roleKey].permissions.filter(
          (p) => !categoryPermissions.includes(p),
        ),
      };
      return updated;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminRolesService.updateRoles(roles, admin.email);
      setOriginalRoles(JSON.parse(JSON.stringify(roles)));
      setHasChanges(false);
      setSaveSuccess(true);
      setEditMode(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save roles:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (hasChanges) {
      setPendingAction("discard");
      setShowConfirmModal(true);
    } else {
      setEditMode(false);
    }
  };

  const confirmDiscard = () => {
    setRoles(JSON.parse(JSON.stringify(originalRoles)));
    setHasChanges(false);
    setEditMode(false);
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const resetRoleToDefault = (roleKey) => {
    if (!canEditRoles || roles[roleKey]?.isProtected) return;
    setPendingAction({ type: "reset", roleKey });
    setShowConfirmModal(true);
  };

  const confirmResetRole = () => {
    const { roleKey } = pendingAction;
    setRoles((prev) => ({
      ...prev,
      [roleKey]: JSON.parse(JSON.stringify(originalRoles[roleKey])),
    }));
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const handleRoleClick = (roleKey) => {
    setSelectedRole(selectedRole === roleKey ? null : roleKey);
    setSearchQuery("");
  };

  const allRoles = useMemo(() => Object.entries(roles), [roles]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[rgb(var(--border))] rounded-lg w-1/4 mb-4" />
          <div className="h-4 bg-[rgb(var(--border))] rounded-lg w-1/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-44 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Heading level={2}>Roles & Permissions</Heading>
          <Body className="text-[rgb(var(--muted))]">
            {editMode
              ? "Click on permissions to toggle them for each role"
              : "Manage role-based access control for the platform"}
          </Body>
        </div>

        {canEditRoles && (
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              editMode
                ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
                : "bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))]"
            }`}
          >
            {editMode ? <Eye size={18} /> : <Edit3 size={18} />}
            {editMode ? "View Mode" : "Edit Mode"}
          </button>
        )}
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl"
          >
            <CheckCircle
              className="text-green-600 dark:text-green-400"
              size={20}
            />
            <p className="text-green-700 dark:text-green-400">
              Permissions updated successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Mode Banner */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Edit3
                className="text-amber-600 dark:text-amber-400 shrink-0"
                size={20}
              />
              <div>
                <p className="text-amber-700 dark:text-amber-400 font-medium">
                  Edit Mode Active
                </p>
                <p className="text-amber-600 dark:text-amber-300 text-sm">
                  Click on permissions to toggle. Admin role cannot be modified.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-amber-600 dark:text-amber-400 text-sm font-medium whitespace-nowrap">
                  Unsaved changes
                </span>
              )}
              <button
                onClick={handleDiscard}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] rounded-lg font-medium hover:bg-[rgb(var(--background))] transition-colors disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Save size={16} className={isSaving ? "animate-spin" : ""} />
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allRoles.map(([roleKey, roleData], idx) => {
          const Icon = getRoleIcon(roleKey);
          const config = getRoleConfig(roleKey);
          const isSelected = selectedRole === roleKey;
          const isProtected = roleData.isProtected;
          const rolePermissions = getPermissionsForRole(roleKey);
          const totalCount = rolePermissions.length;
          const grantedCount = getGrantedCount(roleKey);
          const isModified =
            JSON.stringify(roleData) !== JSON.stringify(originalRoles[roleKey]);

          return (
            <motion.div
              key={roleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleRoleClick(roleKey)}
              className={`bg-[rgb(var(--surface))] border rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? `ring-2 ${config.ring} border-transparent`
                  : "border-[rgb(var(--border))]"
              }`}
            >
              {/* Card Content */}
              <div className={`p-5 ${isSelected ? config.bgLight : ""}`}>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    {isProtected && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                        <Lock size={10} />
                        Protected
                      </span>
                    )}
                    {isModified && !isProtected && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                        <Edit3 size={10} />
                        Modified
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[rgb(var(--foreground))] mb-1">
                  {roleData.name}
                </h3>
                <p className="text-[rgb(var(--muted))] text-sm line-clamp-2 mb-4">
                  {roleData.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[rgb(var(--muted))]">Permissions</span>
                  <span className={`font-semibold ${config.text}`}>
                    {grantedCount} / {totalCount}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 h-1.5 bg-[rgb(var(--background))] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${totalCount > 0 ? (grantedCount / totalCount) * 100 : 0}%`,
                    }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className={`h-full bg-linear-to-r ${config.gradient} rounded-full`}
                  />
                </div>

                {/* Chevron Indicator */}
                <div className="flex items-center justify-center mt-4 pt-3 border-t border-[rgb(var(--border))]">
                  <motion.div
                    animate={{ rotate: isSelected ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} className={config.text} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded Role Permissions */}
      <AnimatePresence>
        {selectedRole && roles[selectedRole] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
              {/* Permissions Header */}
              <div
                className={`p-6 border-b border-[rgb(var(--border))] ${getRoleConfig(selectedRole).bgLight}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {(() => {
                      const Icon = getRoleIcon(selectedRole);
                      const config = getRoleConfig(selectedRole);
                      return (
                        <div
                          className={`w-12 h-12 rounded-xl bg-linear-to-br ${config.gradient} flex items-center justify-center`}
                        >
                          <Icon className="text-white" size={24} />
                        </div>
                      );
                    })()}
                    <div>
                      <h3 className="text-xl font-semibold text-[rgb(var(--foreground))]">
                        {roles[selectedRole].name} Permissions
                      </h3>
                      <p className="text-[rgb(var(--muted))] text-sm">
                        {getGrantedCount(selectedRole)} of{" "}
                        {getPermissionsForRole(selectedRole).length} permissions
                        granted
                        {editMode && !roles[selectedRole].isProtected && (
                          <span className="text-amber-600 dark:text-amber-400 ml-2">
                            • Click to toggle
                          </span>
                        )}
                        {roles[selectedRole].isProtected && (
                          <span className="text-red-600 dark:text-red-400 ml-2">
                            • Protected (read-only)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-48 pl-9 pr-3 py-2 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-lg text-sm text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Reset Button */}
                    {editMode && !roles[selectedRole].isProtected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetRoleToDefault(selectedRole);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] rounded-lg text-sm transition-colors"
                      >
                        <RotateCcw size={14} />
                        Reset
                      </button>
                    )}

                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedRole(null)}
                      className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Permissions List */}
              <div className="p-6">
                {Object.entries(getGroupedPermissionsForRole(selectedRole))
                  .length > 0 ? (
                  Object.entries(
                    getGroupedPermissionsForRole(selectedRole),
                  ).map(([category, categoryPerms]) => (
                    <div key={category} className="mb-6 last:mb-0">
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
                          {category}
                        </h4>
                        {editMode && !roles[selectedRole].isProtected && (
                          <div className="flex items-center gap-3 text-xs">
                            <button
                              onClick={() =>
                                addCategoryPermissions(selectedRole, category)
                              }
                              className="text-green-600 dark:text-green-400 hover:underline font-medium"
                            >
                              Grant All
                            </button>
                            <span className="text-[rgb(var(--border))]">|</span>
                            <button
                              onClick={() =>
                                removeCategoryPermissions(
                                  selectedRole,
                                  category,
                                )
                              }
                              className="text-red-600 dark:text-red-400 hover:underline font-medium"
                            >
                              Revoke All
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Permissions Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {categoryPerms.map((perm) => {
                          const hasPerm = roles[
                            selectedRole
                          ].permissions.includes(perm.id);
                          const isProtected = roles[selectedRole].isProtected;
                          const isEditable = editMode && !isProtected;
                          const PermIcon = getPermissionIcon(perm.id);
                          const config = getRoleConfig(selectedRole);

                          return (
                            <motion.div
                              key={perm.id}
                              whileHover={isEditable ? { scale: 1.02 } : {}}
                              whileTap={isEditable ? { scale: 0.98 } : {}}
                              onClick={() =>
                                isEditable &&
                                togglePermission(selectedRole, perm.id)
                              }
                              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                                isProtected
                                  ? "bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20"
                                  : hasPerm
                                    ? `${config.bgLight} ${config.border}`
                                    : "bg-[rgb(var(--background))] border-[rgb(var(--border))]"
                              } ${isEditable ? "cursor-pointer hover:shadow-md" : ""}`}
                            >
                              {/* Icon */}
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                  isProtected
                                    ? "bg-red-100 dark:bg-red-500/20"
                                    : hasPerm
                                      ? `bg-linear-to-br ${config.gradient}`
                                      : "bg-[rgb(var(--surface))]"
                                }`}
                              >
                                {isProtected ? (
                                  <Lock
                                    size={18}
                                    className="text-red-600 dark:text-red-400"
                                  />
                                ) : hasPerm ? (
                                  <Check size={18} className="text-white" />
                                ) : (
                                  <PermIcon
                                    size={18}
                                    className="text-[rgb(var(--muted))]"
                                  />
                                )}
                              </div>

                              {/* Text */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-medium text-sm truncate ${
                                    isProtected
                                      ? "text-red-700 dark:text-red-400"
                                      : hasPerm
                                        ? config.text
                                        : "text-[rgb(var(--foreground))]"
                                  }`}
                                >
                                  {perm.name}
                                </p>
                                <p className="text-xs text-[rgb(var(--muted))] truncate">
                                  {perm.description}
                                </p>
                              </div>

                              {/* Toggle Indicator */}
                              {isEditable && (
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                    hasPerm
                                      ? `${config.border} ${config.bgLight}`
                                      : "border-[rgb(var(--border))]"
                                  }`}
                                >
                                  {hasPerm && (
                                    <div
                                      className={`w-2.5 h-2.5 rounded-full bg-linear-to-br ${config.gradient}`}
                                    />
                                  )}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Search
                      size={48}
                      className="mx-auto text-[rgb(var(--muted))] mb-4"
                    />
                    <p className="text-[rgb(var(--foreground))] font-medium">
                      No permissions found
                    </p>
                    <p className="text-[rgb(var(--muted))] text-sm">
                      Try adjusting your search query
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-4">
          Quick Reference
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
            <div>
              <p className="text-green-700 dark:text-green-400 font-medium text-sm">
                Granted
              </p>
              <p className="text-green-600 dark:text-green-500 text-xs">
                Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[rgb(var(--background))] rounded-xl border border-[rgb(var(--border))]">
            <div className="w-8 h-8 rounded-lg bg-[rgb(var(--border))] flex items-center justify-center">
              <X size={16} className="text-[rgb(var(--muted))]" />
            </div>
            <div>
              <p className="text-[rgb(var(--foreground))] font-medium text-sm">
                Not Granted
              </p>
              <p className="text-[rgb(var(--muted))] text-xs">Disabled</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Edit3 size={16} className="text-white" />
            </div>
            <div>
              <p className="text-amber-700 dark:text-amber-400 font-medium text-sm">
                Edit Mode
              </p>
              <p className="text-amber-600 dark:text-amber-500 text-xs">
                Click to toggle
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20">
            <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
              <Lock size={16} className="text-white" />
            </div>
            <div>
              <p className="text-red-700 dark:text-red-400 font-medium text-sm">
                Protected
              </p>
              <p className="text-red-600 dark:text-red-500 text-xs">
                Read-only
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle
                    className="text-amber-600 dark:text-amber-400"
                    size={24}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">
                    {pendingAction === "discard"
                      ? "Discard Changes?"
                      : "Reset Role?"}
                  </h3>
                  <p className="text-[rgb(var(--muted))] text-sm">
                    {pendingAction === "discard"
                      ? "All unsaved changes will be lost"
                      : `Reset ${roles[pendingAction?.roleKey]?.name} to default`}
                  </p>
                </div>
              </div>

              <p className="text-[rgb(var(--foreground))] mb-6">
                {pendingAction === "discard"
                  ? "Are you sure you want to discard all your changes? This action cannot be undone."
                  : "This will restore all permissions for this role to their original values."}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setPendingAction(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] rounded-xl font-medium hover:bg-[rgb(var(--surface))] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    pendingAction === "discard"
                      ? confirmDiscard
                      : confirmResetRole
                  }
                  className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
                >
                  {pendingAction === "discard" ? "Discard" : "Reset"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RolesPermissions;
