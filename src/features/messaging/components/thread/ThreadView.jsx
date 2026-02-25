/**
 * ThreadView Component
 *
 * Full conversation thread display.
 */

import React from "react";
import ThreadHeader from "./ThreadHeader";
import MessageItem from "./MessageItem";
import ThreadActions from "./ThreadActions";
import { ComposeReply } from "../compose/ComposeReply";
import { ComposeDisabled } from "../compose/ComposeDisabled";
import { ThreadSkeleton } from "../shared/Skeleton";
import { useConversation } from "../../hooks/useConversation";
import { ProfessionalBanner } from "../banners/ProfessionalBanner";

export function ThreadView({ conversationId }) {
  const {
    conversation,
    messages,
    isLoading,
    error,
    canReply,
    canReplyReason,
    isSystemMessage,
    applicationInfo,
    sendReply,
  } = useConversation(conversationId);

  if (isLoading) {
    return <ThreadSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <a href="/messages" className="text-blue-600 hover:underline">
            Back to Inbox
          </a>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <ThreadHeader
        conversation={conversation}
        applicationInfo={applicationInfo}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      </div>

      {/* Compose/Reply area */}
      <div className="flex-shrink-0 border-t border-gray-200">
        {canReply ? (
          <>
            <ProfessionalBanner />
            <ComposeReply
              onSend={sendReply}
              conversationType={conversation.type}
            />
          </>
        ) : (
          <ComposeDisabled
            reason={canReplyReason}
            isSystemMessage={isSystemMessage}
            applicationInfo={applicationInfo}
          />
        )}
      </div>
    </div>
  );
}

export default ThreadView;
