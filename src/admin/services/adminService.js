// src/admin/services/adminService.js

import {
  adminUsers,
  allPlatformUsers,
  rolesConfig,
  allPermissions,
  auditLogs,
  platformReports,
  systemSettings,
  dashboardAnalytics,
  getAdminByEmail,
  getUserById,
} from "../data/adminMockData";

/**
 * Admin Service - Simulates API calls
 * Structured for easy replacement with real API endpoints
 */

// Simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// AUTHENTICATION
// ============================================
export const adminAuthService = {
  /**
   * Admin login
   */
  login: async (email, password) => {
    await delay(800);

    const admin = getAdminByEmail(email);

    if (!admin) {
      throw new Error("Invalid admin credentials");
    }

    // Mock password check (in real app, this would be server-side)
    if (password !== "admin123") {
      throw new Error("Invalid admin credentials");
    }

    // Generate mock token
    const token = `admin-jwt-${admin.id}-${Date.now()}`;

    return {
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "ADMIN",
        permissions: admin.permissions,
        avatar: admin.avatar,
      },
    };
  },

  /**
   * Validate admin session
   */
  validateSession: async (token) => {
    await delay(200);

    // Check if token exists and starts with correct prefix
    if (!token || !token.startsWith("admin-jwt-")) {
      return { valid: false };
    }

    // Extract admin ID from token (format: admin-jwt-{adminId}-{timestamp})
    const parts = token.split("-");
    if (parts.length < 4) {
      return { valid: false };
    }

    // adminId is the third part (index 2)
    const adminId = `${parts[2]}-${parts[3]}`; // Reconstruct "admin-001" from parts

    // Find admin by ID
    const admin = adminUsers.find((a) => a.id === adminId);

    if (!admin) {
      return { valid: false };
    }

    return {
      valid: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "ADMIN",
        permissions: admin.permissions,
      },
    };
  },

  /**
   * Admin logout
   */
  logout: async () => {
    await delay(200);
    return { success: true };
  },
};

// ============================================
// USER MANAGEMENT
// ============================================
export const adminUserService = {
  /**
   * Get all platform users with filters
   */
  getUsers: async (filters = {}) => {
    await delay(600);

    let users = [...allPlatformUsers];

    // Apply filters
    if (filters.role) {
      users = users.filter((u) => u.role === filters.role);
    }

    if (filters.status) {
      users = users.filter((u) => u.status === filters.status);
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      users.sort((a, b) => {
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];
        const order = filters.sortOrder === "desc" ? -1 : 1;

        if (typeof aVal === "string") {
          return aVal.localeCompare(bVal) * order;
        }
        return (aVal - bVal) * order;
      });
    }

    return {
      users,
      total: users.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId) => {
    await delay(400);

    const user = getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  /**
   * Update user status (activate/deactivate/suspend)
   */
  updateUserStatus: async (userId, status, reason = null) => {
    await delay(500);

    const user = getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Update in mock data
    const index = allPlatformUsers.findIndex((u) => u.id === userId);
    allPlatformUsers[index] = {
      ...user,
      status,
      ...(status === "suspended" && { suspendedReason: reason }),
    };

    return {
      success: true,
      user: allPlatformUsers[index],
    };
  },

  /**
   * Change user role
   */
  changeUserRole: async (userId, newRole, adminEmail) => {
    await delay(500);

    const user = getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if role is valid
    if (!rolesConfig[newRole] || !rolesConfig[newRole].canBeAssigned) {
      throw new Error("Invalid role or role cannot be assigned");
    }

    const oldRole = user.role;

    // Update in mock data
    const index = allPlatformUsers.findIndex((u) => u.id === userId);
    allPlatformUsers[index] = {
      ...user,
      role: newRole,
    };

    // Log the action
    await adminLogsService.createLog({
      action: "USER_ROLE_CHANGED",
      actor: adminEmail,
      actorRole: "ADMIN",
      target: user.email,
      details: `Role changed from '${oldRole}' to '${newRole}'`,
    });

    return {
      success: true,
      user: allPlatformUsers[index],
    };
  },

  /**
   * Reset user password (sends reset email in real implementation)
   */
  resetUserPassword: async (userId, adminEmail) => {
    await delay(500);

    const user = getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Log the action
    await adminLogsService.createLog({
      action: "PASSWORD_RESET",
      actor: adminEmail,
      actorRole: "ADMIN",
      target: user.email,
      details: "Admin initiated password reset",
    });

    return {
      success: true,
      message: "Password reset email sent to user",
    };
  },

  /**
   * Delete user (soft delete in real implementation)
   */
  deleteUser: async (userId, adminEmail) => {
    await delay(500);

    const user = getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Remove from mock data
    const index = allPlatformUsers.findIndex((u) => u.id === userId);
    allPlatformUsers.splice(index, 1);

    // Log the action
    await adminLogsService.createLog({
      action: "USER_DELETED",
      actor: adminEmail,
      actorRole: "ADMIN",
      target: user.email,
      details: "User account deleted",
    });

    return {
      success: true,
      message: "User deleted successfully",
    };
  },

  /**
   * Verify user (for pending users)
   */
  verifyUser: async (userId, adminEmail) => {
    await delay(500);

    const user = getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const index = allPlatformUsers.findIndex((u) => u.id === userId);
    allPlatformUsers[index] = {
      ...user,
      isVerified: true,
      status: "active",
    };

    // Log the action
    await adminLogsService.createLog({
      action: "USER_VERIFIED",
      actor: adminEmail,
      actorRole: "ADMIN",
      target: user.email,
      details: "User account verified",
    });

    return {
      success: true,
      user: allPlatformUsers[index],
    };
  },
};

// ============================================
// ROLES & PERMISSIONS
// ============================================
export const adminRolesService = {
  /**
   * Get all roles
   */
  getRoles: async () => {
    await delay(400);
    // Return a deep copy to prevent direct mutation
    return JSON.parse(JSON.stringify(rolesConfig));
  },

  /**
   * Get all permissions
   */
  getPermissions: async () => {
    await delay(300);
    return [...allPermissions];
  },

  /**
   * Get permissions for a role
   */
  getRolePermissions: async (role) => {
    await delay(300);

    if (!rolesConfig[role]) {
      throw new Error("Role not found");
    }

    return {
      role,
      ...rolesConfig[role],
      permissionDetails: allPermissions.filter((p) =>
        rolesConfig[role].permissions.includes(p.id),
      ),
    };
  },

  /**
   * Update all roles permissions
   */
  updateRoles: async (updatedRoles, adminEmail) => {
    await delay(600);

    const changes = [];

    // Process each role
    Object.entries(updatedRoles).forEach(([roleKey, roleData]) => {
      // Skip if role doesn't exist or is protected
      if (!rolesConfig[roleKey]) return;
      if (rolesConfig[roleKey].isProtected) return;

      const originalRole = rolesConfig[roleKey];
      const originalPermissions = originalRole.permissions;
      const newPermissions = roleData.permissions;

      // Find added and removed permissions
      const addedPermissions = newPermissions.filter(
        (p) => !originalPermissions.includes(p),
      );
      const removedPermissions = originalPermissions.filter(
        (p) => !newPermissions.includes(p),
      );

      // Only process if there are changes
      if (addedPermissions.length > 0 || removedPermissions.length > 0) {
        changes.push({
          role: roleKey,
          roleName: originalRole.name,
          added: addedPermissions,
          removed: removedPermissions,
          addedNames: addedPermissions.map(
            (p) => allPermissions.find((perm) => perm.id === p)?.name || p,
          ),
          removedNames: removedPermissions.map(
            (p) => allPermissions.find((perm) => perm.id === p)?.name || p,
          ),
        });

        // Update the mock data
        rolesConfig[roleKey] = {
          ...rolesConfig[roleKey],
          permissions: [...newPermissions],
        };
      }
    });

    // Log each role change
    for (const change of changes) {
      let details = `Updated ${change.roleName} role permissions.`;
      if (change.addedNames.length > 0) {
        details += ` Added: ${change.addedNames.join(", ")}.`;
      }
      if (change.removedNames.length > 0) {
        details += ` Removed: ${change.removedNames.join(", ")}.`;
      }

      await adminLogsService.createLog({
        action: "ROLE_PERMISSIONS_UPDATED",
        actor: adminEmail,
        actorRole: "ADMIN",
        target: change.roleName,
        details,
        severity: "warning",
      });
    }

    return {
      success: true,
      changes,
      message:
        changes.length > 0
          ? `Updated ${changes.length} role(s) successfully`
          : "No changes were made",
    };
  },

  /**
   * Update a single role's permissions
   */
  updateRolePermissions: async (roleKey, permissions, adminEmail) => {
    await delay(400);

    if (!rolesConfig[roleKey]) {
      throw new Error("Role not found");
    }

    if (rolesConfig[roleKey].isProtected) {
      throw new Error("Cannot modify protected role");
    }

    const originalPermissions = rolesConfig[roleKey].permissions;
    const addedPermissions = permissions.filter(
      (p) => !originalPermissions.includes(p),
    );
    const removedPermissions = originalPermissions.filter(
      (p) => !permissions.includes(p),
    );

    // Update permissions
    rolesConfig[roleKey] = {
      ...rolesConfig[roleKey],
      permissions: [...permissions],
    };

    // Log the action
    let details = `Updated ${rolesConfig[roleKey].name} role.`;
    if (addedPermissions.length > 0) {
      const addedNames = addedPermissions.map(
        (p) => allPermissions.find((perm) => perm.id === p)?.name || p,
      );
      details += ` Added: ${addedNames.join(", ")}.`;
    }
    if (removedPermissions.length > 0) {
      const removedNames = removedPermissions.map(
        (p) => allPermissions.find((perm) => perm.id === p)?.name || p,
      );
      details += ` Removed: ${removedNames.join(", ")}.`;
    }

    await adminLogsService.createLog({
      action: "ROLE_PERMISSIONS_UPDATED",
      actor: adminEmail,
      actorRole: "ADMIN",
      target: rolesConfig[roleKey].name,
      details,
      severity: "warning",
    });

    return {
      success: true,
      role: rolesConfig[roleKey],
      added: addedPermissions,
      removed: removedPermissions,
    };
  },

  /**
   * Add permission to a role
   */
  addPermissionToRole: async (roleKey, permissionId, adminEmail) => {
    await delay(300);

    if (!rolesConfig[roleKey]) {
      throw new Error("Role not found");
    }

    if (rolesConfig[roleKey].isProtected) {
      throw new Error("Cannot modify protected role");
    }

    const permission = allPermissions.find((p) => p.id === permissionId);
    if (!permission) {
      throw new Error("Permission not found");
    }

    // Check if already has permission
    if (rolesConfig[roleKey].permissions.includes(permissionId)) {
      return {
        success: true,
        message: "Role already has this permission",
        role: rolesConfig[roleKey],
      };
    }

    // Add permission
    rolesConfig[roleKey].permissions.push(permissionId);

    // Log the action
    await adminLogsService.createLog({
      action: "PERMISSION_ADDED_TO_ROLE",
      actor: adminEmail,
      actorRole: "ADMIN",
      target: rolesConfig[roleKey].name,
      details: `Added permission: ${permission.name}`,
      severity: "info",
    });

    return {
      success: true,
      role: rolesConfig[roleKey],
    };
  },

  /**
   * Remove permission from a role
   */
  removePermissionFromRole: async (roleKey, permissionId, adminEmail) => {
    await delay(300);

    if (!rolesConfig[roleKey]) {
      throw new Error("Role not found");
    }

    if (rolesConfig[roleKey].isProtected) {
      throw new Error("Cannot modify protected role");
    }

    const permission = allPermissions.find((p) => p.id === permissionId);
    if (!permission) {
      throw new Error("Permission not found");
    }

    // Check if has permission
    const index = rolesConfig[roleKey].permissions.indexOf(permissionId);
    if (index === -1) {
      return {
        success: true,
        message: "Role does not have this permission",
        role: rolesConfig[roleKey],
      };
    }

    // Remove permission
    rolesConfig[roleKey].permissions.splice(index, 1);

    // Log the action
    await adminLogsService.createLog({
      action: "PERMISSION_REMOVED_FROM_ROLE",
      actor: adminEmail,
      actorRole: "ADMIN",
      target: rolesConfig[roleKey].name,
      details: `Removed permission: ${permission.name}`,
      severity: "info",
    });

    return {
      success: true,
      role: rolesConfig[roleKey],
    };
  },

  /**
   * Reset role to default permissions
   */
  resetRoleToDefault: async (roleKey, defaultRoles, adminEmail) => {
    await delay(400);

    if (!rolesConfig[roleKey]) {
      throw new Error("Role not found");
    }

    if (rolesConfig[roleKey].isProtected) {
      throw new Error("Cannot modify protected role");
    }

    if (!defaultRoles[roleKey]) {
      throw new Error("Default configuration not found for this role");
    }

    // Reset to default
    rolesConfig[roleKey] = {
      ...rolesConfig[roleKey],
      permissions: [...defaultRoles[roleKey].permissions],
    };

    // Log the action
    await adminLogsService.createLog({
      action: "ROLE_RESET_TO_DEFAULT",
      actor: adminEmail,
      actorRole: "ADMIN",
      target: rolesConfig[roleKey].name,
      details: `Reset ${rolesConfig[roleKey].name} role to default permissions`,
      severity: "warning",
    });

    return {
      success: true,
      role: rolesConfig[roleKey],
    };
  },

  /**
   * Get role change history (from audit logs)
   */
  getRoleChangeHistory: async (roleKey = null) => {
    await delay(400);

    let logs = auditLogs.filter(
      (log) =>
        log.action === "ROLE_PERMISSIONS_UPDATED" ||
        log.action === "PERMISSION_ADDED_TO_ROLE" ||
        log.action === "PERMISSION_REMOVED_FROM_ROLE" ||
        log.action === "ROLE_RESET_TO_DEFAULT",
    );

    if (roleKey && rolesConfig[roleKey]) {
      logs = logs.filter((log) => log.target === rolesConfig[roleKey].name);
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      logs,
      total: logs.length,
    };
  },
};

// ============================================
// AUDIT LOGS
// ============================================
export const adminLogsService = {
  /**
   * Get audit logs with filters
   */
  getLogs: async (filters = {}) => {
    await delay(500);

    let logs = [...auditLogs];

    // Apply filters
    if (filters.action) {
      logs = logs.filter((l) => l.action === filters.action);
    }

    if (filters.severity) {
      logs = logs.filter((l) => l.severity === filters.severity);
    }

    if (filters.actor) {
      logs = logs.filter((l) =>
        l.actor.toLowerCase().includes(filters.actor.toLowerCase()),
      );
    }

    if (filters.dateFrom) {
      logs = logs.filter(
        (l) => new Date(l.timestamp) >= new Date(filters.dateFrom),
      );
    }

    if (filters.dateTo) {
      logs = logs.filter(
        (l) => new Date(l.timestamp) <= new Date(filters.dateTo),
      );
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      logs,
      total: logs.length,
    };
  },

  /**
   * Create a new log entry
   */
  createLog: async (logData) => {
    const newLog = {
      id: `log-${Date.now()}`,
      ...logData,
      ipAddress: "192.168.1.100", // Mock
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      timestamp: new Date().toISOString(),
      severity: logData.severity || "info",
    };

    auditLogs.unshift(newLog);

    return newLog;
  },
};

// ============================================
// REPORTS & MODERATION
// ============================================
export const adminReportsService = {
  /**
   * Get platform reports
   */
  getReports: async (filters = {}) => {
    await delay(500);

    let reports = [...platformReports];

    if (filters.status) {
      reports = reports.filter((r) => r.status === filters.status);
    }

    if (filters.type) {
      reports = reports.filter((r) => r.type === filters.type);
    }

    if (filters.priority) {
      reports = reports.filter((r) => r.priority === filters.priority);
    }

    // Sort by priority and date
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    reports.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return {
      reports,
      total: reports.length,
      pending: platformReports.filter((r) => r.status === "pending").length,
      underReview: platformReports.filter((r) => r.status === "under_review")
        .length,
      resolved: platformReports.filter((r) => r.status === "resolved").length,
    };
  },

  /**
   * Get report by ID
   */
  getReportById: async (reportId) => {
    await delay(300);

    const report = platformReports.find((r) => r.id === reportId);

    if (!report) {
      throw new Error("Report not found");
    }

    return report;
  },

  /**
   * Update report status
   */
  updateReportStatus: async (reportId, status, resolution, adminEmail) => {
    await delay(500);

    const index = platformReports.findIndex((r) => r.id === reportId);

    if (index === -1) {
      throw new Error("Report not found");
    }

    platformReports[index] = {
      ...platformReports[index],
      status,
      resolution,
      resolvedAt: status === "resolved" ? new Date().toISOString() : null,
      resolvedBy: status === "resolved" ? adminEmail : null,
    };

    return {
      success: true,
      report: platformReports[index],
    };
  },
};

// ============================================
// SYSTEM SETTINGS
// ============================================
export const adminSettingsService = {
  /**
   * Get all settings
   */
  getSettings: async () => {
    await delay(400);
    return { ...systemSettings };
  },

  /**
   * Update settings
   */
  updateSettings: async (category, settings, adminEmail) => {
    await delay(500);

    if (!systemSettings[category]) {
      throw new Error("Invalid settings category");
    }

    systemSettings[category] = {
      ...systemSettings[category],
      ...settings,
    };

    // Log the action
    await adminLogsService.createLog({
      action: "SYSTEM_SETTING_CHANGED",
      actor: adminEmail,
      actorRole: "ADMIN",
      details: `Updated ${category} settings: ${Object.keys(settings).join(", ")}`,
    });

    return {
      success: true,
      settings: systemSettings[category],
    };
  },

  /**
   * Toggle maintenance mode
   */
  toggleMaintenanceMode: async (enabled, message, adminEmail) => {
    await delay(500);

    systemSettings.maintenance.maintenanceMode = enabled;
    if (message) {
      systemSettings.maintenance.maintenanceMessage = message;
    }

    // Log the action
    await adminLogsService.createLog({
      action: "SYSTEM_SETTING_CHANGED",
      actor: adminEmail,
      actorRole: "ADMIN",
      details: `${enabled ? "Enabled" : "Disabled"} maintenance mode`,
      severity: "critical",
    });

    return {
      success: true,
      maintenanceMode: enabled,
    };
  },
};

// ============================================
// DASHBOARD & ANALYTICS
// ============================================
export const adminDashboardService = {
  /**
   * Get dashboard data
   */
  getDashboardData: async () => {
    await delay(600);
    return { ...dashboardAnalytics };
  },

  /**
   * Get user statistics
   */
  getUserStats: async () => {
    await delay(400);
    return {
      overview: dashboardAnalytics.overview,
      byRole: dashboardAnalytics.usersByRole,
      byStatus: dashboardAnalytics.usersByStatus,
    };
  },

  /**
   * Get activity feed
   */
  getActivityFeed: async (limit = 10) => {
    await delay(300);
    return dashboardAnalytics.recentActivity.slice(0, limit);
  },
};

// ============================================
// IMPERSONATION
// ============================================
export const adminImpersonationService = {
  /**
   * Start impersonation session
   */
  startImpersonation: async (userId, adminEmail) => {
    await delay(500);

    const user = getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "ADMIN") {
      throw new Error("Cannot impersonate admin users");
    }

    // Log the action
    await adminLogsService.createLog({
      action: "IMPERSONATION_START",
      actor: adminEmail,
      actorRole: "ADMIN",
      target: user.email,
      details: "Started impersonating user",
      severity: "warning",
    });

    return {
      success: true,
      impersonatedUser: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  /**
   * End impersonation session
   */
  endImpersonation: async (userId, adminEmail) => {
    await delay(300);

    const user = getUserById(userId);

    // Log the action
    await adminLogsService.createLog({
      action: "IMPERSONATION_END",
      actor: adminEmail,
      actorRole: "ADMIN",
      target: user?.email || userId,
      details: "Ended impersonation session",
      severity: "info",
    });

    return {
      success: true,
    };
  },
};

// ============================================
// NAMED EXPORTS
// ============================================
export { delay };

// ============================================
// DEFAULT EXPORT
// ============================================
export default {
  auth: adminAuthService,
  users: adminUserService,
  roles: adminRolesService,
  logs: adminLogsService,
  reports: adminReportsService,
  settings: adminSettingsService,
  dashboard: adminDashboardService,
  impersonation: adminImpersonationService,
};
