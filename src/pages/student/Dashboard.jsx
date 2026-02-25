// src/pages/student/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Briefcase, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { studentData, projectsData } from "../../data/mockData";
import { Heading, Body, Caption } from "../../components/common/Typography";
import { Button } from "../../components/common/Button";
import { 
  SkeletonStatCard, 
  SkeletonProjectCard,
  Skeleton 
} from "../../components/common/Skeleton";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useSimulatedLoading } from "../../hooks/useSimulatedLoading";

const StudentDashboard = () => {
  const { navigate } = useOutletContext();
  const prefersReducedMotion = useReducedMotion();

  // Memoize data to prevent unnecessary re-renders
  const dashboardData = useMemo(() => ({
    student: studentData,
    projects: projectsData,
  }), []);

  // Use the same loading hook as faculty - 800ms delay (or set to 0 for instant)
  const { data, isLoading } = useSimulatedLoading(dashboardData, {
    delay: 800, // Same as faculty dashboard - reduced from 1500ms
    simulateLoading: true,
  });

  // Stats configuration - memoized
  const stats = useMemo(() => [
    {
      label: "Credits Completed",
      value: data ? `${data.student.credits}/${data.student.totalCredits}` : null,
      icon: Award,
      bgGradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Active Internships",
      value: data?.student.internships,
      icon: Briefcase,
      bgGradient: "from-green-500 to-green-600",
    },
    {
      label: "Skill Match",
      value: data ? `${data.student.skillMatch}%` : null,
      icon: TrendingUp,
      bgGradient: "from-purple-500 to-purple-600",
    },
  ], [data]);

  // Simplified animation variants - faster timing
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Credit progress calculation
  const creditProgress = data 
    ? Math.round((data.student.credits / data.student.totalCredits) * 100) 
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        variants={prefersReducedMotion ? {} : itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }} // Faster animation
        className="mb-6"
      >
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-5 w-48" />
          </div>
        ) : (
          <>
            <Heading level={2}>
              Welcome back, {data.student.name.split(" ")[0]}! 👋
            </Heading>
            <Body muted>
              Here's your internship progress overview
            </Body>
          </>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
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
                transition={{ delay: idx * 0.05, duration: 0.3 }} // Reduced delay from 0.1 to 0.05
                whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2 }}
                className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))] shadow-sm hover:shadow-md transition-shadow"
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

      {/* Credit Progress */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }} // Reduced delay
        className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))]"
      >
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
        ) : (
          <>
            <Heading level={4} className="mb-4">
              Credit Progress
            </Heading>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  In Progress
                </span>
                <span className="text-sm font-semibold text-[rgb(var(--muted))]">
                  {creditProgress}%
                </span>
              </div>
              <div className="overflow-hidden h-3 rounded-full bg-[rgb(var(--background))]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${creditProgress}%` }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }} // Faster animation
                  className="h-full bg-linear-to-r from-blue-500 to-green-400 rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2">
                <Caption>{data.student.credits} credits earned</Caption>
                <Caption>{data.student.totalCredits - data.student.credits} remaining</Caption>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Recommended Projects */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }} // Reduced delay
      >
        <div className="flex items-center justify-between mb-4">
          {isLoading ? (
            <Skeleton className="h-7 w-48" />
          ) : (
            <Heading level={4}>Recommended Projects</Heading>
          )}
          {!isLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("projects")}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonProjectCard key={idx} />
            ))
          ) : (
            data.projects.slice(0, 3).map((project, idx) => (
              <motion.div
                key={project.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.05, duration: 0.3 }} // Much faster stagger
                whileHover={prefersReducedMotion ? {} : { y: -4 }}
                className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))] hover:shadow-lg hover:border-blue-500/50 transition-all cursor-pointer group"
                onClick={() => navigate("projects")}
              >
                {/* Company Logo & Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {project.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[rgb(var(--foreground))] truncate group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h4>
                    <Caption className="truncate block">{project.company}</Caption>
                  </div>
                </div>

                {/* Description */}
                <Body size="sm" muted className="mb-4 line-clamp-2">
                  {project.description}
                </Body>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--muted))]">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--border))]">
                  <div className="flex items-center gap-1.5 text-[rgb(var(--muted))]">
                    <Clock className="w-4 h-4" />
                    <Caption>{project.duration || "3 months"}</Caption>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-600">
                      {project.credits} Credits
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      {!isLoading && (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }} // Reduced delay
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <Heading level={4} className="text-white mb-2">
              Browse Projects
            </Heading>
            <Body className="text-blue-100 mb-4">
              Discover new internship opportunities
            </Body>
            <Button
              variant="secondary"
              onClick={() => navigate("projects")}
              className="bg-white text-blue-600 hover:bg-blue-50 border-0"
            >
              Explore Projects
            </Button>
          </div>
          
          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <Heading level={4} className="text-white mb-2">
              My Applications
            </Heading>
            <Body className="text-green-100 mb-4">
              Track your application status
            </Body>
            <Button
              variant="secondary"
              onClick={() => navigate("applications")}
              className="bg-white text-green-600 hover:bg-green-50 border-0"
            >
              View Applications
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentDashboard;