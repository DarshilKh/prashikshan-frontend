/**
 * MessagesIcon Component
 *
 * Navbar icon with unread badge.
 */

import React from "react";
import { Mail } from "lucide-react";
import { useUnreadCount } from "../../hooks/useUnreadCount";

export function MessagesIcon({ onClick, className = "" }) {
  const { count, hasUnread, displayCount } = useUnreadCount();

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
      aria-label={`Messages${hasUnread ? ` (${count} unread)` : ""}`}
    >
      <Mail className="w-5 h-5" />

      {hasUnread && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center
                         bg-red-500 text-white text-xs font-bold rounded-full"
        >
          {displayCount}
        </span>
      )}
    </button>
  );
}

export default MessagesIcon;
