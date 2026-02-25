// src/components/common/Skeleton.jsx
import { motion } from "framer-motion";

/**
 * Base Skeleton component
 */
export const Skeleton = ({ className = "", ...props }) => {
  return <div className={`skeleton ${className}`} {...props} />;
};

/**
 * Skeleton for text content
 */
export const SkeletonText = ({ lines = 1, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index === lines - 1 && lines > 1 ? "w-4/5" : "w-full"}`}
        />
      ))}
    </div>
  );
};

/**
 * Skeleton for avatar/profile images
 */
export const SkeletonAvatar = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return <Skeleton className={`${sizes[size]} rounded-full ${className}`} />;
};

/**
 * Skeleton for dashboard stat cards
 */
export const SkeletonCard = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6 ${className}`}
    >
      <div className="flex gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl skeleton" />
        <div className="space-y-2 flex-1">
          <div className="h-4 skeleton rounded w-3/5" />
          <div className="h-3 skeleton rounded w-2/5" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 skeleton rounded" />
        <div className="h-3 skeleton rounded w-4/5" />
      </div>
    </div>
  );
};

/**
 * Skeleton for stat cards (Dashboard)
 */
export const SkeletonStatCard = ({ className = "" }) => {
  return (
    <div
      className={`bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
};

/**
 * Skeleton for table rows
 */
export const SkeletonTableRow = ({ columns = 5, className = "" }) => {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
};

/**
 * Skeleton for entire table
 */
export const SkeletonTable = ({ rows = 5, columns = 5, className = "" }) => {
  return (
    <div
      className={`bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden ${className}`}
    >
      <table className="w-full">
        <thead className="bg-[rgb(var(--background))]">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonTableRow key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Skeleton for project cards
 */
export const SkeletonProjectCard = ({ className = "" }) => {
  return (
    <div
      className={`bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-[rgb(var(--border))]">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
};

/**
 * Skeleton for profile section
 */
export const SkeletonProfile = ({ className = "" }) => {
  return (
    <div
      className={`bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-8 ${className}`}
    >
      {/* Avatar and name */}
      <div className="flex items-center gap-6 mb-8">
        <SkeletonAvatar size="xl" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton for list items
 */
export const SkeletonListItem = ({ className = "" }) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 border-b border-[rgb(var(--border))] last:border-b-0 ${className}`}
    >
      <SkeletonAvatar size="md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  );
};

/**
 * Skeleton for application cards
 */
export const SkeletonApplicationCard = ({ className = "" }) => {
  return (
    <div
      className={`bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="flex gap-4 mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
};

/**
 * Wrapper to show skeleton while loading
 */
export const SkeletonLoader = ({
  isLoading,
  skeleton,
  children,
  delay = 300,
}) => {
  // Optional: Add delay to prevent flash of skeleton for fast loads
  // This requires useState and useEffect if you want the delay feature

  if (isLoading) {
    return skeleton;
  }

  return children;
};

/**
 * Dashboard skeleton with multiple cards
 */
export const SkeletonDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonCard className="h-80" />
        </div>
        <div>
          <SkeletonCard className="h-80" />
        </div>
      </div>

      {/* Table */}
      <SkeletonTable rows={5} columns={5} />
    </div>
  );
};

export default Skeleton;