/**
 * Validation Utilities
 */

import { ATTACHMENT_CONFIG } from "../config/uiConfig";

/**
 * Validate message content
 */
export const validateMessageContent = (body) => {
  const errors = [];

  if (!body || body.trim().length === 0) {
    errors.push("Message cannot be empty");
  }

  if (body && body.length > 10000) {
    errors.push("Message is too long (max 10,000 characters)");
  }

  // Check for unprofessional content (basic check)
  const unprofessionalPatterns = [
    /(.)\1{4,}/i, // Repeated characters (aaaaaaa)
  ];

  for (const pattern of unprofessionalPatterns) {
    if (pattern.test(body)) {
      errors.push("Please ensure your message is professionally written");
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate attachment
 */
export const validateAttachment = (file) => {
  const errors = [];

  if (file.size > ATTACHMENT_CONFIG.maxFileSize) {
    errors.push(
      `File "${file.name}" is too large (max ${ATTACHMENT_CONFIG.maxFileSize / 1024 / 1024}MB)`,
    );
  }

  const extension = "." + file.name.split(".").pop().toLowerCase();
  if (!ATTACHMENT_CONFIG.allowedExtensions.includes(extension)) {
    errors.push(`File type "${extension}" is not allowed`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate multiple attachments
 */
export const validateAttachments = (files) => {
  const allErrors = [];

  if (files.length > ATTACHMENT_CONFIG.maxFiles) {
    allErrors.push(`Maximum ${ATTACHMENT_CONFIG.maxFiles} files allowed`);
  }

  files.forEach((file) => {
    const { errors } = validateAttachment(file);
    allErrors.push(...errors);
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

export default {
  validateMessageContent,
  validateAttachment,
  validateAttachments,
};
