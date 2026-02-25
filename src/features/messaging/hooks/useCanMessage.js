/**
 * useCanMessage Hook
 *
 * Quick check if current user can message a specific recipient.
 */

import { useMemo } from "react";
import { useMessagesContext } from "../context/MessagesContext";
import { canInitiateConversation } from "../services/permissionService";

export function useCanMessage(recipientId, recipientType) {
  const { user } = useMessagesContext();

  const permission = useMemo(() => {
    if (!user?.id || !recipientId) {
      return { allowed: false, reason: "Invalid user or recipient" };
    }

    return canInitiateConversation(
      user.id,
      user.type,
      recipientId,
      recipientType,
    );
  }, [user?.id, user?.type, recipientId, recipientType]);

  return {
    canMessage: permission.allowed,
    reason: permission.reason,
  };
}

export default useCanMessage;
