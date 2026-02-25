/**
 * MessageAttachments Component
 *
 * Displays file attachments for a message.
 */

import React from "react";
import { Paperclip, FileText, Image, Download } from "lucide-react";
import { formatFileSize } from "../../utils/formatters";

const getFileIcon = (type) => {
  if (type.startsWith("image/")) return Image;
  return FileText;
};

export function MessageAttachments({ attachments }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Paperclip className="w-4 h-4" />
        <span>
          {attachments.length} Attachment{attachments.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-2">
        {attachments.map((attachment) => {
          const Icon = getFileIcon(attachment.type);

          return (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
              </div>

              <a
                href={attachment.url}
                download={attachment.name}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MessageAttachments;
