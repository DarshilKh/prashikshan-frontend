/**
 * MessageListItem Component
 *
 * Single conversation preview in the inbox.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Paperclip, Star, Pin } from "lucide-react";
import { SenderInfo } from "../shared/SenderInfo";
import { MessageBadge } from "../shared/MessageBadge";
import { ContextTag } from "../shared/ContextTag";
import { Timestamp } from "../shared/Timestamp";
import { getOtherParticipant, isUnread } from "../../utils/helpers";
import { truncateText } from "../../utils/formatters";
import { useMessages } from "../../hooks/useMessages";
import { getConversationUrl } from "../../utils/helpers";

export function MessageListItem({ conversation, currentUserId }) {
  const navigate = useNavigate();
  const { user } = useMessages();

  const otherParticipant = getOtherParticipant(conversation, currentUserId);
  const unread = isUnread(conversation, currentUserId);

  const handleClick = () => {
    const url = getConversationUrl(conversation.id, user?.type);
    navigate(url);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        p-4 cursor-pointer transition-colors
        hover:bg-gray-50
        ${unread ? "bg-blue-50/50" : ""}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Unread indicator */}
        <div className="shrink-0 w-2 pt-4">
          {unread && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`font-medium text-gray-900 truncate ${unread ? "font-semibold" : ""}`}
              >
                {otherParticipant?.name || "Unknown"}
              </span>
              {conversation.isPinned && (
                <Pin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              {conversation.isStarred && (
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              )}
            </div>
            <Timestamp
              date={conversation.lastMessage?.timestamp}
              className={`text-xs shrink-0 ${unread ? "font-medium text-blue-600" : ""}`}
            />
          </div>

          {/* Subject */}
          <p
            className={`text-sm text-gray-900 truncate mb-1 ${unread ? "font-medium" : ""}`}
          >
            {conversation.subject}
          </p>

          {/* Preview */}
          <p className="text-sm text-gray-500 truncate mb-2">
            {truncateText(conversation.lastMessage?.preview, 80)}
          </p>

          {/* Footer row */}
          <div className="flex items-center gap-2 flex-wrap">
            <MessageBadge type={conversation.lastMessage?.type} size="xs" />
            <ContextTag context={conversation.context} size="xs" />
            {conversation.hasAttachments && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <Paperclip className="w-3 h-3 mr-1" />
                Attachments
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageListItem;
