// src/admin/pages/RequestAccess.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Mail,
  User,
  Building2,
  Briefcase,
  Phone,
  FileText,
  ArrowLeft,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useForm } from "../../hooks/useForm";
import { validators } from "../../utils/validation";
import { FormField, SelectField } from "../../components/common/FormField";
import { Button } from "../../components/common/Button";
import { Heading, Body, Caption } from "../../components/common/Typography";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useToast } from "../../context/ToastContext";

const RequestAccess = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [requestId, setRequestId] = useState("");
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { showSuccess, showError } = useToast();

  // Validation schema
  const validationSchema = {
    name: [
      validators.required("Full name is required"),
      validators.minLength(2, "Name must be at least 2 characters"),
    ],
    email: [
      validators.required("Email is required"),
      validators.email("Please enter a valid email address"),
    ],
    phone: [validators.phone("Please enter a valid phone number")],
    department: [validators.required("Please select a department")],
    designation: [validators.required("Designation is required")],
    employeeId: [validators.required("Employee/Staff ID is required")],
    reason: [
      validators.required("Please provide a reason for access"),
      validators.minLength(
        20,
        "Please provide more details (min 20 characters)",
      ),
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
  } = useForm(
    {
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      employeeId: "",
      reason: "",
      accessLevel: "viewer",
    },
    validationSchema,
  );

  // Department options
  const departmentOptions = [
    { value: "administration", label: "Administration" },
    { value: "academics", label: "Academics" },
    { value: "placement", label: "Training & Placement Cell" },
    { value: "it", label: "IT Department" },
    { value: "hr", label: "Human Resources" },
    { value: "finance", label: "Finance" },
    { value: "other", label: "Other" },
  ];

  // Access level options
  const accessLevelOptions = [
    { value: "viewer", label: "Viewer - Read-only access" },
    { value: "editor", label: "Editor - Can modify content" },
    { value: "manager", label: "Manager - Can manage users" },
    { value: "admin", label: "Full Admin - Complete access" },
  ];

  // Handle form submission
  const onSubmit = async (formValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock request ID
      const mockRequestId = `REQ-${Date.now().toString(36).toUpperCase()}`;
      setRequestId(mockRequestId);

      showSuccess(
        "Your access request has been submitted successfully!",
        "Request Submitted",
      );
      setStep(2);
    } catch (err) {
      showError("Failed to submit request. Please try again.", "Error");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center p-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Back to Login */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Link
          to="/admin/login"
          className="flex items-center gap-2 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Back to Login</span>
        </Link>
      </motion.div>

      {/* Main Card */}
      <motion.div
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl z-10"
      >
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {/* Success State */}
            {step === 2 ? (
              <motion.div
                key="success"
                variants={prefersReducedMotion ? {} : contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
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

                <Heading level={2} className="mb-2">
                  Request Submitted!
                </Heading>
                <Body muted className="mb-6 max-w-md mx-auto">
                  Your admin access request has been submitted for review. You
                  will receive an email notification once it's processed.
                </Body>

                {/* Request Details */}
                <div className="bg-[rgb(var(--background))] rounded-xl p-6 mb-6 max-w-sm mx-auto">
                  <Caption muted className="block mb-2">
                    Request Reference
                  </Caption>
                  <code className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {requestId}
                  </code>

                  <div className="mt-4 pt-4 border-t border-[rgb(var(--border))]">
                    <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                      <Clock className="w-4 h-4" />
                      <Caption>Estimated review time: 24-48 hours</Caption>
                    </div>
                  </div>
                </div>

                {/* What's Next */}
                <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
                  <Caption className="font-semibold text-indigo-700 dark:text-indigo-300 mb-3 block">
                    What happens next?
                  </Caption>
                  <ul className="space-y-2 text-sm text-indigo-600 dark:text-indigo-300">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        1
                      </span>
                      Your request will be reviewed by the IT team
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        2
                      </span>
                      Department head approval may be required
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        3
                      </span>
                      You'll receive credentials via email if approved
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/admin/login")}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    Back to Login
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/")}>
                    Go to Homepage
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Request Form */
              <motion.div
                key="form"
                variants={prefersReducedMotion ? {} : contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                  >
                    <Users className="w-8 h-8 text-white" />
                  </motion.div>
                  <Heading level={2} className="mb-2">
                    Request Admin Access
                  </Heading>
                  <Body muted>
                    Fill out this form to request access to the admin portal.
                    Your request will be reviewed by the IT team.
                  </Body>
                </div>

                {/* Info Banner */}
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-700 dark:text-amber-400 font-medium text-sm">
                      Important Notice
                    </p>
                    <p className="text-amber-600 dark:text-amber-300 text-sm mt-1">
                      Admin access is restricted to authorized personnel only.
                      All access requests are logged and must be approved by
                      department heads.
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <Caption className="font-semibold text-[rgb(var(--foreground))] block">
                      Personal Information
                    </Caption>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="Full Name"
                        placeholder="Enter your full name"
                        leftIcon={<User className="w-5 h-5" />}
                        required
                        autoComplete="name"
                        {...getFieldProps("name")}
                        {...getFieldMeta("name")}
                      />

                      <FormField
                        label="Email Address"
                        type="email"
                        placeholder="your.email@prashikshan.com"
                        leftIcon={<Mail className="w-5 h-5" />}
                        required
                        autoComplete="email"
                        {...getFieldProps("email")}
                        {...getFieldMeta("email")}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="Phone Number"
                        type="tel"
                        placeholder="+91 98765 43210"
                        leftIcon={<Phone className="w-5 h-5" />}
                        autoComplete="tel"
                        {...getFieldProps("phone")}
                        {...getFieldMeta("phone")}
                      />

                      <FormField
                        label="Employee/Staff ID"
                        placeholder="e.g., EMP2024001"
                        leftIcon={<Briefcase className="w-5 h-5" />}
                        required
                        {...getFieldProps("employeeId")}
                        {...getFieldMeta("employeeId")}
                      />
                    </div>
                  </div>

                  {/* Work Information */}
                  <div className="space-y-4 pt-4 border-t border-[rgb(var(--border))]">
                    <Caption className="font-semibold text-[rgb(var(--foreground))] block">
                      Work Information
                    </Caption>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SelectField
                        label="Department"
                        placeholder="Select department"
                        options={departmentOptions}
                        required
                        {...getFieldProps("department")}
                        {...getFieldMeta("department")}
                      />

                      <FormField
                        label="Designation"
                        placeholder="e.g., Senior Manager"
                        leftIcon={<Building2 className="w-5 h-5" />}
                        required
                        {...getFieldProps("designation")}
                        {...getFieldMeta("designation")}
                      />
                    </div>

                    <SelectField
                      label="Requested Access Level"
                      placeholder="Select access level"
                      options={accessLevelOptions}
                      helperText="Choose the minimum access level you need"
                      {...getFieldProps("accessLevel")}
                      {...getFieldMeta("accessLevel")}
                    />
                  </div>

                  {/* Reason for Access */}
                  <div className="space-y-4 pt-4 border-t border-[rgb(var(--border))]">
                    <Caption className="font-semibold text-[rgb(var(--foreground))] block">
                      Justification
                    </Caption>

                    <div>
                      <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                        Reason for Access Request{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-[rgb(var(--muted))]" />
                        <textarea
                          placeholder="Please explain why you need admin access and how you will use it..."
                          rows={4}
                          className={`w-full pl-11 pr-4 py-3 bg-[rgb(var(--background))] border rounded-xl text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                            touched.reason && errors.reason
                              ? "border-red-500"
                              : "border-[rgb(var(--border))]"
                          }`}
                          {...getFieldProps("reason")}
                        />
                      </div>
                      {touched.reason && errors.reason && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgb(var(--background))]">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 w-4 h-4 rounded border-[rgb(var(--border))] text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-[rgb(var(--muted))]"
                    >
                      I understand that admin access grants elevated privileges
                      and I agree to use it responsibly in accordance with the{" "}
                      <Link
                        to="/admin-policy"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Admin Usage Policy
                      </Link>
                      . I acknowledge that all my actions will be logged and
                      audited.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    leftIcon={<Send className="w-5 h-5" />}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Submit Access Request
                  </Button>
                </form>

                {/* Already have access */}
                <div className="mt-6 text-center">
                  <Body size="sm" muted>
                    Already have admin access?{" "}
                    <Link
                      to="/admin/login"
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Sign In
                    </Link>
                  </Body>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-[rgb(var(--muted))]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              All access requests are reviewed and logged for security
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestAccess;
