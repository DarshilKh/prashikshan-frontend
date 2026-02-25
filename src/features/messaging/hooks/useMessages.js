/**
 * useMessages Hook
 *
 * Main hook for accessing messaging functionality.
 * Thin wrapper around MessagesContext.
 */

import { useMessagesContext } from "../context/MessagesContext";

export function useMessages() {
  const context = useMessagesContext();

  return {
    // State
    conversations: context.conversations,
    unreadCount: context.unreadCount,
    isLoading: context.isLoading,
    error: context.error,
    filters: context.filters,

    // Actions
    fetchConversations: context.fetchConversations,
    setFilters: context.setFilters,
    markAsRead: context.markAsRead,
    markAsUnread: context.markAsUnread,
    archiveConversation: context.archiveConversation,
    clearError: context.clearError,

    // User info
    user: context.user,
  };
}

export default useMessages;
