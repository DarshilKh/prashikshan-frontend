/**
 * Permission Configuration for Prashikshan
 * Defines all features and their default states per role
 */

// Feature keys - used throughout the app
export const FEATURES = {
  // Student Features
  STUDENT_DASHBOARD: "student.dashboard",
  STUDENT_PROJECTS: "student.projects",
  STUDENT_APPLICATIONS: "student.applications",
  STUDENT_MESSAGES: "student.messages",
  STUDENT_PROFILE: "student.profile",
  STUDENT_SETTINGS: "student.settings",

  // Faculty Features
  FACULTY_DASHBOARD: "faculty.dashboard",
  FACULTY_STUDENTS: "faculty.students",
  FACULTY_REPORTS: "faculty.reports",
  FACULTY_MESSAGES: "faculty.messages",
  FACULTY_PROFILE: "faculty.profile",
  FACULTY_SETTINGS: "faculty.settings",

  // Industry Features
  INDUSTRY_DASHBOARD: "industry.dashboard",
  INDUSTRY_OPENINGS: "industry.openings",
  INDUSTRY_APPLICATIONS: "industry.applications",
  INDUSTRY_MESSAGES: "industry.messages",
  INDUSTRY_PROFILE: "industry.profile",
  INDUSTRY_SETTINGS: "industry.settings",

  // Global Features
  CHATBOT: "chatbot",
  NOTIFICATIONS: "notifications",
  DARK_MODE: "dark_mode",
  NEW_REGISTRATIONS: "new_registrations",
};

// Role types
export const ROLES = {
  STUDENT: "student",
  FACULTY: "faculty",
  INDUSTRY: "industry",
  ADMIN: "admin",
};

// Feature metadata with descriptions and categories
export const FEATURE_CONFIG = {
  // ==================== STUDENT ====================
  [FEATURES.STUDENT_DASHBOARD]: {
    key: FEATURES.STUDENT_DASHBOARD,
    label: "Student Dashboard",
    description: "Access to the main student dashboard with stats and overview",
    category: "Student",
    roles: [ROLES.STUDENT],
    critical: true,
    icon: "Home",
  },
  [FEATURES.STUDENT_PROJECTS]: {
    key: FEATURES.STUDENT_PROJECTS,
    label: "Browse Projects",
    description: "Allow students to view and apply for available projects",
    category: "Student",
    roles: [ROLES.STUDENT],
    critical: false,
    icon: "FolderOpen",
  },
  [FEATURES.STUDENT_APPLICATIONS]: {
    key: FEATURES.STUDENT_APPLICATIONS,
    label: "My Applications",
    description: "Allow students to view and track their applications",
    category: "Student",
    roles: [ROLES.STUDENT],
    critical: false,
    icon: "FileText",
  },
  [FEATURES.STUDENT_MESSAGES]: {
    key: FEATURES.STUDENT_MESSAGES,
    label: "Student Messaging",
    description:
      "Allow students to send and receive messages from faculty and industry partners",
    category: "Student",
    roles: [ROLES.STUDENT],
    critical: false,
    icon: "Mail",
  },
  [FEATURES.STUDENT_PROFILE]: {
    key: FEATURES.STUDENT_PROFILE,
    label: "Student Profile",
    description: "Allow students to view and edit their profile",
    category: "Student",
    roles: [ROLES.STUDENT],
    critical: false,
    icon: "User",
  },
  [FEATURES.STUDENT_SETTINGS]: {
    key: FEATURES.STUDENT_SETTINGS,
    label: "Student Settings",
    description: "Allow students to manage their account settings",
    category: "Student",
    roles: [ROLES.STUDENT],
    critical: false,
    icon: "Settings",
  },

  // ==================== FACULTY ====================
  [FEATURES.FACULTY_DASHBOARD]: {
    key: FEATURES.FACULTY_DASHBOARD,
    label: "Faculty Dashboard",
    description: "Access to the main faculty dashboard",
    category: "Faculty",
    roles: [ROLES.FACULTY],
    critical: true,
    icon: "Home",
  },
  [FEATURES.FACULTY_STUDENTS]: {
    key: FEATURES.FACULTY_STUDENTS,
    label: "Manage Students",
    description: "Allow faculty to view and manage their students",
    category: "Faculty",
    roles: [ROLES.FACULTY],
    critical: false,
    icon: "Users",
  },
  [FEATURES.FACULTY_REPORTS]: {
    key: FEATURES.FACULTY_REPORTS,
    label: "Reports & Analytics",
    description: "Allow faculty to generate and view reports",
    category: "Faculty",
    roles: [ROLES.FACULTY],
    critical: false,
    icon: "FileText",
  },
  [FEATURES.FACULTY_MESSAGES]: {
    key: FEATURES.FACULTY_MESSAGES,
    label: "Faculty Messaging",
    description:
      "Allow faculty to send and receive messages from students and industry",
    category: "Faculty",
    roles: [ROLES.FACULTY],
    critical: false,
    icon: "Mail",
  },
  [FEATURES.FACULTY_PROFILE]: {
    key: FEATURES.FACULTY_PROFILE,
    label: "Faculty Profile",
    description: "Allow faculty to view and edit their profile",
    category: "Faculty",
    roles: [ROLES.FACULTY],
    critical: false,
    icon: "User",
  },
  [FEATURES.FACULTY_SETTINGS]: {
    key: FEATURES.FACULTY_SETTINGS,
    label: "Faculty Settings",
    description: "Allow faculty to manage their settings",
    category: "Faculty",
    roles: [ROLES.FACULTY],
    critical: false,
    icon: "Settings",
  },

  // ==================== INDUSTRY ====================
  [FEATURES.INDUSTRY_DASHBOARD]: {
    key: FEATURES.INDUSTRY_DASHBOARD,
    label: "Industry Dashboard",
    description: "Access to the main industry dashboard",
    category: "Industry",
    roles: [ROLES.INDUSTRY],
    critical: true,
    icon: "Home",
  },
  [FEATURES.INDUSTRY_OPENINGS]: {
    key: FEATURES.INDUSTRY_OPENINGS,
    label: "Manage Openings",
    description: "Allow industry partners to create and manage job openings",
    category: "Industry",
    roles: [ROLES.INDUSTRY],
    critical: false,
    icon: "Briefcase",
  },
  [FEATURES.INDUSTRY_APPLICATIONS]: {
    key: FEATURES.INDUSTRY_APPLICATIONS,
    label: "Review Applications",
    description: "Allow industry partners to review student applications",
    category: "Industry",
    roles: [ROLES.INDUSTRY],
    critical: false,
    icon: "Award",
  },
  [FEATURES.INDUSTRY_MESSAGES]: {
    key: FEATURES.INDUSTRY_MESSAGES,
    label: "Industry Messaging",
    description:
      "Allow industry partners to send and receive messages from students and faculty",
    category: "Industry",
    roles: [ROLES.INDUSTRY],
    critical: false,
    icon: "Mail",
  },
  [FEATURES.INDUSTRY_PROFILE]: {
    key: FEATURES.INDUSTRY_PROFILE,
    label: "Company Profile",
    description: "Allow industry partners to manage company profile",
    category: "Industry",
    roles: [ROLES.INDUSTRY],
    critical: false,
    icon: "User",
  },
  [FEATURES.INDUSTRY_SETTINGS]: {
    key: FEATURES.INDUSTRY_SETTINGS,
    label: "Industry Settings",
    description: "Allow industry partners to manage settings",
    category: "Industry",
    roles: [ROLES.INDUSTRY],
    critical: false,
    icon: "Settings",
  },

  // ==================== GLOBAL ====================
  [FEATURES.CHATBOT]: {
    key: FEATURES.CHATBOT,
    label: "AI Chatbot",
    description: "Enable AI-powered chatbot assistant for all users",
    category: "Global",
    roles: [ROLES.STUDENT, ROLES.FACULTY, ROLES.INDUSTRY],
    critical: false,
    icon: "Bot",
  },
  [FEATURES.NOTIFICATIONS]: {
    key: FEATURES.NOTIFICATIONS,
    label: "Notifications",
    description: "Enable in-app notifications for all users",
    category: "Global",
    roles: [ROLES.STUDENT, ROLES.FACULTY, ROLES.INDUSTRY],
    critical: false,
    icon: "Bell",
  },
  [FEATURES.DARK_MODE]: {
    key: FEATURES.DARK_MODE,
    label: "Dark Mode",
    description: "Allow users to switch to dark mode",
    category: "Global",
    roles: [ROLES.STUDENT, ROLES.FACULTY, ROLES.INDUSTRY],
    critical: false,
    icon: "Moon",
  },
  [FEATURES.NEW_REGISTRATIONS]: {
    key: FEATURES.NEW_REGISTRATIONS,
    label: "New Registrations",
    description: "Allow new users to register on the platform",
    category: "Global",
    roles: [ROLES.STUDENT, ROLES.FACULTY, ROLES.INDUSTRY],
    critical: false,
    icon: "UserPlus",
  },
};

// Default permissions - all enabled by default
export const getDefaultPermissions = () => {
  const permissions = {};

  Object.keys(FEATURE_CONFIG).forEach((featureKey) => {
    permissions[featureKey] = {
      enabled: true,
      disabledRoles: [],
      disabledAt: null,
      disabledBy: null,
    };
  });

  return permissions;
};

// Get features by category
export const getFeaturesByCategory = () => {
  const categories = {};

  Object.values(FEATURE_CONFIG).forEach((feature) => {
    if (!categories[feature.category]) {
      categories[feature.category] = [];
    }
    categories[feature.category].push(feature);
  });

  return categories;
};

// Get features for a specific role
export const getFeaturesForRole = (role) => {
  return Object.values(FEATURE_CONFIG).filter((feature) =>
    feature.roles.includes(role),
  );
};

// Storage key for permissions
export const PERMISSIONS_STORAGE_KEY = "prashikshan_feature_permissions";
