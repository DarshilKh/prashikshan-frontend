/**
 * Messaging Module - Public API
 *
 * This is the ONLY file external code should import from.
 * All internal implementation details are hidden.
 *
 * Usage:
 *   import { StudentInbox, MessagesDropdown, useUnreadCount } from '@/features/messaging';
 */

// ============================================
// PAGES - Role-specific inbox pages
// ============================================
export { StudentInbox } from "./pages/StudentInbox";
export { FacultyInbox } from "./pages/FacultyInbox";
export { IndustryInbox } from "./pages/IndustryInbox";
export { AdminMessages } from "./pages/AdminMessages";

// ============================================
// CONTEXT - For wrapping app with provider
// ============================================
export {
  MessagesProvider,
  useMessagesContext,
} from "./context/MessagesContext";

// ============================================
// HOOKS - For consuming messaging functionality
// ============================================
export { useMessages } from "./hooks/useMessages";
export { useConversation } from "./hooks/useConversation";
export { useUnreadCount } from "./hooks/useUnreadCount";
export { useCanMessage } from "./hooks/useCanMessage";
export { useMessagePermissions } from "./hooks/useMessagePermissions";

// ============================================
// NAVBAR COMPONENTS - For integration with app navbar
// ============================================
export { MessagesIcon } from "./components/navbar/MessagesIcon";
export { MessagesDropdown } from "./components/navbar/MessagesDropdown";

// ============================================
// SHARED COMPONENTS - Reusable UI pieces
// ============================================
export { MessageBadge } from "./components/shared/MessageBadge";
export { SenderInfo } from "./components/shared/SenderInfo";
export { ContextTag } from "./components/shared/ContextTag";
export { Timestamp } from "./components/shared/Timestamp";

// ============================================
// BANNERS - Warning and info banners
// ============================================
export { ProfessionalBanner } from "./components/banners/ProfessionalBanner";
export { ReplyDisabledBanner } from "./components/banners/ReplyDisabledBanner";
export { SystemMessageBanner } from "./components/banners/SystemMessageBanner";
export { ActionRequiredBanner } from "./components/banners/ActionRequiredBanner";

// ============================================
// CONFIG - Constants and type definitions
// ============================================
export {
  MESSAGE_TYPES,
  SENDER_TYPES,
  THREAD_STATUS,
  MESSAGE_PRIORITY,
} from "./config/messageTypes";
export {
  APPLICATION_STATUS,
  APPLICATION_MESSAGING_RULES,
  getMessagingPermissions,
} from "./config/applicationRules";
export { PERMISSION_DENIED_MESSAGES } from "./config/permissions";
export {
  UI_LABELS,
  PROFESSIONAL_GUIDELINES,
  BANNER_MESSAGES,
} from "./config/uiConfig";

// ============================================
// UTILITIES - Helper functions
// ============================================
export {
  formatTimestamp,
  formatMessageTimestamp,
  formatFileSize,
  truncateText,
  getInitials,
} from "./utils/formatters";

export {
  validateMessageContent,
  validateAttachment,
  validateAttachments,
} from "./utils/validators";

export {
  getOtherParticipant,
  isUnread,
  sortByDate,
  groupByType,
  filterBySearch,
  getSenderTypeLabel,
  getConversationUrl,
} from "./utils/helpers";

// ============================================
// SERVICES - Data access layer
// (Export only for advanced use cases)
// ============================================
export * as messageService from "./services/messageService";
export * as permissionService from "./services/permissionService";
export * as notificationService from "./services/notificationService";
