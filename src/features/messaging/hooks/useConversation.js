/**
 * useConversation Hook
 *
 * Hook for working with a single conversation thread.
 */

import { useEffect, useCallback } from "react";
import { useMessagesContext } from "../context/MessagesContext";
import { useMessagePermissions } from "./useMessagePermissions";

export function useConversation(conversationId) {
  const context = useMessagesContext();
  const permissions = useMessagePermissions(context.currentConversation);

  // Fetch messages when conversationId changes
  useEffect(() => {
    if (conversationId) {
      context.fetchMessages(conversationId);
    }

    return () => {
      context.clearCurrentConversation();
    };
  }, [conversationId]);

  // Send reply
  const sendReply = useCallback(
    async (body, attachments = []) => {
      if (!conversationId || !permissions.canReply) {
        return { success: false, error: "Cannot reply to this conversation" };
      }

      return context.sendMessage(conversationId, {
        body,
        attachments,
        type: "GENERAL",
      });
    },
    [conversationId, permissions.canReply, context.sendMessage],
  );

  return {
    // State
    conversation: context.currentConversation,
    messages: context.messages,
    isLoading: context.isLoadingMessages,
    error: context.error,

    // Permissions
    ...permissions,

    // Actions
    sendReply,
    refresh: () => context.fetchMessages(conversationId),
  };
}

export default useConversation;
