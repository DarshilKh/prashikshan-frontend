// src/components/common/Typography.jsx
import { forwardRef } from "react";

/**
 * Typography components for consistent text styling
 */

const sizeClasses = {
  1: "text-3xl md:text-4xl",
  2: "text-2xl md:text-3xl",
  3: "text-xl md:text-2xl",
  4: "text-lg md:text-xl",
  5: "text-base md:text-lg",
  6: "text-sm md:text-base",
};

export const Heading = forwardRef(
  ({ level = 2, children, className = "", as, ...props }, ref) => {
    const Tag = as || `h${level}`;
    const size = sizeClasses[level] || sizeClasses[2];

    return (
      <Tag
        ref={ref}
        className={`${size} font-bold text-[rgb(var(--foreground))] ${className}`}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = "Heading";

export const Subheading = forwardRef(
  ({ children, className = "", ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`text-lg font-medium text-[rgb(var(--foreground))] ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Subheading.displayName = "Subheading";

export const Body = forwardRef(
  ({ size = "base", children, className = "", muted = false, ...props }, ref) => {
    const sizeMap = {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    };

    return (
      <p
        ref={ref}
        className={`${sizeMap[size]} ${
          muted ? "text-[rgb(var(--muted))]" : "text-[rgb(var(--foreground))]"
        } ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Body.displayName = "Body";

export const Caption = forwardRef(
  ({ children, className = "", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`text-xs text-[rgb(var(--muted))] ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Caption.displayName = "Caption";

export const Label = forwardRef(
  ({ children, required = false, className = "", ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`block text-sm font-medium text-[rgb(var(--foreground))] mb-1.5 ${className}`}
        {...props}
      >
        {children}
        {required && <span className="text-[rgb(var(--error))] ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";

export default { Heading, Subheading, Body, Caption, Label };