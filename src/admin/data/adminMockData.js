// src/admin/data/adminMockData.js

// ============================================
// ADMIN USERS
// ============================================
export const adminUsers = [
  {
    id: "admin-001",
    name: "System Administrator",
    email: "admin@prashikshan.com",
    role: "ADMIN",
    avatar: null,
    permissions: [
      "MANAGE_USERS",
      "VIEW_REPORTS",
      "VIEW_LOGS",
      "SYSTEM_SETTINGS",
      "IMPERSONATE_USER",
      "MANAGE_ROLES",
      "MANAGE_CONTENT",
      "VIEW_ANALYTICS",
    ],
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    lastLogin: "2024-01-20T10:30:00Z",
    isProtected: true, // Cannot be deleted or downgraded
  },
  {
    id: "admin-002",
    name: "Support Admin",
    email: "support@prashikshan.com",
    role: "ADMIN",
    avatar: null,
    permissions: [
      "MANAGE_USERS",
      "VIEW_REPORTS",
      "VIEW_LOGS",
      "IMPERSONATE_USER",
    ],
    status: "active",
    createdAt: "2023-06-15T00:00:00Z",
    lastLogin: "2024-01-19T14:20:00Z",
    isProtected: true,
  },
];

// ============================================
// ALL PLATFORM USERS (Students, Faculty, Industry)
// ============================================
export const allPlatformUsers = [
  // Students
  {
    id: "user-001",
    name: "Aarav Sharma",
    email: "aarav.sharma@student.edu",
    role: "student",
    status: "active",
    college: "IIT Delhi",
    branch: "Computer Science",
    joinedAt: "2023-08-15T00:00:00Z",
    lastLogin: "2024-01-20T09:15:00Z",
    credits: 18,
    applications: 5,
    isVerified: true,
  },
  {
    id: "user-002",
    name: "Priya Patel",
    email: "priya.patel@student.edu",
    role: "student",
    status: "active",
    college: "NIT Surat",
    branch: "Electronics",
    joinedAt: "2023-09-01T00:00:00Z",
    lastLogin: "2024-01-19T16:45:00Z",
    credits: 12,
    applications: 3,
    isVerified: true,
  },
  {
    id: "user-003",
    name: "Rahul Kumar",
    email: "rahul.kumar@student.edu",
    role: "student",
    status: "suspended",
    college: "BITS Pilani",
    branch: "Mechanical",
    joinedAt: "2023-07-20T00:00:00Z",
    lastLogin: "2024-01-10T11:30:00Z",
    credits: 6,
    applications: 2,
    isVerified: true,
    suspendedReason: "Violation of terms",
  },
  {
    id: "user-004",
    name: "Sneha Gupta",
    email: "sneha.gupta@student.edu",
    role: "student",
    status: "pending",
    college: "IIT Bombay",
    branch: "Computer Science",
    joinedAt: "2024-01-18T00:00:00Z",
    lastLogin: null,
    credits: 0,
    applications: 0,
    isVerified: false,
  },
  // Faculty
  {
    id: "user-005",
    name: "Dr. Priya Mehta",
    email: "priya.mehta@iitdelhi.ac.in",
    role: "faculty",
    status: "active",
    college: "IIT Delhi",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    joinedAt: "2023-01-10T00:00:00Z",
    lastLogin: "2024-01-20T08:00:00Z",
    studentsManaged: 45,
    isVerified: true,
  },
  {
    id: "user-006",
    name: "Dr. Amit Verma",
    email: "amit.verma@nitsurat.ac.in",
    role: "faculty",
    status: "active",
    college: "NIT Surat",
    department: "Electronics & Communication",
    designation: "Professor",
    joinedAt: "2023-03-15T00:00:00Z",
    lastLogin: "2024-01-18T14:30:00Z",
    studentsManaged: 32,
    isVerified: true,
  },
  {
    id: "user-007",
    name: "Dr. Kavita Singh",
    email: "kavita.singh@bits.ac.in",
    role: "faculty",
    status: "inactive",
    college: "BITS Pilani",
    department: "Mechanical Engineering",
    designation: "Assistant Professor",
    joinedAt: "2023-05-20T00:00:00Z",
    lastLogin: "2023-12-01T10:00:00Z",
    studentsManaged: 0,
    isVerified: true,
  },
  // Industry
  {
    id: "user-008",
    name: "TechNova Solutions",
    email: "hr@technova.com",
    role: "industry",
    status: "active",
    companyName: "TechNova Solutions",
    contactPerson: "Rajesh Kumar",
    sector: "Information Technology",
    joinedAt: "2023-02-01T00:00:00Z",
    lastLogin: "2024-01-20T11:00:00Z",
    activeOpenings: 8,
    totalHired: 28,
    isVerified: true,
  },
  {
    id: "user-009",
    name: "GreenGrid Energy",
    email: "careers@greengrid.com",
    role: "industry",
    status: "active",
    companyName: "GreenGrid Energy",
    contactPerson: "Ananya Reddy",
    sector: "Renewable Energy",
    joinedAt: "2023-04-10T00:00:00Z",
    lastLogin: "2024-01-19T09:30:00Z",
    activeOpenings: 5,
    totalHired: 15,
    isVerified: true,
  },
  {
    id: "user-010",
    name: "EduCore Systems",
    email: "hr@educore.in",
    role: "industry",
    status: "pending",
    companyName: "EduCore Systems",
    contactPerson: "Vikram Shah",
    sector: "EdTech",
    joinedAt: "2024-01-15T00:00:00Z",
    lastLogin: null,
    activeOpenings: 0,
    totalHired: 0,
    isVerified: false,
  },
];

// ============================================
// ROLES & PERMISSIONS CONFIGURATION
// ============================================
export const rolesConfig = {
  ADMIN: {
    name: "Administrator",
    description: "Full system access with all permissions",
    isProtected: true,
    canBeAssigned: false, // Cannot be assigned through UI
    permissions: [
      "MANAGE_USERS",
      "VIEW_REPORTS",
      "VIEW_LOGS",
      "SYSTEM_SETTINGS",
      "IMPERSONATE_USER",
      "MANAGE_ROLES",
      "MANAGE_CONTENT",
      "VIEW_ANALYTICS",
    ],
  },
  student: {
    name: "Student",
    description: "Can browse projects, apply for internships, track credits",
    isProtected: false,
    canBeAssigned: true,
    permissions: [
      "VIEW_PROJECTS",
      "APPLY_INTERNSHIP",
      "VIEW_APPLICATIONS",
      "EDIT_PROFILE",
      "VIEW_MESSAGES",
    ],
  },
  faculty: {
    name: "Faculty",
    description: "Can manage students, approve internships, generate reports",
    isProtected: false,
    canBeAssigned: true,
    permissions: [
      "VIEW_STUDENTS",
      "APPROVE_INTERNSHIP",
      "GENERATE_REPORTS",
      "VIEW_MESSAGES",
      "EDIT_PROFILE",
    ],
  },
  industry: {
    name: "Industry Partner",
    description: "Can post openings, review applications, hire interns",
    isProtected: false,
    canBeAssigned: true,
    permissions: [
      "POST_OPENINGS",
      "VIEW_APPLICATIONS",
      "HIRE_INTERNS",
      "VIEW_MESSAGES",
      "EDIT_PROFILE",
    ],
  },
};

export const allPermissions = [
  // Admin-only permissions
  {
    id: "MANAGE_USERS",
    name: "Manage Users",
    description: "Create, edit, delete users",
    category: "Admin",
    isAdmin: true,
  },
  {
    id: "VIEW_REPORTS",
    name: "View Reports",
    description: "Access system reports",
    category: "Admin",
    isAdmin: true,
  },
  {
    id: "VIEW_LOGS",
    name: "View Audit Logs",
    description: "Access audit trail",
    category: "Admin",
    isAdmin: true,
  },
  {
    id: "SYSTEM_SETTINGS",
    name: "System Settings",
    description: "Configure platform settings",
    category: "Admin",
    isAdmin: true,
  },
  {
    id: "IMPERSONATE_USER",
    name: "Impersonate User",
    description: "Login as other users",
    category: "Admin",
    isAdmin: true,
  },
  {
    id: "MANAGE_ROLES",
    name: "Manage Roles",
    description: "Configure roles and permissions",
    category: "Admin",
    isAdmin: true,
  },
  {
    id: "MANAGE_CONTENT",
    name: "Manage Content",
    description: "Moderate platform content",
    category: "Admin",
    isAdmin: true,
  },
  {
    id: "VIEW_ANALYTICS",
    name: "View Analytics",
    description: "Access platform analytics",
    category: "Admin",
    isAdmin: true,
  },

  // Student permissions
  {
    id: "VIEW_PROJECTS",
    name: "View Projects",
    description: "Browse internship projects",
    category: "Student",
    isAdmin: false,
  },
  {
    id: "APPLY_INTERNSHIP",
    name: "Apply for Internship",
    description: "Submit applications",
    category: "Student",
    isAdmin: false,
  },
  {
    id: "VIEW_APPLICATIONS",
    name: "View Applications",
    description: "Track application status",
    category: "Student",
    isAdmin: false,
  },

  // Faculty permissions
  {
    id: "VIEW_STUDENTS",
    name: "View Students",
    description: "Access student list",
    category: "Faculty",
    isAdmin: false,
  },
  {
    id: "APPROVE_INTERNSHIP",
    name: "Approve Internship",
    description: "Approve student internships",
    category: "Faculty",
    isAdmin: false,
  },
  {
    id: "GENERATE_REPORTS",
    name: "Generate Reports",
    description: "Create progress reports",
    category: "Faculty",
    isAdmin: false,
  },

  // Industry permissions
  {
    id: "POST_OPENINGS",
    name: "Post Openings",
    description: "Create internship listings",
    category: "Industry",
    isAdmin: false,
  },
  {
    id: "HIRE_INTERNS",
    name: "Hire Interns",
    description: "Approve intern applications",
    category: "Industry",
    isAdmin: false,
  },

  // Shared permissions
  {
    id: "VIEW_MESSAGES",
    name: "View Messages",
    description: "Access messaging system",
    category: "Shared",
    isAdmin: false,
  },
  {
    id: "EDIT_PROFILE",
    name: "Edit Profile",
    description: "Modify own profile",
    category: "Shared",
    isAdmin: false,
  },
];

// ============================================
// AUDIT LOGS
// ============================================
export const auditLogs = [
  {
    id: "log-001",
    action: "USER_LOGIN",
    actor: "admin@prashikshan.com",
    actorRole: "ADMIN",
    target: null,
    details: "Admin logged in successfully",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0 Windows",
    timestamp: "2024-01-20T10:30:00Z",
    severity: "info",
  },
  {
    id: "log-002",
    action: "USER_ROLE_CHANGED",
    actor: "admin@prashikshan.com",
    actorRole: "ADMIN",
    target: "rahul.kumar@student.edu",
    details: "Role changed from 'student' to 'faculty'",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0 Windows",
    timestamp: "2024-01-20T09:45:00Z",
    severity: "warning",
  },
  {
    id: "log-003",
    action: "USER_SUSPENDED",
    actor: "support@prashikshan.com",
    actorRole: "ADMIN",
    target: "rahul.kumar@student.edu",
    details: "User suspended for violation of terms",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox/121.0 MacOS",
    timestamp: "2024-01-19T16:20:00Z",
    severity: "critical",
  },
  {
    id: "log-004",
    action: "IMPERSONATION_START",
    actor: "admin@prashikshan.com",
    actorRole: "ADMIN",
    target: "aarav.sharma@student.edu",
    details: "Started impersonating user",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0 Windows",
    timestamp: "2024-01-19T14:00:00Z",
    severity: "warning",
  },
  {
    id: "log-005",
    action: "IMPERSONATION_END",
    actor: "admin@prashikshan.com",
    actorRole: "ADMIN",
    target: "aarav.sharma@student.edu",
    details: "Ended impersonation session",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0 Windows",
    timestamp: "2024-01-19T14:15:00Z",
    severity: "info",
  },
  {
    id: "log-006",
    action: "SYSTEM_SETTING_CHANGED",
    actor: "admin@prashikshan.com",
    actorRole: "ADMIN",
    target: null,
    details: "Enabled maintenance mode",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0 Windows",
    timestamp: "2024-01-18T22:00:00Z",
    severity: "critical",
  },
  {
    id: "log-007",
    action: "USER_CREATED",
    actor: "System",
    actorRole: "SYSTEM",
    target: "sneha.gupta@student.edu",
    details: "New user registered",
    ipAddress: "203.45.67.89",
    userAgent: "Chrome/120.0 Android",
    timestamp: "2024-01-18T10:30:00Z",
    severity: "info",
  },
  {
    id: "log-008",
    action: "PASSWORD_RESET",
    actor: "support@prashikshan.com",
    actorRole: "ADMIN",
    target: "priya.patel@student.edu",
    details: "Admin initiated password reset",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox/121.0 MacOS",
    timestamp: "2024-01-17T11:00:00Z",
    severity: "warning",
  },
  {
    id: "log-009",
    action: "USER_VERIFIED",
    actor: "admin@prashikshan.com",
    actorRole: "ADMIN",
    target: "hr@technova.com",
    details: "Industry partner verified",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0 Windows",
    timestamp: "2024-01-16T09:00:00Z",
    severity: "info",
  },
  {
    id: "log-010",
    action: "BULK_EMAIL_SENT",
    actor: "admin@prashikshan.com",
    actorRole: "ADMIN",
    target: null,
    details: "Sent announcement to 150 users",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0 Windows",
    timestamp: "2024-01-15T15:00:00Z",
    severity: "info",
  },
];

// ============================================
// REPORTS (Flagged/Reported Content)
// ============================================
export const platformReports = [
  {
    id: "report-001",
    type: "user",
    reportedItem: {
      id: "user-003",
      name: "Rahul Kumar",
      email: "rahul.kumar@student.edu",
    },
    reportedBy: {
      id: "user-005",
      name: "Dr. Priya Mehta",
      email: "priya.mehta@iitdelhi.ac.in",
    },
    reason: "Inappropriate behavior",
    description: "Student submitted fake documents for internship verification",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-19T10:00:00Z",
    resolvedAt: null,
    resolvedBy: null,
    resolution: null,
  },
  {
    id: "report-002",
    type: "content",
    reportedItem: {
      id: "opening-123",
      title: "Suspicious Job Posting",
      company: "Unknown Corp",
    },
    reportedBy: {
      id: "user-001",
      name: "Aarav Sharma",
      email: "aarav.sharma@student.edu",
    },
    reason: "Spam/Scam",
    description:
      "This job posting asks for upfront payment which seems suspicious",
    status: "resolved",
    priority: "critical",
    createdAt: "2024-01-18T14:30:00Z",
    resolvedAt: "2024-01-18T16:00:00Z",
    resolvedBy: "admin@prashikshan.com",
    resolution: "Content removed and company account suspended",
  },
  {
    id: "report-003",
    type: "user",
    reportedItem: {
      id: "user-010",
      name: "EduCore Systems",
      email: "hr@educore.in",
    },
    reportedBy: {
      id: "user-002",
      name: "Priya Patel",
      email: "priya.patel@student.edu",
    },
    reason: "Fake company",
    description:
      "Company details don't match with their website. Possibly fraudulent.",
    status: "under_review",
    priority: "medium",
    createdAt: "2024-01-17T09:00:00Z",
    resolvedAt: null,
    resolvedBy: null,
    resolution: null,
  },
  {
    id: "report-004",
    type: "content",
    reportedItem: {
      id: "message-456",
      title: "Inappropriate message",
      preview: "Hey beautiful, want to...",
    },
    reportedBy: {
      id: "user-002",
      name: "Priya Patel",
      email: "priya.patel@student.edu",
    },
    reason: "Harassment",
    description: "Received inappropriate messages from industry contact",
    status: "pending",
    priority: "critical",
    createdAt: "2024-01-16T18:00:00Z",
    resolvedAt: null,
    resolvedBy: null,
    resolution: null,
  },
  {
    id: "report-005",
    type: "bug",
    reportedItem: {
      id: "feature-credits",
      title: "Credit calculation error",
    },
    reportedBy: {
      id: "user-006",
      name: "Dr. Amit Verma",
      email: "amit.verma@nitsurat.ac.in",
    },
    reason: "Technical issue",
    description:
      "Student credits not updating after internship completion approval",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-15T11:00:00Z",
    resolvedAt: "2024-01-16T09:00:00Z",
    resolvedBy: "support@prashikshan.com",
    resolution: "Bug fixed in latest update",
  },
];

// ============================================
// SYSTEM SETTINGS
// ============================================
export const systemSettings = {
  general: {
    platformName: "Prashikshan",
    platformTagline: "Bridging Education & Industry",
    supportEmail: "support@prashikshan.com",
    maxFileUploadSize: 10, // MB
    sessionTimeout: 30, // minutes
  },
  features: {
    enableNewRegistrations: true,
    enableStudentRegistration: true,
    enableFacultyRegistration: true,
    enableIndustryRegistration: true,
    enableIndustryPostings: true,
    enableMessaging: true,
    enableChatbot: true,
    requireEmailVerification: true,
    requireAdminApprovalForIndustry: true,
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage:
      "Platform is under maintenance. Please check back later.",
    scheduledMaintenance: null,
    readOnlyMode: false,
  },
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
    passwordMinLength: 8,
    requireStrongPassword: true,
    enableTwoFactor: false,
    sessionConcurrency: 3, // max simultaneous sessions
  },
  notifications: {
    enableEmailNotifications: true,
    enablePushNotifications: false,
    dailyDigest: true,
    weeklyReport: true,
  },
};

// ============================================
// DASHBOARD ANALYTICS
// ============================================
export const dashboardAnalytics = {
  overview: {
    totalUsers: 1250,
    activeUsers: 980,
    newUsersThisMonth: 45,
    userGrowthPercent: 12.5,
  },
  usersByRole: {
    students: 950,
    faculty: 120,
    industry: 175,
    admins: 5,
  },
  usersByStatus: {
    active: 980,
    pending: 150,
    suspended: 45,
    inactive: 75,
  },
  internships: {
    totalOpenings: 320,
    activeOpenings: 85,
    totalApplications: 2450,
    pendingApplications: 180,
    approvedThisMonth: 65,
    placementRate: 78.5,
  },
  credits: {
    totalCreditsEarned: 15600,
    averageCreditsPerStudent: 16.4,
    studentsCompleted: 280,
    completionRate: 72.3,
  },
  activity: {
    dailyActiveUsers: 450,
    weeklyActiveUsers: 780,
    monthlyActiveUsers: 980,
    averageSessionDuration: "12m 34s",
  },
  recentActivity: [
    {
      id: 1,
      type: "registration",
      message: "New student registered",
      user: "Sneha Gupta",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "application",
      message: "Application submitted",
      user: "Aarav Sharma",
      time: "3 hours ago",
    },
    {
      id: 3,
      type: "approval",
      message: "Internship approved",
      user: "Dr. Priya Mehta",
      time: "4 hours ago",
    },
    {
      id: 4,
      type: "posting",
      message: "New opening posted",
      user: "TechNova Solutions",
      time: "5 hours ago",
    },
    {
      id: 5,
      type: "completion",
      message: "Internship completed",
      user: "Priya Patel",
      time: "6 hours ago",
    },
  ],
  monthlyTrends: [
    { month: "Aug", users: 850, applications: 180, placements: 45 },
    { month: "Sep", users: 920, applications: 220, placements: 52 },
    { month: "Oct", users: 1050, applications: 280, placements: 58 },
    { month: "Nov", users: 1120, applications: 310, placements: 62 },
    { month: "Dec", users: 1180, applications: 290, placements: 55 },
    { month: "Jan", users: 1250, applications: 340, placements: 65 },
  ],
};

// ============================================
// HELPER: Get user by ID
// ============================================
export const getUserById = (id) => {
  return allPlatformUsers.find((user) => user.id === id) || null;
};

// ============================================
// HELPER: Get admin by email
// ============================================
export const getAdminByEmail = (email) => {
  return adminUsers.find((admin) => admin.email === email) || null;
};
