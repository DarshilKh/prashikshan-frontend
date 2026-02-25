/**
 * ComposeReply Component
 *
 * Reply form for responding to messages.
 */

import React, { useState } from "react";
import { Send, Paperclip, X } from "lucide-react";
import AttachmentUpload from "./AttachmentUpload";
import {
  validateMessageContent,
  validateAttachments,
} from "../../utils/validators";

export function ComposeReply({ onSend, conversationType }) {
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [showAttachments, setShowAttachments] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate message
    const contentValidation = validateMessageContent(body);
    if (!contentValidation.isValid) {
      setError(contentValidation.errors[0]);
      return;
    }

    // Validate attachments
    if (attachments.length > 0) {
      const attachmentValidation = validateAttachments(attachments);
      if (!attachmentValidation.isValid) {
        setError(attachmentValidation.errors[0]);
        return;
      }
    }

    setIsSending(true);

    try {
      const result = await onSend(body, attachments);

      if (result.success) {
        setBody("");
        setAttachments([]);
        setShowAttachments(false);
      } else {
        setError(result.error || "Failed to send message");
      }
    } catch (err) {
      setError("An error occurred while sending");
    } finally {
      setIsSending(false);
    }
  };

  const handleAttachmentAdd = (files) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleAttachmentRemove = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        {/* Error message */}
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Attachments */}
        {showAttachments && (
          <div className="mb-3">
            <AttachmentUpload
              attachments={attachments}
              onAdd={handleAttachmentAdd}
              onRemove={handleAttachmentRemove}
            />
          </div>
        )}

        {/* Selected attachments preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm"
              >
                <Paperclip className="w-3.5 h-3.5 text-gray-500" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleAttachmentRemove(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Message input */}
        <div className="flex gap-3">
          <div className="flex-1">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your reply..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm
                         resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-3">
          <button
            type="button"
            onClick={() => setShowAttachments(!showAttachments)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <Paperclip className="w-4 h-4" />
            Attach
          </button>

          <button
            type="submit"
            disabled={isSending || !body.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
                       hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Reply
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ComposeReply;
