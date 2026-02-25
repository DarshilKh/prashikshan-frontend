// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowLeft, LogIn, User, Building2, GraduationCap } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import { useForm } from "../../hooks/useForm";
import { validators } from "../../utils/validation";
import { FormField } from "../../components/common/FormField";
import { Button } from "../../components/common/Button";
import { Heading, Body, Caption } from "../../components/common/Typography";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const LoginPage = () => {
  const [loginTab, setLoginTab] = useState("student");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const prefersReducedMotion = useReducedMotion();

  // Tab icons
  const tabIcons = {
    student: GraduationCap,
    faculty: User,
    industry: Building2,
  };

  // Validation schema
  const validationSchema = {
    email: [
      validators.required("Email is required"),
      validators.email("Please enter a valid email address"),
    ],
    password: [
      validators.required("Password is required"),
      validators.minLength(6, "Password must be at least 6 characters"),
    ],
  };

  // Form hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    getFieldMeta,
    resetForm,
  } = useForm(
    { email: "", password: "" },
    validationSchema
  );

  // Reset form when tab changes
  const handleTabChange = (tab) => {
    setLoginTab(tab);
    resetForm({ email: "", password: "" });
  };

  // Handle form submission
  const onSubmit = async (formValues) => {
    try {
      const result = await login(formValues.email, formValues.password, loginTab);

      if (result.success) {
        showSuccess(
          `Welcome back! Redirecting to your dashboard...`,
          "Login Successful 🎉"
        );
        // Navigation is handled by AuthContext/ProtectedRoute
      } else {
        showError(
          result.error || "Invalid credentials. Please try again.",
          "Login Failed"
        );
      }
    } catch (err) {
      showError("An unexpected error occurred. Please try again.", "Error");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[rgb(var(--background))]">
      <motion.div
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-[rgb(var(--surface))] rounded-2xl shadow-xl p-8 w-full max-w-md border border-[rgb(var(--border))]"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Heading level={2} className="mb-2">
            Welcome Back
          </Heading>
          <Body muted>
            Sign in to continue to Prashikshan
          </Body>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-6 bg-[rgb(var(--background))] p-1.5 rounded-xl">
          {["student", "faculty", "industry"].map((tab) => {
            const Icon = tabIcons[tab];
            const isActive = loginTab === tab;
            
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`
                  flex-1 py-2.5 px-3 rounded-lg font-medium transition-all duration-200
                  flex items-center justify-center gap-2
                  focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2
                  ${isActive
                    ? "bg-[rgb(var(--primary))] text-white shadow-md"
                    : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface))] hover:text-[rgb(var(--foreground))]"
                  }
                `}
                aria-pressed={isActive}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Login Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={loginTab}
            variants={prefersReducedMotion ? {} : formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Email Field */}
            <FormField
              label="Email Address"
              type="email"
              placeholder={`${loginTab}@example.com`}
              leftIcon={<Mail className="w-5 h-5" />}
              helperText={`Enter your ${loginTab} email`}
              required
              autoComplete="email"
              {...getFieldProps("email")}
              {...getFieldMeta("email")}
            />

            {/* Password Field */}
            <FormField
              label="Password"
              type="password"
              placeholder="Enter your password"
              leftIcon={<Lock className="w-5 h-5" />}
              required
              autoComplete="current-password"
              {...getFieldProps("password")}
              {...getFieldMeta("password")}
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-[rgb(var(--primary))] hover:underline focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] rounded"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              leftIcon={<LogIn className="w-5 h-5" />}
              className="w-full"
            >
              {isSubmitting 
                ? "Signing in..." 
                : `Sign in as ${loginTab.charAt(0).toUpperCase() + loginTab.slice(1)}`
              }
            </Button>

            {/* Demo Credentials Hint */}
            <div className="p-3 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))]">
              <Caption className="block text-center">
                Demo: Use any email with password "password123"
              </Caption>
            </div>
          </motion.form>
        </AnimatePresence>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <Body size="sm" muted>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[rgb(var(--primary))] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] rounded"
            >
              Sign Up
            </Link>
          </Body>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] rounded px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;