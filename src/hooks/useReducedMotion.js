// src/hooks/useReducedMotion.js
import { useState, useEffect } from "react";

/**
 * Hook to detect user's reduced motion preference
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
};

/**
 * Get animation props based on reduced motion preference
 */
export const useAnimationProps = (normalAnimation, reducedAnimation = {}) => {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedAnimation : normalAnimation;
};

export default useReducedMotion;