// src/hooks/useSimulatedLoading.js
import { useState, useEffect } from "react";

/**
 * Hook to simulate loading state for demo purposes
 * In production, replace with actual API calls
 * 
 * @param {any} data - The data to return after loading
 * @param {object} options - Configuration options
 * @param {number} options.delay - Delay in ms (default: 0 for instant, set higher for demo)
 * @param {boolean} options.simulateLoading - Whether to simulate loading (default: false in production)
 */

// Set this to false in production
const DEMO_MODE = true;
const DEFAULT_DELAY = DEMO_MODE ? 800 : 0; // 800ms in demo, 0 in production

export const useSimulatedLoading = (data, options = {}) => {
  const { 
    delay = DEFAULT_DELAY, 
    simulateLoading = DEMO_MODE,
    enabled = true 
  } = options;

  const [isLoading, setIsLoading] = useState(simulateLoading && enabled);
  const [loadedData, setLoadedData] = useState(simulateLoading ? null : data);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setLoadedData(data);
      return;
    }

    if (!simulateLoading) {
      setIsLoading(false);
      setLoadedData(data);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        setLoadedData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [data, delay, simulateLoading, enabled]);

  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLoadedData(data);
      setIsLoading(false);
    }, delay);
  };

  return { 
    data: loadedData, 
    isLoading, 
    error, 
    refetch 
  };
};

/**
 * Configuration to toggle demo mode globally
 */
export const setDemoMode = (enabled) => {
  // In a real app, you might use context or environment variables
  console.log(`Demo mode ${enabled ? 'enabled' : 'disabled'}`);
};

export default useSimulatedLoading;