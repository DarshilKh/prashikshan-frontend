/**
 * ContextTag Component
 *
 * Displays conversation context (internship, assignment, etc.)
 */

import React from "react";
import { Briefcase, GraduationCap, FileText, Building2 } from "lucide-react";

const contextIcons = {
  APPLICATION: Briefcase,
  MENTORSHIP: GraduationCap,
  ASSIGNMENT: FileText,
  INTERNSHIP: Building2,
};

export function ContextTag({ context, size = "sm" }) {
  if (!context) return null;

  const Icon = contextIcons[context.type] || Briefcase;

  const sizeClasses = {
    xs: "text-xs px-1.5 py-0.5",
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2.5 py-1",
  };

  // Build display text
  let displayText = "";
  if (context.internshipTitle) {
    displayText = context.internshipTitle;
    if (context.companyName) {
      displayText += ` • ${context.companyName}`;
    }
  } else if (context.companyName) {
    displayText = context.companyName;
  }

  if (!displayText) return null;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 rounded-md
        ${sizeClasses[size]}
      `}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="truncate max-w-[200px]">{displayText}</span>
    </div>
  );
}

export default ContextTag;
