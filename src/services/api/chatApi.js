import { baseApi } from './baseApi';

/**
 * Chat API slice for RTK Query
 * Handles all chat-related API calls with automatic caching and invalidation
 */
export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all conversations for the current user
    getConversations: builder.query({
      query: () => '/chat/conversations',
      providesTags: ['Conversations'],
      // Transform response to add computed fields
      transformResponse: (response) => {
        return response.map(conv => ({
          ...conv,
          // Sort by most recent activity
          sortKey: conv.last_message?.created_at || conv.created_at,
        })).sort((a, b) => new Date(b.sortKey) - new Date(a.sortKey));
      },
    }),

    // Get messages for a specific conversation
    getMessages: builder.query({
      query: ({ conversationId, skip = 0, limit = 50 }) => 
        `/chat/conversations/${conversationId}/messages?skip=${skip}&limit=${limit}`,
      providesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
      ],
      // Merge new messages with existing ones for pagination
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.conversationId}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.skip === 0) {
          // If loading fresh, replace cache
          return newItems;
        }
        // Otherwise, prepend older messages
        return [...newItems, ...currentCache];
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.skip !== previousArg?.skip;
      },
    }),

    // Send a new message
    sendMessage: builder.mutation({
      query: ({ sender_id, ...message }) => ({
        url: '/chat/messages',
        method: 'POST',
        body: message,
      }),
      // Optimistic update
      async onQueryStarted(message, { dispatch, queryFulfilled }) {
        // Optimistically add message to cache
        const patchResult = dispatch(
          chatApi.util.updateQueryData(
            'getMessages',
            { conversationId: message.conversation_id, skip: 0, limit: 50 },
            (draft) => {
              draft.push({
                ...message,
                id: `temp-${Date.now()}`,
                status: 'sending',
                created_at: new Date().toISOString(),
              });
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          // Replace temp message with real one
          dispatch(
            chatApi.util.updateQueryData(
              'getMessages',
              { conversationId: message.conversation_id, skip: 0, limit: 50 },
              (draft) => {
                const tempIndex = draft.findIndex(m => m.id?.startsWith('temp-'));
                if (tempIndex !== -1) {
                  draft[tempIndex] = data;
                }
              }
            )
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      invalidatesTags: ['Conversations'],
    }),

    // Mark messages as read
    markAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Conversations'],
      // Optimistically update unread count
      async onQueryStarted(conversationId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          chatApi.util.updateQueryData('getConversations', undefined, (draft) => {
            const conversation = draft.find(c => c.id === conversationId);
            if (conversation) {
              conversation.unread_count = 0;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Delete a message
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/chat/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, messageId) => [
        'Conversations',
        { type: 'Messages', id: 'LIST' },
      ],
    }),

    // Check online status
    getOnlineStatus: builder.query({
      query: (userId) => `/chat/online-status/${userId}`,
      // Poll every 30 seconds
      pollingInterval: 30000,
    }),

    // Get contacts for chat search
    getContacts: builder.query({
      query: (searchQuery) => ({
        url: '/chat/contacts',
        params: searchQuery ? { query: searchQuery } : undefined,
      }),
      keepUnusedDataFor: 60,
    }),

    // Create a new conversation
    createConversation: builder.mutation({
      query: (participantId) => ({
        url: '/chat/conversations',
        method: 'POST',
        body: { participant_id: participantId },
      }),
      invalidatesTags: ['Conversations'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
  useGetOnlineStatusQuery,
  useGetContactsQuery,
  useCreateConversationMutation,
} = chatApi;
