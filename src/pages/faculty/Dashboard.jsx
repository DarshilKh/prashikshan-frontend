// src/pages/faculty/Dashboard.jsx
import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { User, BookOpen, TrendingUp, Briefcase, ArrowRight } from "lucide-react";
import { facultyData } from "../../data/mockData";
import { Heading, Body, Caption } from "../../components/common/Typography";
import { Button } from "../../components/common/Button";
import { 
  SkeletonStatCard, 
  SkeletonListItem,
  Skeleton 
} from "../../components/common/Skeleton";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useSimulatedLoading } from "../../hooks/useSimulatedLoading";

const FacultyDashboard = () => {
  const { navigate } = useOutletContext();
  const prefersReducedMotion = useReducedMotion();

  // Use the simulated loading hook - consistent 800ms delay
  const { data, isLoading } = useSimulatedLoading(facultyData, {
    delay: 800, // Consistent loading time
    simulateLoading: true,
  });

  // Stats configuration - memoized
  const stats = useMemo(() => [
    {
      label: "Total Students",
      value: data?.totalStudents,
      icon: User,
      bgGradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Pending Reviews",
      value: data?.pendingReviews,
      icon: BookOpen,
      bgGradient: "from-orange-500 to-orange-600",
    },
    {
      label: "Avg Completion",
      value: data ? `${data.avgCompletion}%` : null,
      icon: TrendingUp,
      bgGradient: "from-green-500 to-green-600",
    },
    {
      label: "Industry Collaborations",
      value: data?.activeCollaborations,
      icon: Briefcase,
      bgGradient: "from-purple-500 to-purple-600",
    },
  ], [data]);

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
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
        ) : (
          <>
            <Heading level={2}>Faculty Dashboard</Heading>
            <Body muted>Manage and monitor student progress</Body>
          </>
        )}
      </motion.div>

      {/* Stats Cards */}
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
                transition={{ delay: idx * 0.05, duration: 0.3 }} // Fast stagger
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      ) : (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <Heading level={4} className="text-white mb-2">
              Review Pending Internships
            </Heading>
            <Body className="text-blue-100 mb-4">
              {data.pendingReviews} internships awaiting approval
            </Body>
            <Button
              variant="secondary"
              onClick={() => navigate("students")}
              className="bg-white text-blue-600 hover:bg-blue-50 border-0"
            >
              Review Now
            </Button>
          </div>
          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <Heading level={4} className="text-white mb-2">
              Generate Reports
            </Heading>
            <Body className="text-green-100 mb-4">
              Export student progress reports
            </Body>
            <Button
              variant="secondary"
              onClick={() => navigate("reports")}
              className="bg-white text-green-600 hover:bg-green-50 border-0"
            >
              Generate
            </Button>
          </div>
        </motion.div>
      )}

      {/* Recent Student Activity */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))]"
      >
        <div className="flex items-center justify-between mb-4">
          {isLoading ? (
            <Skeleton className="h-7 w-48" />
          ) : (
            <>
              <Heading level={4}>Recent Student Activity</Heading>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("students")}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View All
              </Button>
            </>
          )}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonListItem key={idx} />
            ))
          ) : (
            data.students.slice(0, 3).map((student, idx) => (
              <motion.div
                key={student.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05, duration: 0.3 }} // Fast stagger
                className="flex items-center justify-between p-4 rounded-xl bg-[rgb(var(--background))] hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => navigate(`students/${student.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-semibold">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-[rgb(var(--foreground))]">
                      {student.name}
                    </p>
                    <Caption>
                      {student.branch} • {student.credits} Credits
                    </Caption>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    student.status === "Excellent"
                      ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                      : student.status === "On Track"
                      ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                      : "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400"
                  }`}
                >
                  {student.status}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FacultyDashboard;