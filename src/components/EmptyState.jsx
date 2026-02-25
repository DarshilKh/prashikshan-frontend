// src/components/EmptyState.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Inbox,
  FileText,
  Users,
  MessageSquare,
  Bell,
  Briefcase,
  FolderOpen,
  Search,
  Calendar,
  BookOpen,
  Award,
  ClipboardList,
  Mail,
  Image,
  Database,
  Package
} from "lucide-react";

// Icon mapping
const iconMap = {
  inbox: Inbox,
  file: FileText,
  "file-text": FileText,
  users: Users,
  message: MessageSquare,
  messages: MessageSquare,
  bell: Bell,
  notification: Bell,
  notifications: Bell,
  briefcase: Briefcase,
  internship: Briefcase,
  folder: FolderOpen,
  "folder-open": FolderOpen,
  search: Search,
  calendar: Calendar,
  book: BookOpen,
  award: Award,
  clipboard: ClipboardList,
  "clipboard-list": ClipboardList,
  mail: Mail,
  email: Mail,
  image: Image,
  database: Database,
  package: Package,
  default: Inbox
};

// Preset configurations for common empty states
const presets = {
  notifications: {
    title: "No Notifications",
    description: "You're all caught up! Check back later for updates.",
    icon: "bell"
  },
  applications: {
    title: "No Applications Yet",
    description: "Start exploring internships and apply to opportunities that match your skills.",
    icon: "clipboard"
  },
  students: {
    title: "No Students Found",
    description: "There are no students matching your criteria. Try adjusting your filters.",
    icon: "users"
  },
  messages: {
    title: "No Messages",
    description: "Your inbox is empty. Start a conversation or wait for incoming messages.",
    icon: "message"
  },
  internships: {
    title: "No Internships Available",
    description: "There are no internship openings at the moment. Check back soon!",
    icon: "briefcase"
  },
  projects: {
    title: "No Projects Found",
    description: "There are no projects to display. Create a new project to get started.",
    icon: "folder"
  },
  search: {
    title: "No Results Found",
    description: "We couldn't find anything matching your search. Try different keywords.",
    icon: "search"
  },
  files: {
    title: "No Files Uploaded",
    description: "Upload files to see them here. Drag and drop or click to browse.",
    icon: "file"
  }
};

const EmptyState = ({
  preset,
  title,
  description,
  icon = "inbox",
  buttonText,
  onButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  size = "medium",
  className = ""
}) => {
  // Use preset if provided
  const presetConfig = preset ? presets[preset] : null;
  const finalTitle = title || presetConfig?.title || "Nothing Here Yet";
  const finalDescription = description || presetConfig?.description || "There's nothing to display at the moment.";
  const finalIcon = icon || presetConfig?.icon || "inbox";

  // Get the icon component
  const IconComponent = iconMap[finalIcon] || iconMap.default;

  // Size configurations
  const sizeConfig = {
    small: {
      container: "py-8",
      iconWrapper: "w-16 h-16",
      iconSize: 32,
      title: "text-lg",
      description: "text-sm",
      button: "px-4 py-2 text-sm"
    },
    medium: {
      container: "py-12",
      iconWrapper: "w-20 h-20",
      iconSize: 40,
      title: "text-xl",
      description: "text-base",
      button: "px-5 py-2.5 text-sm"
    },
    large: {
      container: "py-16",
      iconWrapper: "w-24 h-24",
      iconSize: 48,
      title: "text-2xl",
      description: "text-lg",
      button: "px-6 py-3 text-base"
    }
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center text-center ${config.container} ${className}`}
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className={`${config.iconWrapper} rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-6`}
      >
        <motion.div
          animate={{ 
            y: [0, -5, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <IconComponent 
            size={config.iconSize} 
            className="text-gray-400 dark:text-slate-500" 
          />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`${config.title} font-semibold text-gray-900 dark:text-white mb-2`}
      >
        {finalTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`${config.description} text-gray-500 dark:text-gray-400 max-w-md mb-6`}
      >
        {finalDescription}
      </motion.p>

      {/* Buttons */}
      {(buttonText || secondaryButtonText) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {secondaryButtonText && onSecondaryButtonClick && (
            <motion.button
              onClick={onSecondaryButtonClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${config.button} rounded-xl border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-medium hover:border-blue-500 dark:hover:border-blue-400 transition-all`}
            >
              {secondaryButtonText}
            </motion.button>
          )}
          
          {buttonText && onButtonClick && (
            <motion.button
              onClick={onButtonClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${config.button} rounded-xl bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all`}
            >
              {buttonText}
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// Pre-configured Empty State Components
export const EmptyNotifications = (props) => (
  <EmptyState preset="notifications" {...props} />
);

export const EmptyApplications = (props) => (
  <EmptyState preset="applications" {...props} />
);

export const EmptyStudents = (props) => (
  <EmptyState preset="students" {...props} />
);

export const EmptyMessages = (props) => (
  <EmptyState preset="messages" {...props} />
);

export const EmptyInternships = (props) => (
  <EmptyState preset="internships" {...props} />
);

export const EmptyProjects = (props) => (
  <EmptyState preset="projects" {...props} />
);

export const EmptySearchResults = (props) => (
  <EmptyState preset="search" {...props} />
);

export default EmptyState;