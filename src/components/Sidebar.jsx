// src/components/Sidebar.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
Home,
User,
LogOut,
X,
Award,
Briefcase,
Settings,
FileText,
Users,
FolderOpen,
PanelLeftClose,
PanelLeft,
Lock,
Mail,
} from "lucide-react";
import { usePreload } from "../hooks/usePreload";
import { usePermissions } from "../context/PermissionsContext";
import { FEATURES } from "../config/permissions";

const Sidebar = ({
navigate,
currentPage,
sidebarOpen,
setSidebarOpen,
sidebarCollapsed,
setSidebarCollapsed,
handleLogout,
userRole,
userName,
userEmail,
}) => {
const [logoHovered, setLogoHovered] = useState(false);
const { preloadByRole } = usePreload();
const { isFeatureEnabled } = usePermissions();

// Derive display values from props
const userInitials = userName
? userName
.split(" ")
.map((n) => n[0])
.join("")
.slice(0, 2)
.toUpperCase()
: "U";

const roleLabel =
userRole === "faculty"
? "Faculty Mentor"
: userRole === "industry"
? "Industry Partner"
: "Student";

const roleGradient =
userRole === "faculty"
? "from-purple-600 to-indigo-400"
: userRole === "industry"
? "from-emerald-600 to-teal-400"
: "from-blue-600 to-green-400";

// Menu items with feature keys for permission checking
const studentMenuItems = [
{
id: "dashboard",
icon: Home,
label: "Dashboard",
feature: FEATURES.STUDENT_DASHBOARD,
},
{
id: "projects",
icon: FolderOpen,
label: "Projects",
feature: FEATURES.STUDENT_PROJECTS,
},
{
id: "my-applications",
icon: FileText,
label: "My Applications",
feature: FEATURES.STUDENT_APPLICATIONS,
},
{
id: "messages",
icon: Mail,
label: "Messages",
feature: FEATURES.STUDENT_MESSAGES,
},
{
id: "profile",
icon: User,
label: "Profile",
feature: FEATURES.STUDENT_PROFILE,
},
{
id: "settings",
icon: Settings,
label: "Settings",
feature: FEATURES.STUDENT_SETTINGS,
},
];

const facultyMenuItems = [
{
id: "dashboard",
icon: Home,
label: "Dashboard",
feature: FEATURES.FACULTY_DASHBOARD,
},
{
id: "students",
icon: Users,
label: "Students",
feature: FEATURES.FACULTY_STUDENTS,
},
{
id: "reports",
icon: FileText,
label: "Reports",
feature: FEATURES.FACULTY_REPORTS,
},
{
id: "messages",
icon: Mail,
label: "Messages",
feature: FEATURES.FACULTY_MESSAGES,
},
{
id: "profile",
icon: User,
label: "Profile",
feature: FEATURES.FACULTY_PROFILE,
},
{
id: "settings",
icon: Settings,
label: "Settings",
feature: FEATURES.FACULTY_SETTINGS,
},
];

const industryMenuItems = [
{
id: "dashboard",
icon: Home,
label: "Dashboard",
feature: FEATURES.INDUSTRY_DASHBOARD,
},
{
id: "openings",
icon: Briefcase,
label: "Openings",
feature: FEATURES.INDUSTRY_OPENINGS,
},
{
id: "applications",
icon: Award,
label: "Applications",
feature: FEATURES.INDUSTRY_APPLICATIONS,
},
{
id: "messages",
icon: Mail,
label: "Messages",
feature: FEATURES.INDUSTRY_MESSAGES,
},
{
id: "profile",
icon: User,
label: "Profile",
feature: FEATURES.INDUSTRY_PROFILE,
},
{
id: "settings",
icon: Settings,
label: "Settings",
feature: FEATURES.INDUSTRY_SETTINGS,
},
];

const menuItems =
userRole === "faculty"
? facultyMenuItems
: userRole === "industry"
? industryMenuItems
: studentMenuItems;

// Filter menu items based on permissions
const getVisibleMenuItems = () => {
return menuItems.map((item) => {
let enabled = true;
  if (item.feature) {
    try {
      enabled = isFeatureEnabled(item.feature, userRole);
    } catch (e) {
      console.warn(`Permission check failed for ${item.feature}:`, e);
      enabled = true;
    }
  }

  return {
    ...item,
    isEnabled: enabled,
  };
});

};

const visibleMenuItems = getVisibleMenuItems();

const handleItemClick = (item) => {
if (!item.isEnabled) {
return;
}

navigate(item.id);
if (window.innerWidth < 1024) {
  setSidebarOpen(false);
}


};

const toggleCollapse = () => {
setSidebarCollapsed(!sidebarCollapsed);
};

const handleExpandClick = () => {
if (sidebarCollapsed) {
setSidebarCollapsed(false);
setLogoHovered(false);
}
};

return (
<>
{/* Mobile Overlay */}
<AnimatePresence>
{sidebarOpen && (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
onClick={() => setSidebarOpen(false)}
/>
)}
</AnimatePresence>

  <motion.aside
    initial={false}
    animate={{
      width: sidebarCollapsed ? 80 : 256,
      x: sidebarOpen
        ? 0
        : typeof window !== "undefined" && window.innerWidth < 1024
          ? -280
          : 0,
    }}
    transition={{ type: "spring", damping: 25, stiffness: 200 }}
    className="fixed lg:static inset-y-0 left-0 z-30 bg-[rgb(var(--surface))] border-r border-[rgb(var(--border))] flex flex-col overflow-hidden"
  >
    {/* Header */}
    <div
      className={`p-4 border-b border-[rgb(var(--border))] ${sidebarCollapsed ? "px-3" : "px-4"}`}
    >
      <div className="flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center justify-between w-full"
            >
              <h2 className="text-xl font-bold bg-linear-to-r from-blue-600 to-green-400 bg-clip-text text-transparent whitespace-nowrap">
                Prashikshan
              </h2>
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={toggleCollapse}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:flex p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-all"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose size={20} />
                </motion.button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full flex justify-center"
            >
              <motion.button
                onClick={handleExpandClick}
                onMouseEnter={() => setLogoHovered(true)}
                onMouseLeave={() => setLogoHovered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-green-400 flex items-center justify-center cursor-pointer transition-all relative overflow-hidden"
                title="Expand sidebar"
              >
                <AnimatePresence mode="wait">
                  {logoHovered ? (
                    <motion.div
                      key="expand-icon"
                      initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PanelLeft size={20} className="text-white" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="p-logo"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="text-white font-bold text-lg"
                    >
                      P
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
      {!sidebarCollapsed && (
        <p className="px-3 py-2 text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
          Menu
        </p>
      )}
      <div className="space-y-1">
        {visibleMenuItems.map((item) => {
          const isActive = currentPage === item.id;
          const isDisabled = !item.isEnabled;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() =>
                item.isEnabled &&
                preloadByRole &&
                preloadByRole(userRole, item.id)
              }
              whileHover={{ scale: isDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isDisabled ? 1 : 0.98 }}
              title={
                sidebarCollapsed
                  ? item.label
                  : isDisabled
                    ? `${item.label} (Disabled)`
                    : undefined
              }
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative
                ${sidebarCollapsed ? "justify-center" : ""}
                ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed bg-[rgb(var(--background))]"
                    : isActive
                      ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background))]"
                }`}
            >
              {/* Icon */}
              <div className="relative">
                <item.icon
                  size={20}
                  className={`shrink-0 ${
                    isDisabled
                      ? "text-[rgb(var(--muted))]"
                      : isActive
                        ? "text-white"
                        : "text-[rgb(var(--muted))] group-hover:text-[rgb(var(--foreground))]"
                  }`}
                />
                {isDisabled && (
                  <Lock
                    size={10}
                    className="absolute -top-1 -right-1 text-amber-500"
                  />
                )}
              </div>

              {/* Label */}
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap overflow-hidden flex items-center gap-2"
                  >
                    {item.label}
                    {isDisabled && (
                      <Lock size={12} className="text-amber-500" />
                    )}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Active indicator */}
              {isActive && sidebarCollapsed && !isDisabled && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"
                />
              )}

              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div
                  className={`absolute left-full ml-2 px-3 py-2 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap ${isDisabled ? "border-amber-500/30" : ""}`}
                >
                  <span
                    className={`text-sm font-medium ${isDisabled ? "text-amber-600 dark:text-amber-400" : "text-[rgb(var(--foreground))]"}`}
                  >
                    {item.label}
                    {isDisabled && " (Disabled)"}
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>

    {/* User Info Panel */}
    <div
      className={`px-3 py-3 border-t border-[rgb(var(--border))] ${sidebarCollapsed ? "px-2" : ""}`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgb(var(--background))] transition-all cursor-pointer group relative ${
          sidebarCollapsed ? "justify-center px-0" : ""
        }`}
        onClick={() => {
          navigate("profile");
          if (window.innerWidth < 1024) {
            setSidebarOpen(false);
          }
        }}
        title={
          sidebarCollapsed
            ? `${userName || "User"} — View Profile`
            : "View Profile"
        }
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-9 h-9 rounded-full bg-linear-to-br ${roleGradient} flex items-center justify-center text-white font-semibold text-sm shadow-md`}
          >
            {userInitials}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[rgb(var(--surface))]" />
        </div>

        {/* User details - hidden when collapsed */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 min-w-0 overflow-hidden"
            >
              <p className="text-sm font-semibold text-[rgb(var(--foreground))] truncate">
                {userName || "User"}
              </p>
              <p className="text-xs text-[rgb(var(--muted))] truncate">
                {roleLabel}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip for collapsed state */}
        {sidebarCollapsed && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap">
            <p className="text-sm font-medium text-[rgb(var(--foreground))]">
              {userName || "User"}
            </p>
            <p className="text-xs text-[rgb(var(--muted))]">{roleLabel}</p>
          </div>
        )}
      </motion.div>
    </div>

    {/* Logout Button */}
    <div
      className={`p-3 border-t border-[rgb(var(--border))] ${sidebarCollapsed ? "px-2" : ""}`}
    >
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title={sidebarCollapsed ? "Logout" : undefined}
        className="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 transition-all group relative"
      >
        <LogOut
          size={20}
          className="shrink-0 group-hover:-translate-x-0.5 transition-transform"
        />
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-medium whitespace-nowrap overflow-hidden"
            >
              Logout
            </motion.span>
          )}
        </AnimatePresence>
        {sidebarCollapsed && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap">
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              Logout
            </span>
          </div>
        )}
      </motion.button>
    </div>
  </motion.aside>
</>


);
};

export default Sidebar;