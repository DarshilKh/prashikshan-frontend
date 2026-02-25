// src/components/filters/FilterBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { Button } from "../common/Button";
import { Caption } from "../common/Typography";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * FilterBar - Reusable filter and sort component
 */
export const FilterBar = ({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  activeFilters = {},
  onFilterChange,
  sortOptions = [],
  activeSort = "",
  onSortChange,
  onClearAll,
  className = "",
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [showFilters, setShowFilters] = useState(false);

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(
    (v) => v && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  const hasActiveFilters = activeFilterCount > 0 || activeSort;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--muted))]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-all"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange?.("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter & Sort Buttons */}
        <div className="flex gap-2">
          {/* Filter Toggle */}
          {filters.length > 0 && (
            <Button
              variant={showFilters ? "primary" : "secondary"}
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<Filter className="w-4 h-4" />}
              className="relative"
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[rgb(var(--primary))] text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}

          {/* Sort Dropdown */}
          {sortOptions.length > 0 && (
            <SortDropdown
              options={sortOptions}
              value={activeSort}
              onChange={onSortChange}
            />
          )}

          {/* Clear All */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearAll}
              leftIcon={<X className="w-4 h-4" />}
              className="text-[rgb(var(--error))]"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && filters.length > 0 && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[rgb(var(--muted))]" />
                  <Caption className="font-medium">Filter Options</Caption>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filters.map((filter) => (
                  <FilterField
                    key={filter.id}
                    filter={filter}
                    value={activeFilters[filter.id]}
                    onChange={(value) => onFilterChange?.(filter.id, value)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;

            const filter = filters.find((f) => f.id === key);
            if (!filter) return null;

            // Handle array values (multi-select)
            if (Array.isArray(value)) {
              return value.map((v) => (
                <FilterChip
                  key={`${key}-${v}`}
                  label={`${filter.label}: ${filter.options?.find((o) => o.value === v)?.label || v}`}
                  onRemove={() => {
                    const newValue = value.filter((item) => item !== v);
                    onFilterChange?.(key, newValue.length > 0 ? newValue : null);
                  }}
                />
              ));
            }

            // Handle single value
            const displayValue = filter.options?.find((o) => o.value === value)?.label || value;
            return (
              <FilterChip
                key={key}
                label={`${filter.label}: ${displayValue}`}
                onRemove={() => onFilterChange?.(key, null)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Individual Filter Field
 */
const FilterField = ({ filter, value, onChange }) => {
  switch (filter.type) {
    case "select":
      return (
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-1.5">
            {filter.label}
          </label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value || null)}
            className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
          >
            <option value="">All {filter.label}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "multi-select":
      return (
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-1.5">
            {filter.label}
          </label>
          <div className="flex flex-wrap gap-2">
            {filter.options?.map((option) => {
              const isSelected = Array.isArray(value) && value.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    const currentValue = Array.isArray(value) ? value : [];
                    const newValue = isSelected
                      ? currentValue.filter((v) => v !== option.value)
                      : [...currentValue, option.value];
                    onChange(newValue.length > 0 ? newValue : null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-[rgb(var(--primary))] text-white"
                      : "bg-[rgb(var(--background))] text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      );

    case "range":
      return (
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--foreground))] mb-1.5">
            {filter.label}
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              value={value?.min || ""}
              onChange={(e) =>
                onChange({ ...value, min: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
            />
            <span className="text-[rgb(var(--muted))]">-</span>
            <input
              type="number"
              placeholder="Max"
              value={value?.max || ""}
              onChange={(e) =>
                onChange({ ...value, max: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
            />
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={filter.id}
            checked={!!value}
            onChange={(e) => onChange(e.target.checked || null)}
            className="w-4 h-4 rounded border-[rgb(var(--border))] text-[rgb(var(--primary))] focus:ring-[rgb(var(--primary))]"
          />
          <label
            htmlFor={filter.id}
            className="text-sm font-medium text-[rgb(var(--foreground))]"
          >
            {filter.label}
          </label>
        </div>
      );

    default:
      return null;
  }
};

/**
 * Sort Dropdown Component
 */
const SortDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        leftIcon={<ArrowUpDown className="w-4 h-4" />}
        rightIcon={
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        }
      >
        <span className="hidden sm:inline">
          {selectedOption ? selectedOption.label : "Sort"}
        </span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] shadow-lg z-50 overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[rgb(var(--background))] transition-colors ${
                  value === option.value
                    ? "text-[rgb(var(--primary))] font-medium"
                    : "text-[rgb(var(--foreground))]"
                }`}
              >
                {option.label}
                {value === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Filter Chip Component
 */
const FilterChip = ({ label, onRemove }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-[rgb(var(--primary-light))] text-[rgb(var(--primary))]"
    >
      {label}
      <button
        onClick={onRemove}
        className="p-0.5 rounded-full hover:bg-[rgb(var(--primary))] hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.span>
  );
};

export default FilterBar;