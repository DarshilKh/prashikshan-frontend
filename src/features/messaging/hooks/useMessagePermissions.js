/**
 * useMessagePermissions Hook
 *
 * Detailed permission information for a conversation.
 */

import { useMemo } from "react";
import { useMessagesContext } from "../context/MessagesContext";
import { getConversationPermissions } from "../services/permissionService";

export function useMessagePermissions(conversation) {
  const { user } = useMessagesContext();

  const permissions = useMemo(() => {
    if (!conversation || !user?.id) {
      return {
        canReply: false,
        canReplyReason: "No conversation selected",
        canInitiate: false,
        canInitiateReason: "No conversation selected",
        isSystemMessage: false,
        applicationInfo: null,
        conversationType: null,
      };
    }

    return getConversationPermissions(user.id, user.type, conversation);
  }, [conversation, user?.id, user?.type]);

  return permissions;
}

export default useMessagePermissions;
