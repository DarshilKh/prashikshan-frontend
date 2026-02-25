/**
 * Helper Utilities
 */

import { SENDER_TYPES } from "../config/messageTypes";

/**
 * Get the other participant in a conversation
 */
export const getOtherParticipant = (conversation, currentUserId) => {
  if (!conversation?.participants) return null;
  return conversation.participants.find((p) => p.id !== currentUserId);
};

/**
 * Check if conversation has unread messages for user
 */
export const isUnread = (conversation, userId) => {
  return conversation?.readStatus?.[userId] === false;
};

/**
 * Sort conversations by date (newest first)
 */
export const sortByDate = (conversations) => {
  return [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
};

/**
 * Group conversations by type
 */
export const groupByType = (conversations) => {
  return conversations.reduce((groups, conv) => {
    const type = conv.type || "OTHER";
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(conv);
    return groups;
  }, {});
};

/**
 * Filter conversations by search query
 */
export const filterBySearch = (conversations, query) => {
  if (!query) return conversations;

  const lowerQuery = query.toLowerCase();

  return conversations.filter((conv) => {
    // Search in subject
    if (conv.subject?.toLowerCase().includes(lowerQuery)) return true;

    // Search in last message
    if (conv.lastMessage?.preview?.toLowerCase().includes(lowerQuery))
      return true;

    // Search in participant names
    if (
      conv.participants?.some((p) => p.name?.toLowerCase().includes(lowerQuery))
    )
      return true;

    // Search in context
    if (conv.context?.internshipTitle?.toLowerCase().includes(lowerQuery))
      return true;
    if (conv.context?.companyName?.toLowerCase().includes(lowerQuery))
      return true;

    return false;
  });
};

/**
 * Get sender type label
 */
export const getSenderTypeLabel = (type) => {
  const labels = {
    [SENDER_TYPES.STUDENT]: "Student",
    [SENDER_TYPES.FACULTY]: "Faculty",
    [SENDER_TYPES.INDUSTRY]: "Company",
    [SENDER_TYPES.ADMIN]: "Admin",
    [SENDER_TYPES.SYSTEM]: "System",
  };
  return labels[type] || "Unknown";
};

/**
 * Generate conversation URL
 */
export const getConversationUrl = (conversationId, userType) => {
  const basePaths = {
    [SENDER_TYPES.STUDENT]: "/student/messages",
    [SENDER_TYPES.FACULTY]: "/faculty/messages",
    [SENDER_TYPES.INDUSTRY]: "/industry/messages",
    [SENDER_TYPES.ADMIN]: "/admin/messages",
  };

  const basePath = basePaths[userType] || "/messages";
  return `${basePath}/${conversationId}`;
};

export default {
  getOtherParticipant,
  isUnread,
  sortByDate,
  groupByType,
  filterBySearch,
  getSenderTypeLabel,
  getConversationUrl,
};
