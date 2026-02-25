/**
 * Messages Context
 *
 * Global state management for messaging.
 * Provides conversations, messages, and actions to all components.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import * as messageService from "../services/messageService";
import * as notificationService from "../services/notificationService";
import { SENDER_TYPES } from "../config/messageTypes";

// Initial state
const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  unreadCount: 0,
  isLoading: false,
  isLoadingMessages: false,
  error: null,
  filters: {
    status: null,
    type: null,
    unreadOnly: false,
    search: "",
  },
};

// Action types
const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_LOADING_MESSAGES: "SET_LOADING_MESSAGES",
  SET_CONVERSATIONS: "SET_CONVERSATIONS",
  SET_CURRENT_CONVERSATION: "SET_CURRENT_CONVERSATION",
  SET_MESSAGES: "SET_MESSAGES",
  ADD_MESSAGE: "ADD_MESSAGE",
  SET_UNREAD_COUNT: "SET_UNREAD_COUNT",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_FILTERS: "SET_FILTERS",
  MARK_CONVERSATION_READ: "MARK_CONVERSATION_READ",
  RESET: "RESET",
};

// Reducer
function messagesReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_LOADING_MESSAGES:
      return { ...state, isLoadingMessages: action.payload };

    case ACTIONS.SET_CONVERSATIONS:
      return { ...state, conversations: action.payload, isLoading: false };

    case ACTIONS.SET_CURRENT_CONVERSATION:
      return { ...state, currentConversation: action.payload };

    case ACTIONS.SET_MESSAGES:
      return { ...state, messages: action.payload, isLoadingMessages: false };

    case ACTIONS.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };

    case ACTIONS.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isLoadingMessages: false,
      };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case ACTIONS.MARK_CONVERSATION_READ:
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === action.payload.conversationId
            ? {
                ...conv,
                readStatus: {
                  ...conv.readStatus,
                  [action.payload.userId]: true,
                },
              }
            : conv,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
}

// Create context
const MessagesContext = createContext(null);

/**
 * Messages Provider Component
 */
export function MessagesProvider({ children, user }) {
  const [state, dispatch] = useReducer(messagesReducer, initialState);

  const userId = user?.id;
  const userType = user?.type || SENDER_TYPES.STUDENT;

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!userId) return;

    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      const result = await messageService.getConversations(
        userId,
        userType,
        state.filters,
      );

      if (result.success) {
        dispatch({ type: ACTIONS.SET_CONVERSATIONS, payload: result.data });
      } else {
        dispatch({ type: ACTIONS.SET_ERROR, payload: result.error });
      }
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Failed to load conversations",
      });
    }
  }, [userId, userType, state.filters]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(
    async (conversationId) => {
      if (!userId || !conversationId) return;

      dispatch({ type: ACTIONS.SET_LOADING_MESSAGES, payload: true });

      try {
        // Fetch conversation details
        const convResult = await messageService.getConversation(
          conversationId,
          userId,
        );

        if (convResult.success) {
          dispatch({
            type: ACTIONS.SET_CURRENT_CONVERSATION,
            payload: convResult.data,
          });
        }

        // Fetch messages
        const msgResult = await messageService.getMessages(
          conversationId,
          userId,
        );

        if (msgResult.success) {
          dispatch({ type: ACTIONS.SET_MESSAGES, payload: msgResult.data });

          // Mark as read
          await messageService.markAsRead(conversationId, userId);
          dispatch({
            type: ACTIONS.MARK_CONVERSATION_READ,
            payload: { conversationId, userId },
          });
        } else {
          dispatch({ type: ACTIONS.SET_ERROR, payload: msgResult.error });
        }
      } catch (error) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: "Failed to load messages",
        });
      }
    },
    [userId],
  );

  // Send a message
  const sendMessage = useCallback(
    async (conversationId, messageData) => {
      if (!userId) return { success: false, error: "Not authenticated" };

      try {
        const result = await messageService.sendMessage(conversationId, {
          ...messageData,
          sender: {
            id: userId,
            type: userType,
            name: user?.name || "User",
          },
        });

        if (result.success) {
          dispatch({ type: ACTIONS.ADD_MESSAGE, payload: result.data });
          // Refresh conversations to update last message
          fetchConversations();
        }

        return result;
      } catch (error) {
        return { success: false, error: "Failed to send message" };
      }
    },
    [userId, userType, user?.name, fetchConversations],
  );

  // Mark conversation as read
  const markAsRead = useCallback(
    async (conversationId) => {
      if (!userId) return;

      await messageService.markAsRead(conversationId, userId);
      dispatch({
        type: ACTIONS.MARK_CONVERSATION_READ,
        payload: { conversationId, userId },
      });
    },
    [userId],
  );

  // Mark conversation as unread
  const markAsUnread = useCallback(
    async (conversationId) => {
      if (!userId) return;

      await messageService.markAsUnread(conversationId, userId);
      // Refresh conversations
      fetchConversations();
    },
    [userId, fetchConversations],
  );

  // Archive conversation
  const archiveConversation = useCallback(
    async (conversationId) => {
      if (!userId) return;

      await messageService.archiveConversation(conversationId, userId);
      fetchConversations();
    },
    [userId, fetchConversations],
  );

  // Update filters
  const setFilters = useCallback((newFilters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  // Clear current conversation
  const clearCurrentConversation = useCallback(() => {
    dispatch({ type: ACTIONS.SET_CURRENT_CONVERSATION, payload: null });
    dispatch({ type: ACTIONS.SET_MESSAGES, payload: [] });
  }, []);

  // Fetch unread count and start polling
  useEffect(() => {
    if (userId) {
      // Initial fetch
      notificationService.fetchUnreadCount(userId, userType).then((count) => {
        dispatch({ type: ACTIONS.SET_UNREAD_COUNT, payload: count });
      });

      // Start polling
      notificationService.startPolling(userId, userType, (count) => {
        dispatch({ type: ACTIONS.SET_UNREAD_COUNT, payload: count });
      });

      return () => {
        notificationService.stopPolling();
      };
    }
  }, [userId, userType]);

  // Fetch conversations when filters change
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Context value
  const value = {
    // State
    ...state,
    user: { id: userId, type: userType, name: user?.name },

    // Actions
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
    markAsUnread,
    archiveConversation,
    setFilters,
    clearCurrentConversation,
    clearError: () => dispatch({ type: ACTIONS.CLEAR_ERROR }),
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}

/**
 * Hook to use messages context
 */
export function useMessagesContext() {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error(
      "useMessagesContext must be used within a MessagesProvider",
    );
  }

  return context;
}

export default MessagesContext;
