/**
 * Permission Service
 *
 * Checks messaging permissions.
 * Frontend-only validation - backend MUST enforce these rules.
 *
 * TODO: Backend must implement identical permission checks
 */

import { SENDER_TYPES } from "../config/messageTypes";
import {
  INITIATION_RULES,
  REPLY_RULES,
  PERMISSION_DENIED_MESSAGES,
  createPermissionResult,
} from "../config/permissions";
import {
  APPLICATION_MESSAGING_RULES,
  APPLICATION_STATUS,
} from "../config/applicationRules";
import { mockApplications } from "../data/mockApplications";
import { mockFacultyStudentRelationships } from "../data/mockRelationships";

/**
 * Check if a user can initiate a conversation with another user
 *
 * @param {string} fromUserId - The user trying to send
 * @param {string} fromUserType - SENDER_TYPES value
 * @param {string} toUserId - The target user
 * @param {string} toUserType - SENDER_TYPES value
 * @returns {Object} Permission result
 */
export const canInitiateConversation = (
  fromUserId,
  fromUserType,
  toUserId,
  toUserType,
) => {
  // TODO: Backend must enforce this check

  const rules = INITIATION_RULES[fromUserType];

  if (!rules) {
    return createPermissionResult(false, "Unknown user type");
  }

  // Check if this user type can initiate to target type
  if (!rules.canInitiateTo.includes(toUserType)) {
    return createPermissionResult(
      false,
      PERMISSION_DENIED_MESSAGES.NOT_AUTHORIZED,
    );
  }

  // Check specific conditions
  const condition = rules.conditions?.[toUserType];

  if (condition) {
    switch (condition) {
      case "ASSIGNED_ONLY":
        // Faculty can only message assigned students
        const relationship = mockFacultyStudentRelationships.find(
          (rel) =>
            rel.facultyId === fromUserId &&
            rel.studentId === toUserId &&
            rel.status === "ACTIVE",
        );
        if (!relationship) {
          return createPermissionResult(
            false,
            PERMISSION_DENIED_MESSAGES.NO_RELATIONSHIP,
          );
        }
        break;

      case "APPLICANT_OR_INTERN":
        // Company can only message applicants or interns
        const application = mockApplications.find(
          (app) => app.companyId === fromUserId && app.studentId === toUserId,
        );
        if (!application) {
          return createPermissionResult(
            false,
            PERMISSION_DENIED_MESSAGES.NO_RELATIONSHIP,
          );
        }
        break;
    }
  }

  return createPermissionResult(true, "Initiation allowed");
};

/**
 * Check if a user can reply in a conversation
 *
 * @param {string} userId - The user trying to reply
 * @param {string} userType - SENDER_TYPES value
 * @param {Object} conversation - The conversation object
 * @returns {Object} Permission result with detailed info
 */
export const canReplyToConversation = (userId, userType, conversation) => {
  // TODO: Backend must enforce this check

  // System messages cannot be replied to
  if (conversation.type === "SYSTEM") {
    return createPermissionResult(
      false,
      PERMISSION_DENIED_MESSAGES.SYSTEM_MESSAGE,
    );
  }

  // Get the other participant
  const otherParticipant = conversation.participants.find(
    (p) => p.id !== userId,
  );

  if (!otherParticipant) {
    return createPermissionResult(false, "Invalid conversation");
  }

  const replyRules = REPLY_RULES[userType]?.canReplyTo?.[otherParticipant.type];

  if (!replyRules || !replyRules.allowed) {
    return createPermissionResult(
      false,
      replyRules?.reason || PERMISSION_DENIED_MESSAGES.NOT_AUTHORIZED,
    );
  }

  // Check conditional rules for students messaging industry
  if (
    userType === SENDER_TYPES.STUDENT &&
    otherParticipant.type === SENDER_TYPES.INDUSTRY
  ) {
    if (replyRules.condition === "APPLICATION_STATUS") {
      return checkApplicationBasedPermission(userId, conversation);
    }
  }

  return createPermissionResult(true, "Reply allowed");
};

/**
 * Check permission based on application status
 *
 * @param {string} studentId - Student user ID
 * @param {Object} conversation - Conversation object
 * @returns {Object} Permission result
 */
const checkApplicationBasedPermission = (studentId, conversation) => {
  const applicationId = conversation.context?.applicationId;

  if (!applicationId) {
    return createPermissionResult(
      false,
      PERMISSION_DENIED_MESSAGES.NO_RELATIONSHIP,
    );
  }

  // Find the application
  const application = mockApplications.find(
    (app) => app.id === applicationId && app.studentId === studentId,
  );

  if (!application) {
    return createPermissionResult(
      false,
      PERMISSION_DENIED_MESSAGES.NO_RELATIONSHIP,
    );
  }

  // Get messaging rules for this status
  const statusRules = APPLICATION_MESSAGING_RULES[application.status];

  if (!statusRules) {
    return createPermissionResult(false, "Unknown application status");
  }

  if (!statusRules.studentCanReply) {
    // Return specific message based on status
    switch (application.status) {
      case APPLICATION_STATUS.PENDING:
      case APPLICATION_STATUS.UNDER_REVIEW:
        return createPermissionResult(
          false,
          PERMISSION_DENIED_MESSAGES.APPLICATION_PENDING,
          {
            applicationStatus: application.status,
            statusLabel: statusRules.statusLabel,
          },
        );

      case APPLICATION_STATUS.REJECTED:
        return createPermissionResult(
          false,
          PERMISSION_DENIED_MESSAGES.APPLICATION_REJECTED,
          {
            applicationStatus: application.status,
            statusLabel: statusRules.statusLabel,
          },
        );

      case APPLICATION_STATUS.COMPLETED:
      case APPLICATION_STATUS.TERMINATED:
        return createPermissionResult(
          false,
          PERMISSION_DENIED_MESSAGES.INTERNSHIP_ENDED,
          {
            applicationStatus: application.status,
            statusLabel: statusRules.statusLabel,
          },
        );

      default:
        return createPermissionResult(
          false,
          PERMISSION_DENIED_MESSAGES.NOT_AUTHORIZED,
        );
    }
  }

  return createPermissionResult(true, "Reply allowed", {
    applicationStatus: application.status,
    statusLabel: statusRules.statusLabel,
    canInitiate: statusRules.studentCanInitiate,
  });
};

/**
 * Get full permission details for a conversation
 *
 * @param {string} userId - Current user ID
 * @param {string} userType - SENDER_TYPES value
 * @param {Object} conversation - Conversation object
 * @returns {Object} Full permission details
 */
export const getConversationPermissions = (userId, userType, conversation) => {
  const canReply = canReplyToConversation(userId, userType, conversation);

  // Check if user can initiate new threads with other participant
  const otherParticipant = conversation.participants.find(
    (p) => p.id !== userId,
  );
  const canInitiate = otherParticipant
    ? canInitiateConversation(
        userId,
        userType,
        otherParticipant.id,
        otherParticipant.type,
      )
    : createPermissionResult(false, "No recipient");

  // Get application status if applicable
  let applicationInfo = null;
  if (conversation.context?.applicationId) {
    const application = mockApplications.find(
      (app) => app.id === conversation.context.applicationId,
    );
    if (application) {
      const statusRules = APPLICATION_MESSAGING_RULES[application.status];
      applicationInfo = {
        status: application.status,
        statusLabel: statusRules?.statusLabel || "Unknown",
        statusColor: statusRules?.statusColor || "gray",
        requiresAction: statusRules?.requiresAction || false,
      };
    }
  }

  return {
    canReply: canReply.allowed,
    canReplyReason: canReply.reason,
    canInitiate: canInitiate.allowed,
    canInitiateReason: canInitiate.reason,
    isSystemMessage: conversation.type === "SYSTEM",
    applicationInfo,
    conversationType: conversation.type,
  };
};

/**
 * Check if message type requires action
 */
export const requiresAction = (conversation) => {
  const lastMessage = conversation.lastMessage;
  return lastMessage?.metadata?.requiresAction || false;
};

export default {
  canInitiateConversation,
  canReplyToConversation,
  getConversationPermissions,
  requiresAction,
};
