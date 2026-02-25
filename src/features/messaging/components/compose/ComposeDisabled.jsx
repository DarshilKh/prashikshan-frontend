/**
 * ComposeDisabled Component
 *
 * Shown when user cannot reply to a conversation.
 */

import React from "react";
import { Lock, AlertCircle, Bell, CheckCircle } from "lucide-react";
import { BANNER_MESSAGES } from "../../config/uiConfig";

export function ComposeDisabled({ reason, isSystemMessage, applicationInfo }) {
  // Determine which message to show
  const getMessage = () => {
    if (isSystemMessage) {
      return BANNER_MESSAGES.CANNOT_REPLY_SYSTEM;
    }

    if (applicationInfo?.status === "REJECTED") {
      return BANNER_MESSAGES.CANNOT_REPLY_REJECTED;
    }

    if (
      applicationInfo?.status === "PENDING" ||
      applicationInfo?.status === "UNDER_REVIEW"
    ) {
      return BANNER_MESSAGES.CANNOT_REPLY_PENDING;
    }

    return {
      type: "warning",
      title: "Reply Not Available",
      message: reason || "You cannot reply to this conversation.",
    };
  };

  const banner = getMessage();

  const icons = {
    warning: Lock,
    info: Bell,
    success: CheckCircle,
    error: AlertCircle,
  };

  const colors = {
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  const Icon = icons[banner.type] || Lock;
  const colorClasses = colors[banner.type] || colors.warning;

  return (
    <div className={`p-4 border-t ${colorClasses}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">{banner.title}</p>
          <p className="text-sm mt-1 opacity-90">{banner.message}</p>

          {applicationInfo && (
            <p className="text-sm mt-2">
              Application Status:{" "}
              <span className="font-medium">{applicationInfo.statusLabel}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComposeDisabled;
