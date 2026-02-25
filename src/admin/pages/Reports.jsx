// src/admin/pages/Reports.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Flag,
  User,
  FileText,
  Bug,
  Clock,
  CheckCircle,
  Eye,
  MessageSquare,
  RefreshCw,
  X,
  AlertCircle,
  AlertOctagon,
  Info,
} from "lucide-react";
import { adminReportsService } from "../services/adminService";
import { useAdmin } from "../context/AdminContext";
import { Heading, Body } from "../../components/common/Typography";

const Reports = () => {
  const { admin } = useAdmin();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    underReview: 0,
    resolved: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolution, setResolution] = useState("");
  const [isResolving, setIsResolving] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await adminReportsService.getReports({
        status: statusFilter !== "all" ? statusFilter : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
      });
      setReports(response.reports);
      setStats({
        pending: response.pending,
        underReview: response.underReview,
        resolved: response.resolved,
      });
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, typeFilter, priorityFilter]);

  const handleUpdateStatus = async (
    reportId,
    newStatus,
    resolutionText = null,
  ) => {
    setIsResolving(true);
    try {
      await adminReportsService.updateReportStatus(
        reportId,
        newStatus,
        resolutionText,
        admin.email,
      );
      await fetchReports();
      setShowResolveModal(false);
      setSelectedReport(null);
      setResolution("");
    } catch (error) {
      console.error("Failed to update report:", error);
    } finally {
      setIsResolving(false);
    }
  };

  // Filter reports by priority (client-side filtering since mock doesn't support it)
  const filteredReports =
    priorityFilter === "all"
      ? reports
      : reports.filter((r) => r.priority === priorityFilter);

  const getTypeIcon = (type) => {
    switch (type) {
      case "user":
        return User;
      case "content":
        return FileText;
      case "bug":
        return Bug;
      default:
        return Flag;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "user":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20";
      case "content":
        return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20";
      case "bug":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-500/20";
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "critical":
        return {
          color: "bg-red-500 text-white",
          icon: AlertOctagon,
          label: "Critical",
          ringColor: "ring-red-500",
        };
      case "high":
        return {
          color: "bg-orange-500 text-white",
          icon: AlertTriangle,
          label: "High",
          ringColor: "ring-orange-500",
        };
      case "medium":
        return {
          color: "bg-yellow-500 text-black",
          icon: AlertCircle,
          label: "Medium",
          ringColor: "ring-yellow-500",
        };
      case "low":
        return {
          color: "bg-gray-400 dark:bg-gray-600 text-white",
          icon: Info,
          label: "Low",
          ringColor: "ring-gray-400",
        };
      default:
        return {
          color: "bg-gray-400 text-white",
          icon: Info,
          label: priority,
          ringColor: "ring-gray-400",
        };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30";
      case "under_review":
        return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30";
      case "resolved":
        return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30";
      default:
        return "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/30";
    }
  };

  // Priority counts for stats
  const priorityCounts = {
    critical: reports.filter(
      (r) => r.priority === "critical" && r.status !== "resolved",
    ).length,
    high: reports.filter(
      (r) => r.priority === "high" && r.status !== "resolved",
    ).length,
    medium: reports.filter(
      (r) => r.priority === "medium" && r.status !== "resolved",
    ).length,
    low: reports.filter((r) => r.priority === "low" && r.status !== "resolved")
      .length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Heading level={2}>Reports & Moderation</Heading>
          <Body className="text-[rgb(var(--muted))]">
            Review and manage reported content and users
          </Body>
        </div>
        <button
          onClick={fetchReports}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] rounded-lg hover:bg-[rgb(var(--background))] transition-colors"
        >
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm font-medium">
                Pending
              </p>
              <p className="text-3xl font-bold text-[rgb(var(--foreground))] mt-1">
                {stats.pending}
              </p>
            </div>
            <Clock className="text-yellow-600 dark:text-yellow-400" size={32} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 dark:text-blue-400 text-sm font-medium">
                Under Review
              </p>
              <p className="text-3xl font-bold text-[rgb(var(--foreground))] mt-1">
                {stats.underReview}
              </p>
            </div>
            <Eye className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                Resolved
              </p>
              <p className="text-3xl font-bold text-[rgb(var(--foreground))] mt-1">
                {stats.resolved}
              </p>
            </div>
            <CheckCircle
              className="text-green-600 dark:text-green-400"
              size={32}
            />
          </div>
        </motion.div>
      </div>

      {/* Priority Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-4">
          Open Reports by Priority
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Critical */}
          <button
            onClick={() =>
              setPriorityFilter(
                priorityFilter === "critical" ? "all" : "critical",
              )
            }
            className={`p-4 rounded-xl border-2 transition-all ${
              priorityFilter === "critical"
                ? "border-red-500 bg-red-50 dark:bg-red-500/10"
                : "border-transparent bg-[rgb(var(--background))] hover:border-red-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <AlertOctagon className="text-red-500" size={24} />
              <span className="text-2xl font-bold text-[rgb(var(--foreground))]">
                {priorityCounts.critical}
              </span>
            </div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Critical
            </p>
          </button>

          {/* High */}
          <button
            onClick={() =>
              setPriorityFilter(priorityFilter === "high" ? "all" : "high")
            }
            className={`p-4 rounded-xl border-2 transition-all ${
              priorityFilter === "high"
                ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                : "border-transparent bg-[rgb(var(--background))] hover:border-orange-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="text-orange-500" size={24} />
              <span className="text-2xl font-bold text-[rgb(var(--foreground))]">
                {priorityCounts.high}
              </span>
            </div>
            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
              High
            </p>
          </button>

          {/* Medium */}
          <button
            onClick={() =>
              setPriorityFilter(priorityFilter === "medium" ? "all" : "medium")
            }
            className={`p-4 rounded-xl border-2 transition-all ${
              priorityFilter === "medium"
                ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10"
                : "border-transparent bg-[rgb(var(--background))] hover:border-yellow-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="text-yellow-500" size={24} />
              <span className="text-2xl font-bold text-[rgb(var(--foreground))]">
                {priorityCounts.medium}
              </span>
            </div>
            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
              Medium
            </p>
          </button>

          {/* Low */}
          <button
            onClick={() =>
              setPriorityFilter(priorityFilter === "low" ? "all" : "low")
            }
            className={`p-4 rounded-xl border-2 transition-all ${
              priorityFilter === "low"
                ? "border-gray-500 bg-gray-50 dark:bg-gray-500/10"
                : "border-transparent bg-[rgb(var(--background))] hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Info className="text-gray-500" size={24} />
              <span className="text-2xl font-bold text-[rgb(var(--foreground))]">
                {priorityCounts.low}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Low
            </p>
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Types</option>
          <option value="user">User Reports</option>
          <option value="content">Content Reports</option>
          <option value="bug">Bug Reports</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Priorities</option>
          <option value="critical">🔴 Critical</option>
          <option value="high">🟠 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">⚪ Low</option>
        </select>

        {/* Active Filter Indicator */}
        {(statusFilter !== "all" ||
          typeFilter !== "all" ||
          priorityFilter !== "all") && (
          <button
            onClick={() => {
              setStatusFilter("all");
              setTypeFilter("all");
              setPriorityFilter("all");
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-[rgb(var(--muted))]">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-[rgb(var(--surface))] rounded-2xl border border-[rgb(var(--border))]">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-[rgb(var(--foreground))] font-medium">
              No reports found
            </p>
            <p className="text-[rgb(var(--muted))] text-sm">
              {priorityFilter !== "all"
                ? `No ${priorityFilter} priority reports`
                : "All caught up!"}
            </p>
          </div>
        ) : (
          filteredReports.map((report, idx) => {
            const TypeIcon = getTypeIcon(report.type);
            const priorityConfig = getPriorityConfig(report.priority);
            const PriorityIcon = priorityConfig.icon;

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-[rgb(var(--surface))] border rounded-2xl p-6 hover:shadow-lg transition-all ${
                  report.priority === "critical"
                    ? "border-red-300 dark:border-red-500/50"
                    : "border-[rgb(var(--border))]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(report.type)}`}
                    >
                      <TypeIcon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-[rgb(var(--foreground))] font-semibold">
                          {report.reason}
                        </h3>

                        {/* Priority Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${priorityConfig.color}`}
                        >
                          <PriorityIcon size={12} />
                          {priorityConfig.label}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}
                        >
                          {report.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-[rgb(var(--muted))] text-sm mb-3">
                        {report.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-[rgb(var(--muted))]">
                          <User size={14} />
                          <span>
                            Reported:{" "}
                            <span className="text-[rgb(var(--foreground))]">
                              {report.reportedItem.name}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[rgb(var(--muted))]">
                          <MessageSquare size={14} />
                          <span>
                            By:{" "}
                            <span className="text-[rgb(var(--foreground))]">
                              {report.reportedBy.name}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[rgb(var(--muted))]">
                          <Clock size={14} />
                          <span>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {report.resolution && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-400">
                            <strong>Resolution:</strong> {report.resolution}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                            Resolved by {report.resolvedBy} on{" "}
                            {new Date(report.resolvedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {report.status !== "resolved" && (
                    <div className="flex flex-col gap-2">
                      {report.status === "pending" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(report.id, "under_review")
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                          Start Review
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowResolveModal(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Resolve Modal */}
      <AnimatePresence>
        {showResolveModal && selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isResolving && setShowResolveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6 w-full max-w-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[rgb(var(--foreground))]">
                  Resolve Report
                </h3>
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6 p-4 bg-[rgb(var(--background))] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const config = getPriorityConfig(selectedReport.priority);
                    const Icon = config.icon;
                    return (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.color}`}
                      >
                        <Icon size={12} />
                        {config.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-[rgb(var(--muted))] text-sm">
                  Report:{" "}
                  <span className="text-[rgb(var(--foreground))] font-medium">
                    {selectedReport.reason}
                  </span>
                </p>
                <p className="text-[rgb(var(--muted))] text-sm mt-1">
                  Reported:{" "}
                  <span className="text-[rgb(var(--foreground))]">
                    {selectedReport.reportedItem.name}
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                  Resolution Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Describe how this report was resolved..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResolveModal(false)}
                  disabled={isResolving}
                  className="flex-1 px-4 py-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] rounded-lg font-medium hover:bg-[rgb(var(--surface))] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      selectedReport.id,
                      "resolved",
                      resolution,
                    )
                  }
                  disabled={isResolving || !resolution.trim()}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isResolving ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  Mark Resolved
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;
