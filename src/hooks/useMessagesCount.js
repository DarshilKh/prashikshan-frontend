// src/hooks/useMessagesCount.js

/**
 * useMessagesCount Hook
 *
 * Safe wrapper for getting unread messages count.
 * Works independently without requiring MessagesProvider.
 */

import { useState, useEffect } from "react";

export function useMessagesCount() {
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        // Try to get count from localStorage
        const storedCount = localStorage.getItem("unread_messages_count");
        if (storedCount !== null) {
          setCount(parseInt(storedCount, 10) || 0);
        } else {
          // Default mock count for demo - set to 2 so badge shows
          const defaultCount = 2;
          localStorage.setItem(
            "unread_messages_count",
            defaultCount.toString(),
          );
          setCount(defaultCount);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
        setCount(0);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchCount();

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === "unread_messages_count" && e.newValue !== null) {
        setCount(parseInt(e.newValue, 10) || 0);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchCount, 30000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return {
    count,
    hasUnread: count > 0,
    displayCount: count > 99 ? "99+" : count.toString(),
    isLoaded,
  };
}

export default useMessagesCount;
