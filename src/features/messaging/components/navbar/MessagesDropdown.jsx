/**
 * MessagesDropdown Component
 *
 * Quick preview dropdown for navbar.
 */

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import { useMessages } from "../../hooks/useMessages";
import { MessagesIcon } from "./MessagesIcon";
import { SenderInfo } from "../shared/SenderInfo";
import { Timestamp } from "../shared/Timestamp";
import { truncateText } from "../../utils/formatters";
import {
  getOtherParticipant,
  isUnread,
  getConversationUrl,
} from "../../utils/helpers";

export function MessagesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { conversations, unreadCount, user, isLoading } = useMessages();

  // Get recent conversations (max 5)
  const recentConversations = conversations.slice(0, 5);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConversationClick = (conversationId) => {
    const url = getConversationUrl(conversationId, user?.type);
    navigate(url);
    setIsOpen(false);
  };

  const handleViewAll = () => {
    const url = getConversationUrl("", user?.type).replace(/\/$/, "");
    navigate(url);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <MessagesIcon onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Messages</h3>
              {unreadCount > 0 && (
                <span className="text-sm text-blue-600">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          {/* Message list */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : recentConversations.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No messages yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentConversations.map((conversation) => {
                  const otherParticipant = getOtherParticipant(
                    conversation,
                    user?.id,
                  );
                  const unread = isUnread(conversation, user?.id);

                  return (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation.id)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${unread ? "bg-blue-50/50" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Unread dot */}
                        <div className="w-2 flex-shrink-0 pt-2">
                          {unread && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-sm font-medium text-gray-900 truncate ${unread ? "font-semibold" : ""}`}
                            >
                              {otherParticipant?.name}
                            </span>
                            <Timestamp
                              date={conversation.lastMessage?.timestamp}
                              className="text-xs"
                            />
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {truncateText(
                              conversation.lastMessage?.preview,
                              60,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100">
            <button
              onClick={handleViewAll}
              className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all messages
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagesDropdown;
