/**
 * Mock Conversations Data
 *
 * DELETE THIS FILE WHEN BACKEND IS READY
 * Replace with API calls in messageService.js
 */

import {
  MESSAGE_TYPES,
  SENDER_TYPES,
  THREAD_STATUS,
} from "../config/messageTypes";

export const mockConversations = [
  // Industry conversation - Interview scheduled
  {
    id: "conv_001",
    type: "INDUSTRY",
    status: THREAD_STATUS.ACTIVE,
    subject: "AI/ML Intern Position - Interview Invitation",

    // Participants
    participants: [
      {
        id: "company_001",
        type: SENDER_TYPES.INDUSTRY,
        name: "TechNova Solutions",
        avatar: null,
        role: "HR Team",
      },
      {
        id: "student_001",
        type: SENDER_TYPES.STUDENT,
        name: "Aarav Sharma",
        avatar: null,
        role: "Student",
      },
    ],

    // Context - what this conversation is about
    context: {
      type: "APPLICATION",
      applicationId: "app_001",
      internshipId: "intern_001",
      internshipTitle: "AI/ML Intern",
      companyName: "TechNova Solutions",
      applicationStatus: "INTERVIEW_SCHEDULED",
    },

    // Thread metadata
    lastMessage: {
      id: "msg_001_003",
      preview:
        "Your interview has been scheduled for Monday, January 22nd at 3:00 PM...",
      senderId: "company_001",
      senderName: "TechNova Solutions",
      timestamp: "2024-01-18T14:30:00Z",
      type: MESSAGE_TYPES.INTERVIEW.id,
    },

    // Read status per participant
    readStatus: {
      student_001: false,
      company_001: true,
    },

    messageCount: 3,
    hasAttachments: true,
    isStarred: false,
    isPinned: false,

    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
  },

  // Faculty conversation - Assignment
  {
    id: "conv_002",
    type: "ACADEMIC",
    status: THREAD_STATUS.ACTIVE,
    subject: "Weekly Progress Report - Week 3",

    participants: [
      {
        id: "faculty_001",
        type: SENDER_TYPES.FACULTY,
        name: "Dr. Priya Mehta",
        avatar: null,
        role: "Faculty Mentor",
        department: "Computer Science",
      },
      {
        id: "student_001",
        type: SENDER_TYPES.STUDENT,
        name: "Aarav Sharma",
        avatar: null,
        role: "Student",
      },
    ],

    context: {
      type: "MENTORSHIP",
      mentorshipId: "mentor_001",
      internshipId: "intern_active_001",
      internshipTitle: "AI Resume Screener",
      companyName: "DataMind Analytics",
    },

    lastMessage: {
      id: "msg_002_002",
      preview:
        "Please submit your Week 3 progress report by Friday. Include the updated metrics...",
      senderId: "faculty_001",
      senderName: "Dr. Priya Mehta",
      timestamp: "2024-01-17T16:15:00Z",
      type: MESSAGE_TYPES.ASSIGNMENT.id,
    },

    readStatus: {
      student_001: true,
      faculty_001: true,
    },

    messageCount: 2,
    hasAttachments: true,
    isStarred: true,
    isPinned: false,

    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-17T16:15:00Z",
  },

  // System notification - Application update
  {
    id: "conv_003",
    type: "SYSTEM",
    status: THREAD_STATUS.ACTIVE,
    subject: "Application Status Update",

    participants: [
      {
        id: "system",
        type: SENDER_TYPES.SYSTEM,
        name: "Platform Notification",
        avatar: null,
        role: "System",
      },
      {
        id: "student_001",
        type: SENDER_TYPES.STUDENT,
        name: "Aarav Sharma",
        avatar: null,
        role: "Student",
      },
    ],

    context: {
      type: "APPLICATION",
      applicationId: "app_002",
      internshipId: "intern_002",
      internshipTitle: "IoT Energy Monitor",
      companyName: "GreenGrid Solutions",
      applicationStatus: "UNDER_REVIEW",
    },

    lastMessage: {
      id: "msg_003_001",
      preview:
        'Your application for "IoT Energy Monitor" at GreenGrid has been moved to "Under Review".',
      senderId: "system",
      senderName: "Platform Notification",
      timestamp: "2024-01-15T11:30:00Z",
      type: MESSAGE_TYPES.STATUS_UPDATE.id,
    },

    readStatus: {
      student_001: true,
    },

    messageCount: 1,
    hasAttachments: false,
    isStarred: false,
    isPinned: false,

    createdAt: "2024-01-15T11:30:00Z",
    updatedAt: "2024-01-15T11:30:00Z",
  },

  // Industry conversation - Offer made
  {
    id: "conv_004",
    type: "INDUSTRY",
    status: THREAD_STATUS.ACTIVE,
    subject: "Internship Offer - Frontend Developer",

    participants: [
      {
        id: "company_002",
        type: SENDER_TYPES.INDUSTRY,
        name: "WebCraft Studios",
        avatar: null,
        role: "Hiring Manager",
      },
      {
        id: "student_001",
        type: SENDER_TYPES.STUDENT,
        name: "Aarav Sharma",
        avatar: null,
        role: "Student",
      },
    ],

    context: {
      type: "APPLICATION",
      applicationId: "app_003",
      internshipId: "intern_003",
      internshipTitle: "Frontend Developer Intern",
      companyName: "WebCraft Studios",
      applicationStatus: "OFFER_MADE",
    },

    lastMessage: {
      id: "msg_004_004",
      preview:
        "We are pleased to offer you the Frontend Developer Internship position...",
      senderId: "company_002",
      senderName: "WebCraft Studios",
      timestamp: "2024-01-16T10:00:00Z",
      type: MESSAGE_TYPES.OFFER.id,
    },

    readStatus: {
      student_001: false,
      company_002: true,
    },

    messageCount: 4,
    hasAttachments: true,
    isStarred: false,
    isPinned: true,

    createdAt: "2024-01-05T09:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },

  // Industry conversation - Pending (no reply allowed)
  {
    id: "conv_005",
    type: "INDUSTRY",
    status: THREAD_STATUS.ACTIVE,
    subject: "Application Received - Data Analyst Intern",

    participants: [
      {
        id: "company_003",
        type: SENDER_TYPES.INDUSTRY,
        name: "Analytics Pro Inc",
        avatar: null,
        role: "Recruitment Team",
      },
      {
        id: "student_001",
        type: SENDER_TYPES.STUDENT,
        name: "Aarav Sharma",
        avatar: null,
        role: "Student",
      },
    ],

    context: {
      type: "APPLICATION",
      applicationId: "app_004",
      internshipId: "intern_004",
      internshipTitle: "Data Analyst Intern",
      companyName: "Analytics Pro Inc",
      applicationStatus: "PENDING",
    },

    lastMessage: {
      id: "msg_005_001",
      preview:
        "Thank you for applying to the Data Analyst Intern position. We will review your application...",
      senderId: "company_003",
      senderName: "Analytics Pro Inc",
      timestamp: "2024-01-14T15:00:00Z",
      type: MESSAGE_TYPES.STATUS_UPDATE.id,
    },

    readStatus: {
      student_001: true,
      company_003: true,
    },

    messageCount: 1,
    hasAttachments: false,
    isStarred: false,
    isPinned: false,

    createdAt: "2024-01-14T15:00:00Z",
    updatedAt: "2024-01-14T15:00:00Z",
  },

  // Rejected application conversation
  {
    id: "conv_006",
    type: "INDUSTRY",
    status: THREAD_STATUS.CLOSED,
    subject: "Application Update - Backend Developer",

    participants: [
      {
        id: "company_004",
        type: SENDER_TYPES.INDUSTRY,
        name: "CloudScale Systems",
        avatar: null,
        role: "HR Department",
      },
      {
        id: "student_001",
        type: SENDER_TYPES.STUDENT,
        name: "Aarav Sharma",
        avatar: null,
        role: "Student",
      },
    ],

    context: {
      type: "APPLICATION",
      applicationId: "app_005",
      internshipId: "intern_005",
      internshipTitle: "Backend Developer Intern",
      companyName: "CloudScale Systems",
      applicationStatus: "REJECTED",
    },

    lastMessage: {
      id: "msg_006_002",
      preview:
        "Thank you for your interest in CloudScale Systems. After careful consideration...",
      senderId: "company_004",
      senderName: "CloudScale Systems",
      timestamp: "2024-01-12T09:00:00Z",
      type: MESSAGE_TYPES.STATUS_UPDATE.id,
    },

    readStatus: {
      student_001: true,
      company_004: true,
    },

    messageCount: 2,
    hasAttachments: false,
    isStarred: false,
    isPinned: false,

    createdAt: "2024-01-08T10:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
  },
];

// Faculty-specific conversations
export const mockFacultyConversations = [
  {
    id: "fconv_001",
    type: "ACADEMIC",
    status: THREAD_STATUS.ACTIVE,
    subject: "Weekly Progress Update",

    participants: [
      {
        id: "faculty_001",
        type: SENDER_TYPES.FACULTY,
        name: "Dr. Priya Mehta",
        avatar: null,
        role: "Faculty Mentor",
      },
      {
        id: "student_002",
        type: SENDER_TYPES.STUDENT,
        name: "Priya Patel",
        avatar: null,
        role: "Mentee",
        department: "Computer Science",
        year: "3rd Year",
      },
    ],

    context: {
      type: "MENTORSHIP",
      mentorshipId: "mentor_002",
      studentName: "Priya Patel",
    },

    lastMessage: {
      id: "fmsg_001_003",
      preview:
        "Thank you for the update. Please focus on the machine learning module...",
      senderId: "faculty_001",
      senderName: "Dr. Priya Mehta",
      timestamp: "2024-01-17T11:30:00Z",
      type: MESSAGE_TYPES.ACADEMIC.id,
    },

    readStatus: {
      student_002: false,
      faculty_001: true,
    },

    messageCount: 3,
    hasAttachments: false,
    isStarred: false,
    isPinned: false,

    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-17T11:30:00Z",
  },
];

// Industry-specific conversations
export const mockIndustryConversations = [
  {
    id: "iconversation_001",
    type: "INDUSTRY",
    status: THREAD_STATUS.ACTIVE,
    subject: "AI/ML Intern Application",

    participants: [
      {
        id: "company_001",
        type: SENDER_TYPES.INDUSTRY,
        name: "TechNova Solutions",
        avatar: null,
        role: "Company",
      },
      {
        id: "student_001",
        type: SENDER_TYPES.STUDENT,
        name: "Aarav Sharma",
        avatar: null,
        role: "Applicant",
        college: "IIT Delhi",
        year: "3rd Year",
      },
    ],

    context: {
      type: "APPLICATION",
      applicationId: "app_001",
      internshipId: "intern_001",
      internshipTitle: "AI/ML Intern",
      applicationStatus: "INTERVIEW_SCHEDULED",
    },

    lastMessage: {
      id: "imsg_001_003",
      preview: "Interview scheduled for Monday at 3:00 PM...",
      senderId: "company_001",
      senderName: "TechNova Solutions",
      timestamp: "2024-01-18T14:30:00Z",
      type: MESSAGE_TYPES.INTERVIEW.id,
    },

    readStatus: {
      student_001: false,
      company_001: true,
    },

    messageCount: 3,
    hasAttachments: true,
    isStarred: true,
    isPinned: false,

    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
  },
];

// Admin direct message conversations
export const mockAdminConversations = [
  {
    id: "admin_conv_001",
    type: "ADMIN_DIRECT",
    status: THREAD_STATUS.ACTIVE,
    subject: "Profile Verification Required",

    participants: [
      {
        id: "admin_001",
        type: SENDER_TYPES.ADMIN,
        name: "Platform Admin",
        avatar: null,
        role: "Administrator",
      },
      {
        id: "student_001",
        type: SENDER_TYPES.STUDENT,
        name: "Aarav Sharma",
        avatar: null,
        role: "Student",
        college: "IIT Delhi",
      },
    ],

    context: {
      type: "ADMIN_SUPPORT",
      reason: "Profile Verification",
    },

    lastMessage: {
      id: "admin_msg_001_002",
      preview:
        "Please upload your college ID card and enrollment certificate by January 25th...",
      senderId: "admin_001",
      senderName: "Platform Admin",
      timestamp: "2024-01-19T10:00:00Z",
      type: "GENERAL",
    },

    readStatus: {
      student_001: false,
      admin_001: true,
    },

    messageCount: 2,
    hasAttachments: false,
    isStarred: false,
    isPinned: true,

    createdAt: "2024-01-18T09:00:00Z",
    updatedAt: "2024-01-19T10:00:00Z",
  },
  {
    id: "admin_conv_002",
    type: "ADMIN_DIRECT",
    status: THREAD_STATUS.ACTIVE,
    subject: "Company Profile Review",

    participants: [
      {
        id: "admin_001",
        type: SENDER_TYPES.ADMIN,
        name: "Platform Admin",
        avatar: null,
        role: "Administrator",
      },
      {
        id: "company_001",
        type: SENDER_TYPES.INDUSTRY,
        name: "TechNova Solutions",
        avatar: null,
        role: "Company",
      },
    ],

    context: {
      type: "ADMIN_SUPPORT",
      reason: "Profile Review",
    },

    lastMessage: {
      id: "admin_msg_002_003",
      preview:
        "Thank you for the update. Your company profile has been verified and approved.",
      senderId: "admin_001",
      senderName: "Platform Admin",
      timestamp: "2024-01-17T15:30:00Z",
      type: "GENERAL",
    },

    readStatus: {
      company_001: true,
      admin_001: true,
    },

    messageCount: 3,
    hasAttachments: true,
    isStarred: false,
    isPinned: false,

    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-17T15:30:00Z",
  },
  {
    id: "admin_conv_003",
    type: "ADMIN_DIRECT",
    status: THREAD_STATUS.ACTIVE,
    subject: "Mentorship Program Guidelines",

    participants: [
      {
        id: "admin_001",
        type: SENDER_TYPES.ADMIN,
        name: "Platform Admin",
        avatar: null,
        role: "Administrator",
      },
      {
        id: "faculty_001",
        type: SENDER_TYPES.FACULTY,
        name: "Dr. Priya Mehta",
        avatar: null,
        role: "Faculty Mentor",
      },
    ],

    context: {
      type: "ADMIN_SUPPORT",
      reason: "Guidelines Update",
    },

    lastMessage: {
      id: "admin_msg_003_002",
      preview:
        "Thank you for the clarification. I will follow the updated guidelines.",
      senderId: "faculty_001",
      senderName: "Dr. Priya Mehta",
      timestamp: "2024-01-16T11:00:00Z",
      type: "GENERAL",
    },

    readStatus: {
      faculty_001: true,
      admin_001: true,
    },

    messageCount: 2,
    hasAttachments: false,
    isStarred: false,
    isPinned: false,

    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-16T11:00:00Z",
  },
];

export default mockConversations;
