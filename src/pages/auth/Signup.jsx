// src/pages/auth/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  UserPlus, 
  User, 
  Building2, 
  GraduationCap,
  Phone,
  BookOpen,
  Briefcase,
  CheckCircle
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import { useForm } from "../../hooks/useForm";
import { validators } from "../../utils/validation";
import { FormField, SelectField } from "../../components/common/FormField";
import { Button } from "../../components/common/Button";
import { Heading, Body, Caption } from "../../components/common/Typography";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const SignupPage = () => {
  const [signupTab, setSignupTab] = useState("student");
  const [step, setStep] = useState(1); // Multi-step form
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const prefersReducedMotion = useReducedMotion();

  // Tab configuration
  const tabs = [
    { id: "student", label: "Student", icon: GraduationCap },
    { id: "faculty", label: "Faculty", icon: User },
    { id: "industry", label: "Industry", icon: Building2 },
  ];

  // Validation schema based on role and step
  const getValidationSchema = () => {
    const baseSchema = {
      name: [
        validators.required("Full name is required"),
        validators.minLength(2, "Name must be at least 2 characters"),
      ],
      email: [
        validators.required("Email is required"),
        validators.email("Please enter a valid email address"),
      ],
      password: [
        validators.required("Password is required"),
        validators.minLength(8, "Password must be at least 8 characters"),
      ],
      confirmPassword: [
        validators.required("Please confirm your password"),
        validators.match("password", "Passwords do not match"),
      ],
      phone: [
        validators.phone("Please enter a valid phone number"),
      ],
    };

    // Role-specific fields
    const roleSchemas = {
      student: {
        ...baseSchema,
        rollNumber: [validators.required("Roll number is required")],
        branch: [validators.required("Please select your branch")],
        semester: [validators.required("Please select your semester")],
      },
      faculty: {
        ...baseSchema,
        department: [validators.required("Please select your department")],
        designation: [validators.required("Designation is required")],
        employeeId: [validators.required("Employee ID is required")],
      },
      industry: {
        ...baseSchema,
        companyName: [validators.required("Company name is required")],
        designation: [validators.required("Designation is required")],
        companyWebsite: [validators.url("Please enter a valid URL")],
      },
    };

    return roleSchemas[signupTab];
  };

  // Initial values based on role
  const getInitialValues = () => {
    const baseValues = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    };

    const roleValues = {
      student: {
        ...baseValues,
        rollNumber: "",
        branch: "",
        semester: "",
      },
      faculty: {
        ...baseValues,
        department: "",
        designation: "",
        employeeId: "",
      },
      industry: {
        ...baseValues,
        companyName: "",
        designation: "",
        companyWebsite: "",
      },
    };

    return roleValues[signupTab];
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
    setFieldValue,
  } = useForm(getInitialValues(), getValidationSchema());

  // Reset form when tab changes
  const handleTabChange = (tab) => {
    setSignupTab(tab);
    setStep(1);
    resetForm(getInitialValues());
  };

  // Handle form submission
  const onSubmit = async (formValues) => {
    try {
      const result = await register({
        ...formValues,
        role: signupTab,
      });

      if (result?.success) {
        showSuccess(
          "Account created successfully! Please login.",
          "Welcome to Prashikshan! 🎉"
        );
        navigate("/login");
      } else {
        showError(
          result?.error || "Registration failed. Please try again.",
          "Registration Failed"
        );
      }
    } catch (err) {
      showError("An unexpected error occurred. Please try again.", "Error");
    }
  };

  // Step navigation
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Validate current step before proceeding
  const canProceedToStep2 = () => {
    const step1Fields = ["name", "email", "password", "confirmPassword"];
    return step1Fields.every(
      (field) => values[field] && !errors[field]
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Branch options for students
  const branchOptions = [
    { value: "cse", label: "Computer Science & Engineering" },
    { value: "ece", label: "Electronics & Communication" },
    { value: "me", label: "Mechanical Engineering" },
    { value: "ce", label: "Civil Engineering" },
    { value: "ee", label: "Electrical Engineering" },
    { value: "it", label: "Information Technology" },
  ];

  // Semester options
  const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `Semester ${i + 1}`,
  }));

  // Department options for faculty
  const departmentOptions = [
    { value: "cse", label: "Computer Science & Engineering" },
    { value: "ece", label: "Electronics & Communication" },
    { value: "me", label: "Mechanical Engineering" },
    { value: "ce", label: "Civil Engineering" },
    { value: "ee", label: "Electrical Engineering" },
    { value: "mba", label: "Business Administration" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[rgb(var(--background))]">
      <motion.div
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-[rgb(var(--surface))] rounded-2xl shadow-xl p-8 w-full max-w-lg border border-[rgb(var(--border))]"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <Heading level={2} className="mb-2">
            Create Account
          </Heading>
          <Body muted>
            Join Prashikshan to start your journey
          </Body>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all ${
                  step >= s
                    ? "bg-[rgb(var(--primary))] text-white"
                    : "bg-[rgb(var(--background))] text-[rgb(var(--muted))] border border-[rgb(var(--border))]"
                }`}
              >
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 2 && (
                <div
                  className={`w-12 h-1 mx-1 rounded-full transition-all ${
                    step > s
                      ? "bg-[rgb(var(--primary))]"
                      : "bg-[rgb(var(--border))]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Tab Selection - Only on Step 1 */}
        {step === 1 && (
          <div className="flex gap-2 mb-6 bg-[rgb(var(--background))] p-1.5 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = signupTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    flex-1 py-2.5 px-3 rounded-lg font-medium transition-all duration-200
                    flex items-center justify-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2
                    ${isActive
                      ? "bg-[rgb(var(--primary))] text-white shadow-md"
                      : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface))] hover:text-[rgb(var(--foreground))]"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Role Badge on Step 2 */}
        {step === 2 && (
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--primary-light))] text-[rgb(var(--primary))] font-medium">
              {signupTab === "student" && <GraduationCap className="w-4 h-4" />}
              {signupTab === "faculty" && <User className="w-4 h-4" />}
              {signupTab === "industry" && <Building2 className="w-4 h-4" />}
              {signupTab.charAt(0).toUpperCase() + signupTab.slice(1)} Registration
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={prefersReducedMotion ? {} : stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
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
                  placeholder={`${signupTab}@example.com`}
                  leftIcon={<Mail className="w-5 h-5" />}
                  required
                  autoComplete="email"
                  {...getFieldProps("email")}
                  {...getFieldMeta("email")}
                />

                <FormField
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  showPasswordStrength
                  required
                  autoComplete="new-password"
                  {...getFieldProps("password")}
                  {...getFieldMeta("password")}
                />

                <FormField
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  required
                  autoComplete="new-password"
                  {...getFieldProps("confirmPassword")}
                  {...getFieldMeta("confirmPassword")}
                />

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={nextStep}
                  disabled={!canProceedToStep2()}
                  className="w-full mt-6"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {/* Step 2: Role-specific Information */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={prefersReducedMotion ? {} : stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <FormField
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  leftIcon={<Phone className="w-5 h-5" />}
                  autoComplete="tel"
                  {...getFieldProps("phone")}
                  {...getFieldMeta("phone")}
                />

                {/* Student-specific fields */}
                {signupTab === "student" && (
                  <>
                    <FormField
                      label="Roll Number"
                      placeholder="e.g., 2021CSE001"
                      leftIcon={<BookOpen className="w-5 h-5" />}
                      required
                      {...getFieldProps("rollNumber")}
                      {...getFieldMeta("rollNumber")}
                    />

                    <SelectField
                      label="Branch"
                      placeholder="Select your branch"
                      options={branchOptions}
                      required
                      {...getFieldProps("branch")}
                      {...getFieldMeta("branch")}
                    />

                    <SelectField
                      label="Semester"
                      placeholder="Select your semester"
                      options={semesterOptions}
                      required
                      {...getFieldProps("semester")}
                      {...getFieldMeta("semester")}
                    />
                  </>
                )}

                {/* Faculty-specific fields */}
                {signupTab === "faculty" && (
                  <>
                    <FormField
                      label="Employee ID"
                      placeholder="e.g., FAC2021001"
                      leftIcon={<BookOpen className="w-5 h-5" />}
                      required
                      {...getFieldProps("employeeId")}
                      {...getFieldMeta("employeeId")}
                    />

                    <SelectField
                      label="Department"
                      placeholder="Select your department"
                      options={departmentOptions}
                      required
                      {...getFieldProps("department")}
                      {...getFieldMeta("department")}
                    />

                    <FormField
                      label="Designation"
                      placeholder="e.g., Assistant Professor"
                      leftIcon={<Briefcase className="w-5 h-5" />}
                      required
                      {...getFieldProps("designation")}
                      {...getFieldMeta("designation")}
                    />
                  </>
                )}

                {/* Industry-specific fields */}
                {signupTab === "industry" && (
                  <>
                    <FormField
                      label="Company Name"
                      placeholder="e.g., Tech Solutions Pvt. Ltd."
                      leftIcon={<Building2 className="w-5 h-5" />}
                      required
                      {...getFieldProps("companyName")}
                      {...getFieldMeta("companyName")}
                    />

                    <FormField
                      label="Your Designation"
                      placeholder="e.g., HR Manager"
                      leftIcon={<Briefcase className="w-5 h-5" />}
                      required
                      {...getFieldProps("designation")}
                      {...getFieldMeta("designation")}
                    />

                    <FormField
                      label="Company Website"
                      type="url"
                      placeholder="https://www.company.com"
                      helperText="Optional but recommended"
                      {...getFieldProps("companyWebsite")}
                      {...getFieldMeta("companyWebsite")}
                    />
                  </>
                )}

                {/* Terms Agreement */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgb(var(--background))]">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 w-4 h-4 rounded border-[rgb(var(--border))] text-[rgb(var(--primary))] focus:ring-[rgb(var(--primary))]"
                  />
                  <label htmlFor="terms" className="text-sm text-[rgb(var(--muted))]">
                    I agree to the{" "}
                    <Link to="/terms" className="text-[rgb(var(--primary))] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-[rgb(var(--primary))] hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={prevStep}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    leftIcon={<UserPlus className="w-5 h-5" />}
                    className="flex-1"
                  >
                    Create Account
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <Body size="sm" muted>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[rgb(var(--primary))] font-semibold hover:underline"
            >
              Sign In
            </Link>
          </Body>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;