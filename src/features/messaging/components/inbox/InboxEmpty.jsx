/**
 * InboxEmpty Component
 *
 * Empty state for inbox.
 */

import React from "react";
import { Inbox, Search, Archive, Filter } from "lucide-react";
import { UI_LABELS } from "../../config/uiConfig";

export function InboxEmpty({ filters }) {
  // Determine which empty state to show
  const getEmptyState = () => {
    if (filters?.search) {
      return {
        icon: Search,
        title: UI_LABELS.EMPTY_SEARCH,
        description: UI_LABELS.EMPTY_SEARCH_DESC,
        action: null,
      };
    }

    if (filters?.unreadOnly) {
      return {
        icon: Inbox,
        title: UI_LABELS.EMPTY_UNREAD,
        description: UI_LABELS.EMPTY_UNREAD_DESC,
        action: null,
      };
    }

    if (filters?.status === "ARCHIVED") {
      return {
        icon: Archive,
        title: "No archived messages",
        description: "Messages you archive will appear here.",
        action: null,
      };
    }

    return {
      icon: Inbox,
      title: UI_LABELS.EMPTY_INBOX,
      description: UI_LABELS.EMPTY_INBOX_DESC,
      action: {
        label: "Browse Internships",
        href: "/internships",
      },
    };
  };

  const emptyState = getEmptyState();
  const Icon = emptyState.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {emptyState.title}
      </h3>

      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {emptyState.description}
      </p>

      {emptyState.action && (
        <a
          href={emptyState.action.href}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {emptyState.action.label}
        </a>
      )}
    </div>
  );
}

export default InboxEmpty;
