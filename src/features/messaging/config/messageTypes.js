/**
 * Message Type Definitions
 *
 * Defines all message categories and their properties.
 * This is the "vocabulary" of the messaging system.
 */

export const MESSAGE_TYPES = {
  // System notifications - read only, no replies
  SYSTEM: {
    id: "SYSTEM",
    label: "System Notice",
    description: "Platform announcements and automated notifications",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-300",
    icon: "Bell",
    canReply: false,
    isAutomated: true,
  },

  // Academic messages - faculty to student
  ACADEMIC: {
    id: "ACADEMIC",
    label: "Academic",
    description: "Faculty communications regarding coursework and mentorship",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-300",
    icon: "GraduationCap",
    canReply: true,
    isAutomated: false,
  },

  // Industry messages - company to student
  INDUSTRY: {
    id: "INDUSTRY",
    label: "Industry",
    description: "Communications from companies regarding internships",
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    borderColor: "border-purple-300",
    icon: "Building2",
    canReply: true, // Conditional based on application status
    isAutomated: false,
  },

  // Interview related
  INTERVIEW: {
    id: "INTERVIEW",
    label: "Interview",
    description: "Interview scheduling and details",
    color: "amber",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-300",
    icon: "Video",
    canReply: true,
    isAutomated: false,
    requiresAction: true,
  },

  // Offer related
  OFFER: {
    id: "OFFER",
    label: "Offer",
    description: "Internship offers and negotiations",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    borderColor: "border-green-300",
    icon: "FileCheck",
    canReply: true,
    isAutomated: false,
    requiresAction: true,
  },

  // Assignment/Task
  ASSIGNMENT: {
    id: "ASSIGNMENT",
    label: "Assignment",
    description: "Tasks and assignments from faculty or company",
    color: "indigo",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-300",
    icon: "ClipboardList",
    canReply: true,
    isAutomated: false,
  },

  // Status updates
  STATUS_UPDATE: {
    id: "STATUS_UPDATE",
    label: "Status Update",
    description: "Application or internship status changes",
    color: "cyan",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-300",
    icon: "Info",
    canReply: false,
    isAutomated: true,
  },

  // Feedback
  FEEDBACK: {
    id: "FEEDBACK",
    label: "Feedback",
    description: "Performance feedback and reviews",
    color: "teal",
    bgColor: "bg-teal-100",
    textColor: "text-teal-700",
    borderColor: "border-teal-300",
    icon: "MessageSquare",
    canReply: true,
    isAutomated: false,
  },

  // General (only for established relationships)
  GENERAL: {
    id: "GENERAL",
    label: "Message",
    description: "General professional communication",
    color: "slate",
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
    borderColor: "border-slate-300",
    icon: "Mail",
    canReply: true,
    isAutomated: false,
  },
};

// Message priority levels
export const MESSAGE_PRIORITY = {
  URGENT: {
    id: "URGENT",
    label: "Urgent",
    color: "red",
    sortOrder: 1,
  },
  HIGH: {
    id: "HIGH",
    label: "High Priority",
    color: "orange",
    sortOrder: 2,
  },
  NORMAL: {
    id: "NORMAL",
    label: "Normal",
    color: "gray",
    sortOrder: 3,
  },
  LOW: {
    id: "LOW",
    label: "Low Priority",
    color: "gray",
    sortOrder: 4,
  },
};

// Sender types
export const SENDER_TYPES = {
  STUDENT: "STUDENT",
  FACULTY: "FACULTY",
  INDUSTRY: "INDUSTRY",
  ADMIN: "ADMIN",
  SYSTEM: "SYSTEM",
};

// Thread status
export const THREAD_STATUS = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
  CLOSED: "CLOSED",
};

export default MESSAGE_TYPES;
