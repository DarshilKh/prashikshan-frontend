// src/components/common/PageLoader.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Full page loader for lazy-loaded routes
 */
const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[rgb(var(--background))]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Animated Spinner */}
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900"
          />
          {/* Spinning ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner pulse */}
          <motion.div
            className="absolute inset-3 rounded-full bg-linear-to-r from-blue-500/20 to-green-500/20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        
        {/* Loading Text */}
        <motion.p
          className="text-[rgb(var(--muted))] font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
};

/**
 * Inline loader for components within a page
 */
export const InlineLoader = ({ height = "200px", message = "Loading..." }) => {
  return (
    <div 
      className="flex items-center justify-center bg-[rgb(var(--surface))] rounded-2xl border border-[rgb(var(--border))]"
      style={{ minHeight: height }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <motion.div
          className="w-8 h-8 rounded-full border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-sm text-[rgb(var(--muted))]">{message}</p>
      </motion.div>
    </div>
  );
};

/**
 * Dashboard-specific loader with skeleton layout
 */
export const DashboardLoader = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-9 w-64 bg-[rgb(var(--border))] rounded-lg animate-pulse" />
        <div className="h-5 w-48 bg-[rgb(var(--border))] rounded-lg animate-pulse" />
      </div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="h-32 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl animate-pulse"
          />
        ))}
      </div>
      
      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 h-80 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl animate-pulse" 
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="h-80 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl animate-pulse" 
        />
      </div>
    </div>
  );
};

/**
 * Table page loader
 */
export const TableLoader = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-[rgb(var(--border))] rounded-lg animate-pulse" />
          <div className="h-5 w-32 bg-[rgb(var(--border))] rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-[rgb(var(--border))] rounded-xl animate-pulse" />
      </div>
      
      {/* Search/Filter Bar */}
      <div className="flex gap-3">
        <div className="flex-1 h-11 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl animate-pulse" />
        <div className="h-11 w-24 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl animate-pulse" />
        <div className="h-11 w-24 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl animate-pulse" />
      </div>
      
      {/* Table Skeleton */}
      <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
        <div className="h-12 bg-[rgb(var(--background))] border-b border-[rgb(var(--border))] animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="h-16 border-b border-[rgb(var(--border))] animate-pulse" 
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Cards grid loader
 */
export const CardsLoader = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-9 w-56 bg-[rgb(var(--border))] rounded-lg animate-pulse" />
          <div className="h-5 w-40 bg-[rgb(var(--border))] rounded-lg animate-pulse" />
        </div>
      </div>
      
      {/* Search/Filter Bar */}
      <div className="flex gap-3">
        <div className="flex-1 h-11 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl animate-pulse" />
        <div className="h-11 w-24 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl animate-pulse" />
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="h-64 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Profile page loader
 */
export const ProfileLoader = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-[rgb(var(--border))] animate-pulse" />
          <div className="space-y-3">
            <div className="h-8 w-48 bg-[rgb(var(--border))] rounded-lg animate-pulse" />
            <div className="h-5 w-32 bg-[rgb(var(--border))] rounded-lg animate-pulse" />
          </div>
        </div>
      </motion.div>
      
      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-48 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl animate-pulse" 
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-48 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl animate-pulse" 
        />
      </div>
    </div>
  );
};

/**
 * Auth page loader
 */
export const AuthLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl p-8 space-y-6 shadow-xl">
          {/* Logo */}
          <div className="text-center">
            <div className="h-12 w-12 mx-auto rounded-xl bg-linear-to-r from-blue-600 to-green-400 animate-pulse" />
          </div>
          
          {/* Title */}
          <div className="text-center space-y-2">
            <div className="h-8 w-48 bg-[rgb(var(--border))] rounded-lg mx-auto animate-pulse" />
            <div className="h-5 w-64 bg-[rgb(var(--border))] rounded-lg mx-auto animate-pulse" />
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4">
            <div className="h-12 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl animate-pulse" />
            <div className="h-12 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl animate-pulse" />
            <div className="h-12 bg-linear-to-r from-blue-600 to-blue-500 rounded-xl animate-pulse" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Messages page loader
 */
export const MessagesLoader = () => {
  return (
    <div className="p-6 h-[calc(100vh-120px)]">
      <div className="h-full bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-[rgb(var(--border))] p-4 space-y-3">
          <div className="h-10 bg-[rgb(var(--background))] rounded-xl animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-full bg-[rgb(var(--border))] animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-[rgb(var(--border))] rounded animate-pulse" />
                <div className="h-3 w-32 bg-[rgb(var(--border))] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-[rgb(var(--border))] animate-pulse" />
            <div className="h-5 w-48 mx-auto bg-[rgb(var(--border))] rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;