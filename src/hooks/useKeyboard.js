// src/hooks/useKeyboard.js
import { useEffect, useCallback } from "react";

/**
 * Hook to handle keyboard shortcuts
 */
export const useKeyboard = (keyMap = {}, deps = []) => {
  const handleKeyDown = useCallback(
    (event) => {
      // Build key combo string
      const combo = [];
      if (event.ctrlKey || event.metaKey) combo.push("ctrl");
      if (event.altKey) combo.push("alt");
      if (event.shiftKey) combo.push("shift");
      combo.push(event.key.toLowerCase());

      const keyCombo = combo.join("+");

      // Check if we have a handler for this combo
      if (keyMap[keyCombo]) {
        event.preventDefault();
        keyMap[keyCombo](event);
      }

      // Also check for single key handlers
      if (keyMap[event.key.toLowerCase()]) {
        // Don't trigger if user is typing in an input
        const target = event.target;
        const isInput =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable;

        if (!isInput || event.key === "Escape") {
          keyMap[event.key.toLowerCase()](event);
        }
      }
    },
    [keyMap, ...deps]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

/**
 * Hook specifically for Escape key to close modals
 */
export const useEscapeKey = (onEscape, isActive = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onEscape(event);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onEscape, isActive]);
};

/**
 * Hook for command palette shortcut (Ctrl/Cmd + K)
 */
export const useCommandPalette = (onOpen) => {
  useKeyboard({
    "ctrl+k": onOpen,
  });
};

export default useKeyboard;