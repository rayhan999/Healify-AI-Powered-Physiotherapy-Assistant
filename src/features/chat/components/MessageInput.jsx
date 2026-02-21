import React, { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

/**
 * Message input component with send button and typing indicator
 */
export function MessageInput({ onSend, onTyping, disabled = false }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const textareaRef = useRef(null);

  // Handle input change with typing indicator
  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setMessage(value);

    // Trigger typing indicator
    if (onTyping && value.trim()) {
      if (!isTyping) {
        setIsTyping(true);
        onTyping(true);
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping(false);
      }, 1000);
    } else if (isTyping) {
      setIsTyping(false);
      onTyping(false);
    }
  }, [isTyping, onTyping]);

  // Handle send message
  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    onSend(trimmedMessage);
    setMessage('');
    setIsTyping(false);
    if (onTyping) onTyping(false);

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message, onSend, onTyping, disabled]);

  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Auto-resize textarea
  const handleTextareaResize = useCallback((e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
      <div className="flex gap-3 items-end">
        {/* Attachment button */}
        <button
          className="p-2 text-gray-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Attach file"
          disabled={disabled}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Emoji button */}
        <button
          className="p-2 text-gray-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Add emoji"
          disabled={disabled}
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Message input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            handleChange(e);
            handleTextareaResize(e);
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
          className="flex-1 border border-gray-300 dark:border-slate-600 rounded-2xl px-5 py-3 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none max-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="p-3 bg-gradient-to-br from-primary to-purple-600 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Character count (optional) */}
      {message.length > 0 && (
        <div className="text-xs text-gray-400 dark:text-slate-500 mt-2 text-right">
          {message.length} characters
        </div>
      )}
    </div>
  );
}
