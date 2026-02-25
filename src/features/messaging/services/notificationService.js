/**
 * Notification Service
 *
 * Handles unread counts, badges, and notification state.
 *
 * TODO: Replace with WebSocket/SSE for real-time updates
 */

import { getUnreadCount } from "./messageService";

// In-memory cache for unread count
let unreadCountCache = {
  count: 0,
  lastFetched: null,
  userId: null,
};

// Polling interval (in production, use WebSocket)
const POLL_INTERVAL = 30000; // 30 seconds
let pollInterval = null;

/**
 * Get unread message count
 *
 * @param {string} userId - User ID
 * @param {string} userType - User type
 * @param {boolean} forceRefresh - Force API call
 * @returns {Promise<number>} Unread count
 */
export const fetchUnreadCount = async (
  userId,
  userType,
  forceRefresh = false,
) => {
  // Return cached value if recent
  const cacheAge = Date.now() - (unreadCountCache.lastFetched || 0);
  const isSameUser = unreadCountCache.userId === userId;

  if (!forceRefresh && isSameUser && cacheAge < 10000) {
    return unreadCountCache.count;
  }

  try {
    const result = await getUnreadCount(userId, userType);

    if (result.success) {
      unreadCountCache = {
        count: result.count,
        lastFetched: Date.now(),
        userId,
      };
      return result.count;
    }

    return unreadCountCache.count;
  } catch (error) {
    console.error("Failed to fetch unread count:", error);
    return unreadCountCache.count;
  }
};

/**
 * Start polling for unread count updates
 *
 * TODO: Replace with WebSocket subscription
 *
 * @param {string} userId - User ID
 * @param {string} userType - User type
 * @param {Function} onUpdate - Callback when count changes
 */
export const startPolling = (userId, userType, onUpdate) => {
  // Stop any existing polling
  stopPolling();

  // Initial fetch
  fetchUnreadCount(userId, userType, true).then(onUpdate);

  // Start polling
  pollInterval = setInterval(async () => {
    const prevCount = unreadCountCache.count;
    const newCount = await fetchUnreadCount(userId, userType, true);

    if (newCount !== prevCount) {
      onUpdate(newCount);
    }
  }, POLL_INTERVAL);
};

/**
 * Stop polling
 */
export const stopPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
};

/**
 * Clear cache (call on logout)
 */
export const clearCache = () => {
  unreadCountCache = {
    count: 0,
    lastFetched: null,
    userId: null,
  };
  stopPolling();
};

/**
 * Decrement unread count locally (optimistic update)
 *
 * @param {number} amount - Amount to decrement
 */
export const decrementUnreadCount = (amount = 1) => {
  unreadCountCache.count = Math.max(0, unreadCountCache.count - amount);
  return unreadCountCache.count;
};

/**
 * Increment unread count locally (optimistic update)
 *
 * @param {number} amount - Amount to increment
 */
export const incrementUnreadCount = (amount = 1) => {
  unreadCountCache.count += amount;
  return unreadCountCache.count;
};

export default {
  fetchUnreadCount,
  startPolling,
  stopPolling,
  clearCache,
  decrementUnreadCount,
  incrementUnreadCount,
};
