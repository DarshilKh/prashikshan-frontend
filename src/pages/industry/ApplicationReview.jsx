// src/pages/industry/ApplicationReview.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, FileText, Check, X } from "lucide-react";

const IndustryApplicationReview = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  // Mock application data
  const application = {
    id: applicationId,
    studentName: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    position: "Frontend Developer Intern",
    appliedDate: "2024-01-15",
    status: "Pending",
    resume: "resume.pdf",
    coverLetter: "I am excited to apply for this position...",
    skills: ["React", "JavaScript", "CSS", "HTML"],
    education: "B.Tech Computer Science - 3rd Year",
    college: "IIT Delhi",
  };

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate("/industry/applications")}
        className="flex items-center gap-2 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Applications
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[rgb(var(--surface))] rounded-2xl p-8 border border-[rgb(var(--border))]"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-bold text-2xl">
            {application.studentName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[rgb(var(--foreground))]">
                  {application.studentName}
                </h2>
                <p className="text-[rgb(var(--muted))]">
                  Applied for: {application.position}
                </p>
              </div>
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300">
                {application.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2 text-[rgb(var(--muted))]">
                <Mail size={16} />
                {application.email}
              </div>
              <div className="flex items-center gap-2 text-[rgb(var(--muted))]">
                <Phone size={16} />
                {application.phone}
              </div>
              <div className="flex items-center gap-2 text-[rgb(var(--muted))]">
                <FileText size={16} />
                Applied: {application.appliedDate}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))]"
      >
        <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-4">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {application.skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))]"
      >
        <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-4">
          Education
        </h3>
        <p className="text-[rgb(var(--foreground))]">{application.education}</p>
        <p className="text-[rgb(var(--muted))]">{application.college}</p>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
        >
          <Check size={20} />
          Approve Application
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all"
        >
          <X size={20} />
          Reject Application
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] rounded-xl font-medium border border-[rgb(var(--border))] hover:bg-[rgb(var(--surface))] transition-all"
        >
          <FileText size={20} />
          Download Resume
        </motion.button>
      </div>
    </div>
  );
};

export default IndustryApplicationReview;