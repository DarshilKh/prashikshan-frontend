// src/admin/pages/SystemSettings.jsx (COMPLETE VERSION)

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Bell,
  Lock,
  AlertTriangle,
  CheckCircle,
  Server,
  ToggleLeft,
  Users,
  GraduationCap,
  Building2,
  User,
  RotateCcw,
  Search,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-react";
import { adminSettingsService } from "../services/adminService";
import { useAdmin } from "../context/AdminContext";
import { usePermissions } from "../../context/PermissionsContext";
import {
  FEATURE_CONFIG,
  getFeaturesByCategory,
} from "../../config/permissions";
import { Heading, Body, Caption } from "../../components/common/Typography";

// ✅ FIXED: Moved Toggle outside the main component to prevent re-creation on every render
const Toggle = React.memo(({
  enabled,
  onChange,
  disabled = false,
  size = "default",
  id,
}) => {
  const sizes = {
    small: {
      width: "w-10",
      height: "h-5",
      dot: "w-3.5 h-3.5",
      translate: 18,
    },
    default: { width: "w-12", height: "h-6", dot: "w-4 h-4", translate: 24 },
  };
  const s = sizes[size] || sizes.default;

  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative ${s.width} ${s.height} rounded-full transition-colors ${
        enabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <motion.div
        initial={false}
        animate={{ x: enabled ? s.translate : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 ${s.dot} bg-white rounded-full shadow`}
      />
    </button>
  );
});

Toggle.displayName = "Toggle";

const SystemSettings = () => {
  const { admin } = useAdmin();
  const {
    permissions,
    toggleFeature,
    toggleFeatureForRole,
    resetPermissions,
    isFeatureEnabledGlobally,
    lastUpdated,
  } = usePermissions();

  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("features");
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Feature management state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({
    Student: true,
    Faculty: true,
    Industry: true,
    Global: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminSettingsService.getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        // Set default settings if fetch fails
        setSettings({
          security: {
            maxLoginAttempts: 5,
            lockoutDuration: 30,
            passwordMinLength: 8,
            sessionTimeout: 60,
            requireStrongPassword: true,
            enableTwoFactor: false,
          },
          notifications: {
            enableEmailNotifications: true,
            enablePushNotifications: true,
            dailyDigest: false,
            weeklyReport: true,
          },
          maintenance: {
            maintenanceMode: false,
            maintenanceMessage:
              "We are currently performing scheduled maintenance. Please check back soon.",
            readOnlyMode: false,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (category, key) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
    setHasChanges(true);
  };

  const handleInputChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminSettingsService.updateSettings(
        activeTab,
        settings[activeTab],
        admin?.email,
      );
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleMaintenance = async () => {
    const newValue = !settings.maintenance.maintenanceMode;
    setIsSaving(true);
    try {
      await adminSettingsService.toggleMaintenanceMode(
        newValue,
        settings.maintenance.maintenanceMessage,
        admin?.email,
      );
      setSettings((prev) => ({
        ...prev,
        maintenance: {
          ...prev.maintenance,
          maintenanceMode: newValue,
        },
      }));
    } catch (error) {
      console.error("Failed to toggle maintenance mode:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Feature permission handlers
  const handleFeatureToggle = (featureKey) => {
    const currentState = isFeatureEnabledGlobally(featureKey);
    toggleFeature(featureKey, !currentState, admin?.email);
  };

  const handleFeatureRoleToggle = (featureKey, role) => {
    const permission = permissions[featureKey];
    const isDisabledForRole = permission?.disabledRoles?.includes(role);
    toggleFeatureForRole(featureKey, role, isDisabledForRole, admin?.email);
  };

  const handleResetPermissions = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all permissions to defaults? This will enable all features for all roles.",
      )
    ) {
      resetPermissions();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Filter features
  const getFilteredFeatures = () => {
    const featuresByCategory = getFeaturesByCategory();
    const filtered = {};

    Object.entries(featuresByCategory).forEach(([category, features]) => {
      if (selectedCategory !== "all" && category !== selectedCategory) {
        return;
      }

      const matchingFeatures = features.filter(
        (feature) =>
          feature.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          feature.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      if (matchingFeatures.length > 0) {
        filtered[category] = matchingFeatures;
      }
    });

    return filtered;
  };

  const tabs = [
    { id: "features", label: "Feature Permissions", icon: ToggleLeft },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "maintenance", label: "Maintenance", icon: Server },
  ];

  const roleIcons = {
    student: GraduationCap,
    faculty: User,
    industry: Building2,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Heading level={2}>System Settings</Heading>
          <Body className="text-[rgb(var(--muted))]">
            Configure platform behavior, features, and permissions
          </Body>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <Caption className="text-[rgb(var(--muted))]">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </Caption>
          )}
          {hasChanges && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </motion.button>
          )}
        </div>
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
              Settings saved successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Maintenance Mode Warning */}
      {settings?.maintenance?.maintenanceMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl"
        >
          <AlertTriangle
            className="text-amber-600 dark:text-amber-400"
            size={20}
          />
          <div>
            <p className="text-amber-700 dark:text-amber-400 font-medium">
              Maintenance Mode Active
            </p>
            <p className="text-amber-600 dark:text-amber-300 text-sm">
              The platform is currently in maintenance mode. Users cannot access
              the system.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-4 sticky top-6">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400"
                        : "text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))]"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6"
            >
              {/* Feature Permissions Tab */}
              {activeTab === "features" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">
                        Feature Permissions
                      </h3>
                      <p className="text-[rgb(var(--muted))] text-sm">
                        Control which features are available for each user role
                      </p>
                    </div>
                    <button
                      onClick={handleResetPermissions}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors border border-amber-200 dark:border-amber-500/30"
                    >
                      <RotateCcw size={16} />
                      Reset to Defaults
                    </button>
                  </div>

                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--muted))]" />
                      <input
                        type="text"
                        placeholder="Search features..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="Student">Student Features</option>
                      <option value="Faculty">Faculty Features</option>
                      <option value="Industry">Industry Features</option>
                      <option value="Global">Global Features</option>
                    </select>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-4 p-3 bg-[rgb(var(--background))] rounded-xl text-sm">
                    <span className="text-[rgb(var(--muted))]">Legend:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-[rgb(var(--foreground))]">
                        Enabled
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                      <span className="text-[rgb(var(--foreground))]">
                        Disabled
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="text-amber-500" />
                      <span className="text-[rgb(var(--foreground))]">
                        Critical (Cannot disable)
                      </span>
                    </div>
                  </div>

                  {/* Feature Categories */}
                  <div className="space-y-4">
                    {Object.entries(getFilteredFeatures()).map(
                      ([category, features]) => (
                        <div
                          key={category}
                          className="border border-[rgb(var(--border))] rounded-xl overflow-hidden"
                        >
                          {/* Category Header */}
                          <button
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between p-4 bg-[rgb(var(--background))] hover:bg-[rgb(var(--border))]/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {expandedCategories[category] ? (
                                <ChevronDown
                                  size={20}
                                  className="text-[rgb(var(--muted))]"
                                />
                              ) : (
                                <ChevronRight
                                  size={20}
                                  className="text-[rgb(var(--muted))]"
                                />
                              )}
                              <span className="font-semibold text-[rgb(var(--foreground))]">
                                {category} Features
                              </span>
                              <span className="text-sm text-[rgb(var(--muted))] px-2 py-0.5 bg-[rgb(var(--surface))] rounded-full">
                                {features.length}
                              </span>
                            </div>
                          </button>

                          {/* Features List */}
                          <AnimatePresence>
                            {expandedCategories[category] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="divide-y divide-[rgb(var(--border))]">
                                  {features.map((feature) => {
                                    const permission = permissions[
                                      feature.key
                                    ] || { enabled: true, disabledRoles: [] };
                                    const isGloballyEnabled =
                                      permission.enabled;
                                    const isCritical = feature.critical;

                                    return (
                                      <div
                                        key={feature.key}
                                        className={`p-4 ${isCritical ? "bg-amber-50/50 dark:bg-amber-500/5" : ""}`}
                                      >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                          {/* Feature Info */}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className="font-medium text-[rgb(var(--foreground))]">
                                                {feature.label}
                                              </span>
                                              {isCritical && (
                                                <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full">
                                                  <Lock size={10} />
                                                  Critical
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-sm text-[rgb(var(--muted))] mt-1">
                                              {feature.description}
                                            </p>
                                          </div>

                                          {/* Controls */}
                                          <div className="flex items-center gap-4 flex-wrap">
                                            {/* Global Toggle */}
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm text-[rgb(var(--muted))] whitespace-nowrap">
                                                Global
                                              </span>
                                              <Toggle
                                                id={`global-${feature.key}`}
                                                enabled={isGloballyEnabled}
                                                onChange={() =>
                                                  handleFeatureToggle(
                                                    feature.key,
                                                  )
                                                }
                                                disabled={isCritical}
                                              />
                                            </div>

                                            {/* Per-Role Toggles */}
                                            {isGloballyEnabled &&
                                              !isCritical && (
                                                <div className="flex items-center gap-2 pl-4 border-l border-[rgb(var(--border))]">
                                                  {feature.roles.map((role) => {
                                                    const RoleIcon =
                                                      roleIcons[role];
                                                    const isDisabledForRole =
                                                      permission.disabledRoles?.includes(
                                                        role,
                                                      );

                                                    return (
                                                      <button
                                                        key={role}
                                                        onClick={() =>
                                                          handleFeatureRoleToggle(
                                                            feature.key,
                                                            role,
                                                          )
                                                        }
                                                        title={`${role}: ${isDisabledForRole ? "Disabled - Click to enable" : "Enabled - Click to disable"}`}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                          isDisabledForRole
                                                            ? "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                            : "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30"
                                                        }`}
                                                      >
                                                        <RoleIcon size={14} />
                                                        <span className="capitalize">
                                                          {role}
                                                        </span>
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                          </div>
                                        </div>

                                        {/* Disabled info */}
                                        {!isGloballyEnabled &&
                                          permission.disabledBy && (
                                            <div className="mt-3 flex items-center gap-2 text-xs text-[rgb(var(--muted))] bg-[rgb(var(--background))] px-3 py-2 rounded-lg">
                                              <Info size={12} />
                                              <span>
                                                Disabled by{" "}
                                                {permission.disabledBy} on{" "}
                                                {new Date(
                                                  permission.disabledAt,
                                                ).toLocaleString()}
                                              </span>
                                            </div>
                                          )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Empty State */}
                  {Object.keys(getFilteredFeatures()).length === 0 && (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 mx-auto text-[rgb(var(--muted))] mb-4" />
                      <p className="text-[rgb(var(--foreground))] font-medium">
                        No features found
                      </p>
                      <p className="text-[rgb(var(--muted))] text-sm mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && settings && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-2">
                      Security Settings
                    </h3>
                    <p className="text-[rgb(var(--muted))] text-sm">
                      Configure security and authentication options
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        key: "maxLoginAttempts",
                        label: "Max Login Attempts",
                        type: "number",
                      },
                      {
                        key: "lockoutDuration",
                        label: "Lockout Duration (minutes)",
                        type: "number",
                      },
                      {
                        key: "passwordMinLength",
                        label: "Min Password Length",
                        type: "number",
                      },
                      {
                        key: "sessionTimeout",
                        label: "Session Timeout (minutes)",
                        type: "number",
                      },
                    ].map((field) => (
                      <div
                        key={field.key}
                        className="p-4 bg-[rgb(var(--background))] rounded-xl"
                      >
                        <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          value={settings.security?.[field.key] || 0}
                          onChange={(e) =>
                            handleInputChange(
                              "security",
                              field.key,
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-full px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: "requireStrongPassword",
                        label: "Strong Password Required",
                        desc: "Require uppercase, lowercase, numbers, and special characters",
                      },
                      {
                        key: "enableTwoFactor",
                        label: "Two-Factor Authentication",
                        desc: "Require 2FA for all admin users",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 bg-[rgb(var(--background))] rounded-xl"
                      >
                        <div>
                          <p className="text-[rgb(var(--foreground))] font-medium">
                            {item.label}
                          </p>
                          <p className="text-[rgb(var(--muted))] text-sm">
                            {item.desc}
                          </p>
                        </div>
                        <Toggle
                          id={`security-${item.key}`}
                          enabled={settings.security?.[item.key] || false}
                          onChange={() => handleToggle("security", item.key)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && settings && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-2">
                      Notification Settings
                    </h3>
                    <p className="text-[rgb(var(--muted))] text-sm">
                      Configure how users receive notifications
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: "enableEmailNotifications",
                        label: "Email Notifications",
                        desc: "Send notifications via email",
                      },
                      {
                        key: "enablePushNotifications",
                        label: "Push Notifications",
                        desc: "Send browser push notifications",
                      },
                      {
                        key: "dailyDigest",
                        label: "Daily Digest",
                        desc: "Send daily activity summary emails",
                      },
                      {
                        key: "weeklyReport",
                        label: "Weekly Report",
                        desc: "Send weekly analytics report to admins",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 bg-[rgb(var(--background))] rounded-xl"
                      >
                        <div>
                          <p className="text-[rgb(var(--foreground))] font-medium">
                            {item.label}
                          </p>
                          <p className="text-[rgb(var(--muted))] text-sm">
                            {item.desc}
                          </p>
                        </div>
                        <Toggle
                          id={`notifications-${item.key}`}
                          enabled={settings.notifications?.[item.key] || false}
                          onChange={() =>
                            handleToggle("notifications", item.key)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Maintenance Tab */}
              {activeTab === "maintenance" && settings && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-2">
                      Maintenance Settings
                    </h3>
                    <p className="text-[rgb(var(--muted))] text-sm">
                      Control platform availability and maintenance mode
                    </p>
                  </div>

                  {/* Maintenance Mode Toggle */}
                  <div
                    className={`p-6 rounded-xl border-2 ${
                      settings.maintenance?.maintenanceMode
                        ? "bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/50"
                        : "bg-[rgb(var(--background))] border-[rgb(var(--border))]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            settings.maintenance?.maintenanceMode
                              ? "bg-red-100 dark:bg-red-500/20"
                              : "bg-[rgb(var(--surface))]"
                          }`}
                        >
                          <Server
                            size={28}
                            className={
                              settings.maintenance?.maintenanceMode
                                ? "text-red-600 dark:text-red-400"
                                : "text-[rgb(var(--muted))]"
                            }
                          />
                        </div>
                        <div>
                          <p className="text-[rgb(var(--foreground))] font-semibold text-lg">
                            Maintenance Mode
                          </p>
                          <p
                            className={
                              settings.maintenance?.maintenanceMode
                                ? "text-red-600 dark:text-red-400 font-medium"
                                : "text-green-600 dark:text-green-400"
                            }
                          >
                            {settings.maintenance?.maintenanceMode
                              ? "⚠️ Platform is OFFLINE"
                              : "✓ Platform is online"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleToggleMaintenance}
                        disabled={isSaving}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                          settings.maintenance?.maintenanceMode
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        } disabled:opacity-50`}
                      >
                        {isSaving ? (
                          <RefreshCw size={18} className="animate-spin" />
                        ) : settings.maintenance?.maintenanceMode ? (
                          "Disable Maintenance"
                        ) : (
                          "Enable Maintenance"
                        )}
                      </button>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                        Maintenance Message (shown to users)
                      </label>
                      <textarea
                        value={settings.maintenance?.maintenanceMessage || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "maintenance",
                            "maintenanceMessage",
                            e.target.value,
                          )
                        }
                        rows={3}
                        className="w-full px-4 py-3 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        placeholder="We are currently performing scheduled maintenance..."
                      />
                    </div>
                  </div>

                  {/* Read-Only Mode */}
                  <div className="flex items-center justify-between p-4 bg-[rgb(var(--background))] rounded-xl">
                    <div>
                      <p className="text-[rgb(var(--foreground))] font-medium">
                        Read-Only Mode
                      </p>
                      <p className="text-[rgb(var(--muted))] text-sm">
                        Users can view content but cannot make changes
                      </p>
                    </div>
                    <Toggle
                      id="maintenance-readOnlyMode"
                      enabled={settings.maintenance?.readOnlyMode || false}
                      onChange={() =>
                        handleToggle("maintenance", "readOnlyMode")
                      }
                    />
                  </div>

                  {/* Warning */}
                  <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                        size={20}
                      />
                      <div>
                        <p className="text-amber-700 dark:text-amber-400 font-medium">
                          Warning
                        </p>
                        <p className="text-amber-600 dark:text-amber-300 text-sm mt-1">
                          Enabling maintenance mode will immediately prevent all
                          users from accessing the platform. Make sure to
                          communicate scheduled maintenance to users beforehand.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;  