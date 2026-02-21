import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { chatApi } from '../services/api/chatApi';

/**
 * Custom hook for native WebSocket connection to chat service
 * Handles real-time messaging, typing indicators, and online status
 * 
 * ⚠️ IMPORTANT: Uses NATIVE WebSocket, NOT Socket.IO
 * Backend must support native WebSocket (FastAPI WebSocket)
 * 
 * @param {string} userId - Current user's ID
 * @param {boolean} enabled - Whether to connect (default: true)
 * @param {Function} onMessage - Optional callback for handling messages
 * @returns {Object} WebSocket connection state and methods
 */
export function useWebSocket(userId, enabled = true, onMessage = null) {
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const wsRef = useRef(null);
  const dispatch = useDispatch();
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Store the callback in a ref to avoid reconnecting when callback changes
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!userId || !enabled || wsRef.current?.readyState === WebSocket.OPEN) return;

    const token = localStorage.getItem('token');
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

    // Construct WebSocket URL with user_id query parameter
    const url = `${wsUrl}/chat/ws/${userId}${token ? `?token=${token}` : ''}`;

    console.log('🔌 Connecting to WebSocket:', url);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      // Connection opened
      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;

        // Start heartbeat (ping every 25 seconds)
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 25000);
      };

      // Message received
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);

          // Call custom handler if provided
          if (onMessageRef.current) {
            onMessageRef.current(data);
          }

          switch (data.type) {
            case 'pong':
              // Heartbeat response - connection is alive
              break;

            case 'new_message': {
              // New message received
              // Handle potentially nested data structure (some backends wrap in 'data')
              const msgPayload = data.data || data;

              // Also check if this is meant for chat logic handled by RTK Query
              if (msgPayload.conversation_id) {
                // 1. Invalidate tags to refetch (consistency)
                dispatch(
                  chatApi.util.invalidateTags([
                    { type: 'Messages', id: msgPayload.conversation_id },
                    'Conversations',
                  ])
                );

                // 2. Optimistically update cache for instant UI feedback
                dispatch(
                  chatApi.util.updateQueryData(
                    'getMessages',
                    { conversationId: msgPayload.conversation_id },
                    (draft) => {
                      // Check for duplicates before adding
                      const exists = draft.find(m => m.id === msgPayload.id);
                      if (!exists) {
                        draft.push(msgPayload);
                      }
                    }
                  )
                );
              }
              break;
            }

            case 'message_status': {
              const payload = data.data || data;
              console.log(`📬 Message ${payload.message_id} status: ${payload.status}`);

              // Update message status in cache
              if (payload.conversation_id) {
                dispatch(
                  chatApi.util.updateQueryData('getMessages', { conversationId: payload.conversation_id }, (draft) => {
                    const message = draft?.find(m => m.id === payload.message_id);
                    if (message) {
                      message.status = payload.status;
                    }
                  })
                );
              }
              break;
            }

            case 'notification':
              // Notifications are handled by onMessage callback in NotificationContext
              // We can just log here or let it be handled by the consumer.
              console.log('🔔 New notification received via WebSocket');
              break;

            case 'user_typing': {
              const payload = data.data || data;
              setTypingUsers(prev => {
                const newSet = new Set(prev);
                if (!payload.user_id || !payload.conversation_id) return prev;

                const key = `${payload.user_id}-${payload.conversation_id}`;

                if (payload.is_typing) {
                  newSet.add(key);
                } else {
                  newSet.delete(key);
                }

                return newSet;
              });
              break;
            }

            case 'user_status': {
              const payload = data.data || data;
              console.log(`👤 User ${payload.user_id} is ${payload.is_online ? 'online' : 'offline'}`);
              break;
            }

            case 'error':
              console.error('❌ WebSocket error:', data.message);
              break;

            default:
              // Other types handled by consumers or ignored
              break;
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      // Connection closed
      ws.onclose = (event) => {
        console.log('❌ WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);

        // Clear heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }

        // Attempt to reconnect
        if (enabled && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 5000);
          console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error('❌ Max reconnection attempts reached');
        }
      };

      // Connection error
      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnected(false);
    }
  }, [userId, enabled, dispatch]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Send typing indicator
  const sendTypingIndicator = useCallback((conversationId, isTyping) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        conversation_id: conversationId,
        is_typing: isTyping,
      }));
    }
  }, []);

  // Send message via WebSocket (optional - can also use REST API)
  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        ...message,
      }));
    }
  }, []);

  // Check if user is typing in a conversation
  const isUserTyping = useCallback((userId, conversationId) => {
    return typingUsers.has(`${userId}-${conversationId}`);
  }, [typingUsers]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    ws: wsRef.current,
    sendTypingIndicator,
    sendMessage,
    isUserTyping,
    typingUsers,
    connect,
    disconnect,
  };
}

