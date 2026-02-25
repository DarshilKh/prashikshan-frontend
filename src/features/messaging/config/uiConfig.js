/**
 * UI Configuration
 *
 * Labels, strings, colors, and other UI-related constants.
 */

export const UI_LABELS = {
  // Page titles
  INBOX_TITLE: "Messages",
  COMPOSE_TITLE: "New Message",
  THREAD_TITLE: "Conversation",

  // Admin-specific titles
  ADMIN_PAGE_TITLE: "Platform Messages",
  ADMIN_PAGE_DESC: "Send direct messages and broadcast announcements",
  ADMIN_DIRECT_TITLE: "Direct Messages",
  ADMIN_BROADCAST_TITLE: "Compose Broadcast",
  ADMIN_HISTORY_TITLE: "Broadcast History",
  ADMIN_COMPOSE_DIRECT: "Direct Message",

  // Buttons
  BTN_SEND: "Send Reply",
  BTN_COMPOSE: "New Message",
  BTN_ARCHIVE: "Archive",
  BTN_MARK_READ: "Mark as Read",
  BTN_MARK_UNREAD: "Mark as Unread",
  BTN_DELETE: "Delete",
  BTN_BACK: "Back to Inbox",
  BTN_ATTACH: "Attach File",
  BTN_SEND_BROADCAST: "Send Broadcast",
  BTN_SEND_DIRECT: "Send Message",
  BTN_NEW: "New",
  BTN_CANCEL: "Cancel",

  // Filters
  FILTER_ALL: "All Messages",
  FILTER_UNREAD: "Unread",
  FILTER_ARCHIVED: "Archived",
  FILTER_INDUSTRY: "Companies",
  FILTER_ACADEMIC: "Faculty",
  FILTER_SYSTEM: "Notifications",
  FILTER_STUDENTS: "Students",

  // Empty states
  EMPTY_INBOX: "No messages yet",
  EMPTY_INBOX_DESC:
    "Messages from companies you've applied to and your faculty mentors will appear here.",
  EMPTY_UNREAD: "All caught up!",
  EMPTY_UNREAD_DESC: "You have no unread messages.",
  EMPTY_SEARCH: "No messages found",
  EMPTY_SEARCH_DESC: "Try adjusting your search or filters.",

  // Admin empty states
  EMPTY_ADMIN_DIRECT: "No conversations",
  EMPTY_ADMIN_DIRECT_DESC: "Start a direct message with any user",
  EMPTY_ADMIN_BROADCAST: "No broadcasts yet",
  EMPTY_ADMIN_USERS: "No users found",

  // Placeholders
  PLACEHOLDER_SEARCH: "Search messages...",
  PLACEHOLDER_REPLY: "Write your reply...",
  PLACEHOLDER_SUBJECT: "Subject",
  PLACEHOLDER_SEARCH_USERS: "Search users by name or email...",
  PLACEHOLDER_BROADCAST_SUBJECT: "Enter a clear, descriptive subject...",
  PLACEHOLDER_BROADCAST_BODY: "Write your broadcast message...",
  PLACEHOLDER_DIRECT_SUBJECT: "Enter subject...",
  PLACEHOLDER_DIRECT_BODY: "Write your message...",

  // Admin labels
  LABEL_TO: "To",
  LABEL_SUBJECT: "Subject",
  LABEL_MESSAGE: "Message",
  LABEL_SELECT_AUDIENCE: "Select Audience",
  LABEL_CTRL_ENTER: "Press Ctrl+Enter to send",

  // Time labels
  TIME_JUST_NOW: "Just now",
  TIME_MINUTES_AGO: "{n} minutes ago",
  TIME_HOURS_AGO: "{n} hours ago",
  TIME_YESTERDAY: "Yesterday",
  TIME_DAYS_AGO: "{n} days ago",

  // Success messages
  SUCCESS_BROADCAST_SENT: "Broadcast sent successfully!",
  SUCCESS_MESSAGE_SENT: "Message sent successfully!",

  // Confirm messages
  CONFIRM_DELETE_BROADCAST: "Delete this broadcast?",
};

export const UI_COLORS = {
  // Primary actions
  primary: {
    bg: "bg-blue-600",
    bgHover: "hover:bg-blue-700",
    text: "text-white",
    border: "border-blue-600",
  },

  // Secondary actions
  secondary: {
    bg: "bg-gray-100",
    bgHover: "hover:bg-gray-200",
    text: "text-gray-700",
    border: "border-gray-300",
  },

  // Danger actions
  danger: {
    bg: "bg-red-600",
    bgHover: "hover:bg-red-700",
    text: "text-white",
    border: "border-red-600",
  },

  // Unread indicator
  unread: {
    bg: "bg-blue-600",
    text: "text-white",
  },

  // Status colors
  status: {
    success: "text-green-600 bg-green-50",
    warning: "text-amber-600 bg-amber-50",
    error: "text-red-600 bg-red-50",
    info: "text-blue-600 bg-blue-50",
    neutral: "text-gray-600 bg-gray-50",
  },

  // Role colors (for admin direct messaging)
  roles: {
    student: {
      bg: "bg-blue-500",
      badge: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
      label: "Student",
    },
    faculty: {
      bg: "bg-purple-500",
      badge:
        "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
      label: "Faculty",
    },
    industry: {
      bg: "bg-emerald-500",
      badge:
        "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      label: "Company",
    },
    admin: {
      bg: "bg-amber-500",
      badge:
        "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
      label: "Admin",
    },
  },
};

export const PROFESSIONAL_GUIDELINES = {
  title: "Professional Communication Guidelines",
  banner:
    "This is a formal communication channel. Please maintain a professional tone.",
  rules: [
    "Use proper salutations and sign-offs",
    "Be clear and concise in your messages",
    "Avoid informal language, slang, or excessive emojis",
    "Respond within a reasonable timeframe",
    "All messages are logged and may be reviewed",
  ],
  firstTimeWarning: `
    Messages on this platform are formal and tied to your internship applications.
    Please ensure your messages are professional, relevant, and respectful.
    All communications are logged and may be reviewed by platform administrators.
  `,
};

export const BANNER_MESSAGES = {
  // Warning banners
  CANNOT_REPLY_PENDING: {
    type: "warning",
    title: "Reply Not Available",
    message:
      "You cannot reply to this message. Messaging will be enabled after your application is accepted or an offer is made.",
  },
  CANNOT_REPLY_REJECTED: {
    type: "info",
    title: "Conversation Closed",
    message:
      "This conversation is closed as the application was not successful.",
  },
  CANNOT_REPLY_SYSTEM: {
    type: "info",
    title: "System Notification",
    message: "This is an automated notification. Replies are not monitored.",
  },
  ACTION_REQUIRED: {
    type: "warning",
    title: "Action Required",
    message: "Please respond to this message within the specified timeframe.",
  },
  PROFESSIONAL_REMINDER: {
    type: "info",
    title: "Professional Communication",
    message: "Please ensure your response is professional and relevant.",
  },
  // Admin banners
  ADMIN_MESSAGE: {
    type: "info",
    title: "Admin Message",
    message: "This is a message from the platform administration team.",
  },
  ADMIN_REPLY_INFO: {
    type: "info",
    title: "Admin Conversation",
    message:
      "You can reply directly to this admin message. Your response will be reviewed by the admin team.",
  },
};

export const ATTACHMENT_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "text/plain",
  ],
  allowedExtensions: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".txt"],
};

export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50],
};

// Admin audience options (for broadcast compose)
export const BROADCAST_AUDIENCES = [
  { id: "all", label: "All Users", icon: "Users", color: "blue" },
  { id: "students", label: "Students", icon: "GraduationCap", color: "green" },
  { id: "faculty", label: "Faculty", icon: "Users", color: "purple" },
  { id: "industry", label: "Companies", icon: "Building2", color: "amber" },
];

export default {
  UI_LABELS,
  UI_COLORS,
  PROFESSIONAL_GUIDELINES,
  BANNER_MESSAGES,
  ATTACHMENT_CONFIG,
  PAGINATION_CONFIG,
  BROADCAST_AUDIENCES,
};