/**
 * StudentInbox Page
 *
 * Main messages page for students.
 * Designed to work within the StudentLayout.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Search,
  Filter,
  ChevronLeft,
  Paperclip,
  Clock,
  Building2,
  GraduationCap,
  Bell,
  Star,
  Archive,
  MoreVertical,
  Send,
  AlertCircle,
  CheckCircle,
  Lock,
  X,
} from "lucide-react";

import {
  MessagesProvider,
  useMessagesContext,
} from "../context/MessagesContext";
import { useConversation } from "../hooks/useConversation";
import { SENDER_TYPES, MESSAGE_TYPES } from "../config/messageTypes";
import {
  formatTimestamp,
  truncateText,
  getInitials,
} from "../utils/formatters";
import { getOtherParticipant, isUnread } from "../utils/helpers";
import { ProfessionalBanner } from "../components/banners/ProfessionalBanner";

// ============================================
// MOCK USER - Replace with actual auth
// ============================================
const getMockUser = () => ({
  id: "student_001",
  type: SENDER_TYPES.STUDENT,
  name: "Aarav Sharma",
  email: "aarav@university.edu",
});

// ============================================
// INBOX LIST COMPONENT
// ============================================
function InboxList({ onSelectConversation, selectedId }) {
  const { conversations, isLoading, filters, setFilters, unreadCount, user } =
    useMessagesContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filterTabs = [
    { id: "all", label: "All", count: conversations.length },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "industry", label: "Companies", icon: Building2 },
    { id: "academic", label: "Faculty", icon: GraduationCap },
  ];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);

    const newFilters = { ...filters };
    switch (filterId) {
      case "unread":
        newFilters.unreadOnly = true;
        newFilters.type = null;
        break;
      case "industry":
        newFilters.unreadOnly = false;
        newFilters.type = "INDUSTRY";
        break;
      case "academic":
        newFilters.unreadOnly = false;
        newFilters.type = "ACADEMIC";
        break;
      default:
        newFilters.unreadOnly = false;
        newFilters.type = null;
    }
    setFilters(newFilters);
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const other = getOtherParticipant(conv, user?.id);
    return (
      conv.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      other?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.context?.internshipTitle
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="h-full flex flex-col bg-[rgb(var(--surface))]">
      {/* Header */}
      <div className="p-4 border-b border-[rgb(var(--border))]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-[rgb(var(--foreground))]">
            Messages
          </h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeFilter === tab.id
                  ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                  : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--background))]"
              }`}
            >
              {tab.icon && <tab.icon size={14} />}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    activeFilter === tab.id
                      ? "bg-blue-200 dark:bg-blue-500/30"
                      : "bg-[rgb(var(--background))]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-[rgb(var(--muted))]">Loading messages...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="w-12 h-12 text-[rgb(var(--muted))] mx-auto mb-3 opacity-50" />
            <p className="text-[rgb(var(--foreground))] font-medium mb-1">
              No messages yet
            </p>
            <p className="text-sm text-[rgb(var(--muted))]">
              Messages from companies and faculty will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[rgb(var(--border))]">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedId === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// CONVERSATION ITEM COMPONENT
// ============================================
function ConversationItem({
  conversation,
  isSelected,
  onClick,
  currentUserId,
}) {
  const otherParticipant = getOtherParticipant(conversation, currentUserId);
  const unread = isUnread(conversation, currentUserId);

  const getTypeIcon = () => {
    if (conversation.type === "INDUSTRY") return Building2;
    if (conversation.type === "ACADEMIC") return GraduationCap;
    return Bell;
  };

  const TypeIcon = getTypeIcon();

  const getTypeColor = () => {
    if (conversation.type === "INDUSTRY") return "bg-purple-500";
    if (conversation.type === "ACADEMIC") return "bg-blue-500";
    return "bg-gray-500";
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ backgroundColor: "rgba(var(--background), 0.5)" }}
      className={`p-4 cursor-pointer transition-colors ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-500/10 border-l-2 border-blue-500"
          : ""
      } ${unread ? "bg-blue-50/50 dark:bg-blue-500/5" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full ${getTypeColor()} flex items-center justify-center text-white font-medium text-sm`}
          >
            {getInitials(otherParticipant?.name || "U")}
          </div>
          {unread && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-[rgb(var(--surface))]" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-sm font-medium text-[rgb(var(--foreground))] truncate ${unread ? "font-semibold" : ""}`}
            >
              {otherParticipant?.name || "Unknown"}
            </span>
            <span
              className={`text-xs ${unread ? "text-blue-600 dark:text-blue-400 font-medium" : "text-[rgb(var(--muted))]"}`}
            >
              {formatTimestamp(conversation.lastMessage?.timestamp)}
            </span>
          </div>

          <p
            className={`text-sm truncate mb-1.5 ${unread ? "text-[rgb(var(--foreground))] font-medium" : "text-[rgb(var(--muted))]"}`}
          >
            {conversation.subject}
          </p>

          <p className="text-xs text-[rgb(var(--muted))] truncate mb-2">
            {truncateText(conversation.lastMessage?.preview, 60)}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                conversation.type === "INDUSTRY"
                  ? "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                  : conversation.type === "ACADEMIC"
                    ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    : "bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400"
              }`}
            >
              <TypeIcon size={10} />
              {MESSAGE_TYPES[conversation.lastMessage?.type]?.label ||
                "Message"}
            </span>

            {conversation.context?.internshipTitle && (
              <span className="text-xs text-[rgb(var(--muted))] truncate max-w-[150px]">
                {conversation.context.internshipTitle}
              </span>
            )}

            {conversation.hasAttachments && (
              <Paperclip size={12} className="text-[rgb(var(--muted))]" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// THREAD VIEW COMPONENT
// ============================================
function ThreadView({ conversationId, onBack }) {
  const {
    conversation,
    messages,
    isLoading,
    canReply,
    canReplyReason,
    isSystemMessage,
    applicationInfo,
    sendReply,
  } = useConversation(conversationId);

  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showProfessionalBanner, setShowProfessionalBanner] = useState(true);

  const handleSendReply = async () => {
    if (!replyText.trim() || !canReply) return;

    setIsSending(true);
    try {
      await sendReply(replyText);
      setReplyText("");
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[rgb(var(--surface))]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[rgb(var(--muted))]">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center bg-[rgb(var(--surface))]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-[rgb(var(--muted))] mx-auto mb-3" />
          <p className="text-[rgb(var(--foreground))] font-medium">
            Conversation not found
          </p>
          <button
            onClick={onBack}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to inbox
          </button>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant(conversation, "student_001");

  return (
    <div className="h-full flex flex-col bg-[rgb(var(--surface))]">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-[rgb(var(--foreground))] truncate">
              {otherParticipant?.name}
            </h2>
            <p className="text-sm text-[rgb(var(--muted))] truncate">
              {conversation.subject}
            </p>
          </div>
          <button className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Context Info */}
        <div className="flex items-center gap-2 flex-wrap">
          {conversation.context?.internshipTitle && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[rgb(var(--background))] rounded-lg text-xs text-[rgb(var(--muted))]">
              <Building2 size={12} />
              {conversation.context.internshipTitle}
              {conversation.context.companyName &&
                ` • ${conversation.context.companyName}`}
            </span>
          )}

          {applicationInfo && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                applicationInfo.statusColor === "green"
                  ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                  : applicationInfo.statusColor === "yellow"
                    ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                    : applicationInfo.statusColor === "red"
                      ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                      : applicationInfo.statusColor === "blue"
                        ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                        : "bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400"
              }`}
            >
              Status: {applicationInfo.statusLabel}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {/* Reply Section */}
      <div className="flex-shrink-0 border-t border-[rgb(var(--border))]">
        {/* Professional Banner */}
        {canReply && showProfessionalBanner && (
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-500/10 border-b border-blue-100 dark:border-blue-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Please keep your communication professional and relevant to the
                internship.
              </p>
            </div>
            <button
              onClick={() => setShowProfessionalBanner(false)}
              className="text-blue-400 hover:text-blue-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {canReply ? (
          <div className="p-4">
            <div className="flex gap-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                rows={3}
                className="flex-1 px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <button className="inline-flex items-center gap-2 px-3 py-2 text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))] rounded-lg">
                <Paperclip size={16} />
                Attach
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim() || isSending}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 dark:bg-amber-500/10">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Reply not available
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  {isSystemMessage
                    ? "This is a system notification and cannot be replied to."
                    : canReplyReason ||
                      "You cannot reply to this conversation."}
                </p>
                {applicationInfo && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                    Application Status:{" "}
                    <span className="font-medium">
                      {applicationInfo.statusLabel}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// MESSAGE BUBBLE COMPONENT
// ============================================
function MessageBubble({ message }) {
  const isFromMe = message.sender?.type === SENDER_TYPES.STUDENT;

  return (
    <div className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isFromMe ? "order-2" : "order-1"}`}>
        {/* Sender Info */}
        {!isFromMe && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium">
              {getInitials(message.sender?.name || "U")}
            </div>
            <div>
              <p className="text-sm font-medium text-[rgb(var(--foreground))]">
                {message.sender?.name}
              </p>
              <p className="text-xs text-[rgb(var(--muted))]">
                {message.sender?.role}
              </p>
            </div>
          </div>
        )}

        {/* Message Content */}
        <div
          className={`rounded-2xl p-4 ${
            isFromMe
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-bl-md"
          }`}
        >
          {message.content?.subject && (
            <p
              className={`font-medium mb-2 ${isFromMe ? "text-white" : "text-[rgb(var(--foreground))]"}`}
            >
              {message.content.subject}
            </p>
          )}
          <p
            className={`text-sm whitespace-pre-wrap ${isFromMe ? "text-white/90" : "text-[rgb(var(--foreground))]"}`}
          >
            {message.content?.body}
          </p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/20">
              {message.attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.url}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                    isFromMe
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "bg-[rgb(var(--surface))] hover:bg-[rgb(var(--background))]"
                  }`}
                >
                  <Paperclip size={14} />
                  {att.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p
          className={`text-xs text-[rgb(var(--muted))] mt-1 ${isFromMe ? "text-right" : ""}`}
        >
          {formatTimestamp(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

// ============================================
// MAIN STUDENT INBOX COMPONENT
// ============================================
function StudentInboxContent({ threadId }) {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(
    threadId || null,
  );

  useEffect(() => {
    if (threadId) {
      setSelectedConversation(threadId);
    }
  }, [threadId]);

  const handleSelectConversation = (id) => {
    setSelectedConversation(id);
    navigate(`/student/messages/${id}`);
  };

  const handleBack = () => {
    setSelectedConversation(null);
    navigate("/student/messages");
  };

  // Mobile: Show either list or thread
  // Desktop: Show both side by side
  return (
    <div className="h-full flex bg-[rgb(var(--background))]">
      {/* Inbox List - Hidden on mobile when thread is selected */}
      <div
        className={`w-full md:w-96 md:border-r md:border-[rgb(var(--border))] flex-shrink-0 ${
          selectedConversation ? "hidden md:block" : "block"
        }`}
      >
        <InboxList
          onSelectConversation={handleSelectConversation}
          selectedId={selectedConversation}
        />
      </div>

      {/* Thread View or Empty State */}
      <div
        className={`flex-1 ${selectedConversation ? "block" : "hidden md:block"}`}
      >
        {selectedConversation ? (
          <ThreadView
            conversationId={selectedConversation}
            onBack={handleBack}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-[rgb(var(--surface))]">
            <div className="text-center">
              <Mail className="w-16 h-16 text-[rgb(var(--muted))] mx-auto mb-4 opacity-30" />
              <p className="text-[rgb(var(--foreground))] font-medium mb-1">
                Select a conversation
              </p>
              <p className="text-sm text-[rgb(var(--muted))]">
                Choose a message from the list to view
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// EXPORT WITH PROVIDER
// ============================================
export function StudentInbox({ threadId }) {
  const user = getMockUser();

  return (
    <MessagesProvider user={user}>
      <StudentInboxContent threadId={threadId} />
    </MessagesProvider>
  );
}

export default StudentInbox;
