import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../contexts';
import NotificationItem from './NotificationItem';

export default function NotificationDropdown({ isOpen, onClose, onViewAll }) {
    const {
        notifications,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        deleteNotification,
        markAllAsRead
    } = useNotifications();

    const [localLoading, setLocalLoading] = useState(false);

    // Fetch recent notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications({ limit: 5, is_archived: false });
        }
    }, [isOpen, fetchNotifications]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            setLocalLoading(true);
            await markAsRead(notificationId);
        } catch (error) {
            console.error('Error marking as read:', error);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            setLocalLoading(true);
            await deleteNotification(notificationId);
        } catch (error) {
            console.error('Error deleting notification:', error);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            setLocalLoading(true);
            await markAllAsRead();
        } catch (error) {
            console.error('Error marking all as read:', error);
        } finally {
            setLocalLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                </h3>

                {notifications.length > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        disabled={localLoading}
                        className="text-sm text-primary dark:text-cyan-400 hover:underline disabled:opacity-50"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {loading && notifications.length === 0 ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-cyan-400"></div>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <svg className="w-12 h-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                            Failed to load notifications
                        </p>
                        <button
                            onClick={() => fetchNotifications({ limit: 5 })}
                            className="mt-3 text-sm text-primary dark:text-cyan-400 hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            No notifications
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-500">
                            You're all caught up!
                        </p>
                    </div>
                ) : (
                    <div className="p-3 space-y-2">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDelete}
                                onClick={onClose}
                                compact={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="border-t border-gray-200 dark:border-slate-700 p-3">
                    <button
                        onClick={onViewAll}
                        className="w-full py-2 text-sm font-medium text-primary dark:text-cyan-400 hover:bg-primary/5 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
                    >
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
}
