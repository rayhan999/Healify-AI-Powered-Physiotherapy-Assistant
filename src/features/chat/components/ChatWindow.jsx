import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Phone, Info, ArrowLeft, Loader2 } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
} from '../../../services/api/chatApi';

/**
 * Chat window component - displays messages and handles message sending
 */
export function ChatWindow({
  conversation,
  currentUserId,
  onBack,
  onTyping,
  isOtherUserTyping,
  otherUserName,
}) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [page, setPage] = useState(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // Fetch messages
  const {
    data: messages = [],
    isLoading,
    isFetching,
  } = useGetMessagesQuery(
    {
      conversationId: conversation.id,
      skip: page * 50,
      limit: 50,
    },
    { skip: !conversation.id || conversation.id === 'new' }
  );

  // Mutations
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  // Get other participant info
  const otherParticipant = conversation.participant_ids?.find(
    (id) => id !== currentUserId
  );

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  // Mark messages as read when conversation opens
  useEffect(() => {
    if (conversation.id && conversation.id !== 'new' && conversation.unread_count > 0) {
      markAsRead(conversation.id);
    }
  }, [conversation.id, conversation.unread_count, markAsRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 && !hasScrolledToBottom) {
      scrollToBottom(false);
      setHasScrolledToBottom(true);
    } else if (messages.length > 0) {
      // Only auto-scroll if user is near bottom
      const container = messagesContainerRef.current;
      if (container) {
        const isNearBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        if (isNearBottom) {
          scrollToBottom(true);
        }
      }
    }
  }, [messages.length, hasScrolledToBottom, scrollToBottom]);

  // Handle scroll for pagination
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container && container.scrollTop === 0 && !isFetching) {
      // Load more messages
      setPage((prev) => prev + 1);
    }
  }, [isFetching]);

  // Handle send message
  const handleSend = useCallback(
    async (content) => {
      try {
        const messagePayload = {
          receiver_id: otherParticipant,
          content,
          message_type: 'text',
          conversation_id: conversation.id === 'new' ? null : conversation.id,
          sender_id: currentUserId,
        };

        await sendMessage(messagePayload).unwrap();
      } catch (error) {
        console.error('Failed to send message:', error);
        // TODO: Show error toast
      }
    },
    [sendMessage, otherParticipant, conversation.id]
  );

  // Handle delete message
  const handleDelete = useCallback(
    async (messageId) => {
      if (window.confirm('Delete this message?')) {
        try {
          await deleteMessage(messageId).unwrap();
        } catch (error) {
          console.error('Failed to delete message:', error);
        }
      }
    },
    [deleteMessage]
  );

  if (!conversation.id) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
            Select a conversation
          </h3>
          <p className="text-gray-500 dark:text-slate-400">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary to-purple-600 border-b border-gray-200 dark:border-slate-700 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back button (mobile) */}
            <button
              onClick={onBack}
              className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* User avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                {otherUserName?.[0]?.toUpperCase() || '?'}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* User info */}
            <div>
              <h3 className="font-bold text-white text-lg">
                {otherUserName || 'Unknown User'}
              </h3>
              <p className="text-sm text-white/80">
                {isOtherUserTyping ? 'typing...' : 'Active now'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button className="p-2 text-white hover:bg-white/20 rounded-lg transition">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-white hover:bg-white/20 rounded-lg transition">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-slate-900"
      >
        {/* Loading indicator for pagination */}
        {isFetching && page > 0 && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}

        {/* Initial loading */}
        {isLoading && page === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">👋</div>
              <p className="text-gray-500 dark:text-slate-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.sender_id === currentUserId}
                onDelete={handleDelete}
                senderName={message.sender_id !== currentUserId ? otherUserName : null}
              />
            ))}

            {/* Typing indicator */}
            {isOtherUserTyping && <TypingIndicator userName={otherUserName} />}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message input */}
      <MessageInput
        onSend={handleSend}
        onTyping={onTyping}
        disabled={isSending}
      />
    </div>
  );
}
