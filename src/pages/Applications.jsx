// src/pages/Applications.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  X, 
  Check, 
  Clock, 
  Eye, 
  Mail, 
  Download,
  ArrowUpDown,
  ChevronDown,
  SlidersHorizontal,
  FileText,
  User,
  Calendar,
  Building2,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { industryData } from "../data/mockData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useToast } from "../context/ToastContext";
import { Heading, Body, Caption } from "../components/common/Typography";
import { Button } from "../components/common/Button";
import { SkeletonTableRow, Skeleton } from "../components/common/Skeleton";
import EmptyState from "../components/EmptyState";

const ApplicationsPage = ({ setSelectedInternship, navigate, userRole }) => {
  const prefersReducedMotion = useReducedMotion();
  const { showSuccess, showInfo, showError } = useToast();

  // Applications data with local state for modifications
  const [applications, setApplications] = useState(industryData.recentApplications || []);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    status: [],       // multi-select: Pending, Under Review, Approved, Rejected
    project: "",      // single select
    dateRange: "",    // single select: today, week, month, all
  });

  // Sort state
  const [sortBy, setSortBy] = useState("newest");

  // Selected applications for bulk actions
  const [selectedApps, setSelectedApps] = useState([]);

  // View modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Filter configuration
  const filterConfig = {
    status: {
      label: "Status",
      type: "multi-select",
      options: [
        { value: "Pending", label: "Pending", color: "yellow" },
        { value: "Under Review", label: "Under Review", color: "blue" },
        { value: "Approved", label: "Approved", color: "green" },
        { value: "Rejected", label: "Rejected", color: "red" },
      ],
    },
    project: {
      label: "Project",
      type: "select",
      options: [...new Set(applications.map(a => a.project))].map(p => ({
        value: p,
        label: p,
      })),
    },
    dateRange: {
      label: "Applied Date",
      type: "select",
      options: [
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "all", label: "All Time" },
      ],
    },
  };

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name-az", label: "Name: A-Z" },
    { value: "name-za", label: "Name: Z-A" },
    { value: "status", label: "Status" },
  ];

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status.length > 0) count += filters.status.length;
    if (filters.project) count += 1;
    if (filters.dateRange && filters.dateRange !== 'all') count += 1;
    return count;
  }, [filters]);

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let result = [...applications];

    // Search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.email?.toLowerCase().includes(query) ||
          app.project.toLowerCase().includes(query) ||
          app.college?.toLowerCase().includes(query)
      );
    }

    // Status filter (multi-select)
    if (filters.status.length > 0) {
      result = result.filter((app) => filters.status.includes(app.status));
    }

    // Project filter
    if (filters.project) {
      result = result.filter((app) => app.project === filters.project);
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const today = new Date();
      result = result.filter((app) => {
        const appDate = new Date(app.appliedDate);
        const diffDays = Math.floor((today - appDate) / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case "today":
            return diffDays === 0;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.appliedDate) - new Date(a.appliedDate);
        case "oldest":
          return new Date(a.appliedDate) - new Date(b.appliedDate);
        case "name-az":
          return a.name.localeCompare(b.name);
        case "name-za":
          return b.name.localeCompare(a.name);
        case "status":
          const statusOrder = { "Pending": 1, "Under Review": 2, "Approved": 3, "Rejected": 4 };
          return (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
        default:
          return 0;
      }
    });

    return result;
  }, [searchTerm, filters, sortBy, applications]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
    setFilters({ status: [], project: "", dateRange: "" });
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

  // Get active filter chips
  const getActiveFilterChips = () => {
    const chips = [];
    
    filters.status.forEach((status) => {
      chips.push({ key: "status", value: status, label: `Status: ${status}` });
    });

    if (filters.project) {
      chips.push({ key: "project", value: filters.project, label: `Project: ${filters.project}` });
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const option = filterConfig.dateRange.options.find((o) => o.value === filters.dateRange);
      chips.push({ key: "dateRange", value: filters.dateRange, label: `Date: ${option?.label}` });
    }

    return chips;
  };

  const activeChips = getActiveFilterChips();

  // Stats
  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === 'Pending').length,
    underReview: applications.filter(a => a.status === 'Under Review').length,
    approved: applications.filter(a => a.status === 'Approved').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  }), [applications]);

  // Get status badge
  const getStatusBadge = (status) => {
    const styles = {
      "Pending": "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
      "Under Review": "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
      "Approved": "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
      "Rejected": "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
    };
    return styles[status] || "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400";
  };

  // Handle status update
  const handleUpdateStatus = (appId, newStatus) => {
    setApplications(applications.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
    showSuccess(`Application ${newStatus.toLowerCase()}`, "Status Updated");
  };

  // Handle view application
  const handleViewApplication = (app) => {
    setSelectedApplication(app);
    setShowViewModal(true);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedApps.length === filteredApplications.length) {
      setSelectedApps([]);
    } else {
      setSelectedApps(filteredApplications.map(a => a.id));
    }
  };

  // Handle select single
  const handleSelectApp = (appId) => {
    setSelectedApps(prev =>
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  // Bulk actions
  const handleBulkApprove = () => {
    setApplications(applications.map(app =>
      selectedApps.includes(app.id) ? { ...app, status: 'Approved' } : app
    ));
    showSuccess(`${selectedApps.length} applications approved`, "Bulk Action");
    setSelectedApps([]);
  };

  const handleBulkReject = () => {
    setApplications(applications.map(app =>
      selectedApps.includes(app.id) ? { ...app, status: 'Rejected' } : app
    ));
    showSuccess(`${selectedApps.length} applications rejected`, "Bulk Action");
    setSelectedApps([]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <Heading level={2}>Applications</Heading>
          <Body muted>Review and manage internship applications</Body>
        </div>
        <div className="flex items-center gap-3">
          {selectedApps.length > 0 && (
            <>
              <Button variant="primary" size="sm" leftIcon={<ThumbsUp size={16} />} onClick={handleBulkApprove}>
                Approve ({selectedApps.length})
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<ThumbsDown size={16} />} onClick={handleBulkReject} className="text-red-600 border-red-300 hover:bg-red-50">
                Reject ({selectedApps.length})
              </Button>
            </>
          )}
          <Button variant="secondary" leftIcon={<Download size={16} />} onClick={() => showSuccess("Export started", "Exporting...")}>
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'blue' },
          { label: 'Pending', value: stats.pending, color: 'yellow' },
          { label: 'Under Review', value: stats.underReview, color: 'blue' },
          { label: 'Approved', value: stats.approved, color: 'green' },
          { label: 'Rejected', value: stats.rejected, color: 'red' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`bg-[rgb(var(--surface))] rounded-xl p-4 border border-[rgb(var(--border))] cursor-pointer hover:shadow-md transition-all ${
              filters.status.includes(stat.label) || (stat.label === 'Total' && filters.status.length === 0) 
                ? 'ring-2 ring-blue-500' 
                : ''
            }`}
            onClick={() => {
              if (stat.label !== 'Total') {
                handleMultiSelectToggle('status', stat.label);
              } else {
                handleFilterChange('status', []);
              }
            }}
          >
            <Caption>{stat.label}</Caption>
            <Heading level={3} className={`mt-1 text-${stat.color}-600`}>{stat.value}</Heading>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]">
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
              <span className="hidden sm:inline">{sortOptions.find(o => o.value === sortBy)?.label}</span>
              <ChevronDown size={16} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] shadow-xl z-50 overflow-hidden"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[rgb(var(--background))] transition-colors ${
                          sortBy === option.value ? "text-blue-600 font-medium bg-blue-50 dark:bg-blue-500/10" : "text-[rgb(var(--foreground))]"
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

          {/* Clear All */}
          {(activeFilterCount > 0 || searchTerm) && (
            <button onClick={clearAllFilters} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
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
              className="overflow-hidden"
            >
              <div className="p-5 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-[rgb(var(--muted))]" />
                    <span className="font-medium">Filter Options</span>
                  </div>
                  <button onClick={() => setFilterOpen(false)} className="p-1.5 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]">
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {filterConfig.status.options.map((option) => {
                        const isSelected = filters.status.includes(option.value);
                        const colorClasses = {
                          yellow: isSelected ? "bg-yellow-600 text-white" : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
                          blue: isSelected ? "bg-blue-600 text-white" : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
                          green: isSelected ? "bg-green-600 text-white" : "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
                          red: isSelected ? "bg-red-600 text-white" : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
                        };
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleMultiSelectToggle("status", option.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${colorClasses[option.color]}`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">Project</label>
                    <select
                      value={filters.project}
                      onChange={(e) => handleFilterChange("project", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Projects</option>
                      {filterConfig.project.options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">Applied Date</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Time</option>
                      {filterConfig.dateRange.options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
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
              {activeChips.map((chip) => (
                <span
                  key={`${chip.key}-${chip.value}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                >
                  {chip.label}
                  <button onClick={() => removeFilter(chip.key, chip.value)} className="p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-500/30">
                    <X size={14} />
                  </button>
                </span>
              ))}
              <button onClick={clearAllFilters} className="text-sm text-[rgb(var(--muted))] hover:text-red-600 underline">Clear all</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <Caption>Showing {filteredApplications.length} of {applications.length} applications</Caption>
        {selectedApps.length > 0 && <Caption className="text-blue-600">{selectedApps.length} selected</Caption>}
      </div>

      {/* Applications Table */}
      {filteredApplications.length > 0 ? (
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
                      checked={selectedApps.length === filteredApplications.length && filteredApplications.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-[rgb(var(--border))] text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[rgb(var(--muted))]">Applicant</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[rgb(var(--muted))]">Project</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[rgb(var(--muted))]">Applied Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[rgb(var(--muted))]">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[rgb(var(--muted))]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => <SkeletonTableRow key={idx} columns={6} />)
                ) : (
                  filteredApplications.map((app, idx) => (
                    <motion.tr
                      key={app.id}
                      initial={prefersReducedMotion ? {} : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--background))] transition-colors ${
                        selectedApps.includes(app.id) ? "bg-blue-50 dark:bg-blue-500/5" : ""
                      }`}
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedApps.includes(app.id)}
                          onChange={() => handleSelectApp(app.id)}
                          className="w-4 h-4 rounded border-[rgb(var(--border))] text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                            {app.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-[rgb(var(--foreground))]">{app.name}</p>
                            <Caption>{app.email || app.college || 'N/A'}</Caption>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[rgb(var(--foreground))]">{app.project}</td>
                      <td className="py-4 px-4 text-[rgb(var(--muted))]">{app.appliedDate}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewApplication(app)}
                            className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-600"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {app.status !== 'Approved' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'Approved')}
                              className="p-2 rounded-lg hover:bg-green-500/10 text-green-600"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          {app.status !== 'Rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-red-600"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          )}
                          <button className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]" title="Send Message">
                            <Mail size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <EmptyState
          preset="search"
          title="No applications found"
          description={activeFilterCount > 0 ? "Try adjusting your filters" : "No applications yet"}
          buttonText={activeFilterCount > 0 ? "Clear Filters" : undefined}
          onButtonClick={activeFilterCount > 0 ? clearAllFilters : undefined}
        />
      )}

      {/* View Application Modal */}
      <AnimatePresence>
        {showViewModal && selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
              className="rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[rgb(var(--surface))]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {selectedApplication.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <Heading level={3}>{selectedApplication.name}</Heading>
                    <Caption>{selectedApplication.email || 'email@example.com'}</Caption>
                  </div>
                </div>
                <button onClick={() => setShowViewModal(false)} className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]">
                  <X size={20} />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedApplication.status)}`}>
                  {selectedApplication.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-[rgb(var(--muted))]" />
                  <div>
                    <Caption>Project</Caption>
                    <Body>{selectedApplication.project}</Body>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-[rgb(var(--muted))]" />
                  <div>
                    <Caption>Applied Date</Caption>
                    <Body>{selectedApplication.appliedDate}</Body>
                  </div>
                </div>
                {selectedApplication.college && (
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-[rgb(var(--muted))]" />
                    <div>
                      <Caption>College</Caption>
                      <Body>{selectedApplication.college}</Body>
                    </div>
                  </div>
                )}
                {selectedApplication.skills && (
                  <div className="flex items-start gap-3">
                    <FileText size={18} className="text-[rgb(var(--muted))] mt-1" />
                    <div>
                      <Caption>Skills</Caption>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedApplication.skills.map(skill => (
                          <span key={skill} className="px-2 py-1 rounded-lg text-sm bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-[rgb(var(--border))]">
                {selectedApplication.status !== 'Approved' && (
                  <Button
                    variant="primary"
                    leftIcon={<Check size={18} />}
                    onClick={() => {
                      handleUpdateStatus(selectedApplication.id, 'Approved');
                      setShowViewModal(false);
                    }}
                    className="flex-1"
                  >
                    Approve
                  </Button>
                )}
                {selectedApplication.status !== 'Rejected' && (
                  <Button
                    variant="secondary"
                    leftIcon={<X size={18} />}
                    onClick={() => {
                      handleUpdateStatus(selectedApplication.id, 'Rejected');
                      setShowViewModal(false);
                    }}
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                )}
                <Button variant="secondary" leftIcon={<MessageSquare size={18} />}>
                  Message
                </Button>
                {selectedApplication.resume && (
                  <Button variant="secondary" leftIcon={<ExternalLink size={18} />}>
                    Resume
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicationsPage;