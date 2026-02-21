import React from 'react';

/**
 * Animated typing indicator component
 * Shows when another user is typing
 */
export function TypingIndicator({ userName }) {
  return (
    <div className="flex items-start gap-2 px-4 py-2">
      <div className="bg-gray-100 dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      {userName && (
        <span className="text-xs text-gray-500 dark:text-slate-400 mt-2">
          {userName} is typing...
        </span>
      )}
    </div>
  );
}
