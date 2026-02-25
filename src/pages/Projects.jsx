// src/pages/Projects.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Award, 
  X, 
  Send, 
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Building2,
  ExternalLink,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  Check
} from "lucide-react";
import { projectsData } from "../data/mockData";
import { useToast } from "../context/ToastContext";
import EmptyState from "../components/EmptyState";
import { useReducedMotion } from "../hooks/useReducedMotion";

const ProjectsPage = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [isApplying, setIsApplying] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    location: [], // multi-select: remote, onsite, hybrid
    credits: "",  // single select: 1-2, 3-4, 5+
    duration: "", // single select: 1-month, 3-months, 6-months
  });
  
  // Sort state
  const [sortBy, setSortBy] = useState("newest");

  const prefersReducedMotion = useReducedMotion();
  const { showSuccess, showError, showInfo } = useToast();

  // Filter options configuration
  const filterConfig = {
    location: {
      label: "Location",
      type: "multi-select",
      options: [
        { value: "remote", label: "Remote" },
        { value: "onsite", label: "On-site" },
        { value: "hybrid", label: "Hybrid" },
      ],
    },
    credits: {
      label: "Credits",
      type: "select",
      options: [
        { value: "1-2", label: "1-2 Credits" },
        { value: "3-4", label: "3-4 Credits" },
        { value: "5+", label: "5+ Credits" },
      ],
    },
    duration: {
      label: "Duration",
      type: "select",
      options: [
        { value: "1-month", label: "1 Month" },
        { value: "3-months", label: "3 Months" },
        { value: "6-months", label: "6 Months" },
      ],
    },
  };

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "credits-high", label: "Credits: High to Low" },
    { value: "credits-low", label: "Credits: Low to High" },
    { value: "company-az", label: "Company: A-Z" },
  ];

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.location.length > 0) count += filters.location.length;
    if (filters.credits) count += 1;
    if (filters.duration) count += 1;
    return count;
  }, [filters]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projectsData];

    // Search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.company.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Location filter (multi-select)
    if (filters.location.length > 0) {
      result = result.filter((project) => {
        const projectLocation = project.location?.toLowerCase() || "remote";
        return filters.location.includes(projectLocation);
      });
    }

    // Credits filter
    if (filters.credits) {
      result = result.filter((project) => {
        const credits = project.credits || 0;
        switch (filters.credits) {
          case "1-2":
            return credits >= 1 && credits <= 2;
          case "3-4":
            return credits >= 3 && credits <= 4;
          case "5+":
            return credits >= 5;
          default:
            return true;
        }
      });
    }

    // Duration filter
    if (filters.duration) {
      result = result.filter((project) => {
        const duration = project.duration?.toLowerCase() || "3 months";
        switch (filters.duration) {
          case "1-month":
            return duration.includes("1 month");
          case "3-months":
            return duration.includes("3 month");
          case "6-months":
            return duration.includes("6 month");
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.postedDate || Date.now()) - new Date(a.postedDate || Date.now());
        case "oldest":
          return new Date(a.postedDate || 0) - new Date(b.postedDate || 0);
        case "credits-high":
          return (b.credits || 0) - (a.credits || 0);
        case "credits-low":
          return (a.credits || 0) - (b.credits || 0);
        case "company-az":
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    return result;
  }, [searchTerm, filters, sortBy]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle multi-select toggle
  const handleMultiSelectToggle = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      const newValue = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: newValue };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      location: [],
      credits: "",
      duration: "",
    });
    setSortBy("newest");
    setSearchTerm("");
    showInfo("All filters cleared", "Filters Reset");
  };

  // Remove single filter
  const removeFilter = (key, value = null) => {
    if (value && Array.isArray(filters[key])) {
      handleFilterChange(key, filters[key].filter((v) => v !== value));
    } else {
      handleFilterChange(key, Array.isArray(filters[key]) ? [] : "");
    }
  };

  // Handle Apply Button Click
  const handleApplyClick = (project) => {
    if (appliedProjects.includes(project.id)) {
      showInfo("You have already applied to this internship.", "Already Applied");
      return;
    }
    setSelectedProject(project);
    setShowApplyModal(true);
  };

  // Handle View Details
  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  // Handle Application Submit
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsApplying(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAppliedProjects([...appliedProjects, selectedProject.id]);
      setShowApplyModal(false);
      setSelectedProject(null);
      showSuccess(
        `Your application for "${selectedProject.title}" at ${selectedProject.company} has been submitted!`,
        "Application Submitted 🎉"
      );
    } catch (error) {
      showError("Failed to submit application. Please try again.", "Submission Failed");
    } finally {
      setIsApplying(false);
    }
  };

  // Handle Save/Bookmark Project
  const handleSaveProject = (project, e) => {
    e?.stopPropagation();
    
    if (savedProjects.includes(project.id)) {
      setSavedProjects(savedProjects.filter(id => id !== project.id));
      showInfo(`"${project.title}" removed from saved`, "Removed");
    } else {
      setSavedProjects([...savedProjects, project.id]);
      showSuccess(`"${project.title}" saved to your wishlist!`, "Saved ⭐");
    }
  };

  // Get active filter chips
  const getActiveFilterChips = () => {
    const chips = [];
    
    // Location chips
    filters.location.forEach((loc) => {
      const option = filterConfig.location.options.find((o) => o.value === loc);
      if (option) {
        chips.push({
          key: "location",
          value: loc,
          label: `Location: ${option.label}`,
        });
      }
    });

    // Credits chip
    if (filters.credits) {
      const option = filterConfig.credits.options.find((o) => o.value === filters.credits);
      if (option) {
        chips.push({
          key: "credits",
          value: filters.credits,
          label: `Credits: ${option.label}`,
        });
      }
    }

    // Duration chip
    if (filters.duration) {
      const option = filterConfig.duration.options.find((o) => o.value === filters.duration);
      if (option) {
        chips.push({
          key: "duration",
          value: filters.duration,
          label: `Duration: ${option.label}`,
        });
      }
    }

    return chips;
  };

  const activeChips = getActiveFilterChips();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[rgb(var(--foreground))]">
            Explore Projects
          </h2>
          <p className="text-[rgb(var(--muted))]">
            {filteredProjects.length} of {projectsData.length} internship opportunities
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
              size={20}
            />
            <input
              type="text"
              placeholder="Search projects, companies, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all relative ${
              filterOpen || activeFilterCount > 0
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-[rgb(var(--surface))] border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:border-blue-500"
            }`}
          >
            <Filter size={20} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white text-blue-600 text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:border-blue-500 transition-all"
            >
              <ArrowUpDown size={20} />
              <span className="hidden sm:inline">
                {sortOptions.find((o) => o.value === sortBy)?.label || "Sort"}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Sort Dropdown Menu */}
            <AnimatePresence>
              {sortOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSortOpen(false)}
                  />
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] shadow-xl z-50 overflow-hidden"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[rgb(var(--background))] transition-colors ${
                          sortBy === option.value
                            ? "text-blue-600 font-medium bg-blue-50 dark:bg-blue-500/10"
                            : "text-[rgb(var(--foreground))]"
                        }`}
                      >
                        {option.label}
                        {sortBy === option.value && <Check size={16} />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Clear All Button */}
          {(activeFilterCount > 0 || searchTerm) && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              <X size={20} />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-5 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] space-y-5">
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-[rgb(var(--muted))]" />
                    <span className="font-medium text-[rgb(var(--foreground))]">
                      Filter Options
                    </span>
                  </div>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Location Filter (Multi-select) */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                      {filterConfig.location.label}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {filterConfig.location.options.map((option) => {
                        const isSelected = filters.location.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleMultiSelectToggle("location", option.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] hover:bg-[rgb(var(--border))]"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Credits Filter (Select) */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                      {filterConfig.credits.label}
                    </label>
                    <select
                      value={filters.credits}
                      onChange={(e) => handleFilterChange("credits", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="">All Credits</option>
                      {filterConfig.credits.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration Filter (Select) */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                      {filterConfig.duration.label}
                    </label>
                    <select
                      value={filters.duration}
                      onChange={(e) => handleFilterChange("duration", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="">All Durations</option>
                      {filterConfig.duration.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Apply Filters Button (Mobile) */}
                <div className="flex justify-end pt-2 sm:hidden">
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filter Chips */}
        <AnimatePresence>
          {activeChips.length > 0 && (
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
              className="flex flex-wrap gap-2"
            >
              {activeChips.map((chip, idx) => (
                <motion.span
                  key={`${chip.key}-${chip.value}`}
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: idx * 0.05 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                >
                  {chip.label}
                  <button
                    onClick={() => removeFilter(chip.key, chip.value)}
                    className="p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-sm text-[rgb(var(--muted))] hover:text-red-600 transition-colors underline"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={prefersReducedMotion ? {} : { y: -5 }}
              className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))] shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all cursor-pointer group"
              onClick={() => handleViewDetails(project)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {project.company.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[rgb(var(--foreground))] group-hover:text-blue-600 transition-colors truncate">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[rgb(var(--muted))] truncate">{project.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {appliedProjects.includes(project.id) && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                      <CheckCircle size={12} />
                      Applied
                    </span>
                  )}
                  <button
                    onClick={(e) => handleSaveProject(project, e)}
                    className="p-2 rounded-lg hover:bg-[rgb(var(--background))] transition-colors"
                  >
                    {savedProjects.includes(project.id) ? (
                      <BookmarkCheck size={20} className="text-blue-600" />
                    ) : (
                      <Bookmark size={20} className="text-[rgb(var(--muted))]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[rgb(var(--muted))] mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-md text-xs bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="px-2 py-1 rounded-md text-xs bg-[rgb(var(--background))] text-[rgb(var(--muted))]">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-[rgb(var(--muted))] mb-4">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {project.location || "Remote"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {project.duration || "3 months"}
                </span>
                <span className="flex items-center gap-1">
                  <Award size={14} />
                  {project.credits} Credits
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                <motion.button
                  onClick={() => handleApplyClick(project)}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  disabled={appliedProjects.includes(project.id)}
                  className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
                    appliedProjects.includes(project.id)
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                  }`}
                >
                  {appliedProjects.includes(project.id) ? "Applied" : "Apply Now"}
                </motion.button>
                <motion.button
                  onClick={() => handleViewDetails(project)}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  className="px-4 py-2.5 rounded-xl border-2 border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:border-blue-500 transition-all"
                >
                  <ExternalLink size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          preset="search"
          title="No projects found"
          description={
            activeFilterCount > 0
              ? "Try adjusting your filters or search term"
              : "No projects match your search criteria"
          }
          buttonText="Clear Filters"
          onButtonClick={clearAllFilters}
        />
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowApplyModal(false)}
          >
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
              className="bg-[rgb(var(--surface))] rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-[rgb(var(--border))] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[rgb(var(--foreground))]">
                    Apply for Internship
                  </h3>
                  <p className="text-[rgb(var(--muted))]">
                    {selectedProject.title} at {selectedProject.company}
                  </p>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Application Form */}
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                    Why are you interested in this position? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your motivation and what you hope to learn..."
                    className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                    Relevant Experience
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe any relevant projects, coursework, or experience..."
                    className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                    Portfolio/GitHub Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/yourusername"
                    className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                    Available Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="submit"
                    disabled={isApplying}
                    whileHover={prefersReducedMotion || isApplying ? {} : { scale: 1.02 }}
                    whileTap={prefersReducedMotion || isApplying ? {} : { scale: 0.98 }}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      isApplying
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                    }`}
                  >
                    {isApplying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Application
                      </>
                    )}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-6 py-3 rounded-xl font-semibold bg-[rgb(var(--background))] text-[rgb(var(--foreground))] border border-[rgb(var(--border))] hover:bg-[rgb(var(--border))] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
              className="bg-[rgb(var(--surface))] rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-[rgb(var(--border))] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                    {selectedProject.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[rgb(var(--foreground))]">
                      {selectedProject.title}
                    </h3>
                    <p className="text-[rgb(var(--muted))] flex items-center gap-2">
                      <Building2 size={16} />
                      {selectedProject.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
                  <MapPin size={16} className="text-blue-500" />
                  {selectedProject.location || "Remote"}
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
                  <Clock size={16} className="text-green-500" />
                  {selectedProject.duration || "3 months"}
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
                  <Award size={16} className="text-purple-500" />
                  {selectedProject.credits} Credits
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-[rgb(var(--foreground))] mb-2">Description</h4>
                <p className="text-[rgb(var(--muted))] leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h4 className="font-semibold text-[rgb(var(--foreground))] mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg text-sm bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[rgb(var(--border))]">
                <motion.button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleApplyClick(selectedProject);
                  }}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  disabled={appliedProjects.includes(selectedProject.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                    appliedProjects.includes(selectedProject.id)
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                  }`}
                >
                  {appliedProjects.includes(selectedProject.id) ? (
                    <>
                      <CheckCircle size={18} />
                      Already Applied
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Apply Now
                    </>
                  )}
                </motion.button>
                <motion.button
                  onClick={() => handleSaveProject(selectedProject)}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  className="px-6 py-3 rounded-xl border-2 border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:border-blue-500 transition-all flex items-center gap-2"
                >
                  {savedProjects.includes(selectedProject.id) ? (
                    <>
                      <BookmarkCheck size={18} className="text-blue-600" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark size={18} />
                      Save
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsPage;