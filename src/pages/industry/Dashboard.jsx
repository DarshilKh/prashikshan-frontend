// src/pages/industry/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, User, Award, TrendingUp, Plus, X, ArrowRight } from "lucide-react";
import { industryData } from "../../data/mockData";
import { Heading, Body, Caption, Label } from "../../components/common/Typography";
import { Button } from "../../components/common/Button";
import { FormField, TextAreaField, SelectField } from "../../components/common/FormField";
import { 
  SkeletonStatCard, 
  SkeletonTable,
  Skeleton 
} from "../../components/common/Skeleton";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useForm } from "../../hooks/useForm";
import { validators } from "../../utils/validation";
import { useEscapeKey } from "../../hooks/useKeyboard";

const IndustryDashboard = () => {
  const { navigate } = useOutletContext();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Close modal on escape
  useEscapeKey(() => setShowPostModal(false), showPostModal);

  // Form for posting internship
  const validationSchema = {
    title: [validators.required("Title is required")],
    description: [
      validators.required("Description is required"),
      validators.minLength(20, "Description must be at least 20 characters"),
    ],
    credits: [validators.required("Credits is required")],
    duration: [validators.required("Duration is required")],
    location: [validators.required("Location is required")],
  };

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
    {
      title: "",
      description: "",
      skills: "",
      credits: "",
      duration: "",
      location: "Remote",
    },
    validationSchema
  );

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(industryData);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      label: "Total Openings",
      value: data?.activeOpenings,
      icon: Briefcase,
      bgGradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Applications Received",
      value: data?.applications,
      icon: User,
      bgGradient: "from-purple-500 to-purple-600",
    },
    {
      label: "Interns Approved",
      value: data?.internsApproved,
      icon: Award,
      bgGradient: "from-green-500 to-green-600",
    },
    {
      label: "Active Listings",
      value: data?.activeListings,
      icon: TrendingUp,
      bgGradient: "from-orange-500 to-orange-600",
    },
  ];

  const handlePostProject = async (formValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Posted internship:", formValues);
    alert("Internship posted successfully!");
    setShowPostModal(false);
    resetForm();
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        variants={prefersReducedMotion ? {} : itemVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between flex-wrap gap-4"
      >
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-5 w-64" />
          </div>
        ) : (
          <div>
            <Heading level={2}>Industry Dashboard</Heading>
            <Body muted>Manage internships and track applications</Body>
          </div>
        )}
        
        {!isLoading && (
          <Button
            variant="primary"
            onClick={() => setShowPostModal(true)}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Post New Internship
          </Button>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonStatCard key={idx} />
          ))
        ) : (
          stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))] shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Caption className="block mb-1">{stat.label}</Caption>
                    <Heading level={3}>{stat.value}</Heading>
                  </div>
                  <div className={`p-4 rounded-xl bg-linear-to-br ${stat.bgGradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <Heading level={4} className="text-white mb-2">
              Review Applications
            </Heading>
            <Body className="text-blue-100 mb-4">
              {data.applications} pending
            </Body>
            <Button
              variant="secondary"
              onClick={() => navigate("applications")}
              className="bg-white text-blue-600 hover:bg-blue-50 border-0"
            >
              View All
            </Button>
          </div>
          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <Heading level={4} className="text-white mb-2">
              Manage Openings
            </Heading>
            <Body className="text-green-100 mb-4">
              {data.activeOpenings} active
            </Body>
            <Button
              variant="secondary"
              onClick={() => navigate("openings")}
              className="bg-white text-green-600 hover:bg-green-50 border-0"
            >
              Manage
            </Button>
          </div>
          <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <Heading level={4} className="text-white mb-2">
              Messages
            </Heading>
            <Body className="text-purple-100 mb-4">5 unread messages</Body>
            <Button
              variant="secondary"
              onClick={() => navigate("messages")}
              className="bg-white text-purple-600 hover:bg-purple-50 border-0"
            >
              View Messages
            </Button>
          </div>
        </motion.div>
      )}

      {/* Recent Applications Table */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))]"
      >
        <div className="flex items-center justify-between mb-4">
          {isLoading ? (
            <Skeleton className="h-7 w-48" />
          ) : (
            <>
              <Heading level={4}>Recent Applications</Heading>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("applications")}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View All
              </Button>
            </>
          )}
        </div>

        {isLoading ? (
          <SkeletonTable rows={5} columns={4} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(var(--border))]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--muted))]">
                    Applicant
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--muted))]">
                    Position
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--muted))]">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--muted))]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentApplications?.slice(0, 5).map((app, idx) => (
                  <motion.tr
                    key={app.id || idx}
                    initial={prefersReducedMotion ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + idx * 0.05 }}
                    className="border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--background))] transition-colors cursor-pointer"
                    onClick={() => navigate(`applications/${app.id}`)}
                  >
                    <td className="py-4 px-4 font-medium text-[rgb(var(--foreground))]">
                      {app.name}
                    </td>
                    <td className="py-4 px-4 text-[rgb(var(--muted))]">
                      {app.project}
                    </td>
                    <td className="py-4 px-4 text-[rgb(var(--muted))]">
                      {app.appliedDate}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === "Approved"
                            ? "bg-[rgb(var(--success-light))] text-[rgb(var(--success))]"
                            : app.status === "Pending"
                            ? "bg-[rgb(var(--warning-light))] text-[rgb(var(--warning))]"
                            : "bg-[rgb(var(--info-light))] text-[rgb(var(--info))]"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPostModal(false)}
          >
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
              className="rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[rgb(var(--surface))]"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div className="flex items-center justify-between mb-6">
                <Heading level={3} id="modal-title">
                  Post New Internship
                </Heading>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(handlePostProject)} className="space-y-5">
                <FormField
                  label="Project Title"
                  placeholder="e.g., Frontend Developer Intern"
                  required
                  {...getFieldProps("title")}
                  {...getFieldMeta("title")}
                />

                <TextAreaField
                  label="Description"
                  placeholder="Describe the internship role, responsibilities, and requirements..."
                  rows={4}
                  required
                  {...getFieldProps("description")}
                  {...getFieldMeta("description")}
                />

                <FormField
                  label="Required Skills"
                  placeholder="e.g., React, Node.js, TypeScript"
                  helperText="Separate skills with commas"
                  {...getFieldProps("skills")}
                  {...getFieldMeta("skills")}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Credits"
                    type="number"
                    placeholder="e.g., 4"
                    required
                    {...getFieldProps("credits")}
                    {...getFieldMeta("credits")}
                  />
                  <FormField
                    label="Duration"
                    placeholder="e.g., 3 months"
                    required
                    {...getFieldProps("duration")}
                    {...getFieldMeta("duration")}
                  />
                </div>

                <SelectField
                  label="Location"
                  required
                  options={[
                    { value: "Remote", label: "Remote" },
                    { value: "On-site", label: "On-site" },
                    { value: "Hybrid", label: "Hybrid" },
                  ]}
                  {...getFieldProps("location")}
                  {...getFieldMeta("location")}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    className="flex-1"
                  >
                    Post Internship
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowPostModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IndustryDashboard;