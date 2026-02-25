// src/admin/pages/AuditLogs.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ScrollText,
  Search,
  RefreshCw,
  Download,
  Clock,
  User,
  Shield,
  AlertTriangle,
  Info,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Monitor,
  MapPin,
  X
} from 'lucide-react';
import { adminLogsService } from '../services/adminService';
import { Heading, Body } from '../../components/common/Typography';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);

  const ITEMS_PER_PAGE = 15;

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await adminLogsService.getLogs({
        severity: severityFilter !== "all" ? severityFilter : undefined,
        action: actionFilter !== "all" ? actionFilter : undefined,
        actor: searchQuery || undefined,
      });
      setLogs(response.logs);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [severityFilter, actionFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const paginatedLogs = logs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case "critical":
        return {
          color:
            "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30",
          icon: AlertCircle,
        };
      case "warning":
        return {
          color:
            "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
          icon: AlertTriangle,
        };
      case "info":
      default:
        return {
          color:
            "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
          icon: Info,
        };
    }
  };

  const getActionColor = (action) => {
    if (action.includes("LOGIN")) return "text-green-600 dark:text-green-400";
    if (action.includes("SUSPENDED") || action.includes("DELETED"))
      return "text-red-600 dark:text-red-400";
    if (action.includes("CHANGED") || action.includes("RESET"))
      return "text-amber-600 dark:text-amber-400";
    if (action.includes("IMPERSONATION"))
      return "text-purple-600 dark:text-purple-400";
    return "text-blue-600 dark:text-blue-400";
  };

  const uniqueActions = [...new Set(logs.map((log) => log.action))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Heading level={2}>Audit Logs</Heading>
          <Body className="text-[rgb(var(--muted))]">
            Track all system activities and changes
          </Body>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-2.5 rounded-lg bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))] transition-colors"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] rounded-lg hover:bg-[rgb(var(--background))] transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by actor email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Severity</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map((action) => (
            <option key={action} value={action}>
              {action.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl p-4">
          <p className="text-[rgb(var(--muted))] text-sm">Total Logs</p>
          <p className="text-2xl font-bold text-[rgb(var(--foreground))]">
            {logs.length}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4">
          <p className="text-blue-700 dark:text-blue-400 text-sm">Info</p>
          <p className="text-2xl font-bold text-[rgb(var(--foreground))]">
            {logs.filter((l) => l.severity === "info").length}
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
          <p className="text-amber-700 dark:text-amber-400 text-sm">Warnings</p>
          <p className="text-2xl font-bold text-[rgb(var(--foreground))]">
            {logs.filter((l) => l.severity === "warning").length}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4">
          <p className="text-red-700 dark:text-red-400 text-sm">Critical</p>
          <p className="text-2xl font-bold text-[rgb(var(--foreground))]">
            {logs.filter((l) => l.severity === "critical").length}
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-[rgb(var(--muted))]">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center">
            <ScrollText className="w-12 h-12 text-[rgb(var(--muted))] mx-auto mb-4" />
            <p className="text-[rgb(var(--muted))]">No logs found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[rgb(var(--background))] border-b border-[rgb(var(--border))]">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      Timestamp
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      Severity
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      Action
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      Actor
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      Target
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--foreground))]">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log, idx) => {
                    const { color, icon: SeverityIcon } = getSeverityConfig(
                      log.severity,
                    );

                    return (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        onClick={() => setSelectedLog(log)}
                        className="border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--background))] cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-[rgb(var(--muted))] text-sm">
                            <Clock size={14} />
                            <span>
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
                          >
                            <SeverityIcon size={12} />
                            {log.severity}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`font-mono text-sm ${getActionColor(log.action)}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[rgb(var(--background))] flex items-center justify-center">
                              {log.actorRole === "ADMIN" ? (
                                <Shield
                                  size={12}
                                  className="text-indigo-600 dark:text-indigo-400"
                                />
                              ) : (
                                <User
                                  size={12}
                                  className="text-[rgb(var(--muted))]"
                                />
                              )}
                            </div>
                            <span className="text-[rgb(var(--foreground))] text-sm truncate max-w-[150px]">
                              {log.actor}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[rgb(var(--muted))] text-sm">
                          {log.target || "-"}
                        </td>
                        <td className="py-4 px-6 text-[rgb(var(--muted))] text-sm truncate max-w-[200px]">
                          {log.details}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[rgb(var(--border))]">
                <p className="text-sm text-[rgb(var(--muted))]">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, logs.length)} of{" "}
                  {logs.length} logs
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface))] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-[rgb(var(--muted))] text-sm px-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface))] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLog(null)}
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
                Log Details
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[rgb(var(--background))] rounded-lg">
                <Clock className="text-[rgb(var(--muted))]" size={18} />
                <div>
                  <p className="text-[rgb(var(--muted))] text-xs">Timestamp</p>
                  <p className="text-[rgb(var(--foreground))] text-sm">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[rgb(var(--background))] rounded-lg">
                <User className="text-[rgb(var(--muted))]" size={18} />
                <div>
                  <p className="text-[rgb(var(--muted))] text-xs">Actor</p>
                  <p className="text-[rgb(var(--foreground))] text-sm">
                    {selectedLog.actor} ({selectedLog.actorRole})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[rgb(var(--background))] rounded-lg">
                <ScrollText className="text-[rgb(var(--muted))]" size={18} />
                <div>
                  <p className="text-[rgb(var(--muted))] text-xs">Action</p>
                  <p
                    className={`text-sm font-mono ${getActionColor(selectedLog.action)}`}
                  >
                    {selectedLog.action}
                  </p>
                </div>
              </div>

              {selectedLog.target && (
                <div className="flex items-center gap-3 p-3 bg-[rgb(var(--background))] rounded-lg">
                  <User className="text-[rgb(var(--muted))]" size={18} />
                  <div>
                    <p className="text-[rgb(var(--muted))] text-xs">Target</p>
                    <p className="text-[rgb(var(--foreground))] text-sm">
                      {selectedLog.target}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-[rgb(var(--background))] rounded-lg">
                <Info className="text-[rgb(var(--muted))]" size={18} />
                <div>
                  <p className="text-[rgb(var(--muted))] text-xs">Details</p>
                  <p className="text-[rgb(var(--foreground))] text-sm">
                    {selectedLog.details}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[rgb(var(--background))] rounded-lg">
                <MapPin className="text-[rgb(var(--muted))]" size={18} />
                <div>
                  <p className="text-[rgb(var(--muted))] text-xs">IP Address</p>
                  <p className="text-[rgb(var(--foreground))] text-sm font-mono">
                    {selectedLog.ipAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[rgb(var(--background))] rounded-lg">
                <Monitor className="text-[rgb(var(--muted))]" size={18} />
                <div>
                  <p className="text-[rgb(var(--muted))] text-xs">User Agent</p>
                  <p className="text-[rgb(var(--foreground))] text-sm truncate">
                    {selectedLog.userAgent}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AuditLogs;