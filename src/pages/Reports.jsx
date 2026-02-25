import React from "react";
import { motion } from "framer-motion";

const ReportsPage = () => {
  const reports = [
    {
      title: "Student Progress Report",
      desc: "Export detailed progress report for all students",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Internship Summary",
      desc: "Summary of all internship activities and approvals",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Credit Analytics",
      desc: "Detailed analytics of credit completion rates",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Custom Report",
      desc: "Create a custom report with specific parameters",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">
          Reports & Analytics
        </h2>
        <p className="opacity-70">
          Generate and export student progress reports
        </p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r, idx) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl shadow-lg p-6
              bg-[rgb(var(--surface))]
              border border-black/10 dark:border-white/10"
          >
            <h3 className="text-xl font-semibold mb-2">
              {r.title}
            </h3>
            <p className="opacity-70 mb-4">
              {r.desc}
            </p>
            <button
              className={`w-full text-white px-6 py-3 rounded-lg
                font-semibold transition ${r.color}`}
            >
              Generate Report
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
