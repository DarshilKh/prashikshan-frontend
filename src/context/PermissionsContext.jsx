// src/context/PermissionsContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { permissionsService } from "../services/permissionsService";
import { FEATURES, FEATURE_CONFIG } from "../config/permissions";

const PermissionsContext = createContext(null);

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(() =>
    permissionsService.getPermissions(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(
    permissionsService.getLastUpdateTimestamp(),
  );

  useEffect(() => {
    // Subscribe to permission changes from the service
    const unsubscribe = permissionsService.subscribe((newPermissions) => {
      setPermissions(newPermissions);
      setLastUpdated(Date.now());
    });

    // Listen for custom event (for cross-component updates)
    const handlePermissionsUpdate = (event) => {
      setPermissions(event.detail.permissions);
      setLastUpdated(event.detail.timestamp);
    };

    window.addEventListener("permissions-updated", handlePermissionsUpdate);

    // Also listen for storage events (cross-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === "prashikshan_feature_permissions" && e.newValue) {
        try {
          const newPermissions = JSON.parse(e.newValue);
          setPermissions(newPermissions);
          setLastUpdated(Date.now());
        } catch (error) {
          console.error("Failed to parse permissions:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Periodic sync (poll every 5 seconds for changes)
    const pollInterval = setInterval(() => {
      const currentTimestamp = permissionsService.getLastUpdateTimestamp();
      if (currentTimestamp !== lastUpdated) {
        setPermissions(permissionsService.getPermissions());
        setLastUpdated(currentTimestamp);
      }
    }, 5000);

    return () => {
      unsubscribe();
      window.removeEventListener(
        "permissions-updated",
        handlePermissionsUpdate,
      );
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [lastUpdated]);

  // Refresh permissions manually
  const refreshPermissions = useCallback(() => {
    setPermissions(permissionsService.getPermissions());
    setLastUpdated(permissionsService.getLastUpdateTimestamp());
  }, []);

  // Check if feature is enabled for role
  const isFeatureEnabled = useCallback(
    (featureKey, role) => {
      return permissionsService.isFeatureEnabled(featureKey, role);
    },
    [permissions], // Re-evaluate when permissions change
  );

  // Check if feature is enabled globally
  const isFeatureEnabledGlobally = useCallback(
    (featureKey) => {
      return permissionsService.isFeatureEnabledGlobally(featureKey);
    },
    [permissions],
  );

  // Toggle feature globally
  const toggleFeature = useCallback(
    (featureKey, enabled, adminEmail = null) => {
      return permissionsService.toggleFeature(featureKey, enabled, adminEmail);
    },
    [],
  );

  // Toggle feature for role
  const toggleFeatureForRole = useCallback(
    (featureKey, role, enabled, adminEmail = null) => {
      return permissionsService.toggleFeatureForRole(
        featureKey,
        role,
        enabled,
        adminEmail,
      );
    },
    [],
  );

  // Reset permissions
  const resetPermissions = useCallback(() => {
    permissionsService.resetPermissions();
  }, []);

  // Get disabled features for role
  const getDisabledFeaturesForRole = useCallback(
    (role) => {
      return permissionsService.getDisabledFeaturesForRole(role);
    },
    [permissions],
  );

  // Get permission details
  const getPermissionDetails = useCallback(
    (featureKey) => {
      return permissionsService.getPermissionDetails(featureKey);
    },
    [permissions],
  );

  const value = useMemo(
    () => ({
      permissions,
      isLoading,
      lastUpdated,
      isFeatureEnabled,
      isFeatureEnabledGlobally,
      toggleFeature,
      toggleFeatureForRole,
      resetPermissions,
      getDisabledFeaturesForRole,
      getPermissionDetails,
      refreshPermissions,
      FEATURES,
      FEATURE_CONFIG,
    }),
    [
      permissions,
      isLoading,
      lastUpdated,
      isFeatureEnabled,
      isFeatureEnabledGlobally,
      toggleFeature,
      toggleFeatureForRole,
      resetPermissions,
      getDisabledFeaturesForRole,
      getPermissionDetails,
      refreshPermissions,
    ],
  );

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

export default PermissionsContext;
