/**
 * Application Status → Messaging Rules
 *
 * Maps internship application statuses to messaging permissions.
 * This is critical for the Internshala-style controlled messaging.
 */

/**
 * Application Status Enum
 */
export const APPLICATION_STATUS = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  SHORTLISTED: "SHORTLISTED",
  INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED",
  INTERVIEW_COMPLETED: "INTERVIEW_COMPLETED",
  OFFER_MADE: "OFFER_MADE",
  OFFER_ACCEPTED: "OFFER_ACCEPTED",
  OFFER_DECLINED: "OFFER_DECLINED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  TERMINATED: "TERMINATED",
};

/**
 * Messaging rules for each application status
 */
export const APPLICATION_MESSAGING_RULES = {
  [APPLICATION_STATUS.DRAFT]: {
    companyCanMessage: false,
    studentCanReply: false,
    studentCanInitiate: false,
    allowedMessageTypes: [],
    statusLabel: "Draft",
    statusColor: "gray",
    description: "Application not yet submitted.",
  },

  [APPLICATION_STATUS.PENDING]: {
    companyCanMessage: true,
    studentCanReply: false,
    studentCanInitiate: false,
    allowedMessageTypes: ["STATUS_UPDATE", "SYSTEM"],
    statusLabel: "Pending Review",
    statusColor: "yellow",
    description: "Application submitted, awaiting review.",
    studentMessage:
      "Your application is being reviewed. Messaging will be enabled if you are shortlisted.",
  },

  [APPLICATION_STATUS.UNDER_REVIEW]: {
    companyCanMessage: true,
    studentCanReply: false,
    studentCanInitiate: false,
    allowedMessageTypes: ["STATUS_UPDATE", "SYSTEM"],
    statusLabel: "Under Review",
    statusColor: "blue",
    description: "Company is reviewing your application.",
    studentMessage:
      "Your application is under active review. Please wait for updates.",
  },

  [APPLICATION_STATUS.SHORTLISTED]: {
    companyCanMessage: true,
    studentCanReply: true,
    studentCanInitiate: false,
    allowedMessageTypes: ["STATUS_UPDATE", "INDUSTRY", "GENERAL"],
    statusLabel: "Shortlisted",
    statusColor: "purple",
    description: "You have been shortlisted!",
    studentMessage:
      "Congratulations! You can now respond to messages from this company.",
  },

  [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: {
    companyCanMessage: true,
    studentCanReply: true,
    studentCanInitiate: false,
    allowedMessageTypes: ["INTERVIEW", "STATUS_UPDATE", "INDUSTRY", "GENERAL"],
    statusLabel: "Interview Scheduled",
    statusColor: "amber",
    description: "Interview has been scheduled.",
    studentMessage: "Please confirm your interview availability.",
    requiresAction: true,
  },

  [APPLICATION_STATUS.INTERVIEW_COMPLETED]: {
    companyCanMessage: true,
    studentCanReply: true,
    studentCanInitiate: false,
    allowedMessageTypes: ["STATUS_UPDATE", "FEEDBACK", "INDUSTRY", "GENERAL"],
    statusLabel: "Interview Completed",
    statusColor: "cyan",
    description: "Interview completed, awaiting decision.",
    studentMessage:
      "Your interview is complete. Please wait for the company's decision.",
  },

  [APPLICATION_STATUS.OFFER_MADE]: {
    companyCanMessage: true,
    studentCanReply: true,
    studentCanInitiate: true, // Student can now initiate!
    allowedMessageTypes: ["OFFER", "STATUS_UPDATE", "INDUSTRY", "GENERAL"],
    statusLabel: "Offer Received",
    statusColor: "green",
    description: "You have received an internship offer!",
    studentMessage:
      "Congratulations on your offer! You can now freely communicate with this company.",
    requiresAction: true,
  },

  [APPLICATION_STATUS.OFFER_ACCEPTED]: {
    companyCanMessage: true,
    studentCanReply: true,
    studentCanInitiate: true,
    allowedMessageTypes: ["ALL"],
    statusLabel: "Offer Accepted",
    statusColor: "green",
    description: "You have accepted the offer.",
    studentMessage: "You have full messaging access with this company.",
  },

  [APPLICATION_STATUS.OFFER_DECLINED]: {
    companyCanMessage: true,
    studentCanReply: false,
    studentCanInitiate: false,
    allowedMessageTypes: ["STATUS_UPDATE", "SYSTEM"],
    statusLabel: "Offer Declined",
    statusColor: "gray",
    description: "You declined the offer.",
    studentMessage: "This conversation is now closed.",
  },

  [APPLICATION_STATUS.REJECTED]: {
    companyCanMessage: true,
    studentCanReply: false,
    studentCanInitiate: false,
    allowedMessageTypes: ["STATUS_UPDATE", "SYSTEM"],
    statusLabel: "Not Selected",
    statusColor: "red",
    description: "Application was not successful.",
    studentMessage:
      "This conversation is closed. We encourage you to apply to other opportunities.",
  },

  [APPLICATION_STATUS.WITHDRAWN]: {
    companyCanMessage: false,
    studentCanReply: false,
    studentCanInitiate: false,
    allowedMessageTypes: [],
    statusLabel: "Withdrawn",
    statusColor: "gray",
    description: "You withdrew your application.",
    studentMessage: "This conversation is closed.",
  },

  [APPLICATION_STATUS.IN_PROGRESS]: {
    companyCanMessage: true,
    studentCanReply: true,
    studentCanInitiate: true,
    allowedMessageTypes: ["ALL"],
    statusLabel: "Internship Active",
    statusColor: "green",
    description: "Your internship is in progress.",
    studentMessage: "You have full messaging access with this company.",
  },

  [APPLICATION_STATUS.COMPLETED]: {
    companyCanMessage: true,
    studentCanReply: true,
    studentCanInitiate: false,
    allowedMessageTypes: ["FEEDBACK", "GENERAL", "STATUS_UPDATE"],
    statusLabel: "Completed",
    statusColor: "teal",
    description: "Internship completed successfully.",
    studentMessage:
      "You can reply to messages but cannot start new conversations.",
  },

  [APPLICATION_STATUS.TERMINATED]: {
    companyCanMessage: true,
    studentCanReply: false,
    studentCanInitiate: false,
    allowedMessageTypes: ["STATUS_UPDATE", "SYSTEM"],
    statusLabel: "Terminated",
    statusColor: "red",
    description: "Internship was terminated.",
    studentMessage: "This conversation is closed.",
  },
};

/**
 * Get messaging permissions for a given application status
 */
export const getMessagingPermissions = (status) => {
  const rules = APPLICATION_MESSAGING_RULES[status];

  if (!rules) {
    return {
      companyCanMessage: false,
      studentCanReply: false,
      studentCanInitiate: false,
      allowedMessageTypes: [],
      error: "Unknown application status",
    };
  }

  return rules;
};

/**
 * Check if a message type is allowed for a given status
 */
export const isMessageTypeAllowed = (status, messageType) => {
  const rules = APPLICATION_MESSAGING_RULES[status];

  if (!rules) return false;
  if (rules.allowedMessageTypes.includes("ALL")) return true;

  return rules.allowedMessageTypes.includes(messageType);
};

/**
 * Get status display info
 */
export const getStatusDisplay = (status) => {
  const rules = APPLICATION_MESSAGING_RULES[status];

  if (!rules) {
    return {
      label: "Unknown",
      color: "gray",
    };
  }

  return {
    label: rules.statusLabel,
    color: rules.statusColor,
    description: rules.description,
    requiresAction: rules.requiresAction || false,
  };
};

export default APPLICATION_MESSAGING_RULES;
