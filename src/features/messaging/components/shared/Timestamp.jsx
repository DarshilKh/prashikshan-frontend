/**
 * Timestamp Component
 *
 * Displays formatted timestamp with tooltip for full date.
 */

import React from "react";
import {
  formatTimestamp,
  formatMessageTimestamp,
} from "../../utils/formatters";

export function Timestamp({ date, format = "relative", className = "" }) {
  if (!date) return null;

  const displayText =
    format === "relative"
      ? formatTimestamp(date)
      : formatMessageTimestamp(date);

  const fullDate = formatMessageTimestamp(date);

  return (
    <time
      dateTime={new Date(date).toISOString()}
      title={fullDate}
      className={`text-gray-500 ${className}`}
    >
      {displayText}
    </time>
  );
}

export default Timestamp;
