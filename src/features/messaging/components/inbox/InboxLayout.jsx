/**
 * InboxLayout Component
 *
 * Main layout for the inbox view.
 */

import React from "react";
import MessageFilters from "./MessageFilters";
import MessageList from "./MessageList";
import InboxEmpty from "./InboxEmpty";
import { MessageListSkeleton } from "../shared/Skeleton";
import { useMessages } from "../../hooks/useMessages";

export function InboxLayout({ title = "Messages" }) {
  const { conversations, isLoading, filters, setFilters, unreadCount } =
    useMessages();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="shrink-0 border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {unreadCount > 0 && (
              <span className="text-sm text-gray-500">
                {unreadCount} unread
              </span>
            )}
          </div>
          <MessageFilters filters={filters} onFilterChange={setFilters} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <MessageListSkeleton />
        ) : conversations.length === 0 ? (
          <InboxEmpty filters={filters} />
        ) : (
          <MessageList conversations={conversations} />
        )}
      </div>
    </div>
  );
}

export default InboxLayout;
