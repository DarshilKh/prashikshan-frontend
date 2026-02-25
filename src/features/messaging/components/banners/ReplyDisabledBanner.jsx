/**
 * ReplyDisabledBanner Component
 *
 * Banner explaining why replies are disabled.
 */

import React from "react";
import { Lock, Clock, XCircle } from "lucide-react";

const bannerTypes = {
  pending: {
    icon: Clock,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-800",
    title: "Awaiting Response",
    message: "You can reply once the company responds to your application.",
  },
  rejected: {
    icon: XCircle,
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
    title: "Conversation Closed",
    message: "This conversation is closed as the application was not accepted.",
  },
  locked: {
    icon: Lock,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    title: "Reply Not Available",
    message: "Messaging will be enabled after your application progresses.",
  },
};

export function ReplyDisabledBanner({ type = "locked", customMessage }) {
  const banner = bannerTypes[type] || bannerTypes.locked;
  const Icon = banner.icon;

  return (
    <div
      className={`p-4 ${banner.bgColor} border ${banner.borderColor} rounded-lg`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${banner.textColor} flex-shrink-0 mt-0.5`} />
        <div>
          <p className={`font-medium ${banner.textColor}`}>{banner.title}</p>
          <p className={`text-sm mt-1 ${banner.textColor} opacity-90`}>
            {customMessage || banner.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReplyDisabledBanner;
