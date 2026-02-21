import React from 'react';
import { Loader2 } from 'lucide-react';
import { ChatLayout } from '../components/ChatLayout';
import { useAuth } from '../../../contexts';
import { useGetContactsQuery } from '../../../services/api/chatApi';

/**
 * Chat page component
 * Main entry point for the chat feature
 */
export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  
  // Fetch all connected users (empty query to get default list)
  const { 
    data: contactsData = [], 
    isLoading: contactsLoading 
  } = useGetContactsQuery('');

  // Handle data structure (array or { users: [] })
  const users = Array.isArray(contactsData) ? contactsData : contactsData.users || [];

  if (authLoading || contactsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Authentication Required</h2>
          <p className="text-gray-600 dark:text-slate-400 mt-2">Please log in to access chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Chat with your {user.role === 'therapist' ? 'patients' : 'therapist'}
          </p>
        </div>

        {/* Chat layout */}
        <ChatLayout currentUser={user} users={users} />
      </div>
    </div>
  );
}
