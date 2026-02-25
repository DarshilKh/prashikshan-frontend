// src/admin/pages/Forbidden.jsx

import React from "react";
import { motion } from "framer-motion";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-red-500/5 via-transparent to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center"
        >
          <ShieldX className="w-12 h-12 text-red-600 dark:text-red-400" />
        </motion.div>

        <h1 className="text-4xl font-bold text-[rgb(var(--foreground))] mb-4">
          403
        </h1>
        <h2 className="text-xl font-semibold text-[rgb(var(--foreground))] mb-2">
          Access Forbidden
        </h2>
        <p className="text-[rgb(var(--muted))] mb-8">
          You don't have permission to access this resource. Please contact your
          administrator if you believe this is a mistake.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] rounded-xl font-medium hover:bg-[rgb(var(--background))] transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <Home size={18} />
            Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Forbidden;
