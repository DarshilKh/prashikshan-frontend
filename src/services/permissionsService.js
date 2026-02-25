// src/services/permissionsService.js

/**
 * Centralized Permissions Service
 * Acts as a "mock backend" - all permission changes go through here
 * and all contexts read from here
 */

import { FEATURE_CONFIG, getDefaultPermissions } from "../config/permissions";

// Simulated "database" - this is shared across all imports
let permissionsStore = null;
let listeners = new Set();
let lastUpdateTimestamp = null;

// Storage key
const PERMISSIONS_STORAGE_KEY = "prashikshan_feature_permissions";

// Initialize store from localStorage or defaults
const initializeStore = () => {
  if (permissionsStore === null) {
    try {
      const stored = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
      const defaults = getDefaultPermissions();

      if (stored) {
        const parsed = JSON.parse(stored);
        // IMPORTANT: Merge defaults with stored to ensure new features are included
        permissionsStore = { ...defaults, ...parsed };

        // Check if we need to save (new features were added)
        const storedKeys = Object.keys(parsed);
        const defaultKeys = Object.keys(defaults);
        const hasNewKeys = defaultKeys.some((key) => !storedKeys.includes(key));

        if (hasNewKeys) {
          // Save merged permissions to include new features
          localStorage.setItem(
            PERMISSIONS_STORAGE_KEY,
            JSON.stringify(permissionsStore),
          );
        }
      } else {
        permissionsStore = defaults;
        // Save initial defaults
        localStorage.setItem(
          PERMISSIONS_STORAGE_KEY,
          JSON.stringify(permissionsStore),
        );
      }
    } catch (e) {
      console.error("Error initializing permissions store:", e);
      permissionsStore = getDefaultPermissions();
    }
    lastUpdateTimestamp = Date.now();
  }
  return permissionsStore;
};

// Save to localStorage and notify listeners
const saveAndNotify = () => {
  lastUpdateTimestamp = Date.now();
  localStorage.setItem(
    PERMISSIONS_STORAGE_KEY,
    JSON.stringify(permissionsStore),
  );

  // Notify all listeners (contexts in different parts of the app)
  listeners.forEach((listener) => {
    try {
      listener({ ...permissionsStore });
    } catch (e) {
      console.error("Error notifying listener:", e);
    }
  });

  // Dispatch custom event for cross-component communication
  window.dispatchEvent(
    new CustomEvent("permissions-updated", {
      detail: {
        permissions: { ...permissionsStore },
        timestamp: lastUpdateTimestamp,
      },
    }),
  );
};

// Public API
export const permissionsService = {
  /**
   * Get current permissions
   */
  getPermissions: () => {
    initializeStore();
    return { ...permissionsStore };
  },

  /**
   * Get last update timestamp
   */
  getLastUpdateTimestamp: () => lastUpdateTimestamp,

  /**
   * Check if feature is enabled for a role
   */
  isFeatureEnabled: (featureKey, role) => {
    initializeStore();
    const permission = permissionsStore[featureKey];
    const featureConfig = FEATURE_CONFIG[featureKey];

    // If feature doesn't exist in config, default to enabled
    if (!featureConfig) {
      console.warn(
        `Feature "${featureKey}" not found in FEATURE_CONFIG, defaulting to enabled`,
      );
      return true;
    }

    // If permission doesn't exist in store, default to enabled
    if (!permission) {
      console.warn(
        `Permission for "${featureKey}" not found in store, defaulting to enabled`,
      );
      return true;
    }

    // Critical features are always enabled
    if (featureConfig.critical) return true;

    // Check if globally disabled
    if (!permission.enabled) return false;

    // Check if disabled for this specific role
    if (permission.disabledRoles?.includes(role)) return false;

    return true;
  },

  /**
   * Check if feature is enabled globally
   */
  isFeatureEnabledGlobally: (featureKey) => {
    initializeStore();
    const permission = permissionsStore[featureKey];
    const featureConfig = FEATURE_CONFIG[featureKey];

    if (!permission || !featureConfig) return true;
    if (featureConfig.critical) return true;

    return permission.enabled;
  },

  /**
   * Toggle feature globally
   */
  toggleFeature: (featureKey, enabled, adminEmail = null) => {
    initializeStore();
    const featureConfig = FEATURE_CONFIG[featureKey];

    if (featureConfig?.critical) {
      console.warn(`Cannot toggle critical feature: ${featureKey}`);
      return false;
    }

    permissionsStore[featureKey] = {
      ...permissionsStore[featureKey],
      enabled,
      disabledAt: enabled ? null : new Date().toISOString(),
      disabledBy: enabled ? null : adminEmail,
      disabledRoles: enabled
        ? []
        : permissionsStore[featureKey]?.disabledRoles || [],
    };

    saveAndNotify();
    return true;
  },

  /**
   * Toggle feature for specific role
   */
  toggleFeatureForRole: (featureKey, role, enabled, adminEmail = null) => {
    initializeStore();
    const featureConfig = FEATURE_CONFIG[featureKey];

    if (featureConfig?.critical) {
      console.warn(`Cannot toggle critical feature: ${featureKey}`);
      return false;
    }

    const currentPermission = permissionsStore[featureKey] || {
      enabled: true,
      disabledRoles: [],
    };

    let newDisabledRoles = [...(currentPermission.disabledRoles || [])];

    if (enabled) {
      newDisabledRoles = newDisabledRoles.filter((r) => r !== role);
    } else {
      if (!newDisabledRoles.includes(role)) {
        newDisabledRoles.push(role);
      }
    }

    permissionsStore[featureKey] = {
      ...currentPermission,
      disabledRoles: newDisabledRoles,
      disabledAt: new Date().toISOString(),
      disabledBy: adminEmail,
    };

    saveAndNotify();
    return true;
  },

  /**
   * Reset all permissions to defaults
   */
  resetPermissions: () => {
    permissionsStore = getDefaultPermissions();
    saveAndNotify();
  },

  /**
   * Force re-initialize (clears cache and reloads from storage/defaults)
   */
  forceReinitialize: () => {
    permissionsStore = null;
    initializeStore();
    saveAndNotify();
  },

  /**
   * Subscribe to permission changes
   */
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /**
   * Get disabled features for a role
   */
  getDisabledFeaturesForRole: (role) => {
    initializeStore();
    return Object.entries(permissionsStore)
      .filter(([featureKey, permission]) => {
        const config = FEATURE_CONFIG[featureKey];
        if (!config || config.critical) return false;
        if (!permission.enabled) return true;
        return permission.disabledRoles?.includes(role);
      })
      .map(([featureKey]) => featureKey);
  },

  /**
   * Get permission details
   */
  getPermissionDetails: (featureKey) => {
    initializeStore();
    return {
      ...FEATURE_CONFIG[featureKey],
      ...permissionsStore[featureKey],
    };
  },
};

export default permissionsService;
