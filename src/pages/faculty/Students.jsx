// src/pages/faculty/Students.jsx
import React, { useState, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Eye, 
  X,
  ChevronDown,
  Check,
  ArrowUpDown,
  SlidersHorizontal,
  Download,
  Mail,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  MoreVertical,
  FileText,
  MessageSquare
} from "lucide-react";
import { facultyData } from "../../data/mockData";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useToast } from "../../context/ToastContext";
import { 
  Skeleton, 
  SkeletonTableRow 
} from "../../components/common/Skeleton";
import { Heading, Body, Caption } from "../../components/common/Typography";
import { Button } from "../../components/common/Button";
import EmptyState from "../../components/EmptyState";

const FacultyStudents = () => {
  const { navigate: layoutNavigate } = useOutletContext();
  const routerNavigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { showSuccess, showInfo } = useToast();

  // Loading state (for demo)
  const [isLoading, setIsLoading] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    status: [],      // multi-select: Excellent, On Track, Needs Attention
    branch: [],      // multi-select: CSE, ECE, ME, etc.
    creditsRange: "", // single select: 0-5, 6-10, 11-15, 16+
    semester: "",    // single select: 1-8
  });

  // Sort state
  const [sortBy, setSortBy] = useState("name-az");

  // Selected students for bulk actions
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Filter configuration
  const filterConfig = {
    status: {
      label: "Status",
      type: "multi-select",
      options: [
        { value: "Excellent", label: "Excellent", color: "green" },
        { value: "On Track", label: "On Track", color: "blue" },
        { value: "Needs Attention", label: "Needs Attention", color: "orange" },
      ],
    },
    branch: {
      label: "Branch",
      type: "multi-select",
      options: [
        { value: "CSE", label: "Computer Science" },
        { value: "ECE", label: "Electronics" },
        { value: "ME", label: "Mechanical" },
        { value: "CE", label: "Civil" },
        { value: "EE", label: "Electrical" },
        { value: "IT", label: "Information Technology" },
      ],
    },
    creditsRange: {
      label: "Credits Earned",
      type: "select",
      options: [
        { value: "0-5", label: "0-5 Credits" },
        { value: "6-10", label: "6-10 Credits" },
        { value: "11-15", label: "11-15 Credits" },
        { value: "16+", label: "16+ Credits" },
      ],
    },
    semester: {
      label: "Semester",
      type: "select",
      options: Array.from({ length: 8 }, (_, i) => ({
        value: String(i + 1),
        label: `Semester ${i + 1}`,
      })),
    },
  };

  // Sort options
  const sortOptions = [
    { value: "name-az", label: "Name: A-Z" },
    { value: "name-za", label: "Name: Z-A" },
    { value: "credits-high", label: "Credits: High to Low" },
    { value: "credits-low", label: "Credits: Low to High" },
    { value: "status", label: "Status" },
    { value: "branch", label: "Branch" },
  ];

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status.length > 0) count += filters.status.length;
    if (filters.branch.length > 0) count += filters.branch.length;
    if (filters.creditsRange) count += 1;
    if (filters.semester) count += 1;
    return count;
  }, [filters]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let result = [...(facultyData.students || [])];

    // Search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.branch.toLowerCase().includes(query) ||
          student.email?.toLowerCase().includes(query) ||
          student.rollNumber?.toLowerCase().includes(query)
      );
    }

    // Status filter (multi-select)
    if (filters.status.length > 0) {
      result = result.filter((student) => 
        filters.status.includes(student.status)
      );
    }

    // Branch filter (multi-select)
    if (filters.branch.length > 0) {
      result = result.filter((student) => 
        filters.branch.includes(student.branch)
      );
    }

    // Credits range filter
    if (filters.creditsRange) {
      result = result.filter((student) => {
        const credits = student.credits || 0;
        switch (filters.creditsRange) {
          case "0-5":
            return credits >= 0 && credits <= 5;
          case "6-10":
            return credits >= 6 && credits <= 10;
          case "11-15":
            return credits >= 11 && credits <= 15;
          case "16+":
            return credits >= 16;
          default:
            return true;
        }
      });
    }

    // Semester filter
    if (filters.semester) {
      result = result.filter(
        (student) => String(student.semester) === filters.semester
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-az":
          return a.name.localeCompare(b.name);
        case "name-za":
          return b.name.localeCompare(a.name);
        case "credits-high":
          return (b.credits || 0) - (a.credits || 0);
        case "credits-low":
          return (a.credits || 0) - (b.credits || 0);
        case "status":
          const statusOrder = { "Excellent": 1, "On Track": 2, "Needs Attention": 3 };
          return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
        case "branch":
          return a.branch.localeCompare(b.branch);
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
      status: [],
      branch: [],
      creditsRange: "",
      semester: "",
    });
    setSortBy("name-az");
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

  // Get active filter chips
  const getActiveFilterChips = () => {
    const chips = [];
    
    filters.status.forEach((status) => {
      chips.push({
        key: "status",
        value: status,
        label: `Status: ${status}`,
      });
    });

    filters.branch.forEach((branch) => {
      const option = filterConfig.branch.options.find((o) => o.value === branch);
      chips.push({
        key: "branch",
        value: branch,
        label: `Branch: ${option?.label || branch}`,
      });
    });

    if (filters.creditsRange) {
      const option = filterConfig.creditsRange.options.find(
        (o) => o.value === filters.creditsRange
      );
      chips.push({
        key: "creditsRange",
        value: filters.creditsRange,
        label: `Credits: ${option?.label || filters.creditsRange}`,
      });
    }

    if (filters.semester) {
      chips.push({
        key: "semester",
        value: filters.semester,
        label: `Semester ${filters.semester}`,
      });
    }

    return chips;
  };

  const activeChips = getActiveFilterChips();

  // Handle view student
  const handleViewStudent = (studentId) => {
    routerNavigate(`/faculty/student/${studentId}`);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  // Handle select student
  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Handle bulk actions
  const handleBulkEmail = () => {
    showSuccess(`Email sent to ${selectedStudents.length} students`, "Emails Sent");
    setSelectedStudents([]);
  };

  const handleExport = () => {
    showSuccess("Student data exported successfully", "Export Complete");
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Excellent":
        return <TrendingUp className="w-4 h-4" />;
      case "On Track":
        return <UserCheck className="w-4 h-4" />;
      case "Needs Attention":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Stats summary
  const stats = useMemo(() => {
    const total = facultyData.students?.length || 0;
    const excellent = facultyData.students?.filter((s) => s.status === "Excellent").length || 0;
    const onTrack = facultyData.students?.filter((s) => s.status === "On Track").length || 0;
    const needsAttention = facultyData.students?.filter((s) => s.status === "Needs Attention").length || 0;
    
    return { total, excellent, onTrack, needsAttention };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <Heading level={2}>Students</Heading>
          <Body muted>
            Manage and monitor {stats.total} students
          </Body>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Export
          </Button>
          {selectedStudents.length > 0 && (
            <Button
              variant="primary"
              leftIcon={<Mail className="w-4 h-4" />}
              onClick={handleBulkEmail}
            >
              Email ({selectedStudents.length})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[rgb(var(--surface))] rounded-xl p-4 border border-[rgb(var(--border))]"
        >
          <Caption>Total Students</Caption>
          <Heading level={3} className="mt-1">{stats.total}</Heading>
        </motion.div>
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[rgb(var(--surface))] rounded-xl p-4 border border-[rgb(var(--border))]"
        >
          <Caption className="text-green-600">Excellent</Caption>
          <Heading level={3} className="mt-1 text-green-600">{stats.excellent}</Heading>
        </motion.div>
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[rgb(var(--surface))] rounded-xl p-4 border border-[rgb(var(--border))]"
        >
          <Caption className="text-blue-600">On Track</Caption>
          <Heading level={3} className="mt-1 text-blue-600">{stats.onTrack}</Heading>
        </motion.div>
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[rgb(var(--surface))] rounded-xl p-4 border border-[rgb(var(--border))]"
        >
          <Caption className="text-orange-600">Needs Attention</Caption>
          <Heading level={3} className="mt-1 text-orange-600">{stats.needsAttention}</Heading>
        </motion.div>
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
              placeholder="Search by name, branch, email, roll number..."
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
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

            <AnimatePresence>
              {sortOpen && (
                <>
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
              <span className="hidden sm:inline">Clear</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Status Filter (Multi-select with colors) */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                      {filterConfig.status.label}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {filterConfig.status.options.map((option) => {
                        const isSelected = filters.status.includes(option.value);
                        const colorClasses = {
                          green: isSelected 
                            ? "bg-green-600 text-white" 
                            : "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
                          blue: isSelected 
                            ? "bg-blue-600 text-white" 
                            : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
                          orange: isSelected 
                            ? "bg-orange-600 text-white" 
                            : "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400",
                        };
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleMultiSelectToggle("status", option.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                              colorClasses[option.color]
                            }`}
                          >
                            {getStatusIcon(option.value)}
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Branch Filter (Multi-select) */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                      {filterConfig.branch.label}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {filterConfig.branch.options.map((option) => {
                        const isSelected = filters.branch.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleMultiSelectToggle("branch", option.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] hover:bg-[rgb(var(--border))]"
                            }`}
                          >
                            {option.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Credits Range Filter (Select) */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                      {filterConfig.creditsRange.label}
                    </label>
                    <select
                      value={filters.creditsRange}
                      onChange={(e) => handleFilterChange("creditsRange", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="">All Credits</option>
                      {filterConfig.creditsRange.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Filter (Select) */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                      {filterConfig.semester.label}
                    </label>
                    <select
                      value={filters.semester}
                      onChange={(e) => handleFilterChange("semester", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="">All Semesters</option>
                      {filterConfig.semester.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
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

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <Caption>
          Showing {filteredStudents.length} of {facultyData.students?.length || 0} students
        </Caption>
        {selectedStudents.length > 0 && (
          <Caption className="text-blue-600">
            {selectedStudents.length} selected
          </Caption>
        )}
      </div>

      {/* Students Table */}
      {filteredStudents.length > 0 ? (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[rgb(var(--surface))] rounded-2xl border border-[rgb(var(--border))] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]">
                  <th className="py-4 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-[rgb(var(--border))] text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--muted))]">
                    Student
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--muted))]">
                    Branch
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--muted))]">
                    Semester
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--muted))]">
                    Credits
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--muted))]">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[rgb(var(--muted))]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Skeleton loading rows
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-[rgb(var(--border))]">
                      <td className="py-4 px-4">
                        <Skeleton className="w-4 h-4 rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-16" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-12" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-8" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-6 w-20 rounded-full" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-8 w-16 rounded-lg" /></td>
                    </tr>
                  ))
                ) : (
                  filteredStudents.map((student, idx) => (
                    <motion.tr
                      key={student.id}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--background))] transition-colors ${
                        selectedStudents.includes(student.id) ? "bg-blue-50 dark:bg-blue-500/5" : ""
                      }`}
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleSelectStudent(student.id)}
                          className="w-4 h-4 rounded border-[rgb(var(--border))] text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[rgb(var(--foreground))] truncate">
                              {student.name}
                            </p>
                            <p className="text-sm text-[rgb(var(--muted))] truncate">
                              {student.email || student.rollNumber || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[rgb(var(--muted))]">
                        {student.branch}
                      </td>
                      <td className="py-4 px-6 text-[rgb(var(--muted))]">
                        {student.semester || "-"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-[rgb(var(--foreground))]">
                          {student.credits}
                        </span>
                        <span className="text-[rgb(var(--muted))] text-sm"> / 20</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            student.status === "Excellent"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                              : student.status === "On Track"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
                          }`}
                        >
                          {getStatusIcon(student.status)}
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewStudent(student.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all text-sm font-medium"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          
                          {/* More Actions Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => setActionMenuOpen(actionMenuOpen === student.id ? null : student.id)}
                              className="p-1.5 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>

                            <AnimatePresence>
                              {actionMenuOpen === student.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setActionMenuOpen(null)}
                                  />
                                  <motion.div
                                    initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 mt-1 w-40 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] shadow-xl z-50 overflow-hidden"
                                  >
                                    <button
                                      onClick={() => {
                                        showInfo(`Report generated for ${student.name}`, "Report");
                                        setActionMenuOpen(null);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-[rgb(var(--background))] transition-colors text-[rgb(var(--foreground))]"
                                    >
                                      <FileText size={14} />
                                      Generate Report
                                    </button>
                                    <button
                                      onClick={() => {
                                        showInfo(`Message sent to ${student.name}`, "Message");
                                        setActionMenuOpen(null);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-[rgb(var(--background))] transition-colors text-[rgb(var(--foreground))]"
                                    >
                                      <MessageSquare size={14} />
                                      Send Message
                                    </button>
                                    <button
                                      onClick={() => {
                                        showInfo(`Email sent to ${student.name}`, "Email");
                                        setActionMenuOpen(null);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-[rgb(var(--background))] transition-colors text-[rgb(var(--foreground))]"
                                    >
                                      <Mail size={14} />
                                      Send Email
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination Placeholder */}
          <div className="px-6 py-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--background))] flex items-center justify-between">
            <Caption>
              Page 1 of 1
            </Caption>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" disabled>
                Previous
              </Button>
              <Button variant="secondary" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <EmptyState
          preset="search"
          title="No students found"
          description={
            activeFilterCount > 0
              ? "Try adjusting your filters or search term"
              : "No students match your search criteria"
          }
          buttonText="Clear Filters"
          onButtonClick={clearAllFilters}
        />
      )}
    </div>
  );
};

export default FacultyStudents;