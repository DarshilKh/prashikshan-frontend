// src/admin/pages/AdminDashboard.jsx

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  TrendingUp,
  UserPlus,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  UserCheck,
  Settings,
  FileText,
  Server,
  AlertCircle,
} from "lucide-react";
import {
  adminDashboardService,
  adminSettingsService,
} from "../services/adminService";
import { useAdmin } from "../context/AdminContext";
import { Heading, Body, Caption } from "../../components/common/Typography";
import { Button } from "../../components/common/Button";
import { Skeleton, SkeletonStatCard } from "../../components/common/Skeleton";

const useSimulatedLoading = (fetchFn, { delay = 800 } = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const result = await fetchFn();
      await new Promise((resolve) => setTimeout(resolve, delay));
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, isLoading, refetch };
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin } = useAdmin();

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useSimulatedLoading(
    () => adminDashboardService.getDashboardData(),
    { delay: 800 },
  );

  // Fetch system settings for maintenance status
  const {
    data: systemSettings,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = useSimulatedLoading(() => adminSettingsService.getSettings(), {
    delay: 400,
  });

  // Check maintenance mode
  const isMaintenanceMode =
    systemSettings?.maintenance?.maintenanceMode || false;

  // Stats configuration
  const stats = useMemo(
    () => [
      {
        label: "Total Users",
        value: dashboardData?.overview?.totalUsers?.toLocaleString() || "0",
        change: dashboardData?.overview?.userGrowthPercent || 0,
        trend: "up",
        icon: Users,
        bgGradient: "from-blue-500 to-blue-600",
      },
      {
        label: "Active Users",
        value: dashboardData?.overview?.activeUsers?.toLocaleString() || "0",
        change: 8.2,
        trend: "up",
        icon: UserCheck,
        bgGradient: "from-green-500 to-green-600",
      },
      {
        label: "Open Positions",
        value:
          dashboardData?.internships?.activeOpenings?.toLocaleString() || "0",
        change: 5.4,
        trend: "up",
        icon: Briefcase,
        bgGradient: "from-purple-500 to-purple-600",
      },
      {
        label: "Pending Reports",
        value: dashboardData?.reports?.pending || "0",
        change: -12,
        trend: "down",
        icon: AlertTriangle,
        bgGradient: "from-amber-500 to-orange-500",
      },
    ],
    [dashboardData],
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const userDistribution = useMemo(() => {
    if (!dashboardData) return [];
    const total = dashboardData.overview?.totalUsers || 1;
    return [
      {
        label: "Students",
        count: dashboardData.usersByRole?.students || 0,
        percentage: Math.round(
          ((dashboardData.usersByRole?.students || 0) / total) * 100,
        ),
        color: "bg-blue-500",
        lightColor: "bg-blue-100 dark:bg-blue-500/20",
        textColor: "text-blue-600 dark:text-blue-400",
      },
      {
        label: "Faculty",
        count: dashboardData.usersByRole?.faculty || 0,
        percentage: Math.round(
          ((dashboardData.usersByRole?.faculty || 0) / total) * 100,
        ),
        color: "bg-green-500",
        lightColor: "bg-green-100 dark:bg-green-500/20",
        textColor: "text-green-600 dark:text-green-400",
      },
      {
        label: "Industry",
        count: dashboardData.usersByRole?.industry || 0,
        percentage: Math.round(
          ((dashboardData.usersByRole?.industry || 0) / total) * 100,
        ),
        color: "bg-purple-500",
        lightColor: "bg-purple-100 dark:bg-purple-500/20",
        textColor: "text-purple-600 dark:text-purple-400",
      },
    ];
  }, [dashboardData]);

  return (
    <div className="space-y-6">
      {/* Maintenance Mode Banner */}
      {!settingsLoading && isMaintenanceMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
              <Server className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <div>
              <p className="text-red-700 dark:text-red-400 font-semibold">
                Maintenance Mode Active
              </p>
              <p className="text-red-600 dark:text-red-300 text-sm">
                {systemSettings?.maintenance?.maintenanceMessage ||
                  "The platform is currently under maintenance."}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/admin/settings")}
            className="bg-white dark:bg-[rgb(var(--surface))] border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            Manage
          </Button>
        </motion.div>
      )}

      {/* Welcome Header */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
      >
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-5 w-48" />
          </div>
        ) : (
          <>
            <Heading level={2}>
              Welcome back, {admin?.name?.split(" ")[0]}! 👋
            </Heading>
            <Body muted>Here's what's happening on your platform today</Body>
          </>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonStatCard key={idx} />
            ))
          : stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))] shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Caption className="block mb-1">{stat.label}</Caption>
                      <Heading level={3}>{stat.value}</Heading>
                      <div
                        className={`flex items-center gap-1 mt-1 text-sm ${
                          stat.trend === "up"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                        <span>{Math.abs(stat.change)}%</span>
                        <span className="text-[rgb(var(--muted))]">
                          vs last month
                        </span>
                      </div>
                    </div>
                    <div
                      className={`p-4 rounded-xl bg-linear-to-br ${stat.bgGradient}`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
      </div>

      {/* Platform Health & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))]"
        >
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <Heading level={4}>User Distribution</Heading>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/users")}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {userDistribution.map((item, idx) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium text-[rgb(var(--foreground))]">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[rgb(var(--foreground))]">
                          {item.count.toLocaleString()}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${item.lightColor} ${item.textColor}`}
                        >
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 rounded-full bg-[rgb(var(--background))]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{
                          duration: 0.6,
                          delay: 0.2 + idx * 0.1,
                          ease: "easeOut",
                        }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* User Status Summary */}
              <div className="mt-6 pt-4 border-t border-[rgb(var(--border))]">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 mb-1">
                      <CheckCircle size={14} />
                      <span className="text-lg font-bold">
                        {dashboardData?.usersByStatus?.active || 0}
                      </span>
                    </div>
                    <Caption>Active</Caption>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-600 dark:text-yellow-400 mb-1">
                      <Clock size={14} />
                      <span className="text-lg font-bold">
                        {dashboardData?.usersByStatus?.pending || 0}
                      </span>
                    </div>
                    <Caption>Pending</Caption>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 mb-1">
                      <XCircle size={14} />
                      <span className="text-lg font-bold">
                        {dashboardData?.usersByStatus?.suspended || 0}
                      </span>
                    </div>
                    <Caption>Suspended</Caption>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Platform Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))]"
        >
          {isLoading || settingsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <Heading level={4} className="mb-6">
                Platform Health
              </Heading>

              <div className="grid grid-cols-2 gap-4">
                {/* System Status - Dynamic based on Maintenance Mode */}
                <div
                  className={`p-4 rounded-xl border ${
                    isMaintenanceMode
                      ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
                      : "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isMaintenanceMode ? (
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        isMaintenanceMode
                          ? "text-red-700 dark:text-red-400"
                          : "text-green-700 dark:text-green-400"
                      }`}
                    >
                      System Status
                    </span>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      isMaintenanceMode
                        ? "text-red-700 dark:text-red-400"
                        : "text-green-700 dark:text-green-400"
                    }`}
                  >
                    {isMaintenanceMode ? "Maintenance" : "Operational"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      Placement Rate
                    </span>
                  </div>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                    {dashboardData?.internships?.placementRate || 0}%
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                      Applications
                    </span>
                  </div>
                  <p className="text-lg font-bold text-purple-700 dark:text-purple-400">
                    {dashboardData?.internships?.totalApplications?.toLocaleString() ||
                      0}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      Avg. Session
                    </span>
                  </div>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                    {dashboardData?.activity?.averageSessionDuration || "0m"}
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          {isLoading ? (
            <Skeleton className="h-7 w-40" />
          ) : (
            <Heading level={4}>Recent Activity</Heading>
          )}
          {!isLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/logs")}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All Logs
            </Button>
          )}
        </div>

        <div className="bg-[rgb(var(--surface))] rounded-2xl border border-[rgb(var(--border))] overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-[rgb(var(--border))]">
              {dashboardData?.recentActivity?.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05, duration: 0.3 }}
                  className="flex items-center gap-4 p-4 hover:bg-[rgb(var(--background))] transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      activity.type === "registration"
                        ? "bg-green-100 dark:bg-green-500/20"
                        : activity.type === "application"
                          ? "bg-blue-100 dark:bg-blue-500/20"
                          : activity.type === "approval"
                            ? "bg-purple-100 dark:bg-purple-500/20"
                            : activity.type === "posting"
                              ? "bg-amber-100 dark:bg-amber-500/20"
                              : "bg-gray-100 dark:bg-gray-500/20"
                    }`}
                  >
                    {activity.type === "registration" && (
                      <UserPlus
                        size={18}
                        className="text-green-600 dark:text-green-400"
                      />
                    )}
                    {activity.type === "application" && (
                      <FileText
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    )}
                    {activity.type === "approval" && (
                      <CheckCircle
                        size={18}
                        className="text-purple-600 dark:text-purple-400"
                      />
                    )}
                    {activity.type === "posting" && (
                      <Briefcase
                        size={18}
                        className="text-amber-600 dark:text-amber-400"
                      />
                    )}
                    {activity.type === "completion" && (
                      <TrendingUp
                        size={18}
                        className="text-green-600 dark:text-green-400"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[rgb(var(--foreground))] truncate">
                      {activity.message}
                    </p>
                    <Caption className="truncate">{activity.user}</Caption>
                  </div>
                  <Caption className="shrink-0">{activity.time}</Caption>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Manage Users */}
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <Heading level={4} className="text-white">
                Manage Users
              </Heading>
            </div>
            <Body className="text-blue-100 mb-4">
              View, edit, and manage all platform users
            </Body>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/users")}
              className="bg-white text-blue-600 hover:bg-blue-50 border-0"
            >
              View Users
            </Button>
          </div>

          {/* Review Reports */}
          <div className="bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <Heading level={4} className="text-white">
                Review Reports
              </Heading>
            </div>
            <Body className="text-amber-100 mb-4">
              {dashboardData?.reports?.pending || 0} reports need your attention
            </Body>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/reports")}
              className="bg-white text-amber-600 hover:bg-amber-50 border-0"
            >
              View Reports
            </Button>
          </div>

          {/* System Settings */}
          <div
            className={`rounded-2xl shadow-lg p-6 text-white ${
              isMaintenanceMode
                ? "bg-linear-to-br from-red-500 to-red-600"
                : "bg-linear-to-br from-purple-500 to-purple-600"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {isMaintenanceMode ? (
                  <Server className="w-5 h-5" />
                ) : (
                  <Settings className="w-5 h-5" />
                )}
              </div>
              <Heading level={4} className="text-white">
                {isMaintenanceMode ? "Maintenance Active" : "System Settings"}
              </Heading>
            </div>
            <Body
              className={
                isMaintenanceMode ? "text-red-100 mb-4" : "text-purple-100 mb-4"
              }
            >
              {isMaintenanceMode
                ? "Platform is currently in maintenance mode"
                : "Configure platform features and security"}
            </Body>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/settings")}
              className={
                isMaintenanceMode
                  ? "bg-white text-red-600 hover:bg-red-50 border-0"
                  : "bg-white text-purple-600 hover:bg-purple-50 border-0"
              }
            >
              {isMaintenanceMode ? "Disable Maintenance" : "Open Settings"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Monthly Trends */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))]"
        >
          <Heading level={4} className="mb-6">
            Monthly Trends
          </Heading>

          <div className="grid grid-cols-6 gap-4">
            {dashboardData?.monthlyTrends?.map((month, idx) => (
              <div key={month.month} className="text-center">
                <div className="relative h-32 mb-2">
                  {/* Users bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.users / 1500) * 100}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="absolute bottom-0 left-1 right-1/2 mr-0.5 bg-blue-500 rounded-t-sm opacity-80"
                  />
                  {/* Applications bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.applications / 400) * 100}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.1 }}
                    className="absolute bottom-0 left-1/2 right-1 ml-0.5 bg-green-500 rounded-t-sm opacity-80"
                  />
                </div>
                <Caption>{month.month}</Caption>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[rgb(var(--border))]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-blue-500" />
              <Caption>Users</Caption>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-500" />
              <Caption>Applications</Caption>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
