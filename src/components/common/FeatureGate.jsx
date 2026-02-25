// src/components/common/FeatureGate.jsx

import React from "react";
import { motion } from "framer-motion";
import { Lock, AlertCircle } from "lucide-react";
import { usePermissions } from "../../context/PermissionsContext";
import { useAuth } from "../../hooks/useAuth";

/**
 * FeatureGate - Conditionally renders children based on feature permissions
 *
 * @param {string} feature - The feature key from FEATURES config
 * @param {React.ReactNode} children - Content to render if feature is enabled
 * @param {React.ReactNode} fallback - Custom fallback content (optional)
 * @param {boolean} showDisabled - Show disabled state instead of hiding (default: false)
 * @param {string} role - Override role check (optional, uses auth role by default)
 */
export const FeatureGate = ({
  feature,
  children,
  fallback = null,
  showDisabled = false,
  role: overrideRole = null,
}) => {
  const { isFeatureEnabled, getPermissionDetails } = usePermissions();
  const { user } = useAuth();

  const role = overrideRole || user?.role;
  const isEnabled = isFeatureEnabled(feature, role);
  const permissionDetails = getPermissionDetails(feature);

  // Feature is enabled - render children
  if (isEnabled) {
    return <>{children}</>;
  }

  // Feature is disabled - show fallback or disabled state
  if (showDisabled) {
    return (
      <FeatureDisabledMessage
        featureName={permissionDetails?.label || feature}
        description={permissionDetails?.description}
      />
    );
  }

  // Return custom fallback or null
  return fallback;
};

/**
 * FeatureDisabledMessage - Shows a message when feature is disabled
 */
export const FeatureDisabledMessage = ({
  featureName = "This feature",
  description = "",
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg text-sm">
        <Lock className="w-4 h-4" />
        <span>{featureName} is currently disabled</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[300px] p-8"
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="text-xl font-semibold text-[rgb(var(--foreground))] mb-2">
        Feature Unavailable
      </h3>
      <p className="text-[rgb(var(--muted))] text-center max-w-md mb-4">
        {featureName} is currently disabled by the administrator.
      </p>
      {description && (
        <p className="text-sm text-[rgb(var(--muted))] text-center max-w-md">
          {description}
        </p>
      )}
      <div className="mt-6 flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
        <AlertCircle className="w-4 h-4" />
        <span>Contact your administrator for access</span>
      </div>
    </motion.div>
  );
};

/**
 * FeatureGateButton - A button that's disabled when feature is off
 */
export const FeatureGateButton = ({
  feature,
  children,
  role: overrideRole = null,
  disabledMessage = "Feature disabled",
  ...buttonProps
}) => {
  const { isFeatureEnabled } = usePermissions();
  const { user } = useAuth();

  const role = overrideRole || user?.role;
  const isEnabled = isFeatureEnabled(feature, role);

  return (
    <button
      {...buttonProps}
      disabled={!isEnabled || buttonProps.disabled}
      title={!isEnabled ? disabledMessage : buttonProps.title}
      className={`${buttonProps.className} ${
        !isEnabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

/**
 * useFeatureFlag - Hook to check feature status
 */
export const useFeatureFlag = (feature) => {
  const { isFeatureEnabled, getPermissionDetails } = usePermissions();
  const { user } = useAuth();

  const isEnabled = isFeatureEnabled(feature, user?.role);
  const details = getPermissionDetails(feature);

  return {
    isEnabled,
    isDisabled: !isEnabled,
    featureName: details?.label,
    featureDescription: details?.description,
    isCritical: details?.critical,
  };
};

export default FeatureGate;
