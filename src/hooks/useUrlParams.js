// src/hooks/useUrlParams.js
import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

/**
 * Hook to manage URL query parameters for filters
 * Useful for persisting filter states in the URL
 * 
 * @example
 * const { params, setParam, setParams, clearParams, hasActiveFilters } = useUrlParams({
 *   search: '',
 *   status: 'all',
 *   sort: 'newest',
 *   page: 1
 * });
 */
export const useUrlParams = (defaultParams = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current params with defaults
  const params = useMemo(() => {
    const currentParams = {};
    
    for (const [key, defaultValue] of Object.entries(defaultParams)) {
      const value = searchParams.get(key);
      
      if (value !== null) {
        // Try to parse as JSON for arrays/objects/numbers
        try {
          const parsed = JSON.parse(value);
          currentParams[key] = parsed;
        } catch {
          // If parsing fails, use the string value
          currentParams[key] = value;
        }
      } else {
        currentParams[key] = defaultValue;
      }
    }
    
    return currentParams;
  }, [searchParams, defaultParams]);

  // Set a single param
  const setParam = useCallback(
    (key, value) => {
      const newParams = new URLSearchParams(searchParams);

      // Remove param if value is empty/null/undefined
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        newParams.delete(key);
      } else if (typeof value === "object") {
        // Stringify objects and arrays
        newParams.set(key, JSON.stringify(value));
      } else {
        newParams.set(key, String(value));
      }

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Set multiple params at once
  const setParams = useCallback(
    (newParamsObj) => {
      const urlParams = new URLSearchParams(searchParams);

      for (const [key, value] of Object.entries(newParamsObj)) {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          urlParams.delete(key);
        } else if (typeof value === "object") {
          urlParams.set(key, JSON.stringify(value));
        } else {
          urlParams.set(key, String(value));
        }
      }

      setSearchParams(urlParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Clear all params (reset to defaults)
  const clearParams = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Remove specific param
  const removeParam = useCallback(
    (key) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(key);
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Check if any filters are active (different from defaults)
  const hasActiveFilters = useMemo(() => {
    for (const [key, defaultValue] of Object.entries(defaultParams)) {
      const currentValue = params[key];
      
      // Compare stringified versions for objects/arrays
      if (JSON.stringify(currentValue) !== JSON.stringify(defaultValue)) {
        return true;
      }
    }
    return false;
  }, [params, defaultParams]);

  // Get list of active filter keys
  const activeFilterKeys = useMemo(() => {
    const active = [];
    
    for (const [key, defaultValue] of Object.entries(defaultParams)) {
      const currentValue = params[key];
      
      if (JSON.stringify(currentValue) !== JSON.stringify(defaultValue)) {
        active.push(key);
      }
    }
    
    return active;
  }, [params, defaultParams]);

  return {
    params,
    setParam,
    setParams,
    clearParams,
    removeParam,
    hasActiveFilters,
    activeFilterKeys,
  };
};

export default useUrlParams;