import React, { useState } from "react";
import { motion } from "framer-motion";

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      title: "AI Resume Screener",
      company: "TechNova",
      status: "Approved",
      credits: 4,
      appliedDate: "2024-01-15",
    },
    {
      id: 2,
      title: "IoT Energy Monitor",
      company: "GreenGrid",
      status: "Shortlisted",
      credits: 6,
      appliedDate: "2024-01-20",
    },
    {
      id: 3,
      title: "Web Portal for NEP Credits",
      company: "EduCore",
      status: "Applied",
      credits: 5,
      appliedDate: "2024-02-01",
    },
    {
      id: 4,
      title: "Blockchain Certification System",
      company: "CertiChain",
      status: "Rejected",
      credits: 8,
      appliedDate: "2024-01-10",
    },
  ]);

  const handleWithdraw = (id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    alert("Application withdrawn successfully!");
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/15 text-green-600";
      case "Rejected":
        return "bg-red-500/15 text-red-600";
      case "Shortlisted":
        return "bg-blue-500/15 text-blue-600";
      default:
        return "bg-yellow-500/15 text-yellow-600";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">My Applications</h2>
        <p className="opacity-70">
          Track your internship applications
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app, idx) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl shadow-lg p-6
              bg-[rgb(var(--surface))]
              border border-black/10 dark:border-white/10"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">
                {app.title}
              </h3>
              <p className="text-sm text-blue-600 font-medium">
                {app.company}
              </p>
              <p className="text-xs opacity-50 mt-1">
                Applied: {app.appliedDate}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="opacity-70">
                  Credits Offered
                </span>
                <span className="font-semibold">
                  {app.credits}
                </span>
              </div>

              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                  app.status
                )}`}
              >
                {app.status}
              </span>
            </div>

            {app.status === "Applied" ||
            app.status === "Shortlisted" ? (
              <button
                onClick={() => handleWithdraw(app.id)}
                className="w-full bg-red-600 text-white py-2 rounded-lg
                  hover:bg-red-700 transition text-sm font-medium"
              >
                Withdraw Application
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2 rounded-lg text-sm font-medium
                  bg-black/10 dark:bg-white/10 cursor-not-allowed"
              >
                {app.status}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
