/**
 * SystemMessageBanner Component
 *
 * Banner for system notifications.
 */

import React from "react";
import { Bell } from "lucide-react";

export function SystemMessageBanner() {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-gray-700">System Notification</p>
          <p className="text-sm mt-1 text-gray-600">
            This is an automated notification. Replies are not monitored. For
            support, please visit the Help Center.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SystemMessageBanner;
