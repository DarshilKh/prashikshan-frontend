// src/components/common/FormField.jsx
import { forwardRef, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { getPasswordStrength } from "../../utils/validation";
import { Label, Caption } from "./Typography";

/**
 * FormField - A comprehensive form input component
 */
export const FormField = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      helperText,
      error,
      success,
      touched,
      required = false,
      disabled = false,
      showPasswordStrength = false,
      leftIcon,
      rightIcon,
      className = "",
      inputClassName = "",
      isLoading = false,
      value,
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const id = useId();
    const prefersReducedMotion = useReducedMotion();
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    // Determine validation state
    const hasError = touched && error;
    const hasSuccess = touched && !error && value && success !== false;

    // Password strength
    const passwordStrength =
      showPasswordStrength && isPassword ? getPasswordStrength(value) : null;

    // Determine border/ring color
    const getStateClasses = () => {
      if (hasError) return "input-error";
      if (hasSuccess) return "input-success";
      return "";
    };

    // Handle focus
    const handleFocus = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    // Handle blur
    const handleBlur = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Animation variants
    const errorVariants = {
      hidden: { opacity: 0, y: -10, height: 0 },
      visible: { opacity: 1, y: 0, height: "auto" },
    };

    return (
      <div className={`space-y-1.5 ${className}`}>
        {/* Label */}
        {label && (
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled || isLoading}
            required={required}
            placeholder={placeholder}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            className={`
              input-base
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon || isPassword || hasError || hasSuccess || isLoading ? "pr-10" : ""}
              ${getStateClasses()}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              focus-ring
              ${inputClassName}
            `}
            {...props}
          />

          {/* Right Side Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Loading Spinner */}
            {isLoading && (
              <Loader2 className="icon-md animate-spin text-[rgb(var(--muted))]" />
            )}

            {/* Success Icon */}
            {hasSuccess && !isLoading && (
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[rgb(var(--success))]"
              >
                <Check className="icon-md" />
              </motion.div>
            )}

            {/* Error Icon */}
            {hasError && !isLoading && (
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[rgb(var(--error))]"
              >
                <AlertCircle className="icon-md" />
              </motion.div>
            )}

            {/* Password Toggle */}
            {isPassword && !isLoading && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors focus-ring rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="icon-md" />
                ) : (
                  <Eye className="icon-md" />
                )}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !isPassword && !hasError && !hasSuccess && !isLoading && (
              <span className="text-[rgb(var(--muted))]">{rightIcon}</span>
            )}
          </div>
        </div>

        {/* Password Strength Indicator */}
        {showPasswordStrength && isPassword && value && (
          <div className="space-y-2">
            {/* Strength Bar */}
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index < passwordStrength.score
                      ? `bg-[rgb(var(--${passwordStrength.color}))]`
                      : "bg-[rgb(var(--border))]"
                  }`}
                  initial={prefersReducedMotion ? {} : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>

            {/* Strength Label */}
            <div className="flex justify-between items-center">
              <Caption className={`text-[rgb(var(--${passwordStrength.color}))]`}>
                {passwordStrength.label}
              </Caption>
              {passwordStrength.feedback.length > 0 && (
                <Caption>{passwordStrength.feedback[0]}</Caption>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {hasError && (
            <motion.div
              id={`${id}-error`}
              role="alert"
              variants={prefersReducedMotion ? {} : errorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center gap-1.5 text-[rgb(var(--error))]"
            >
              <AlertCircle className="icon-sm shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        {helperText && !hasError && (
          <div id={`${id}-helper`} className="flex items-center gap-1.5">
            <Info className="icon-sm text-[rgb(var(--muted))]" />
            <Caption>{helperText}</Caption>
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

/**
 * TextArea variant
 */
export const TextAreaField = forwardRef(
  (
    {
      label,
      name,
      placeholder,
      helperText,
      error,
      success,
      touched,
      required = false,
      disabled = false,
      rows = 4,
      className = "",
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const id = useId();
    const prefersReducedMotion = useReducedMotion();

    const hasError = touched && error;
    const hasSuccess = touched && !error && value && success !== false;

    const getStateClasses = () => {
      if (hasError) return "input-error";
      if (hasSuccess) return "input-success";
      return "";
    };

    const errorVariants = {
      hidden: { opacity: 0, y: -10, height: 0 },
      visible: { opacity: 1, y: 0, height: "auto" },
    };

    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            className={`
              input-base resize-none
              ${getStateClasses()}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              focus-ring
            `}
            {...props}
          />

          {/* Status Icon */}
          <div className="absolute right-3 top-3">
            {hasSuccess && (
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[rgb(var(--success))]"
              >
                <Check className="icon-md" />
              </motion.div>
            )}
            {hasError && (
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[rgb(var(--error))]"
              >
                <AlertCircle className="icon-md" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Character Count (optional) */}
        {props.maxLength && (
          <div className="flex justify-end">
            <Caption>
              {value?.length || 0} / {props.maxLength}
            </Caption>
          </div>
        )}

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {hasError && (
            <motion.div
              id={`${id}-error`}
              role="alert"
              variants={prefersReducedMotion ? {} : errorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center gap-1.5 text-[rgb(var(--error))]"
            >
              <AlertCircle className="icon-sm shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        {helperText && !hasError && (
          <div id={`${id}-helper`} className="flex items-center gap-1.5">
            <Info className="icon-sm text-[rgb(var(--muted))]" />
            <Caption>{helperText}</Caption>
          </div>
        )}
      </div>
    );
  }
);

TextAreaField.displayName = "TextAreaField";

/**
 * Select Field
 */
export const SelectField = forwardRef(
  (
    {
      label,
      name,
      options = [],
      placeholder = "Select an option",
      helperText,
      error,
      touched,
      required = false,
      disabled = false,
      className = "",
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const id = useId();
    const prefersReducedMotion = useReducedMotion();

    const hasError = touched && error;
    const hasSuccess = touched && !error && value;

    const getStateClasses = () => {
      if (hasError) return "input-error";
      if (hasSuccess) return "input-success";
      return "";
    };

    const errorVariants = {
      hidden: { opacity: 0, y: -10, height: 0 },
      visible: { opacity: 1, y: 0, height: "auto" },
    };

    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            className={`
              input-base pr-10 appearance-none cursor-pointer
              ${getStateClasses()}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${!value ? "text-[rgb(var(--muted))]" : ""}
              focus-ring
            `}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Arrow */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-[rgb(var(--muted))]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {hasError && (
            <motion.div
              id={`${id}-error`}
              role="alert"
              variants={prefersReducedMotion ? {} : errorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center gap-1.5 text-[rgb(var(--error))]"
            >
              <AlertCircle className="icon-sm shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        {helperText && !hasError && (
          <div id={`${id}-helper`} className="flex items-center gap-1.5">
            <Info className="icon-sm text-[rgb(var(--muted))]" />
            <Caption>{helperText}</Caption>
          </div>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

export default FormField;