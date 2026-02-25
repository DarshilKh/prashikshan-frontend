/**
 * FacultyInbox Page
 *
 * Messages page for faculty members.
 * Includes ability to initiate conversations with assigned students.
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
  Building2,
  GraduationCap,
  Bell,
  MoreVertical,
  Send,
  AlertCircle,
  X,
  Users,
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
import { getStudentsForFaculty } from "../data/mockRelationships";

// ============================================
// MOCK USER - Replace with actual auth
// ============================================
const getMockUser = () => ({
  id: "faculty_001",
  type: SENDER_TYPES.FACULTY,
  name: "Dr. Priya Mehta",
  email: "priya.mehta@university.edu",
  department: "Computer Science",
});

// ============================================
// COMPOSE NEW MESSAGE MODAL
// ============================================
function ComposeModal({ isOpen, onClose, students }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter((s) =>
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSend = async () => {
    if (!selectedStudent || !subject.trim() || !body.trim()) return;

    setIsSending(true);
    // TODO: Implement actual send
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
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[rgb(var(--surface))] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-xl"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgb(var(--border))] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">
            New Message
          </h2>
          <button
            onClick={onClose}
            className="text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Student Selector */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
              To
            </label>
            {selectedStudent ? (
              <div className="flex items-center justify-between p-3 bg-[rgb(var(--background))] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                    {getInitials(selectedStudent.studentName)}
                  </div>
                  <span className="text-sm text-[rgb(var(--foreground))]">
                    {selectedStudent.studentName}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                    {filteredStudents.map((student) => (
                      <button
                        key={student.studentId}
                        onClick={() => {
                          setSelectedStudent(student);
                          setSearchQuery("");
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-[rgb(var(--background))] flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                          {getInitials(student.studentName)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[rgb(var(--foreground))]">
                            {student.studentName}
                          </p>
                          <p className="text-xs text-[rgb(var(--muted))]">
                            {student.internshipTitle || "Mentee"}
                          </p>
                        </div>
                      </button>
                    ))}
                    {filteredStudents.length === 0 && (
                      <p className="px-4 py-3 text-sm text-[rgb(var(--muted))]">
                        No students found
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgb(var(--border))] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={
              !selectedStudent || !subject.trim() || !body.trim() || isSending
            }
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? "Sending..." : "Send Message"}
            <Send size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// INBOX LIST COMPONENT
// ============================================
function InboxList({ onSelectConversation, selectedId, onCompose }) {
  const { conversations, isLoading, unreadCount, user } = useMessagesContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const other = getOtherParticipant(conv, user?.id);
    return (
      conv.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      other?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <button
            onClick={onCompose}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            New
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-[rgb(var(--muted))] mx-auto mb-3 opacity-50" />
            <p className="text-[rgb(var(--foreground))] font-medium mb-1">
              No messages
            </p>
            <p className="text-sm text-[rgb(var(--muted))]">
              Start a conversation with your students
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
// CONVERSATION ITEM (Same as Student)
// ============================================
function ConversationItem({
  conversation,
  isSelected,
  onClick,
  currentUserId,
}) {
  const otherParticipant = getOtherParticipant(conversation, currentUserId);
  const unread = isUnread(conversation, currentUserId);

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer hover:bg-[rgb(var(--background))] transition-colors ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-500/10 border-l-2 border-blue-500"
          : ""
      } ${unread ? "bg-blue-50/50 dark:bg-blue-500/5" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
            {getInitials(otherParticipant?.name || "U")}
          </div>
          {unread && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-[rgb(var(--surface))]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-sm font-medium text-[rgb(var(--foreground))] truncate ${unread ? "font-semibold" : ""}`}
            >
              {otherParticipant?.name || "Unknown"}
            </span>
            <span className="text-xs text-[rgb(var(--muted))]">
              {formatTimestamp(conversation.lastMessage?.timestamp)}
            </span>
          </div>
          <p
            className={`text-sm truncate ${unread ? "text-[rgb(var(--foreground))]" : "text-[rgb(var(--muted))]"}`}
          >
            {conversation.subject}
          </p>
          <p className="text-xs text-[rgb(var(--muted))] truncate mt-1">
            {truncateText(conversation.lastMessage?.preview, 50)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// THREAD VIEW (Similar to Student)
// ============================================
function ThreadView({ conversationId, onBack }) {
  const { conversation, messages, isLoading, sendReply } =
    useConversation(conversationId);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      await sendReply(replyText);
      setReplyText("");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || !conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant(conversation, "faculty_001");

  return (
    <div className="h-full flex flex-col bg-[rgb(var(--surface))]">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-[rgb(var(--border))]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">
              {otherParticipant?.name}
            </h2>
            <p className="text-sm text-[rgb(var(--muted))]">
              {conversation.subject}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender?.type === SENDER_TYPES.FACULTY ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.sender?.type === SENDER_TYPES.FACULTY
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-bl-md"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">
                {message.content?.body}
              </p>
              <p
                className={`text-xs mt-2 ${message.sender?.type === SENDER_TYPES.FACULTY ? "text-white/70" : "text-[rgb(var(--muted))]"}`}
              >
                {formatTimestamp(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Reply */}
      <div className="flex-shrink-0 p-4 border-t border-[rgb(var(--border))]">
        <div className="flex gap-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            rows={2}
            className="flex-1 px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendReply}
            disabled={!replyText.trim() || isSending}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN FACULTY INBOX COMPONENT
// ============================================
function FacultyInboxContent({ threadId }) {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(
    threadId || null,
  );
  const [showCompose, setShowCompose] = useState(false);
  const { user } = useMessagesContext();

  const students = getStudentsForFaculty(user?.id);

  useEffect(() => {
    if (threadId) setSelectedConversation(threadId);
  }, [threadId]);

  const handleSelectConversation = (id) => {
    setSelectedConversation(id);
    navigate(`/faculty/messages/${id}`);
  };

  const handleBack = () => {
    setSelectedConversation(null);
    navigate("/faculty/messages");
  };

  return (
    <>
      <div className="h-full flex bg-[rgb(var(--background))]">
        <div
          className={`w-full md:w-96 md:border-r md:border-[rgb(var(--border))] flex-shrink-0 ${
            selectedConversation ? "hidden md:block" : "block"
          }`}
        >
          <InboxList
            onSelectConversation={handleSelectConversation}
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
              onBack={handleBack}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-[rgb(var(--surface))]">
              <div className="text-center">
                <Mail className="w-16 h-16 text-[rgb(var(--muted))] mx-auto mb-4 opacity-30" />
                <p className="text-[rgb(var(--foreground))] font-medium">
                  Select a conversation
                </p>
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
            students={students}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function FacultyInbox({ threadId }) {
  const user = getMockUser();

  return (
    <MessagesProvider user={user}>
      <FacultyInboxContent threadId={threadId} />
    </MessagesProvider>
  );
}

export default FacultyInbox;
