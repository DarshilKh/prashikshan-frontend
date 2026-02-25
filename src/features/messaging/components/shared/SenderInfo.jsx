/**
 * SenderInfo Component
 *
 * Displays sender avatar, name, and role.
 */

import React from "react";
import { getInitials } from "../../utils/formatters";
import { SENDER_TYPES } from "../../config/messageTypes";

const avatarColors = {
  [SENDER_TYPES.STUDENT]: "bg-blue-500",
  [SENDER_TYPES.FACULTY]: "bg-purple-500",
  [SENDER_TYPES.INDUSTRY]: "bg-green-500",
  [SENDER_TYPES.ADMIN]: "bg-red-500",
  [SENDER_TYPES.SYSTEM]: "bg-gray-500",
};

export function SenderInfo({ sender, size = "md", showRole = true }) {
  if (!sender) return null;

  const sizeClasses = {
    sm: {
      avatar: "w-8 h-8 text-xs",
      name: "text-sm",
      role: "text-xs",
    },
    md: {
      avatar: "w-10 h-10 text-sm",
      name: "text-base",
      role: "text-sm",
    },
    lg: {
      avatar: "w-12 h-12 text-base",
      name: "text-lg",
      role: "text-sm",
    },
  };

  const sizes = sizeClasses[size];
  const bgColor = avatarColors[sender.type] || "bg-gray-500";

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      {sender.avatar ? (
        <img
          src={sender.avatar}
          alt={sender.name}
          className={`${sizes.avatar} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`
            ${sizes.avatar} ${bgColor}
            rounded-full flex items-center justify-center text-white font-medium
          `}
        >
          {getInitials(sender.name)}
        </div>
      )}

      {/* Name and Role */}
      <div className="flex flex-col">
        <span className={`font-medium text-gray-900 ${sizes.name}`}>
          {sender.name}
        </span>
        {showRole && sender.role && (
          <span className={`text-gray-500 ${sizes.role}`}>{sender.role}</span>
        )}
      </div>
    </div>
  );
}

export default SenderInfo;
