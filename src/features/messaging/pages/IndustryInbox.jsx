/**
 * IndustryInbox Page
 *
 * Messages page for industry/company users.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Search,
  Plus,
  ChevronLeft,
  Paperclip,
  Users,
  MoreVertical,
  Send,
  X,
  Filter,
} from "lucide-react";

import {
  MessagesProvider,
  useMessagesContext,
} from "../context/MessagesContext";
import { useConversation } from "../hooks/useConversation";
import { SENDER_TYPES } from "../config/messageTypes";
import {
  formatTimestamp,
  truncateText,
  getInitials,
} from "../utils/formatters";
import { getOtherParticipant, isUnread } from "../utils/helpers";

// ============================================
// MOCK USER
// ============================================
const getMockUser = () => ({
  id: "company_001",
  type: SENDER_TYPES.INDUSTRY,
  name: "TechNova Solutions",
  email: "hr@technova.com",
  role: "HR Team",
});

// Mock applicants
const mockApplicants = [
  {
    id: "student_001",
    name: "Aarav Sharma",
    context: "AI/ML Intern",
    status: "Interview Scheduled",
  },
  {
    id: "student_002",
    name: "Priya Patel",
    context: "Frontend Developer",
    status: "Pending",
  },
  {
    id: "student_003",
    name: "Rahul Kumar",
    context: "Data Analyst",
    status: "Active Intern",
  },
];

// ============================================
// COMPOSE MODAL
// ============================================
function ComposeModal({ isOpen, onClose, applicants }) {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!selectedApplicant || !subject.trim() || !body.trim()) return;
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSending(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[rgb(var(--surface))] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-xl"
      >
        <div className="px-6 py-4 border-b border-[rgb(var(--border))] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">
            Message Applicant
          </h2>
          <button
            onClick={onClose}
            className="text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Applicant Selector */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
              To
            </label>
            <select
              value={selectedApplicant?.id || ""}
              onChange={(e) =>
                setSelectedApplicant(
                  applicants.find((a) => a.id === e.target.value),
                )
              }
              className="w-full px-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an applicant...</option>
              {applicants.map((applicant) => (
                <option key={applicant.id} value={applicant.id}>
                  {applicant.name} - {applicant.context}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
              className="w-full px-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={6}
              className="w-full px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[rgb(var(--border))] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[rgb(var(--muted))]"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={
              !selectedApplicant || !subject.trim() || !body.trim() || isSending
            }
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send"}
            <Send size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// INBOX LIST
// ============================================
function InboxList({ onSelectConversation, selectedId, onCompose }) {
  const { conversations, isLoading, unreadCount, user } = useMessagesContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const other = getOtherParticipant(conv, user?.id);
    return other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col bg-[rgb(var(--surface))]">
      <div className="p-4 border-b border-[rgb(var(--border))]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-[rgb(var(--foreground))]">
            Applicant Messages
          </h1>
          <button
            onClick={onCompose}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            New
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applicants..."
            className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          {["all", "applicants", "interns"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg capitalize ${
                filter === f
                  ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600"
                  : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--background))]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-[rgb(var(--muted))] mx-auto mb-3 opacity-50" />
            <p className="text-[rgb(var(--foreground))] font-medium">
              No messages
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[rgb(var(--border))]">
            {filteredConversations.map((conversation) => {
              const other = getOtherParticipant(conversation, user?.id);
              const unread = isUnread(conversation, user?.id);

              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`p-4 cursor-pointer hover:bg-[rgb(var(--background))] ${
                    selectedId === conversation.id
                      ? "bg-blue-50 dark:bg-blue-500/10 border-l-2 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                      {getInitials(other?.name || "U")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${unread ? "font-semibold" : ""}`}
                        >
                          {other?.name}
                        </span>
                        <span className="text-xs text-[rgb(var(--muted))]">
                          {formatTimestamp(conversation.lastMessage?.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-[rgb(var(--muted))] truncate">
                        {conversation.subject}
                      </p>
                    </div>
                    {unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// THREAD VIEW
// ============================================
function ThreadView({ conversationId, onBack }) {
  const { conversation, messages, isLoading, sendReply } =
    useConversation(conversationId);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    await sendReply(replyText);
    setReplyText("");
    setIsSending(false);
  };

  if (isLoading || !conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const other = getOtherParticipant(conversation, "company_001");

  return (
    <div className="h-full flex flex-col bg-[rgb(var(--surface))]">
      <div className="flex-shrink-0 p-4 border-b border-[rgb(var(--border))]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-[rgb(var(--background))]"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-semibold">{other?.name}</h2>
            <p className="text-sm text-[rgb(var(--muted))]">
              {conversation.subject}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender?.type === SENDER_TYPES.INDUSTRY ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.sender?.type === SENDER_TYPES.INDUSTRY
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-[rgb(var(--background))] border rounded-bl-md"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">
                {message.content?.body}
              </p>
              <p
                className={`text-xs mt-2 ${message.sender?.type === SENDER_TYPES.INDUSTRY ? "text-white/70" : "text-[rgb(var(--muted))]"}`}
              >
                {formatTimestamp(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 p-4 border-t border-[rgb(var(--border))]">
        <div className="flex gap-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            rows={2}
            className="flex-1 px-4 py-3 bg-[rgb(var(--background))] border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendReply}
            disabled={!replyText.trim() || isSending}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
function IndustryInboxContent({ threadId }) {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(
    threadId || null,
  );
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    if (threadId) setSelectedConversation(threadId);
  }, [threadId]);

  return (
    <>
      <div className="h-full flex bg-[rgb(var(--background))]">
        <div
          className={`w-full md:w-96 md:border-r flex-shrink-0 ${selectedConversation ? "hidden md:block" : "block"}`}
        >
          <InboxList
            onSelectConversation={(id) => {
              setSelectedConversation(id);
              navigate(`/industry/messages/${id}`);
            }}
            selectedId={selectedConversation}
            onCompose={() => setShowCompose(true)}
          />
        </div>

        <div
          className={`flex-1 ${selectedConversation ? "block" : "hidden md:block"}`}
        >
          {selectedConversation ? (
            <ThreadView
              conversationId={selectedConversation}
              onBack={() => {
                setSelectedConversation(null);
                navigate("/industry/messages");
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-[rgb(var(--surface))]">
              <div className="text-center">
                <Mail className="w-16 h-16 text-[rgb(var(--muted))] mx-auto mb-4 opacity-30" />
                <p className="font-medium">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCompose && (
          <ComposeModal
            isOpen={showCompose}
            onClose={() => setShowCompose(false)}
            applicants={mockApplicants}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function IndustryInbox({ threadId }) {
  return (
    <MessagesProvider user={getMockUser()}>
      <IndustryInboxContent threadId={threadId} />
    </MessagesProvider>
  );
}

export default IndustryInbox;
