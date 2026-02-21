import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, Check, CheckCheck } from 'lucide-react';

/**
 * Individual message bubble component
 * Displays message with timestamp, status, and delete option
 */
export function MessageBubble({ message, isOwnMessage, onDelete, senderName }) {
  const [showActions, setShowActions] = useState(false);

  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const getStatusIcon = () => {
    if (!isOwnMessage) return null;
    
    switch (message.status) {
      case 'sent':
        return <Check className="w-3 h-3" />;
      case 'delivered':
      case 'read':
        return <CheckCheck className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex flex-col max-w-md">
        {/* Sender name for received messages */}
        {!isOwnMessage && senderName && (
          <span className="text-xs text-gray-500 dark:text-slate-500 mb-1 ml-1">
            {senderName}
          </span>
        )}

        {/* Message bubble */}
        <div className="flex items-end gap-2">
          {/* Delete button (only for own messages) */}
          {isOwnMessage && showActions && onDelete && (
            <button
              onClick={() => onDelete(message.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
              title="Delete message"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}

          <div
            className={`px-4 py-3 rounded-2xl ${
              isOwnMessage
                ? 'bg-gradient-to-br from-primary to-purple-600 text-white rounded-br-sm'
                : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 shadow-sm rounded-bl-sm'
            }`}
          >
            {/* Message content */}
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
        </div>

        {/* Timestamp and status */}
        <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500 dark:text-slate-500">
            {formatTimestamp(message.created_at)}
          </span>
          {isOwnMessage && (
            <span className={`text-xs ${message.status === 'read' ? 'text-blue-500' : 'text-gray-400'}`}>
              {getStatusIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
