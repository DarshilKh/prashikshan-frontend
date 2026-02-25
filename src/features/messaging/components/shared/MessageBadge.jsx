/**
 * MessageBadge Component
 *
 * Displays message type as a colored badge.
 */

import React from "react";
import { MESSAGE_TYPES } from "../../config/messageTypes";

export function MessageBadge({ type, size = "sm" }) {
  const messageType = MESSAGE_TYPES[type] || MESSAGE_TYPES.GENERAL;

  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${messageType.bgColor} ${messageType.textColor}
        ${sizeClasses[size]}
      `}
    >
      {messageType.label}
    </span>
  );
}

export default MessageBadge;
