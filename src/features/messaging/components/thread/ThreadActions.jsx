/**
 * ThreadActions Component
 *
 * Action buttons for thread (archive, mark read, etc.)
 */

import React from "react";
import { Archive, Mail, MailOpen, Star, Trash2 } from "lucide-react";

export function ThreadActions({
  conversation,
  onArchive,
  onToggleRead,
  onToggleStar,
  onDelete,
}) {
  const isRead = conversation?.readStatus?.["current_user"]; // Replace with actual user ID

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleRead}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        title={isRead ? "Mark as unread" : "Mark as read"}
      >
        {isRead ? (
          <Mail className="w-5 h-5" />
        ) : (
          <MailOpen className="w-5 h-5" />
        )}
      </button>

      <button
        onClick={onToggleStar}
        className={`p-2 rounded-lg ${
          conversation?.isStarred
            ? "text-amber-400 hover:bg-amber-50"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        }`}
        title={conversation?.isStarred ? "Unstar" : "Star"}
      >
        <Star
          className={`w-5 h-5 ${conversation?.isStarred ? "fill-current" : ""}`}
        />
      </button>

      <button
        onClick={onArchive}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        title="Archive"
      >
        <Archive className="w-5 h-5" />
      </button>

      <button
        onClick={onDelete}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
        title="Delete"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

export default ThreadActions;
