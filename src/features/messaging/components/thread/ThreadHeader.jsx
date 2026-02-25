/**
 * ThreadHeader Component
 *
 * Header for conversation thread with context info.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Archive, Flag, Trash2 } from "lucide-react";
import { ContextTag } from "../shared/ContextTag";
import { MessageBadge } from "../shared/MessageBadge";

export function ThreadHeader({ conversation, applicationInfo }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex-shrink-0 border-b border-gray-200 bg-white">
      <div className="px-6 py-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Inbox
          </button>

          {/* Actions menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <Flag className="w-4 h-4 mr-2" />
                  Mark as unread
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Subject */}
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {conversation.subject}
        </h1>

        {/* Context and status */}
        <div className="flex items-center gap-3 flex-wrap">
          <ContextTag context={conversation.context} size="sm" />

          {applicationInfo && (
            <span
              className={`
                inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                ${applicationInfo.statusColor === "green" ? "bg-green-100 text-green-700" : ""}
                ${applicationInfo.statusColor === "yellow" ? "bg-yellow-100 text-yellow-700" : ""}
                ${applicationInfo.statusColor === "amber" ? "bg-amber-100 text-amber-700" : ""}
                ${applicationInfo.statusColor === "red" ? "bg-red-100 text-red-700" : ""}
                ${applicationInfo.statusColor === "blue" ? "bg-blue-100 text-blue-700" : ""}
                ${applicationInfo.statusColor === "purple" ? "bg-purple-100 text-purple-700" : ""}
                ${applicationInfo.statusColor === "gray" ? "bg-gray-100 text-gray-700" : ""}
              `}
            >
              Status: {applicationInfo.statusLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThreadHeader;
