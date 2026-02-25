/**
 * Permission Configuration
 *
 * Defines who can message whom and under what conditions.
 * This is the "rule book" for the messaging system.
 */

import { SENDER_TYPES } from "./messageTypes";

/**
 * INITIATION RULES
 * Who can START a new conversation with whom
 */
export const INITIATION_RULES = {
  [SENDER_TYPES.STUDENT]: {
    // Students can NEVER initiate conversations
    canInitiateTo: [],
    reason:
      "Students must wait for companies or faculty to contact them first.",
  },

  [SENDER_TYPES.FACULTY]: {
    // Faculty can initiate with their assigned students
    canInitiateTo: [SENDER_TYPES.STUDENT],
    conditions: {
      [SENDER_TYPES.STUDENT]: "ASSIGNED_ONLY", // Must be their mentee
    },
    reason: "Faculty can reach out to students they are mentoring.",
  },

  [SENDER_TYPES.INDUSTRY]: {
    // Industry can initiate with applicants and interns
    canInitiateTo: [SENDER_TYPES.STUDENT],
    conditions: {
      [SENDER_TYPES.STUDENT]: "APPLICANT_OR_INTERN", // Must have applied or be interning
    },
    reason: "Companies can contact students who have applied or are interning.",
  },

  [SENDER_TYPES.ADMIN]: {
    // Admin can broadcast to anyone
    canInitiateTo: [
      SENDER_TYPES.STUDENT,
      SENDER_TYPES.FACULTY,
      SENDER_TYPES.INDUSTRY,
      SENDER_TYPES.ADMIN,
    ],
    conditions: {},
    reason: "Administrators can send platform-wide announcements.",
  },

  [SENDER_TYPES.SYSTEM]: {
    // System can notify anyone
    canInitiateTo: [
      SENDER_TYPES.STUDENT,
      SENDER_TYPES.FACULTY,
      SENDER_TYPES.INDUSTRY,
      SENDER_TYPES.ADMIN,
    ],
    conditions: {},
    reason: "Automated system notifications.",
  },
};

/**
 * REPLY RULES
 * Who can REPLY within an existing thread
 */
export const REPLY_RULES = {
  [SENDER_TYPES.STUDENT]: {
    canReplyTo: {
      [SENDER_TYPES.FACULTY]: {
        allowed: true,
        condition: "ALWAYS", // Can always reply to faculty
      },
      [SENDER_TYPES.INDUSTRY]: {
        allowed: true,
        condition: "APPLICATION_STATUS", // Depends on application status
      },
      [SENDER_TYPES.ADMIN]: {
        allowed: false,
        reason: "Cannot reply to admin broadcasts.",
      },
      [SENDER_TYPES.SYSTEM]: {
        allowed: false,
        reason: "Cannot reply to system notifications.",
      },
    },
  },

  [SENDER_TYPES.FACULTY]: {
    canReplyTo: {
      [SENDER_TYPES.STUDENT]: { allowed: true, condition: "ALWAYS" },
      [SENDER_TYPES.FACULTY]: { allowed: true, condition: "ALWAYS" },
      [SENDER_TYPES.INDUSTRY]: { allowed: true, condition: "ALWAYS" },
      [SENDER_TYPES.ADMIN]: { allowed: false },
      [SENDER_TYPES.SYSTEM]: { allowed: false },
    },
  },

  [SENDER_TYPES.INDUSTRY]: {
    canReplyTo: {
      [SENDER_TYPES.STUDENT]: { allowed: true, condition: "ALWAYS" },
      [SENDER_TYPES.FACULTY]: { allowed: true, condition: "ALWAYS" },
      [SENDER_TYPES.INDUSTRY]: { allowed: true, condition: "ALWAYS" },
      [SENDER_TYPES.ADMIN]: { allowed: false },
      [SENDER_TYPES.SYSTEM]: { allowed: false },
    },
  },

  [SENDER_TYPES.ADMIN]: {
    canReplyTo: {
      [SENDER_TYPES.STUDENT]: { allowed: true, condition: "ALWAYS" },
      [SENDER_TYPES.FACULTY]: { allowed: true, condition: "ALWAYS" },
      [SENDER_TYPES.INDUSTRY]: { allowed: true, condition: "ALWAYS" },
      [SENDER_TYPES.ADMIN]: { allowed: true, condition: "ALWAYS" },
      [SENDER_TYPES.SYSTEM]: { allowed: false },
    },
  },
};

/**
 * Permission check result structure
 */
export const createPermissionResult = (
  allowed,
  reason = "",
  conditions = {},
) => ({
  allowed,
  reason,
  conditions,
  timestamp: new Date().toISOString(),
});

/**
 * Error messages for permission denials
 */
export const PERMISSION_DENIED_MESSAGES = {
  NO_RELATIONSHIP:
    "You do not have an established relationship with this user.",
  APPLICATION_PENDING:
    "Messaging will be enabled after your application is reviewed.",
  APPLICATION_REJECTED:
    "This conversation is closed as the application was not accepted.",
  SYSTEM_MESSAGE: "This is an automated notification and cannot be replied to.",
  ADMIN_BROADCAST: "This is a platform announcement and cannot be replied to.",
  NOT_AUTHORIZED: "You are not authorized to send messages to this recipient.",
  INTERNSHIP_ENDED:
    "This conversation is archived as the internship has concluded.",
};

export default {
  INITIATION_RULES,
  REPLY_RULES,
  PERMISSION_DENIED_MESSAGES,
  createPermissionResult,
};
