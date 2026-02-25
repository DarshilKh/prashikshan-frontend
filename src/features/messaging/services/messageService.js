/**
 * Message Service
 *
 * Data access layer for messaging.
 * Currently uses mock data - replace with API calls when backend is ready.
 *
 * TODO: Replace mock implementations with actual API calls
 */

import {
  mockConversations,
  mockFacultyConversations,
  mockIndustryConversations,
  mockAdminConversations,
} from "../data/mockConversations";
import { mockMessages } from "../data/mockMessages";
import { SENDER_TYPES, THREAD_STATUS } from "../config/messageTypes";

// Simulated network delay for realistic UX
const SIMULATED_DELAY = 300;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all conversations for a user
 *
 * TODO: Replace with API call: GET /api/messages/conversations
 */
export const getConversations = async (userId, userType, filters = {}) => {
  await delay(SIMULATED_DELAY);

  let conversations = [];

  // Get conversations based on user type
  switch (userType) {
    case SENDER_TYPES.STUDENT:
      conversations = mockConversations.filter((conv) =>
        conv.participants.some((p) => p.id === userId),
      );
      break;

    case SENDER_TYPES.FACULTY:
      conversations = mockFacultyConversations.filter((conv) =>
        conv.participants.some((p) => p.id === userId),
      );
      break;

    case SENDER_TYPES.INDUSTRY:
      conversations = mockIndustryConversations.filter((conv) =>
        conv.participants.some((p) => p.id === userId),
      );
      break;

    case SENDER_TYPES.ADMIN:
      conversations = mockAdminConversations.filter((conv) =>
        conv.participants.some((p) => p.id === userId),
      );
      break;

    default:
      conversations = [];
  }

  // Apply filters
  if (filters.status) {
    conversations = conversations.filter(
      (conv) => conv.status === filters.status,
    );
  }

  if (filters.type) {
    conversations = conversations.filter((conv) => conv.type === filters.type);
  }

  if (filters.unreadOnly) {
    conversations = conversations.filter((conv) => !conv.readStatus[userId]);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    conversations = conversations.filter(
      (conv) =>
        conv.subject.toLowerCase().includes(searchLower) ||
        conv.lastMessage.preview.toLowerCase().includes(searchLower) ||
        conv.participants.some((p) =>
          p.name.toLowerCase().includes(searchLower),
        ),
    );
  }

  // Sort by latest message
  conversations.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return {
    success: true,
    data: conversations,
    total: conversations.length,
  };
};

/**
 * Get a single conversation by ID
 *
 * TODO: Replace with API call: GET /api/messages/conversations/:id
 */
export const getConversation = async (conversationId, userId) => {
  await delay(SIMULATED_DELAY);

  const allConversations = [
    ...mockConversations,
    ...mockFacultyConversations,
    ...mockIndustryConversations,
    ...mockAdminConversations,
  ];

  const conversation = allConversations.find(
    (conv) => conv.id === conversationId,
  );

  if (!conversation) {
    return {
      success: false,
      error: "Conversation not found",
    };
  }

  // Check if user is a participant
  const isParticipant = conversation.participants.some((p) => p.id === userId);

  if (!isParticipant) {
    return {
      success: false,
      error: "You do not have access to this conversation",
    };
  }

  return {
    success: true,
    data: conversation,
  };
};

/**
 * Get messages for a conversation
 *
 * TODO: Replace with API call: GET /api/messages/conversations/:id/messages
 */
export const getMessages = async (conversationId, userId, pagination = {}) => {
  await delay(SIMULATED_DELAY);

  const messages = mockMessages[conversationId] || [];

  // Pagination
  const page = pagination.page || 1;
  const limit = pagination.limit || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedMessages = messages.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedMessages,
    pagination: {
      page,
      limit,
      total: messages.length,
      hasMore: endIndex < messages.length,
    },
  };
};

/**
 * Send a reply to a conversation
 *
 * TODO: Replace with API call: POST /api/messages/conversations/:id/messages
 */
export const sendMessage = async (conversationId, messageData) => {
  await delay(SIMULATED_DELAY);

  // TODO: Backend will validate:
  // 1. User has permission to reply
  // 2. Conversation exists and is active
  // 3. Message content is valid
  // 4. Attachments are valid

  const newMessage = {
    id: `msg_${Date.now()}`,
    conversationId,
    type: messageData.type || "GENERAL",
    sender: messageData.sender,
    content: {
      subject: messageData.subject || null,
      body: messageData.body,
      html: null,
    },
    attachments: messageData.attachments || [],
    metadata: {},
    status: {
      sent: true,
      delivered: false,
      read: false,
      readAt: null,
    },
    createdAt: new Date().toISOString(),
  };

  // In real implementation, this would be added to the database
  if (mockMessages[conversationId]) {
    mockMessages[conversationId].push(newMessage);
  }

  return {
    success: true,
    data: newMessage,
  };
};

/**
 * Mark conversation as read
 *
 * TODO: Replace with API call: PATCH /api/messages/conversations/:id/read
 */
export const markAsRead = async (conversationId, userId) => {
  await delay(SIMULATED_DELAY);

  const allConversations = [
    ...mockConversations,
    ...mockFacultyConversations,
    ...mockIndustryConversations,
    ...mockAdminConversations,
  ];

  const conversation = allConversations.find(
    (conv) => conv.id === conversationId,
  );

  if (conversation) {
    conversation.readStatus[userId] = true;
  }

  return {
    success: true,
  };
};

/**
 * Mark conversation as unread
 *
 * TODO: Replace with API call: PATCH /api/messages/conversations/:id/unread
 */
export const markAsUnread = async (conversationId, userId) => {
  await delay(SIMULATED_DELAY);

  const allConversations = [
    ...mockConversations,
    ...mockFacultyConversations,
    ...mockIndustryConversations,
    ...mockAdminConversations,
  ];

  const conversation = allConversations.find(
    (conv) => conv.id === conversationId,
  );

  if (conversation) {
    conversation.readStatus[userId] = false;
  }

  return {
    success: true,
  };
};

/**
 * Archive a conversation
 *
 * TODO: Replace with API call: PATCH /api/messages/conversations/:id/archive
 */
export const archiveConversation = async (conversationId, userId) => {
  await delay(SIMULATED_DELAY);

  // In real implementation, this would update the conversation status in the database

  return {
    success: true,
  };
};

/**
 * Get unread count for a user
 *
 * TODO: Replace with API call: GET /api/messages/unread-count
 */
export const getUnreadCount = async (userId, userType) => {
  await delay(100); // Faster for badge updates

  const result = await getConversations(userId, userType, { unreadOnly: true });

  return {
    success: true,
    count: result.data.length,
  };
};

export default {
  getConversations,
  getConversation,
  getMessages,
  sendMessage,
  markAsRead,
  markAsUnread,
  archiveConversation,
  getUnreadCount,
};