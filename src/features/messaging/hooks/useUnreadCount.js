/**
 * useUnreadCount Hook
 *
 * Simple hook for getting unread message count.
 * Useful for navbar badges.
 */

import { useMessagesContext } from "../context/MessagesContext";

export function useUnreadCount() {
  const { unreadCount } = useMessagesContext();

  return {
    count: unreadCount,
    hasUnread: unreadCount > 0,
    displayCount: unreadCount > 99 ? "99+" : unreadCount.toString(),
  };
}

export default useUnreadCount;
