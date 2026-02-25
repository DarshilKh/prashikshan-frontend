/**
 * AdminMessages Page
 *
 * Admin messaging system with:
 * 1. Broadcast announcements (existing)
 * 2. Direct messages to individual users (NEW)
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Users,
  GraduationCap,
  Building2,
  Megaphone,
  Clock,
  CheckCircle,
  Eye,
  Search,
  Trash2,
  AlertCircle,
  Mail,
  MessageSquare,
  ChevronLeft,
  Plus,
  X,
  Paperclip,
  MoreVertical,
  User,
  Shield,
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
// MOCK DATA
// ============================================
const mockAdminUser = {
  id: "admin_001",
  type: SENDER_TYPES.ADMIN,
  name: "Platform Admin",
};

const mockBroadcasts = [
  {
    id: "1",
    subject: "Platform Maintenance - January 25th",
    body: "We will be performing scheduled maintenance on January 25th from 2:00 AM to 6:00 AM IST.",
    audience: "all",
    audienceLabel: "All Users",
    audienceCount: 2450,
    sentAt: "2024-01-18T10:00:00Z",
    openRate: 68,
  },
  {
    id: "2",
    subject: "New Feature: Application Tracking",
    body: "We are excited to announce our new application tracking feature.",
    audience: "students",
    audienceLabel: "Students",
    audienceCount: 1850,
    sentAt: "2024-01-15T14:30:00Z",
    openRate: 72,
  },
  {
    id: "3",
    subject: "Updated Company Posting Guidelines",
    body: "Please review the updated guidelines for posting internship opportunities.",
    audience: "industry",
    audienceLabel: "Companies",
    audienceCount: 320,
    sentAt: "2024-01-10T09:00:00Z",
    openRate: 85,
  },
];

const audienceOptions = [
  { id: "all", label: "All Users", icon: Users, count: 2450, color: "blue" },
  {
    id: "students",
    label: "Students",
    icon: GraduationCap,
    count: 1850,
    color: "green",
  },
  {
    id: "faculty",
    label: "Faculty",
    icon: Users,
    count: 280,
    color: "purple",
  },
  {
    id: "industry",
    label: "Companies",
    icon: Building2,
    count: 320,
    color: "amber",
  },
];

// Mock users for direct messaging
const mockAllUsers = [
  {
    id: "student_001",
    name: "Aarav Sharma",
    type: SENDER_TYPES.STUDENT,
    role: "Student",
    email: "aarav@university.edu",
    detail: "B.Tech CSE, 3rd Year",
  },
  {
    id: "student_002",
    name: "Priya Patel",
    type: SENDER_TYPES.STUDENT,
    role: "Student",
    email: "priya.p@university.edu",
    detail: "B.Tech CSE, 3rd Year",
  },
  {
    id: "faculty_001",
    name: "Dr. Priya Mehta",
    type: SENDER_TYPES.FACULTY,
    role: "Faculty",
    email: "priya.mehta@university.edu",
    detail: "Computer Science Dept",
  },
  {
    id: "company_001",
    name: "TechNova Solutions",
    type: SENDER_TYPES.INDUSTRY,
    role: "Company",
    email: "hr@technova.com",
    detail: "Technology",
  },
  {
    id: "company_002",
    name: "WebCraft Studios",
    type: SENDER_TYPES.INDUSTRY,
    role: "Company",
    email: "hiring@webcraft.com",
    detail: "Web Development",
  },
];

// ============================================
// STATS CARD
// ============================================
function StatsCard({ title, value, subtitle, icon: Icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
    purple:
      "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
    amber:
      "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="bg-[rgb(var(--surface))] rounded-xl border border-[rgb(var(--border))] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[rgb(var(--muted))]">{title}</p>
          <p className="text-2xl font-bold text-[rgb(var(--foreground))] mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-[rgb(var(--muted))] mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPOSE BROADCAST
// ============================================
function ComposeBroadcast({ onSend }) {
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const selectedAudienceInfo = audienceOptions.find(
    (a) => a.id === selectedAudience,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onSend?.({ audience: selectedAudience, subject, body });
    setSubject("");
    setBody("");
    setIsSending(false);
  };

  return (
    <div className="bg-[rgb(var(--surface))] rounded-xl border border-[rgb(var(--border))] overflow-hidden">
      <div className="px-6 py-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]">
        <h2 className="text-lg font-semibold text-[rgb(var(--foreground))] flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-blue-600" />
          Compose Broadcast
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 border-b border-[rgb(var(--border))]">
          <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-3">
            Select Audience
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {audienceOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedAudience === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedAudience(option.id)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                      : "border-[rgb(var(--border))] hover:border-[rgb(var(--muted))]"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <Icon
                    className={`w-6 h-6 mb-2 ${isSelected ? "text-blue-600" : "text-[rgb(var(--muted))]"}`}
                  />
                  <p className="text-sm font-medium">{option.label}</p>
                  <p className="text-xs text-[rgb(var(--muted))] mt-1">
                    {option.count.toLocaleString()} recipients
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-b border-[rgb(var(--border))]">
          <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter a clear, descriptive subject..."
            className="w-full px-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="px-6 py-4 border-b border-[rgb(var(--border))]">
          <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your broadcast message..."
            rows={8}
            className="w-full px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="px-6 py-4 bg-[rgb(var(--background))] flex items-center justify-between">
          <p className="text-sm text-[rgb(var(--muted))]">
            Sending to{" "}
            <span className="font-semibold">
              {selectedAudienceInfo?.count.toLocaleString()}
            </span>{" "}
            {selectedAudienceInfo?.label.toLowerCase()}
          </p>
          <button
            type="submit"
            disabled={isSending || !subject.trim() || !body.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send Broadcast"}
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================
// BROADCAST HISTORY
// ============================================
function BroadcastHistory({ broadcasts, onDelete }) {
  return (
    <div className="bg-[rgb(var(--surface))] rounded-xl border border-[rgb(var(--border))] overflow-hidden">
      <div className="px-6 py-4 border-b border-[rgb(var(--border))]">
        <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">
          Broadcast History
        </h2>
      </div>
      <div className="divide-y divide-[rgb(var(--border))]">
        {broadcasts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Mail className="w-12 h-12 text-[rgb(var(--muted))] mx-auto mb-3 opacity-50" />
            <p className="text-[rgb(var(--muted))]">No broadcasts yet</p>
          </div>
        ) : (
          broadcasts.map((broadcast) => (
            <div
              key={broadcast.id}
              className="p-4 hover:bg-[rgb(var(--background))]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[rgb(var(--foreground))] truncate">
                    {broadcast.subject}
                  </h3>
                  <p className="text-sm text-[rgb(var(--muted))] truncate mt-1">
                    {broadcast.body}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[rgb(var(--muted))]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {broadcast.audienceCount.toLocaleString()} (
                      {broadcast.audienceLabel})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTimestamp(broadcast.sentAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {broadcast.openRate}% opened
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onDelete?.(broadcast.id)}
                  className="p-2 text-[rgb(var(--muted))] hover:text-red-500 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPOSE DIRECT MESSAGE MODAL
// ============================================
function ComposeDirectModal({ isOpen, onClose }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const filteredUsers = mockAllUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "students" && user.type === SENDER_TYPES.STUDENT) ||
      (roleFilter === "faculty" && user.type === SENDER_TYPES.FACULTY) ||
      (roleFilter === "industry" && user.type === SENDER_TYPES.INDUSTRY);

    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (type) => {
    if (type === SENDER_TYPES.STUDENT) return GraduationCap;
    if (type === SENDER_TYPES.FACULTY) return User;
    if (type === SENDER_TYPES.INDUSTRY) return Building2;
    return User;
  };

  const getRoleColor = (type) => {
    if (type === SENDER_TYPES.STUDENT) return "bg-blue-500";
    if (type === SENDER_TYPES.FACULTY) return "bg-purple-500";
    if (type === SENDER_TYPES.INDUSTRY) return "bg-emerald-500";
    return "bg-gray-500";
  };

  const handleSend = async () => {
    if (!selectedUser || !subject.trim() || !body.trim()) return;
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSending(false);
    setSelectedUser(null);
    setSubject("");
    setBody("");
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
          <h2 className="text-lg font-semibold text-[rgb(var(--foreground))] flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Direct Message
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
          {/* User Selector */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
              To
            </label>
            {selectedUser ? (
              <div className="flex items-center justify-between p-3 bg-[rgb(var(--background))] rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${getRoleColor(selectedUser.type)} flex items-center justify-center text-white text-sm`}
                  >
                    {getInitials(selectedUser.name)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[rgb(var(--foreground))]">
                      {selectedUser.name}
                    </span>
                    <p className="text-xs text-[rgb(var(--muted))]">
                      {selectedUser.role} • {selectedUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Role Filter */}
                <div className="flex gap-2">
                  {[
                    { id: "all", label: "All" },
                    { id: "students", label: "Students" },
                    { id: "faculty", label: "Faculty" },
                    { id: "industry", label: "Companies" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setRoleFilter(f.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                        roleFilter === f.id
                          ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600"
                          : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--background))]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* User List */}
                <div className="max-h-48 overflow-y-auto border border-[rgb(var(--border))] rounded-xl divide-y divide-[rgb(var(--border))]">
                  {filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.type);
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          setSelectedUser(user);
                          setSearchQuery("");
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-[rgb(var(--background))] flex items-center gap-3"
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${getRoleColor(user.type)} flex items-center justify-center text-white text-sm`}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[rgb(var(--foreground))] truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-[rgb(var(--muted))] truncate">
                            {user.role} • {user.detail}
                          </p>
                        </div>
                        <RoleIcon
                          size={14}
                          className="text-[rgb(var(--muted))] shrink-0"
                        />
                      </button>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <p className="px-4 py-6 text-sm text-[rgb(var(--muted))] text-center">
                      No users found
                    </p>
                  )}
                </div>
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
              !selectedUser || !subject.trim() || !body.trim() || isSending
            }
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
// DIRECT MESSAGES INBOX
// ============================================
function DirectMessagesInbox() {
  const {
    conversations,
    isLoading,
    unreadCount,
    user,
    fetchMessages,
    currentConversation,
    messages,
    isLoadingMessages,
    sendMessage,
    clearCurrentConversation,
  } = useMessagesContext();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const other = getOtherParticipant(conv, user?.id);
    return (
      other?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSelectConversation = (id) => {
    setSelectedConversation(id);
    fetchMessages(id);
  };

  const handleBack = () => {
    setSelectedConversation(null);
    clearCurrentConversation();
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;
    setIsSending(true);
    try {
      await sendMessage(selectedConversation, {
        body: replyText,
        type: "GENERAL",
      });
      setReplyText("");
    } finally {
      setIsSending(false);
    }
  };

  const getRoleColor = (type) => {
    if (type === SENDER_TYPES.STUDENT) return "bg-blue-500";
    if (type === SENDER_TYPES.FACULTY) return "bg-purple-500";
    if (type === SENDER_TYPES.INDUSTRY) return "bg-emerald-500";
    return "bg-gray-500";
  };

  const getRoleBadge = (type) => {
    const config = {
      [SENDER_TYPES.STUDENT]: {
        label: "Student",
        class:
          "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
      },
      [SENDER_TYPES.FACULTY]: {
        label: "Faculty",
        class:
          "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
      },
      [SENDER_TYPES.INDUSTRY]: {
        label: "Company",
        class:
          "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      },
    };
    return config[type] || { label: "User", class: "bg-gray-100 text-gray-600" };
  };

  return (
    <>
      <div className="bg-[rgb(var(--surface))] rounded-xl border border-[rgb(var(--border))] overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversation List */}
          <div
            className={`w-full md:w-80 border-r border-[rgb(var(--border))] flex flex-col ${
              selectedConversation ? "hidden md:flex" : "flex"
            }`}
          >
            {/* List Header */}
            <div className="p-4 border-b border-[rgb(var(--border))]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[rgb(var(--foreground))]">
                  Direct Messages
                </h3>
                <button
                  onClick={() => setShowCompose(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  <Plus size={14} />
                  New
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-[rgb(var(--muted))] mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-[rgb(var(--foreground))] font-medium">
                    No conversations
                  </p>
                  <p className="text-xs text-[rgb(var(--muted))] mt-1">
                    Start a direct message with any user
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[rgb(var(--border))]">
                  {filteredConversations.map((conv) => {
                    const other = getOtherParticipant(conv, user?.id);
                    const unread = isUnread(conv, user?.id);
                    const badge = getRoleBadge(other?.type);
                    const isActive = selectedConversation === conv.id;

                    return (
                      <div
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className={`p-3 cursor-pointer hover:bg-[rgb(var(--background))] transition-colors ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-500/10 border-l-2 border-blue-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${getRoleColor(other?.type)} flex items-center justify-center text-white text-xs font-medium shrink-0`}
                          >
                            {getInitials(other?.name || "U")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span
                                className={`text-sm truncate ${unread ? "font-semibold text-[rgb(var(--foreground))]" : "font-medium text-[rgb(var(--foreground))]"}`}
                              >
                                {other?.name}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full ${badge.class}`}
                              >
                                {badge.label}
                              </span>
                            </div>
                            <p className="text-xs text-[rgb(var(--muted))] truncate">
                              {conv.subject}
                            </p>
                            <p className="text-xs text-[rgb(var(--muted))] truncate mt-0.5">
                              {truncateText(
                                conv.lastMessage?.preview,
                                40,
                              )}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] text-[rgb(var(--muted))]">
                              {formatTimestamp(
                                conv.lastMessage?.timestamp,
                              )}
                            </span>
                            {unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Thread View */}
          <div
            className={`flex-1 flex flex-col ${
              selectedConversation ? "flex" : "hidden md:flex"
            }`}
          >
            {selectedConversation && currentConversation ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-[rgb(var(--border))] flex items-center gap-3">
                  <button
                    onClick={handleBack}
                    className="md:hidden p-2 -ml-2 rounded-lg hover:bg-[rgb(var(--background))]"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[rgb(var(--foreground))]">
                      {getOtherParticipant(currentConversation, user?.id)
                        ?.name}
                    </h3>
                    <p className="text-sm text-[rgb(var(--muted))]">
                      {currentConversation.subject}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isFromMe =
                        message.sender?.type === SENDER_TYPES.ADMIN;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-4 ${
                              isFromMe
                                ? "bg-blue-600 text-white rounded-br-md"
                                : "bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-bl-md"
                            }`}
                          >
                            {message.content?.subject && (
                              <p
                                className={`font-medium mb-2 text-sm ${isFromMe ? "text-white" : ""}`}
                              >
                                {message.content.subject}
                              </p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content?.body}
                            </p>

                            {message.attachments?.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-white/20">
                                {message.attachments.map((att) => (
                                  <span
                                    key={att.id}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs ${
                                      isFromMe
                                        ? "bg-white/20 text-white"
                                        : "bg-[rgb(var(--surface))]"
                                    }`}
                                  >
                                    <Paperclip size={12} />
                                    {att.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            <p
                              className={`text-xs mt-2 ${isFromMe ? "text-white/70" : "text-[rgb(var(--muted))]"}`}
                            >
                              {formatTimestamp(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Reply */}
                <div className="p-4 border-t border-[rgb(var(--border))]">
                  <div className="flex gap-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      rows={2}
                      className="flex-1 px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          handleSendReply();
                        }
                      }}
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || isSending}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 self-end"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-[rgb(var(--muted))] mt-2">
                    Press Ctrl+Enter to send
                  </p>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-[rgb(var(--muted))] mx-auto mb-4 opacity-30" />
                  <p className="text-[rgb(var(--foreground))] font-medium">
                    Select a conversation
                  </p>
                  <p className="text-sm text-[rgb(var(--muted))] mt-1">
                    Or start a new direct message
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCompose && (
          <ComposeDirectModal
            isOpen={showCompose}
            onClose={() => setShowCompose(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================
// MAIN ADMIN MESSAGES COMPONENT
// ============================================
function AdminMessagesContent() {
  const [activeTab, setActiveTab] = useState("direct");
  const [broadcasts, setBroadcasts] = useState(mockBroadcasts);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSendBroadcast = (data) => {
    const newBroadcast = {
      id: Date.now().toString(),
      subject: data.subject,
      body: data.body,
      audience: data.audience,
      audienceLabel:
        audienceOptions.find((a) => a.id === data.audience)?.label || "Unknown",
      audienceCount:
        audienceOptions.find((a) => a.id === data.audience)?.count || 0,
      sentAt: new Date().toISOString(),
      openRate: 0,
    };
    setBroadcasts([newBroadcast, ...broadcasts]);
    setShowSuccess(true);
    setActiveTab("history");
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleDeleteBroadcast = (id) => {
    if (window.confirm("Delete this broadcast?")) {
      setBroadcasts(broadcasts.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="min-h-full bg-[rgb(var(--background))] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            Platform Messages
          </h1>
          <p className="text-[rgb(var(--muted))] mt-1">
            Send direct messages and broadcast announcements
          </p>
        </div>

        {/* Success Banner */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 dark:text-green-200">
                Broadcast sent successfully!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Direct Messages"
            value="12"
            subtitle="Active conversations"
            icon={MessageSquare}
            color="blue"
          />
          <StatsCard
            title="Broadcasts Sent"
            value="24"
            subtitle="All time"
            icon={Megaphone}
            color="green"
          />
          <StatsCard
            title="Total Recipients"
            value="15,680"
            subtitle="Messages delivered"
            icon={Users}
            color="purple"
          />
          <StatsCard
            title="Avg Open Rate"
            value="74%"
            subtitle="Across broadcasts"
            icon={Eye}
            color="amber"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("direct")}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === "direct"
                ? "bg-blue-600 text-white"
                : "bg-[rgb(var(--surface))] text-[rgb(var(--muted))] hover:bg-[rgb(var(--background))] border border-[rgb(var(--border))]"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Direct Messages
          </button>
          <button
            onClick={() => setActiveTab("compose")}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === "compose"
                ? "bg-blue-600 text-white"
                : "bg-[rgb(var(--surface))] text-[rgb(var(--muted))] hover:bg-[rgb(var(--background))] border border-[rgb(var(--border))]"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Broadcast
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-[rgb(var(--surface))] text-[rgb(var(--muted))] hover:bg-[rgb(var(--background))] border border-[rgb(var(--border))]"
            }`}
          >
            <Clock className="w-4 h-4" />
            History
            <span
              className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                activeTab === "history"
                  ? "bg-white/20"
                  : "bg-[rgb(var(--background))]"
              }`}
            >
              {broadcasts.length}
            </span>
          </button>
        </div>

        {/* Content */}
        {activeTab === "direct" && <DirectMessagesInbox />}
        {activeTab === "compose" && (
          <ComposeBroadcast onSend={handleSendBroadcast} />
        )}
        {activeTab === "history" && (
          <BroadcastHistory
            broadcasts={broadcasts}
            onDelete={handleDeleteBroadcast}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// EXPORT WITH PROVIDER
// ============================================
export function AdminMessages() {
  return (
    <MessagesProvider user={mockAdminUser}>
      <AdminMessagesContent />
    </MessagesProvider>
  );
}

export default AdminMessages;