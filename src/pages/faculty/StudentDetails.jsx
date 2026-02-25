// src/pages/faculty/StudentDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { facultyData } from "../../data/mockData";

const FacultyStudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  // Find student by ID (mock data)
  const student = facultyData.students.find(
    (s) => s.id === parseInt(studentId)
  ) || {
    id: studentId,
    name: "Student Name",
    branch: "Computer Science",
    credits: 18,
    status: "On Track",
    email: "student@example.com",
    phone: "+91 98765 43210",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/faculty/students")}
        className="flex items-center gap-2 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Students
      </button>

      {/* Student Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[rgb(var(--surface))] rounded-2xl p-8 border border-[rgb(var(--border))]"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-bold text-3xl">
            {student.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold text-[rgb(var(--foreground))]">
              {student.name}
            </h2>
            <p className="text-[rgb(var(--muted))]">{student.branch}</p>
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <span className="flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
                <Mail size={16} />
                {student.email || "student@example.com"}
              </span>
              <span className="flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
                <Phone size={16} />
                {student.phone || "+91 98765 43210"}
              </span>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              student.status === "Excellent"
                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                : student.status === "On Track"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
            }`}
          >
            {student.status}
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Credits Earned", value: student.credits, color: "blue" },
          { label: "Internships", value: 2, color: "green" },
          { label: "Pending Reviews", value: 1, color: "orange" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))] text-center"
          >
            <p className={`text-4xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
              {stat.value}
            </p>
            <p className="text-[rgb(var(--muted))] mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all">
          Send Message
        </button>
        <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all">
          Approve Internship
        </button>
        <button className="px-6 py-3 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] rounded-xl font-medium border border-[rgb(var(--border))] hover:bg-[rgb(var(--surface))] transition-all">
          Download Report
        </button>
      </div>
    </div>
  );
};

export default FacultyStudentDetails;