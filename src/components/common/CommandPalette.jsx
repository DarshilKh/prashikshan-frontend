// src/components/common/CommandPalette.jsx
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Command,
  ArrowRight,
  Home,
  User,
  Settings,
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  BarChart3,
  X,
  Moon,
  Sun,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useKeyboard, useEscapeKey } from "../../hooks/useKeyboard";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Command Palette - Global search and navigation
 * Opens with Ctrl/Cmd + K
 */

// Navigation items - customize based on user role
const getNavigationItems = (userRole = "student") => {
  const commonItems = [
    {
      id: "home",
      title: "Go to Dashboard",
      subtitle: "View your dashboard",
      icon: Home,
      action: "navigate",
      path: `/${userRole}/dashboard`,
      keywords: ["home", "dashboard", "main"],
      category: "Navigation",
    },
    {
      id: "profile",
      title: "View Profile",
      subtitle: "Edit your profile information",
      icon: User,
      action: "navigate",
      path: `/${userRole}/profile`,
      keywords: ["profile", "account", "personal"],
      category: "Navigation",
    },
    {
      id: "settings",
      title: "Settings",
      subtitle: "Manage your preferences",
      icon: Settings,
      action: "navigate",
      path: `/${userRole}/settings`,
      keywords: ["settings", "preferences", "config"],
      category: "Navigation",
    },
    {
      id: "messages",
      title: "Messages",
      subtitle: "View your messages",
      icon: MessageSquare,
      action: "navigate",
      path: `/${userRole}/messages`,
      keywords: ["messages", "chat", "inbox"],
      category: "Navigation",
    },
  ];

  const roleSpecificItems = {
    student: [
      {
        id: "applications",
        title: "My Applications",
        subtitle: "Track your applications",
        icon: FileText,
        action: "navigate",
        path: "/student/applications",
        keywords: ["applications", "applied", "status"],
        category: "Navigation",
      },
      {
        id: "projects",
        title: "Browse Projects",
        subtitle: "Find new opportunities",
        icon: Briefcase,
        action: "navigate",
        path: "/student/projects",
        keywords: ["projects", "opportunities", "browse"],
        category: "Navigation",
      },
    ],
    faculty: [
      {
        id: "students",
        title: "Manage Students",
        subtitle: "View and manage students",
        icon: Users,
        action: "navigate",
        path: "/faculty/students",
        keywords: ["students", "manage", "list"],
        category: "Navigation",
      },
      {
        id: "reports",
        title: "View Reports",
        subtitle: "Analytics and reports",
        icon: BarChart3,
        action: "navigate",
        path: "/faculty/reports",
        keywords: ["reports", "analytics", "stats"],
        category: "Navigation",
      },
    ],
    industry: [
      {
        id: "openings",
        title: "Manage Openings",
        subtitle: "Post and manage job openings",
        icon: Briefcase,
        action: "navigate",
        path: "/industry/openings",
        keywords: ["openings", "jobs", "post"],
        category: "Navigation",
      },
      {
        id: "applications-review",
        title: "Review Applications",
        subtitle: "Review candidate applications",
        icon: FileText,
        action: "navigate",
        path: "/industry/applications",
        keywords: ["applications", "candidates", "review"],
        category: "Navigation",
      },
    ],
  };

  return [...commonItems, ...(roleSpecificItems[userRole] || [])];
};

// Quick actions
const quickActions = [
  {
    id: "toggle-theme",
    title: "Toggle Dark Mode",
    subtitle: "Switch between light and dark theme",
    icon: Moon,
    action: "theme",
    keywords: ["dark", "light", "theme", "mode", "toggle"],
    category: "Actions",
  },
  {
    id: "notifications",
    title: "View Notifications",
    subtitle: "Check your notifications",
    icon: Bell,
    action: "notifications",
    keywords: ["notifications", "alerts", "bell"],
    category: "Actions",
  },
  {
    id: "help",
    title: "Help & Support",
    subtitle: "Get help and documentation",
    icon: HelpCircle,
    action: "help",
    keywords: ["help", "support", "docs", "documentation"],
    category: "Actions",
  },
  {
    id: "logout",
    title: "Log Out",
    subtitle: "Sign out of your account",
    icon: LogOut,
    action: "logout",
    keywords: ["logout", "sign out", "exit"],
    category: "Actions",
  },
];

export const CommandPalette = ({ 
  isOpen, 
  onClose, 
  userRole = "student",
  onLogout,
  onToggleNotifications,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // Get navigation items based on role
  const navigationItems = useMemo(
    () => getNavigationItems(userRole),
    [userRole]
  );

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const allItems = [...navigationItems, ...quickActions];

    if (!query.trim()) {
      return allItems.slice(0, 8); // Show first 8 items when no query
    }

    const lowerQuery = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.subtitle.toLowerCase().includes(lowerQuery) ||
        item.keywords.some((k) => k.includes(lowerQuery))
    );
  }, [query, navigationItems]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups = {};
    filteredItems.forEach((item) => {
      const category = item.category || "Other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Flatten grouped items for index tracking
  const flattenedItems = useMemo(() => {
    return Object.values(groupedItems).flat();
  }, [groupedItems]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEscapeKey(onClose, isOpen);

  // Handle keyboard navigation
  useKeyboard(
    {
      arrowdown: (e) => {
        if (!isOpen) return;
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < flattenedItems.length - 1 ? prev + 1 : 0
        );
      },
      arrowup: (e) => {
        if (!isOpen) return;
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : flattenedItems.length - 1
        );
      },
      enter: (e) => {
        if (!isOpen || flattenedItems.length === 0) return;
        e.preventDefault();
        handleSelect(flattenedItems[selectedIndex]);
      },
    },
    [isOpen, flattenedItems, selectedIndex]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && flattenedItems.length > 0) {
      const selectedElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selectedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, flattenedItems.length]);

  // Handle item selection
  const handleSelect = useCallback(
    (item) => {
      switch (item.action) {
        case "navigate":
          navigate(item.path);
          onClose();
          break;
        case "theme":
          document.documentElement.classList.toggle("dark");
          // Optionally save preference to localStorage
          const isDark = document.documentElement.classList.contains("dark");
          localStorage.setItem("theme", isDark ? "dark" : "light");
          onClose();
          break;
        case "notifications":
          onToggleNotifications?.();
          onClose();
          break;
        case "logout":
          onLogout?.();
          onClose();
          break;
        case "help":
          // Navigate to help page or open help modal
          navigate("/help");
          onClose();
          break;
        default:
          onClose();
      }
    },
    [navigate, onClose, onLogout, onToggleNotifications]
  );

  // Get current item index across all groups
  const getGlobalIndex = useCallback(
    (category, localIndex) => {
      let globalIndex = 0;
      for (const [cat, items] of Object.entries(groupedItems)) {
        if (cat === category) {
          return globalIndex + localIndex;
        }
        globalIndex += items.length;
      }
      return globalIndex;
    },
    [groupedItems]
  );

  // Backdrop variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Modal variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        key="command-palette-backdrop"
        className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh]"
        variants={prefersReducedMotion ? {} : backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.15 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-xl mx-4"
          variants={prefersReducedMotion ? {} : modalVariants}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-[rgb(var(--border))]">
              <Search className="w-5 h-5 text-[rgb(var(--muted))] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or type a command..."
                className="flex-1 bg-transparent outline-none text-[rgb(var(--foreground))] text-lg placeholder:text-[rgb(var(--muted))]"
                aria-label="Search commands"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[rgb(var(--border))] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                aria-label="Close command palette"
              >
                <X className="w-5 h-5 text-[rgb(var(--muted))]" />
              </button>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-80 overflow-y-auto p-2"
              role="listbox"
              aria-label="Search results"
            >
              {flattenedItems.length === 0 ? (
                <div className="py-12 text-center">
                  <Search className="w-12 h-12 mx-auto text-[rgb(var(--muted))] mb-3 opacity-50" />
                  <p className="text-[rgb(var(--muted))] font-medium">
                    No results found
                  </p>
                  <p className="text-sm text-[rgb(var(--muted))] mt-1">
                    Try searching for something else
                  </p>
                </div>
              ) : (
                Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category} className="mb-2 last:mb-0">
                    {/* Category Header */}
                    <div className="px-3 py-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
                        {category}
                      </span>
                    </div>

                    {/* Items */}
                    {items.map((item, localIndex) => {
                      const Icon = item.icon;
                      const globalIndex = getGlobalIndex(category, localIndex);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={item.id}
                          data-index={globalIndex}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150
                            ${
                              isSelected
                                ? "bg-[rgb(var(--primary))] bg-opacity-10"
                                : "hover:bg-[rgb(var(--background))]"
                            }
                          `}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <div
                            className={`
                              p-2 rounded-lg transition-colors
                              ${
                                isSelected
                                  ? "bg-[rgb(var(--primary))] text-white"
                                  : "bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
                              }
                            `}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p
                              className={`font-medium truncate ${
                                isSelected
                                  ? "text-[rgb(var(--primary))]"
                                  : "text-[rgb(var(--foreground))]"
                              }`}
                            >
                              {item.title}
                            </p>
                            <p className="text-sm text-[rgb(var(--muted))] truncate">
                              {item.subtitle}
                            </p>
                          </div>
                          <ArrowRight
                            className={`w-4 h-4 shrink-0 transition-transform ${
                              isSelected
                                ? "text-[rgb(var(--primary))] translate-x-1"
                                : "text-[rgb(var(--muted))]"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer with keyboard hints */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[rgb(var(--border))] bg-[rgb(var(--background))]">
              <div className="flex items-center gap-4 text-xs text-[rgb(var(--muted))]">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-[rgb(var(--surface))] border border-[rgb(var(--border))] font-mono">
                    ↑↓
                  </kbd>
                  <span className="hidden sm:inline">navigate</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-[rgb(var(--surface))] border border-[rgb(var(--border))] font-mono">
                    ↵
                  </kbd>
                  <span className="hidden sm:inline">select</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-[rgb(var(--surface))] border border-[rgb(var(--border))] font-mono">
                    esc
                  </kbd>
                  <span className="hidden sm:inline">close</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[rgb(var(--muted))]">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

/**
 * Hook to use command palette
 */
export const useCommandPaletteState = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Register Ctrl/Cmd + K shortcut
  useKeyboard({
    "ctrl+k": (e) => {
      e.preventDefault();
      toggle();
    },
  });

  return { isOpen, open, close, toggle };
};

/**
 * Command Palette Trigger Button
 */
export const CommandPaletteTrigger = ({ onClick, className = "" }) => {
  // Detect OS for keyboard shortcut display
  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl
        bg-[rgb(var(--surface))] border border-[rgb(var(--border))]
        text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]
        transition-all duration-200 hover:border-[rgb(var(--primary))] hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2
        ${className}
      `}
      aria-label={`Open command palette (${isMac ? "⌘" : "Ctrl"}+K)`}
    >
      <Search className="w-4 h-4" />
      <span className="hidden sm:block text-sm">Search...</span>
      <div className="hidden sm:flex items-center gap-0.5 ml-auto pl-4">
        <kbd className="px-1.5 py-0.5 text-xs rounded bg-[rgb(var(--background))] border border-[rgb(var(--border))] font-mono">
          {isMac ? "⌘" : "Ctrl"}
        </kbd>
        <kbd className="px-1.5 py-0.5 text-xs rounded bg-[rgb(var(--background))] border border-[rgb(var(--border))] font-mono">
          K
        </kbd>
      </div>
    </button>
  );
};

export default CommandPalette;