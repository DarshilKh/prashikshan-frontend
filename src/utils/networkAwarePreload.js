// src/utils/networkAwarePreload.js

/**
 * Check if the user's network connection supports preloading
 */
export const shouldPreload = () => {
  // Check if Network Information API is available
  if ("connection" in navigator) {
    const connection = navigator.connection;

    // Don't preload on slow connections or data saver mode
    if (connection.saveData) return false;
    if (
      connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g"
    )
      return false;
  }

  return true;
};

/**
 * Preload a component only if network conditions are favorable
 */
export const smartPreload = (importFn) => {
  if (shouldPreload()) {
    // Use requestIdleCallback if available for non-blocking preload
    if ("requestIdleCallback" in window) {
      requestIdleCallback(
        () => {
          importFn().catch(() => {});
        },
        { timeout: 2000 },
      );
    } else {
      setTimeout(() => {
        importFn().catch(() => {});
      }, 100);
    }
  }
};

/**
 * Preload on link hover with debounce
 */
export const createHoverPreloader = (importFn, delay = 100) => {
  let timeoutId = null;

  return {
    onMouseEnter: () => {
      if (shouldPreload()) {
        timeoutId = setTimeout(() => {
          importFn().catch(() => {});
        }, delay);
      }
    },
    onMouseLeave: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
  };
};
