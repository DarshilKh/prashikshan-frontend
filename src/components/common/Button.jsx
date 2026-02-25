// src/components/common/Button.jsx
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "bg-[rgb(var(--error))] text-white hover:opacity-90",
  success: "bg-[rgb(var(--success))] text-white hover:opacity-90",
  ghost: "bg-transparent hover:bg-[rgb(var(--border))] text-[rgb(var(--foreground))]",
  link: "bg-transparent text-[rgb(var(--primary))] hover:underline p-0",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
  icon: "p-2",
};

export const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const isDisabled = disabled || isLoading;

    const MotionComponent = prefersReducedMotion ? "button" : motion.button;

    const motionProps = prefersReducedMotion
      ? {}
      : {
          whileHover: isDisabled ? {} : { scale: 1.02 },
          whileTap: isDisabled ? {} : { scale: 0.98 },
          transition: { duration: 0.15 },
        };

    return (
      <MotionComponent
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
          btn ${variants[variant]} ${sizes[size]}
          focus-ring
          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...motionProps}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="icon-md animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="icon-md">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="icon-md">{rightIcon}</span>}
          </>
        )}
      </MotionComponent>
    );
  }
);

Button.displayName = "Button";

export default Button;