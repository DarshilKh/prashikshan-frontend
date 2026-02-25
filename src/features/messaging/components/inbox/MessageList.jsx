/**
 * MessageList Component
 *
 * Renders list of conversation threads.
 */

import React from "react";
import MessageListItem from "./MessageListItem";
import { useMessages } from "../../hooks/useMessages";

export function MessageList({ conversations }) {
  const { user } = useMessages();

  if (!conversations || conversations.length === 0) {
    return null;
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => (
        <MessageListItem
          key={conversation.id}
          conversation={conversation}
          currentUserId={user?.id}
        />
      ))}
    </div>
  );
}

export default MessageList;
