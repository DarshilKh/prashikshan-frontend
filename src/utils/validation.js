// src/utils/validation.js

/**
 * Validation rules and utilities for form validation
 */

export const validators = {
  required: (value, message = "This field is required") => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return message;
    }
    return null;
  },

  email: (value, message = "Please enter a valid email address") => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return message || `Must be no more than ${max} characters`;
    }
    return null;
  },

  pattern: (regex, message = "Invalid format") => (value) => {
    if (!value) return null;
    if (!regex.test(value)) {
      return message;
    }
    return null;
  },

  match: (fieldName, message) => (value, allValues) => {
    if (!value) return null;
    if (value !== allValues[fieldName]) {
      return message || `Must match ${fieldName}`;
    }
    return null;
  },

  phone: (value, message = "Please enter a valid phone number") => {
    if (!value) return null;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ""))) {
      return message;
    }
    return null;
  },

  url: (value, message = "Please enter a valid URL") => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },
};

/**
 * Password strength calculator
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { score: 0, label: "", color: "", feedback: [] };
  }

  let score = 0;
  const feedback = [];

  // Length checks
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("Use at least 8 characters");
  }

  if (password.length >= 12) {
    score += 1;
  }

  // Character type checks
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add lowercase letters");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add uppercase letters");
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add numbers");
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add special characters (!@#$%...)");
  }

  // Normalize score to 0-4
  const normalizedScore = Math.min(Math.floor(score / 1.5), 4);

  const strengthMap = {
    0: { label: "Very Weak", color: "error" },
    1: { label: "Weak", color: "error" },
    2: { label: "Fair", color: "warning" },
    3: { label: "Good", color: "info" },
    4: { label: "Strong", color: "success" },
  };

  return {
    score: normalizedScore,
    ...strengthMap[normalizedScore],
    feedback,
  };
};

/**
 * Validate a single field with multiple rules
 */
export const validateField = (value, rules = [], allValues = {}) => {
  for (const rule of rules) {
    const error = typeof rule === "function" ? rule(value, allValues) : null;
    if (error) return error;
  }
  return null;
};

/**
 * Validate entire form
 */
export const validateForm = (values, validationSchema) => {
  const errors = {};
  let isValid = true;

  for (const [fieldName, rules] of Object.entries(validationSchema)) {
    const error = validateField(values[fieldName], rules, values);
    if (error) {
      errors[fieldName] = error;
      isValid = false;
    }
  }

  return { errors, isValid };
};