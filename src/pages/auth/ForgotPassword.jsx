// src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Send, CheckCircle, KeyRound, Lock } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useForm } from "../../hooks/useForm";
import { validators } from "../../utils/validation";
import { FormField } from "../../components/common/FormField";
import { Button } from "../../components/common/Button";
import { Heading, Body, Caption } from "../../components/common/Typography";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const prefersReducedMotion = useReducedMotion();

  // Step 1: Email form
  const emailForm = useForm(
    { email: "" },
    {
      email: [
        validators.required("Email is required"),
        validators.email("Please enter a valid email address"),
      ],
    }
  );

  // Step 2: OTP form
  const otpForm = useForm(
    { otp: "" },
    {
      otp: [
        validators.required("OTP is required"),
        validators.minLength(6, "OTP must be 6 digits"),
        validators.maxLength(6, "OTP must be 6 digits"),
      ],
    }
  );

  // Step 3: New password form
  const passwordForm = useForm(
    { password: "", confirmPassword: "" },
    {
      password: [
        validators.required("Password is required"),
        validators.minLength(8, "Password must be at least 8 characters"),
      ],
      confirmPassword: [
        validators.required("Please confirm your password"),
        validators.match("password", "Passwords do not match"),
      ],
    }
  );

  // Handle email submission
  const handleEmailSubmit = async (values) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmail(values.email);
      showInfo("OTP sent to your email address", "Check your inbox");
      setStep(2);
    } catch (err) {
      showError("Failed to send OTP. Please try again.", "Error");
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (values) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Demo: Accept any 6-digit OTP
      if (values.otp.length === 6) {
        showSuccess("OTP verified successfully", "Verified");
        setStep(3);
      } else {
        showError("Invalid OTP. Please try again.", "Verification Failed");
      }
    } catch (err) {
      showError("Failed to verify OTP. Please try again.", "Error");
    }
  };

  // Handle password reset
  const handlePasswordSubmit = async (values) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showSuccess("Password reset successfully!", "Success");
      setStep(4);
    } catch (err) {
      showError("Failed to reset password. Please try again.", "Error");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showInfo("OTP resent to your email", "Check your inbox");
    } catch (err) {
      showError("Failed to resend OTP", "Error");
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

  // Step indicator
  const steps = [
    { number: 1, label: "Email" },
    { number: 2, label: "Verify" },
    { number: 3, label: "Reset" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[rgb(var(--background))]">
      <motion.div
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-[rgb(var(--surface))] rounded-2xl shadow-xl p-8 w-full max-w-md border border-[rgb(var(--border))]"
      >
        {/* Success State */}
        {step === 4 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgb(var(--success-light))] flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[rgb(var(--success))]" />
            </div>
            <Heading level={3} className="mb-2">
              Password Reset Complete!
            </Heading>
            <Body muted className="mb-8">
              Your password has been successfully reset. You can now login with your new password.
            </Body>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/login")}
              className="w-full"
            >
              Continue to Login
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgb(var(--primary-light))] flex items-center justify-center">
                {step === 1 && <Mail className="w-8 h-8 text-[rgb(var(--primary))]" />}
                {step === 2 && <KeyRound className="w-8 h-8 text-[rgb(var(--primary))]" />}
                {step === 3 && <Lock className="w-8 h-8 text-[rgb(var(--primary))]" />}
              </div>
              <Heading level={2} className="mb-2">
                {step === 1 && "Forgot Password?"}
                {step === 2 && "Verify OTP"}
                {step === 3 && "Create New Password"}
              </Heading>
              <Body muted>
                {step === 1 && "Enter your email to receive a verification code"}
                {step === 2 && `Enter the 6-digit code sent to ${email}`}
                {step === 3 && "Choose a strong password for your account"}
              </Body>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((s, idx) => (
                <React.Fragment key={s.number}>
                  <div
                    className={`flex flex-col items-center ${
                      step >= s.number ? "text-[rgb(var(--primary))]" : "text-[rgb(var(--muted))]"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
                        step > s.number
                          ? "bg-[rgb(var(--primary))] text-white"
                          : step === s.number
                          ? "bg-[rgb(var(--primary))] text-white"
                          : "bg-[rgb(var(--background))] border border-[rgb(var(--border))]"
                      }`}
                    >
                      {step > s.number ? <CheckCircle className="w-4 h-4" /> : s.number}
                    </div>
                    <Caption className="mt-1 hidden sm:block">{s.label}</Caption>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-12 h-0.5 rounded-full transition-all ${
                        step > s.number
                          ? "bg-[rgb(var(--primary))]"
                          : "bg-[rgb(var(--border))]"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Form Steps */}
            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  variants={prefersReducedMotion ? {} : stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    leftIcon={<Mail className="w-5 h-5" />}
                    required
                    autoComplete="email"
                    autoFocus
                    {...emailForm.getFieldProps("email")}
                    {...emailForm.getFieldMeta("email")}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={emailForm.isSubmitting}
                    leftIcon={<Send className="w-5 h-5" />}
                    className="w-full"
                  >
                    Send Verification Code
                  </Button>
                </motion.form>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  variants={prefersReducedMotion ? {} : stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    label="Verification Code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    leftIcon={<KeyRound className="w-5 h-5" />}
                    helperText="Check your email for the verification code"
                    required
                    maxLength={6}
                    autoComplete="one-time-code"
                    autoFocus
                    {...otpForm.getFieldProps("otp")}
                    {...otpForm.getFieldMeta("otp")}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={otpForm.isSubmitting}
                    className="w-full"
                  >
                    Verify Code
                  </Button>

                  <div className="text-center">
                    <Caption>
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[rgb(var(--primary))] font-medium hover:underline"
                      >
                        Resend
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
                    Use different email
                  </Button>
                </motion.form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <motion.form
                  key="step3"
                  variants={prefersReducedMotion ? {} : stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    leftIcon={<Lock className="w-5 h-5" />}
                    showPasswordStrength
                    required
                    autoComplete="new-password"
                    autoFocus
                    {...passwordForm.getFieldProps("password")}
                    {...passwordForm.getFieldMeta("password")}
                  />

                  <FormField
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm new password"
                    leftIcon={<Lock className="w-5 h-5" />}
                    required
                    autoComplete="new-password"
                    {...passwordForm.getFieldProps("confirmPassword")}
                    {...passwordForm.getFieldMeta("confirmPassword")}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={passwordForm.isSubmitting}
                    className="w-full"
                  >
                    Reset Password
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Back to Login */}
        {step !== 4 && (
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;