/**
 * MessageItem Component
 *
 * Single message in a thread (email-style, not chat bubble).
 */

import React from "react";
import { SenderInfo } from "../shared/SenderInfo";
import { MessageBadge } from "../shared/MessageBadge";
import { Timestamp } from "../shared/Timestamp";
import MessageAttachments from "./MessageAttachments";

export function MessageItem({ message }) {
  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Message header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <SenderInfo sender={message.sender} size="sm" />
              <MessageBadge type={message.type} size="xs" />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 ml-11">
              <span>To: You</span>
              <span>•</span>
              <Timestamp
                date={message.createdAt}
                format="full"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Message body */}
      <div className="px-6 py-4">
        {message.content.subject && (
          <h3 className="font-medium text-gray-900 mb-3">
            {message.content.subject}
          </h3>
        )}

        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
          {message.content.body}
        </div>
      </div>

      {/* Attachments */}
      {message.attachments && message.attachments.length > 0 && (
        <MessageAttachments attachments={message.attachments} />
      )}
    </div>
  );
}

export default MessageItem;
