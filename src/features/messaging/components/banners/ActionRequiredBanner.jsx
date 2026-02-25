/**
 * ActionRequiredBanner Component
 *
 * Banner when action is required (confirm interview, accept offer, etc.)
 */

import React from "react";
import { AlertTriangle, Calendar, FileCheck, Clock } from "lucide-react";

const actionTypes = {
  CONFIRM_INTERVIEW: {
    icon: Calendar,
    title: "Interview Confirmation Required",
    message: "Please confirm your availability for the scheduled interview.",
    primaryAction: "Confirm Availability",
    secondaryAction: "Request Reschedule",
  },
  ACCEPT_OFFER: {
    icon: FileCheck,
    title: "Offer Response Required",
    message: "Please respond to the internship offer.",
    primaryAction: "View Offer Details",
    secondaryAction: null,
  },
  SUBMIT_REPORT: {
    icon: Clock,
    title: "Submission Due",
    message: "You have a pending submission deadline.",
    primaryAction: "View Details",
    secondaryAction: null,
  },
};

export function ActionRequiredBanner({
  actionType,
  deadline,
  onPrimaryAction,
  onSecondaryAction,
}) {
  const action = actionTypes[actionType] || actionTypes.SUBMIT_REPORT;
  const Icon = action.icon;

  // Format deadline
  const deadlineText = deadline
    ? new Date(deadline).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <Icon className="w-5 h-5 text-amber-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="font-medium text-amber-800">{action.title}</p>
          </div>

          <p className="text-sm mt-1 text-amber-700">{action.message}</p>

          {deadlineText && (
            <p className="text-sm mt-2 text-amber-600 font-medium">
              Deadline: {deadlineText}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={onPrimaryAction}
              className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg
                         hover:bg-amber-700 transition-colors"
            >
              {action.primaryAction}
            </button>

            {action.secondaryAction && (
              <button
                onClick={onSecondaryAction}
                className="px-4 py-2 text-amber-700 text-sm font-medium hover:underline"
              >
                {action.secondaryAction}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionRequiredBanner;
