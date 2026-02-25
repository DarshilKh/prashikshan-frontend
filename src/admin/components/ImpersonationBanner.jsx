// src/admin/components/ImpersonationBanner.jsx

import React from "react";
import { motion } from "framer-motion";
import { UserCircle, AlertTriangle, Eye, ArrowLeft } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const ImpersonationBanner = () => {
  const { impersonation, isImpersonating, endImpersonation } = useAdmin();
  const navigate = useNavigate();

  if (!isImpersonating || !impersonation) return null;

  const handleEndImpersonation = async () => {
    await endImpersonation();
    navigate("/admin/users");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return "text-blue-400";
      case "faculty":
        return "text-green-400";
      case "industry":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-9999 bg-linear-to-r from-amber-600 via-orange-500 to-red-500 text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
              <Eye size={16} />
              <span className="font-semibold text-sm">IMPERSONATION MODE</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <UserCircle size={20} />
              </div>
              <div>
                <p className="font-medium">
                  Viewing as:{" "}
                  <span className="font-bold">
                    {impersonation.impersonatedUser.name}
                  </span>
                </p>
                <p className="text-sm text-white/80">
                  Role:{" "}
                  <span
                    className={`font-medium ${getRoleColor(impersonation.impersonatedUser.role)}`}
                  >
                    {impersonation.impersonatedUser.role
                      .charAt(0)
                      .toUpperCase() +
                      impersonation.impersonatedUser.role.slice(1)}
                  </span>
                  <span className="mx-2">•</span>
                  {impersonation.impersonatedUser.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-white/80">
              <AlertTriangle size={14} />
              <span>Actions are logged for security</span>
            </div>

            <motion.button
              onClick={handleEndImpersonation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Exit Impersonation
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImpersonationBanner;
