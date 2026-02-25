/**
 * MessageFilters Component
 *
 * Filter and search controls for inbox.
 */

import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";

const filterTabs = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "industry", label: "Companies" },
  { id: "academic", label: "Faculty" },
  { id: "archived", label: "Archived" },
];

export function MessageFilters({ filters, onFilterChange }) {
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const handleTabClick = (tabId) => {
    const newFilters = { ...filters };

    switch (tabId) {
      case "all":
        newFilters.unreadOnly = false;
        newFilters.type = null;
        newFilters.status = null;
        break;
      case "unread":
        newFilters.unreadOnly = true;
        newFilters.type = null;
        newFilters.status = null;
        break;
      case "industry":
        newFilters.unreadOnly = false;
        newFilters.type = "INDUSTRY";
        newFilters.status = null;
        break;
      case "academic":
        newFilters.unreadOnly = false;
        newFilters.type = "ACADEMIC";
        newFilters.status = null;
        break;
      case "archived":
        newFilters.unreadOnly = false;
        newFilters.type = null;
        newFilters.status = "ARCHIVED";
        break;
    }

    onFilterChange(newFilters);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchValue });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onFilterChange({ ...filters, search: "" });
  };

  const getActiveTab = () => {
    if (filters.status === "ARCHIVED") return "archived";
    if (filters.unreadOnly) return "unread";
    if (filters.type === "INDUSTRY") return "industry";
    if (filters.type === "ACADEMIC") return "academic";
    return "all";
  };

  const activeTab = getActiveTab();

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search messages..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors
              ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MessageFilters;
