import React, { useState } from 'react';
import { Search, Loader2, MessageSquare, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { 
  useGetConversationsQuery, 
  useGetContactsQuery
} from '../../../services/api/chatApi';

/**
 * Conversation list component - displays conversations or search results
 */
export function ConversationList({
  currentUserId,
  activeConversationId,
  onSelectConversation,
  getUserName,
  getUserRole,
  isUserOnline,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch conversations
  const { 
    data: conversations = [], 
    isLoading: isLoadingConversations, 
    error 
  } = useGetConversationsQuery();

  // Search contacts query - only run when searchQuery is present
  const { 
    data: searchResults = [], 
    isLoading: isLoadingContacts 
  } = useGetContactsQuery(searchQuery, { 
    skip: !searchQuery.trim() 
  });



  // Handle contact selection from search
  const handleContactSelect = (contact) => {
    // Check if we already have a conversation with this contact
    const existingConversation = conversations.find(c => 
      c.participant_ids?.some(id => String(id) === String(contact.id))
    );

    if (existingConversation) {
      onSelectConversation(existingConversation);
    } else {
      // Create temporary conversation object
      const newConversation = {
        id: 'new',
        participant_ids: [currentUserId, contact.id],
        unread_count: 0,
        temp_user_details: contact
      };
      onSelectConversation(newConversation);
    }
    setSearchQuery(''); // Clear search
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  // Get conversation preview
  const getConversationPreview = (conversation) => {
    if (!conversation.last_message) {
      return 'No messages yet';
    }
    const preview = conversation.last_message.content;
    const maxLength = 50;
    return preview.length > maxLength
      ? preview.substring(0, maxLength) + '...'
      : preview;
  };

  // Normalize contacts list (handle if backend returns { users: [...] } or just [...])
  const contactsList = Array.isArray(searchResults) 
    ? searchResults 
    : searchResults.users || [];

  if (isLoadingConversations) {
    return (
      <div className="w-80 border-r border-gray-200 dark:border-slate-700 flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 border-r border-gray-200 dark:border-slate-700 flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center p-4">
          <p className="text-red-500 dark:text-red-400 mb-2">Failed to load conversations</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-gray-200 dark:border-slate-700 flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Messages
        </h2>

        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          {isLoadingContacts && (
            <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-primary" />
          )}
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery.trim() ? (
          // Search Results
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-slate-900">
              Search Results
            </div>
            {contactsList.length === 0 && !isLoadingContacts ? (
              <div className="p-8 text-center text-gray-500 dark:text-slate-400">
                <p className="text-sm">No users found</p>
              </div>
            ) : (
              contactsList.map((contact) => {
                // Check if conversation exists
                const existingConv = conversations.find(c => 
                  c.participant_ids?.some(id => String(id) === String(contact.id))
                );
                
                return (
                  <div
                    key={contact.id}
                    onClick={() => handleContactSelect(contact)}
                    className="p-4 cursor-pointer transition-all border-b border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {contact.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        {contact.is_online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                          {contact.full_name || 'Unknown User'}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-slate-500">
                          {contact.role || 'User'}
                        </p>
                      </div>

                      {/* Action Icon */}
                      <div className="text-gray-400">
                        {existingConv ? (
                          <MessageSquare className="w-5 h-5" />
                        ) : (
                          <UserPlus className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          // Conversations List
          <>
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-slate-600" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Search for someone to start chatting!</p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const otherUserId = conversation.participant_ids?.find(
                  (id) => id !== currentUserId
                );
                const userName = getUserName(otherUserId);
                const userRole = getUserRole(otherUserId);
                const isOnline = isUserOnline(otherUserId);
                const isActive = conversation.id === activeConversationId;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation)}
                    className={`p-4 cursor-pointer transition-all border-b border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 ${
                      isActive
                        ? 'bg-primary/10 dark:bg-primary/20 border-l-4 border-l-primary'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {userName?.[0]?.toUpperCase() || '?'}
                        </div>
                        {isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                              {userName || 'Unknown User'}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-slate-500">
                              {userRole || 'User'}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-slate-400 flex-shrink-0 ml-2">
                            {conversation.last_message &&
                              formatTimestamp(conversation.last_message.created_at)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-slate-400 truncate flex-1">
                            {getConversationPreview(conversation)}
                          </p>
                          {conversation.unread_count > 0 && (
                            <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 font-semibold">
                              {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}
