import React, { useState, useCallback, useMemo } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { useWebSocket } from '../../../hooks/useWebSocket';

/**
 * Main chat layout component
 * Manages conversation selection and WebSocket connection
 */
export function ChatLayout({ currentUser, users = [] }) {
  const [activeConversation, setActiveConversation] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // WebSocket connection
  const {
    isConnected,
    sendTypingIndicator,
    isUserTyping,
  } = useWebSocket(currentUser?.id);

  // Helper functions to get user info
  const getUserInfo = useCallback(
    (userId) => {
      if (activeConversation && activeConversation.temp_user_details && activeConversation.temp_user_details.id === userId) {
        return activeConversation.temp_user_details;
      }
      return users.find((u) => u.id === userId) || {};
    },
    [users, activeConversation]
  );

  const getUserName = useCallback(
    (userId) => {
      const user = getUserInfo(userId);
      return user.full_name || user.email || 'Unknown User';
    },
    [getUserInfo]
  );

  const getUserRole = useCallback(
    (userId) => {
      const user = getUserInfo(userId);
      return user.role || 'User';
    },
    [getUserInfo]
  );

  const isUserOnline = useCallback(
    (userId) => {
      const user = getUserInfo(userId);
      return user.is_online || false;
    },
    [getUserInfo]
  );

  // Handle conversation selection
  const handleSelectConversation = useCallback((conversation) => {
    setActiveConversation(conversation);
    setShowMobileChat(true);
  }, []);

  // Handle back button (mobile)
  const handleBack = useCallback(() => {
    setShowMobileChat(false);
  }, []);

  // Handle typing indicator
  const handleTyping = useCallback(
    (isTyping) => {
      if (activeConversation?.id) {
        sendTypingIndicator(activeConversation.id, isTyping);
      }
    },
    [activeConversation, sendTypingIndicator]
  );

  // Check if other user is typing
  const isOtherUserTyping = useMemo(() => {
    if (!activeConversation) return false;

    const otherUserId = activeConversation.participant_ids?.find(
      (id) => id !== currentUser?.id
    );

    return otherUserId
      ? isUserTyping(otherUserId, activeConversation.id)
      : false;
  }, [activeConversation, currentUser, isUserTyping]);

  // Get other user's name
  const otherUserName = useMemo(() => {
    if (!activeConversation) return '';

    const otherUserId = activeConversation.participant_ids?.find(
      (id) => id !== currentUser?.id
    );

    return otherUserId ? getUserName(otherUserId) : '';
  }, [activeConversation, currentUser, getUserName]);

  return (
    <div className="h-full w-full">
      {/* WebSocket connection indicator */}
      {!isConnected && (
        <div className="bg-yellow-500 text-white text-center py-2 text-sm">
          ⚠️ Connecting to chat server...
        </div>
      )}

      {/* Main chat container */}
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex border border-gray-200 dark:border-slate-700"
        style={{ height: isConnected ? '75vh' : 'calc(75vh - 40px)' }}
      >
        {/* Conversation list - hidden on mobile when chat is open */}
        <div className={`${showMobileChat ? 'hidden lg:flex' : 'flex'} flex-shrink-0`}>
          <ConversationList
            currentUserId={currentUser?.id}
            activeConversationId={activeConversation?.id}
            onSelectConversation={handleSelectConversation}
            getUserName={getUserName}
            getUserRole={getUserRole}
            isUserOnline={isUserOnline}
          />
        </div>

        {/* Chat window - hidden on mobile when no conversation selected */}
        <div className={`${showMobileChat ? 'flex' : 'hidden lg:flex'} flex-1`}>
          <ChatWindow
            conversation={activeConversation || {}}
            currentUserId={currentUser?.id}
            onBack={handleBack}
            onTyping={handleTyping}
            isOtherUserTyping={isOtherUserTyping}
            otherUserName={otherUserName}
          />
        </div>
      </div>
    </div>
  );
}
