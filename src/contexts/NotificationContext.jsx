import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import { useToast } from '../components/ui';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // WebSocket handler for real-time notifications
    const handleWebSocketMessage = useCallback((data) => {
        console.log("NotificationContext received WebSocket message:", data);

        let notificationData = null;

        if (data.type === 'notification' && data.data) {
            notificationData = data.data;
        } else if (data.type === 'new_message' && data.data) {
            // Handle chat messages as notifications if needed
            notificationData = {
                id: data.data.id,
                title: "New Message",
                message: data.data.content,
                is_read: false,
                ...data.data
            };
        }

        if (notificationData) {
            const toastMessage = notificationData.title
                ? `${notificationData.title}: ${notificationData.message}`
                : notificationData.message;

            // Fix: toast is an object with methods, not a function
            if (toast && typeof toast.info === 'function') {
                toast.info(toastMessage);
            } else {
                console.warn("Toast method missing:", toast);
            }

            // Update local state
            setNotifications(prev => [notificationData, ...prev]);

            // Increment unread count if not read
            if (!notificationData.is_read) {
                setUnreadCount(prev => prev + 1);
            }
        }
    }, [toast]);

    // Initialize WebSocket with the handler
    useWebSocket(user?.id, !!user, handleWebSocketMessage);

    /**
     * Fetch unread notification count
     */
    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;

        try {
            const data = await notificationService.getUnreadCount();
            let count = 0;
            if (typeof data === 'number') {
                count = data;
            } else if (data && typeof data.count === 'number') {
                count = data.count;
            } else if (data && typeof data.unread_count === 'number') {
                count = data.unread_count;
            }
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
            // Don't set error state for background updates
        }
    }, [user]);

    /**
     * Fetch notifications with optional filters
     */
    const fetchNotifications = useCallback(async (params = {}) => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const data = await notificationService.getNotifications(params);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError(error.message);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    /**
     * Mark a notification as read
     */
    const markAsRead = useCallback(async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);

            // Update local state
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
                )
            );

            // Update unread count
            await fetchUnreadCount();
        } catch (error) {
            console.error('Error marking as read:', error);
            throw error;
        }
    }, [fetchUnreadCount]);

    /**
     * Mark a notification as unread
     */
    const markAsUnread = useCallback(async (notificationId) => {
        try {
            await notificationService.markAsUnread(notificationId);

            // Update local state
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, is_read: false, read_at: null } : n
                )
            );

            // Update unread count
            await fetchUnreadCount();
        } catch (error) {
            console.error('Error marking as unread:', error);
            throw error;
        }
    }, [fetchUnreadCount]);

    /**
     * Mark all notifications as read
     */
    const markAllAsRead = useCallback(async () => {
        try {
            await notificationService.markAllAsRead();

            // Update local state
            const now = new Date().toISOString();
            setNotifications(prev =>
                prev.map(n => ({ ...n, is_read: true, read_at: now }))
            );

            // Update unread count
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
            throw error;
        }
    }, []);

    /**
     * Delete a notification
     */
    const deleteNotification = useCallback(async (notificationId) => {
        try {
            await notificationService.deleteNotification(notificationId);

            // Remove from local state
            setNotifications(prev => prev.filter(n => n.id !== notificationId));

            // Update unread count
            await fetchUnreadCount();
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }, [fetchUnreadCount]);

    /**
     * Archive a notification
     */
    const archiveNotification = useCallback(async (notificationId) => {
        try {
            await notificationService.archiveNotification(notificationId);

            // Update local state
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, is_archived: true } : n
                )
            );
        } catch (error) {
            console.error('Error archiving notification:', error);
            throw error;
        }
    }, []);

    /**
     * Get notification statistics
     */
    const fetchStats = useCallback(async () => {
        if (!user) return null;

        try {
            const stats = await notificationService.getStats();
            return stats;
        } catch (error) {
            console.error('Error fetching stats:', error);
            return null;
        }
    }, [user]);

    /**
     * Get user notification preferences
     */
    const getPreferences = useCallback(async () => {
        if (!user) return null;
        try {
            return await notificationService.getPreferences();
        } catch (error) {
            console.error('Error fetching preferences:', error);
            throw error;
        }
    }, [user]);

    /**
     * Update user notification preferences
     */
    const updatePreferences = useCallback(async (preferences) => {
        try {
            return await notificationService.updatePreferences(preferences);
        } catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
        }
    }, []);

    /**
     * Refresh notifications and unread count
     */
    const refresh = useCallback(async () => {
        await Promise.all([
            fetchNotifications(),
            fetchUnreadCount()
        ]);
    }, [fetchNotifications, fetchUnreadCount]);

    // Auto-fetch unread count when user logs in
    useEffect(() => {
        if (user) {
            fetchUnreadCount();
        } else {
            setUnreadCount(0);
            setNotifications([]);
        }
    }, [user, fetchUnreadCount]);

    // Polling removed in favor of WebSocket
    // useEffect(() => {
    //     if (!user) return;
    //     const interval = setInterval(() => {
    //         fetchUnreadCount();
    //     }, 30000); 
    //     return () => clearInterval(interval);
    // }, [user, fetchUnreadCount]);

    const value = {
        // State
        unreadCount,
        notifications,
        loading,
        error,

        // Actions
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        archiveNotification,
        fetchStats,
        getPreferences,
        updatePreferences,
        refresh
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

/**
 * Hook to use notification context
 */
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};
