// src/admin/pages/AdminLogin.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft,
  LogIn,
  KeyRound,
  CheckCircle,
  Fingerprint,
  ShieldCheck,
  Clock,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { useForm } from "../../hooks/useForm";
import { validators } from "../../utils/validation";
import { FormField } from "../../components/common/FormField";
import { Button } from "../../components/common/Button";
import { Heading, Body, Caption } from "../../components/common/Typography";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useToast } from "../../context/ToastContext";

const AdminLogin = () => {
  const [step, setStep] = useState(1);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const { login, isAuthenticated, isLoading: authLoading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const { showSuccess, showError, showWarning } = useToast();

  // Validation schema
  const validationSchema = {
    email: [
      validators.required("Admin email is required"),
      validators.email("Please enter a valid email address"),
    ],
    password: [
      validators.required("Password is required"),
      validators.minLength(6, "Password must be at least 6 characters"),
    ],
  };

  // 2FA validation schema
  const twoFASchema = {
    code: [
      validators.required("Verification code is required"),
      validators.minLength(6, "Code must be 6 digits"),
      validators.maxLength(6, "Code must be 6 digits"),
    ],
  };

  // Credentials form
  const credentialsForm = useForm(
    { email: "", password: "" },
    validationSchema,
  );

  // 2FA form
  const twoFAForm = useForm({ code: "" }, twoFASchema);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  // Lockout timer
  useEffect(() => {
    let interval;
    if (isLocked && lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockoutTimer]);

  // Handle credentials submission
  const handleCredentialsSubmit = async (values) => {
    if (isLocked) {
      showError(`Account locked. Try again in ${lockoutTimer} seconds.`);
      return;
    }

    try {
      const result = await login(values.email, values.password);

      if (result.success) {
        const requires2FA = values.email.includes("secure");

        if (requires2FA) {
          setStep(2);
          showWarning("Two-factor authentication required", "Security Check");
        } else {
          setStep(3);
          showSuccess("Authentication successful!", "Welcome Admin");
          setTimeout(() => {
            const from = location.state?.from?.pathname || "/admin/dashboard";
            navigate(from, { replace: true });
          }, 1500);
        }
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockoutTimer(300);
          showError(
            "Too many failed attempts. Account locked for 5 minutes.",
            "Account Locked",
          );
        } else {
          showError(
            result.error || "Invalid credentials",
            `Attempt ${newAttempts}/5`,
          );
        }
      }
    } catch (err) {
      showError("An unexpected error occurred", "Error");
    }
  };

  // Handle 2FA submission
  const handle2FASubmit = async (values) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (values.code === "123456") {
        setStep(3);
        showSuccess("Two-factor authentication verified!", "Access Granted");
        setTimeout(() => {
          const from = location.state?.from?.pathname || "/admin/dashboard";
          navigate(from, { replace: true });
        }, 1500);
      } else {
        showError("Invalid verification code", "Verification Failed");
      }
    } catch (err) {
      showError("Verification failed", "Error");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  // Format lockout timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-200 dark:border-indigo-900" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
          </div>
          <Body muted>Verifying authentication...</Body>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Back to main site */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Back to Prashikshan</span>
        </Link>
      </motion.div>

      {/* Security Info Toggle */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setShowSecurityInfo(!showSecurityInfo)}
        className="absolute top-6 right-6 flex items-center gap-2 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors"
      >
        <ShieldCheck size={18} />
        <span className="hidden sm:inline">Security Info</span>
      </motion.button>

      {/* Security Info Panel */}
      <AnimatePresence>
        {showSecurityInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 right-6 w-80 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl p-4 shadow-xl z-50"
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-[rgb(var(--foreground))]">
                Security Features
              </span>
            </div>
            <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                256-bit SSL encryption
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Brute-force protection
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Session monitoring
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Audit logging enabled
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Card */}
      <motion.div
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          {/* Success State */}
          {step === 3 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>
              <Heading level={3} className="mb-2">
                Access Granted
              </Heading>
              <Body muted className="mb-4">
                Redirecting to admin dashboard...
              </Body>
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 animate-spin" />
              </div>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  {step === 1 ? (
                    <Shield className="w-8 h-8 text-white" />
                  ) : (
                    <Fingerprint className="w-8 h-8 text-white" />
                  )}
                </motion.div>
                <Heading level={2} className="mb-2">
                  {step === 1 ? "Admin Portal" : "Two-Factor Authentication"}
                </Heading>
                <Body muted>
                  {step === 1
                    ? "Sign in to access the control panel"
                    : "Enter the code from your authenticator app"}
                </Body>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2].map((s, idx) => (
                  <React.Fragment key={s}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
                        step >= s
                          ? "bg-indigo-600 text-white"
                          : "bg-[rgb(var(--background))] text-[rgb(var(--muted))] border border-[rgb(var(--border))]"
                      }`}
                    >
                      {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                    </div>
                    {idx < 1 && (
                      <div
                        className={`w-12 h-1 rounded-full transition-all ${
                          step > s ? "bg-indigo-600" : "bg-[rgb(var(--border))]"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Lockout Warning */}
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                    <div>
                      <p className="text-red-700 dark:text-red-400 font-medium">
                        Account Temporarily Locked
                      </p>
                      <p className="text-red-600 dark:text-red-300 text-sm">
                        Try again in{" "}
                        <span className="font-mono font-bold">
                          {formatTime(lockoutTimer)}
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Login Attempts Warning */}
              {!isLocked && loginAttempts > 0 && loginAttempts < 5 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <p className="text-amber-700 dark:text-amber-400 text-sm">
                    {5 - loginAttempts} attempts remaining before account
                    lockout
                  </p>
                </motion.div>
              )}

              {/* Form Steps */}
              <AnimatePresence mode="wait">
                {/* Step 1: Credentials */}
                {step === 1 && (
                  <motion.form
                    key="step1"
                    variants={prefersReducedMotion ? {} : stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onSubmit={credentialsForm.handleSubmit(
                      handleCredentialsSubmit,
                    )}
                    className="space-y-5"
                  >
                    <FormField
                      label="Admin Email"
                      type="email"
                      placeholder="admin@prashikshan.com"
                      leftIcon={<Mail className="w-5 h-5" />}
                      required
                      autoComplete="email"
                      autoFocus
                      disabled={isLocked}
                      {...credentialsForm.getFieldProps("email")}
                      {...credentialsForm.getFieldMeta("email")}
                    />

                    <FormField
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      leftIcon={<Lock className="w-5 h-5" />}
                      required
                      autoComplete="current-password"
                      disabled={isLocked}
                      {...credentialsForm.getFieldProps("password")}
                      {...credentialsForm.getFieldMeta("password")}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={credentialsForm.isSubmitting}
                      disabled={isLocked || credentialsForm.isSubmitting}
                      leftIcon={<LogIn className="w-5 h-5" />}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      {isLocked
                        ? `Locked (${formatTime(lockoutTimer)})`
                        : "Sign In to Admin"}
                    </Button>
                  </motion.form>
                )}

                {/* Step 2: 2FA */}
                {step === 2 && (
                  <motion.form
                    key="step2"
                    variants={prefersReducedMotion ? {} : stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onSubmit={twoFAForm.handleSubmit(handle2FASubmit)}
                    className="space-y-5"
                  >
                    <FormField
                      label="Verification Code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      leftIcon={<KeyRound className="w-5 h-5" />}
                      helperText="Enter the code from your authenticator app"
                      required
                      maxLength={6}
                      autoComplete="one-time-code"
                      autoFocus
                      {...twoFAForm.getFieldProps("code")}
                      {...twoFAForm.getFieldMeta("code")}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={twoFAForm.isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                    >
                      Verify & Continue
                    </Button>

                    <div className="text-center">
                      <Caption>
                        Having trouble?{" "}
                        <button
                          type="button"
                          className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                        >
                          Use backup code
                        </button>
                      </Caption>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(1)}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                      className="w-full"
                    >
                      Back to login
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Demo Credentials */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-4 bg-[rgb(var(--background))] rounded-xl border border-[rgb(var(--border))]"
                >
                  <Caption className="block text-center mb-3 font-medium">
                    Demo Credentials
                  </Caption>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-[rgb(var(--surface))]">
                      <Caption muted className="block mb-1">
                        Email
                      </Caption>
                      <code className="text-xs text-[rgb(var(--foreground))]">
                        admin@prashikshan.com
                      </code>
                    </div>
                    <div className="p-2 rounded-lg bg-[rgb(var(--surface))]">
                      <Caption muted className="block mb-1">
                        Password
                      </Caption>
                      <code className="text-xs text-[rgb(var(--foreground))]">
                        admin123
                      </code>
                    </div>
                  </div>
                  <Caption muted className="block text-center mt-3">
                    For 2FA demo, use email with "secure" & code "123456"
                  </Caption>
                </motion.div>
              )}

              {/* Request Access Link */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 text-center"
                >
                  <Body size="sm" muted>
                    Don't have admin access?{" "}
                    <Link
                      to="/admin/request-access"
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <UserPlus className="w-4 h-4" />
                      Request Access
                    </Link>
                  </Body>
                </motion.div>
              )}
            </>
          )}

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-[rgb(var(--muted))]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              Secure admin area • All actions are logged and monitored
            </span>
          </motion.div>

          {/* Session Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex items-center justify-center gap-4 text-xs text-[rgb(var(--muted))]"
          >
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Session: 30 min
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Secure Connection
            </span>
          </motion.div>
        </div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-center"
        >
          <Caption muted>
            Need help?{" "}
            <a
              href="mailto:support@prashikshan.com"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Contact IT Support
            </a>
          </Caption>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
