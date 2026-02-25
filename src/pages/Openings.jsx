// src/pages/Openings.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Users, 
  Calendar,
  Award,
  AlertTriangle,
  Check,
  Pause,
  Play,
  ExternalLink,
  Clock,
  Briefcase,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  SlidersHorizontal,
  MapPin,
  Download
} from 'lucide-react';
import { projectsData } from '../data/mockData';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useToast } from '../context/ToastContext';
import { Heading, Body, Caption } from '../components/common/Typography';
import { Button } from '../components/common/Button';
import { SkeletonCard, Skeleton } from '../components/common/Skeleton';
import EmptyState from '../components/EmptyState';

const OpeningsPage = ({ userRole }) => {
  const prefersReducedMotion = useReducedMotion();
  const { showSuccess, showInfo, showError } = useToast();

  // State for projects (using local state to allow modifications)
  const [projects, setProjects] = useState(
    projectsData.map(p => ({ 
      ...p, 
      status: p.status || 'active',
      applicants: p.applicants || Math.floor(Math.random() * 20) + 1
    }))
  );
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    status: [],      // multi-select: active, paused, closed
    location: [],    // multi-select: Remote, Onsite, Hybrid
    credits: "",     // single select: 1-3, 4-6, 7+
    duration: "",    // single select: 1-2 months, 3-4 months, 5+ months
  });

  // Sort state
  const [sortBy, setSortBy] = useState("newest");
  
  // Modal states
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Selected project for edit/delete/view
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Form state for new project
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    skills: '',
    credits: '',
    duration: '',
    location: 'Remote',
    stipend: ''
  });
  
  // Form state for editing
  const [editProject, setEditProject] = useState({
    title: '',
    description: '',
    skills: '',
    credits: '',
    duration: '',
    location: '',
    status: 'active',
    stipend: ''
  });

  // Mock applicants data
  const mockApplicants = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', status: 'pending', appliedDate: '2024-01-15', avatar: 'RS', college: 'IIT Delhi' },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', status: 'shortlisted', appliedDate: '2024-01-14', avatar: 'PP', college: 'NIT Surat' },
    { id: 3, name: 'Amit Kumar', email: 'amit@example.com', status: 'rejected', appliedDate: '2024-01-13', avatar: 'AK', college: 'BITS Pilani' },
    { id: 4, name: 'Sneha Gupta', email: 'sneha@example.com', status: 'pending', appliedDate: '2024-01-12', avatar: 'SG', college: 'IIT Bombay' },
  ];

  // Filter configuration
  const filterConfig = {
    status: {
      label: "Status",
      type: "multi-select",
      options: [
        { value: "active", label: "Active", color: "green" },
        { value: "paused", label: "Paused", color: "yellow" },
        { value: "closed", label: "Closed", color: "red" },
      ],
    },
    location: {
      label: "Location",
      type: "multi-select",
      options: [
        { value: "Remote", label: "Remote" },
        { value: "Onsite", label: "On-site" },
        { value: "Hybrid", label: "Hybrid" },
      ],
    },
    credits: {
      label: "Credits",
      type: "select",
      options: [
        { value: "1-3", label: "1-3 Credits" },
        { value: "4-6", label: "4-6 Credits" },
        { value: "7+", label: "7+ Credits" },
      ],
    },
    duration: {
      label: "Duration",
      type: "select",
      options: [
        { value: "1-2", label: "1-2 Months" },
        { value: "3-4", label: "3-4 Months" },
        { value: "5+", label: "5+ Months" },
      ],
    },
  };

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "applicants-high", label: "Most Applicants" },
    { value: "applicants-low", label: "Least Applicants" },
    { value: "credits-high", label: "Credits: High to Low" },
    { value: "credits-low", label: "Credits: Low to High" },
    { value: "title-az", label: "Title: A-Z" },
  ];

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status.length > 0) count += filters.status.length;
    if (filters.location.length > 0) count += filters.location.length;
    if (filters.credits) count += 1;
    if (filters.duration) count += 1;
    return count;
  }, [filters]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Status filter (multi-select)
    if (filters.status.length > 0) {
      result = result.filter((project) => 
        filters.status.includes(project.status || 'active')
      );
    }

    // Location filter (multi-select)
    if (filters.location.length > 0) {
      result = result.filter((project) => 
        filters.location.includes(project.location || 'Remote')
      );
    }

    // Credits filter
    if (filters.credits) {
      result = result.filter((project) => {
        const credits = project.credits || 0;
        switch (filters.credits) {
          case "1-3":
            return credits >= 1 && credits <= 3;
          case "4-6":
            return credits >= 4 && credits <= 6;
          case "7+":
            return credits >= 7;
          default:
            return true;
        }
      });
    }

    // Duration filter
    if (filters.duration) {
      result = result.filter((project) => {
        const duration = project.duration?.toLowerCase() || "";
        const months = parseInt(duration) || 3;
        switch (filters.duration) {
          case "1-2":
            return months >= 1 && months <= 2;
          case "3-4":
            return months >= 3 && months <= 4;
          case "5+":
            return months >= 5;
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
        case "oldest":
          return new Date(a.postedDate || 0) - new Date(b.postedDate || 0);
        case "applicants-high":
          return (b.applicants || 0) - (a.applicants || 0);
        case "applicants-low":
          return (a.applicants || 0) - (b.applicants || 0);
        case "credits-high":
          return (b.credits || 0) - (a.credits || 0);
        case "credits-low":
          return (a.credits || 0) - (b.credits || 0);
        case "title-az":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [searchTerm, filters, sortBy, projects]);

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

  // Get active filter chips
  const getActiveFilterChips = () => {
    const chips = [];
    
    filters.status.forEach((status) => {
      const option = filterConfig.status.options.find((o) => o.value === status);
      chips.push({
        key: "status",
        value: status,
        label: `Status: ${option?.label || status}`,
      });
    });

    filters.location.forEach((location) => {
      chips.push({
        key: "location",
        value: location,
        label: `Location: ${location}`,
      });
    });

    if (filters.credits) {
      const option = filterConfig.credits.options.find((o) => o.value === filters.credits);
      chips.push({
        key: "credits",
        value: filters.credits,
        label: `Credits: ${option?.label || filters.credits}`,
      });
    }

    if (filters.duration) {
      const option = filterConfig.duration.options.find((o) => o.value === filters.duration);
      chips.push({
        key: "duration",
        value: filters.duration,
        label: `Duration: ${option?.label || filters.duration}`,
      });
    }

    return chips;
  };

  const activeChips = getActiveFilterChips();

  // Stats
  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    paused: projects.filter(p => p.status === 'paused').length,
    totalApplicants: projects.reduce((acc, p) => acc + (p.applicants || 0), 0),
  }), [projects]);

  // Handle posting new project
  const handlePostProject = (e) => {
    e.preventDefault();
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    const project = {
      id: newId,
      title: newProject.title,
      description: newProject.description,
      company: 'Your Company',
      tags: newProject.skills.split(',').map(s => s.trim()).filter(Boolean),
      credits: parseInt(newProject.credits) || 4,
      duration: newProject.duration,
      location: newProject.location,
      stipend: newProject.stipend,
      status: 'active',
      applicants: 0,
      postedDate: new Date().toISOString().split('T')[0]
    };
    
    setProjects([project, ...projects]);
    setShowPostModal(false);
    setNewProject({ title: '', description: '', skills: '', credits: '', duration: '', location: 'Remote', stipend: '' });
    showSuccess(`"${project.title}" has been posted successfully!`, "Internship Posted 🎉");
  };

  // Handle opening edit modal
  const handleEditClick = (project, e) => {
    e?.stopPropagation();
    setSelectedProject(project);
    setEditProject({
      title: project.title,
      description: project.description,
      skills: project.tags?.join(', ') || '',
      credits: project.credits?.toString() || '',
      duration: project.duration || '3 months',
      location: project.location || 'Remote',
      status: project.status || 'active',
      stipend: project.stipend || ''
    });
    setShowEditModal(true);
  };

  // Handle saving edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setProjects(projects.map(p => 
      p.id === selectedProject.id 
        ? {
            ...p,
            title: editProject.title,
            description: editProject.description,
            tags: editProject.skills.split(',').map(s => s.trim()).filter(Boolean),
            credits: parseInt(editProject.credits) || p.credits,
            duration: editProject.duration,
            location: editProject.location,
            status: editProject.status,
            stipend: editProject.stipend
          }
        : p
    ));
    setShowEditModal(false);
    setSelectedProject(null);
    showSuccess("Internship updated successfully!", "Changes Saved");
  };

  // Handle delete click
  const handleDeleteClick = (project, e) => {
    e?.stopPropagation();
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    const title = selectedProject.title;
    setProjects(projects.filter(p => p.id !== selectedProject.id));
    setShowDeleteModal(false);
    setSelectedProject(null);
    showSuccess(`"${title}" has been deleted`, "Internship Deleted");
  };

  // Handle view applicants
  const handleViewClick = (project, e) => {
    e?.stopPropagation();
    setSelectedProject(project);
    setShowViewModal(true);
  };

  // Handle toggle status
  const handleToggleStatus = (projectId, e) => {
    e?.stopPropagation();
    const project = projects.find(p => p.id === projectId);
    const newStatus = project.status === 'active' ? 'paused' : 'active';
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, status: newStatus }
        : p
    ));
    showInfo(`Internship ${newStatus === 'active' ? 'activated' : 'paused'}`, "Status Updated");
  };

  // Get status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
      case 'paused':
        return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'closed':
        return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400';
    }
  };

  // Get applicant status badge styles
  const getApplicantStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'shortlisted':
        return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <Heading level={2}>Internship Openings</Heading>
          <Body muted>Manage your posted internships</Body>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => showSuccess("Export started", "Exporting...")}
          >
            Export
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowPostModal(true)}
          >
            Post New Internship
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Openings', value: stats.total, icon: Briefcase, color: 'blue' },
          { label: 'Active', value: stats.active, icon: Play, color: 'green' },
          { label: 'Paused', value: stats.paused, icon: Pause, color: 'yellow' },
          { label: 'Total Applicants', value: stats.totalApplicants, icon: Users, color: 'purple' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-[rgb(var(--surface))] rounded-xl p-4 border border-[rgb(var(--border))]"
          >
            <div className="flex items-center justify-between">
              <div>
                <Caption>{stat.label}</Caption>
                <Heading level={3} className="mt-1">{stat.value}</Heading>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/15 flex items-center justify-center`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
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
              placeholder="Search openings by title, skills..."
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-[rgb(var(--muted))]" />
                    <span className="font-medium text-[rgb(var(--foreground))]">Filter Options</span>
                  </div>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {filterConfig.status.options.map((option) => {
                        const isSelected = filters.status.includes(option.value);
                        const colorClasses = {
                          green: isSelected ? "bg-green-600 text-white" : "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
                          yellow: isSelected ? "bg-yellow-600 text-white" : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
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

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                      Location
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
                                : "bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Credits Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                      Credits
                    </label>
                    <select
                      value={filters.credits}
                      onChange={(e) => handleFilterChange("credits", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Credits</option>
                      {filterConfig.credits.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-2">
                      Duration
                    </label>
                    <select
                      value={filters.duration}
                      onChange={(e) => handleFilterChange("duration", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <motion.span
                  key={`${chip.key}-${chip.value}`}
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
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
      <Caption>
        Showing {filteredProjects.length} of {projects.length} openings
      </Caption>

      {/* Openings Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="rounded-2xl p-6 shadow-sm bg-[rgb(var(--surface))] border border-[rgb(var(--border))] group hover:shadow-lg hover:border-blue-500/50 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {project.company?.charAt(0) || 'C'}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                    {(project.status || 'active').charAt(0).toUpperCase() + (project.status || 'active').slice(1)}
                  </span>
                  <button
                    onClick={(e) => handleToggleStatus(project.id, e)}
                    className="p-1.5 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-all"
                    title={project.status === 'active' ? 'Pause listing' : 'Activate listing'}
                  >
                    {project.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>
              </div>

              {/* Content */}
              <h4 className="text-lg font-semibold mb-2 text-[rgb(var(--foreground))] line-clamp-1">{project.title}</h4>
              <p className="text-sm text-[rgb(var(--muted))] mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-md text-xs bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags?.length > 3 && (
                  <span className="px-2 py-1 rounded-md text-xs bg-[rgb(var(--background))] text-[rgb(var(--muted))]">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Info Row */}
              <div className="flex items-center gap-4 text-sm text-[rgb(var(--muted))] mb-4">
                <div className="flex items-center gap-1">
                  <Award size={14} />
                  <span>{project.credits} Credits</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{project.applicants || 0} Applicants</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-[rgb(var(--muted))] mb-4">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{project.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{project.duration || '3 months'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-[rgb(var(--border))]">
                <button
                  onClick={(e) => handleViewClick(project, e)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all text-sm font-medium"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={(e) => handleEditClick(project, e)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-all text-sm font-medium"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
                <button
                  onClick={(e) => handleDeleteClick(project, e)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          preset="search"
          title="No openings found"
          description={activeFilterCount > 0 ? "Try adjusting your filters" : "Start by posting your first internship"}
          buttonText={activeFilterCount > 0 ? "Clear Filters" : "Post Internship"}
          onButtonClick={activeFilterCount > 0 ? clearAllFilters : () => setShowPostModal(true)}
        />
      )}

      {/* ==================== MODALS ==================== */}

      {/* Post New Internship Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPostModal(false)}
          >
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
              className="rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[rgb(var(--surface))]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <Heading level={3}>Post New Internship</Heading>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handlePostProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="e.g., Frontend Developer Intern"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={newProject.duration}
                      onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                      placeholder="e.g., 3 months"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">
                      Credits *
                    </label>
                    <input
                      type="number"
                      value={newProject.credits}
                      onChange={(e) => setNewProject({ ...newProject, credits: e.target.value })}
                      placeholder="e.g., 4"
                      required
                      min="1"
                      max="12"
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">
                      Location
                    </label>
                    <select
                      value={newProject.location}
                      onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Onsite">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">
                      Stipend
                    </label>
                    <input
                      type="text"
                      value={newProject.stipend}
                      onChange={(e) => setNewProject({ ...newProject, stipend: e.target.value })}
                      placeholder="e.g., ₹25,000/month"
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">
                      Required Skills * <span className="text-[rgb(var(--muted))] font-normal">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={newProject.skills}
                      onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })}
                      placeholder="e.g., React, JavaScript, CSS"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">
                      Description *
                    </label>
                    <textarea
                      rows="4"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Describe the internship role, responsibilities, and what students will learn..."
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))] resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    Post Internship
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setShowPostModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal - Similar structure, abbreviated for length */}
      <AnimatePresence>
        {showEditModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
              className="rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[rgb(var(--surface))]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <Heading level={3}>Edit Internship</Heading>
                <button onClick={() => setShowEditModal(false)} className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Same form fields as Post modal but with editProject state */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">Title *</label>
                    <input
                      type="text"
                      value={editProject.title}
                      onChange={(e) => setEditProject({ ...editProject, title: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">Duration</label>
                    <input
                      type="text"
                      value={editProject.duration}
                      onChange={(e) => setEditProject({ ...editProject, duration: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">Credits</label>
                    <input
                      type="number"
                      value={editProject.credits}
                      onChange={(e) => setEditProject({ ...editProject, credits: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">Location</label>
                    <select
                      value={editProject.location}
                      onChange={(e) => setEditProject({ ...editProject, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Onsite">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">Status</label>
                    <select
                      value={editProject.status}
                      onChange={(e) => setEditProject({ ...editProject, status: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">Skills (comma separated)</label>
                    <input
                      type="text"
                      value={editProject.skills}
                      onChange={(e) => setEditProject({ ...editProject, skills: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-[rgb(var(--foreground))]">Description</label>
                    <textarea
                      rows="4"
                      value={editProject.description}
                      onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none text-[rgb(var(--foreground))] resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" variant="primary" leftIcon={<Check size={18} />} className="flex-1">
                    Save Changes
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
              className="rounded-2xl shadow-2xl p-8 max-w-md w-full bg-[rgb(var(--surface))]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-red-600" />
                </div>
                <Heading level={4} className="mb-2">Delete Internship?</Heading>
                <Body muted className="mb-6">
                  Are you sure you want to delete <strong>"{selectedProject.title}"</strong>? This action cannot be undone.
                </Body>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleConfirmDelete} leftIcon={<Trash2 size={18} />} className="flex-1 bg-red-600 hover:bg-red-700">
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Applicants Modal */}
      <AnimatePresence>
        {showViewModal && selectedProject && (
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
              className="rounded-2xl shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-hidden bg-[rgb(var(--surface))] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Heading level={3}>{selectedProject.title}</Heading>
                  <Caption>View all applicants</Caption>
                </div>
                <button onClick={() => setShowViewModal(false)} className="p-2 rounded-lg hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]">
                  <X size={20} />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[rgb(var(--background))] rounded-xl p-4 text-center">
                  <Heading level={3}>{mockApplicants.length}</Heading>
                  <Caption>Total</Caption>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4 text-center">
                  <Heading level={3} className="text-green-600">{mockApplicants.filter(a => a.status === 'shortlisted').length}</Heading>
                  <Caption>Shortlisted</Caption>
                </div>
                <div className="bg-yellow-500/10 rounded-xl p-4 text-center">
                  <Heading level={3} className="text-yellow-600">{mockApplicants.filter(a => a.status === 'pending').length}</Heading>
                  <Caption>Pending</Caption>
                </div>
              </div>

              {/* Applicants List */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {mockApplicants.map((applicant, idx) => (
                  <motion.div
                    key={applicant.id}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {applicant.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-[rgb(var(--foreground))]">{applicant.name}</p>
                        <Caption>{applicant.college}</Caption>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getApplicantStatusBadge(applicant.status)}`}>
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </span>
                        <Caption className="block mt-1">{applicant.appliedDate}</Caption>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 rounded-lg hover:bg-green-500/20 text-green-600" title="Shortlist">
                          <Check size={18} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-600" title="View Profile">
                          <ExternalLink size={18} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-500/20 text-red-600" title="Reject">
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-[rgb(var(--border))]">
                <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
                <Button variant="primary" leftIcon={<Users size={18} />}>Export Applicants</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpeningsPage;