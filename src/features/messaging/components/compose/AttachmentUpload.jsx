/**
 * AttachmentUpload Component
 *
 * File upload interface for attachments.
 */

import React, { useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { ATTACHMENT_CONFIG } from "../../config/uiConfig";
import { formatFileSize } from "../../utils/formatters";

export function AttachmentUpload({ attachments = [], onAdd, onRemove }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    onAdd(files);
    // Reset input
    e.target.value = "";
  };

  const allowedExtensions = ATTACHMENT_CONFIG.allowedExtensions.join(", ");

  return (
    <div className="space-y-3">
      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer
                   hover:border-gray-400 transition-colors"
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          {allowedExtensions} (max {ATTACHMENT_CONFIG.maxFileSize / 1024 / 1024}
          MB)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ATTACHMENT_CONFIG.allowedExtensions.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File list */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttachmentUpload;
