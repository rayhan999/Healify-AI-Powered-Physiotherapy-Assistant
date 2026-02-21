import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts';
import NotificationItem from '../components/notifications/NotificationItem';
import {
    getCategoryLabel,
    getPriorityLabel,
    groupNotificationsByDate
} from '../utils/notificationUtils';
import NotificationPreferences from '../components/notifications/NotificationPreferences';

export default function NotificationList() {
    const navigate = useNavigate();
    const {
        notifications,
        loading,
        error,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification
    } = useNotifications();

    const [filter, setFilter] = useState({
        category: '',
        priority: '',
        isRead: ''
    });
    const [groupByDate, setGroupByDate] = useState(true);
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [showPreferences, setShowPreferences] = useState(false);

    // Fetch notifications on mount
    useEffect(() => {
        const params = {};
        if (filter.category) params.category = filter.category;
        if (filter.priority) params.priority = filter.priority;
        if (filter.isRead !== '') params.is_read = filter.isRead === 'unread' ? false : true;

        fetchNotifications(params);
    }, [filter, fetchNotifications]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markAsRead(notificationId);
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAsUnread = async (notificationId) => {
        try {
            await markAsUnread(notificationId);
        } catch (error) {
            console.error('Error marking as unread:', error);
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilter({ category: '', priority: '', isRead: '' });
    };

    const groupedNotifications = groupByDate
        ? groupNotificationsByDate(notifications)
        : { all: notifications };

    const renderNotificationGroup = (title, notifs) => {
        if (!notifs || notifs.length === 0) return null;

        return (
            <div key={title} className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                    {title}
                </h3>
                <div className="space-y-3">
                    {notifs.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDelete}
                            compact={false}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-2"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Notifications
                            </h1>
                            {unreadCount > 0 && (
                                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={loading || unreadCount === 0}
                                className="px-4 py-2 bg-primary dark:bg-cyan-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Mark all as read
                            </button>
                        )}

                        <button
                            onClick={() => setShowPreferences(true)}
                            className="ml-3 p-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            title="Notification Preferences"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Category Filter */}
                        <select
                            value={filter.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-cyan-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            <option value="prescription">Prescription</option>
                            <option value="request">Request</option>
                            <option value="exercise">Exercise</option>
                            <option value="system">System</option>
                            <option value="chat">Chat</option>
                            <option value="appointment">Appointment</option>
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={filter.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-cyan-500 focus:border-transparent"
                        >
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>

                        {/* Read Status Filter */}
                        <select
                            value={filter.isRead}
                            onChange={(e) => handleFilterChange('isRead', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-cyan-500 focus:border-transparent"
                        >
                            <option value="">All</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                        </select>

                        {/* Group By Date Toggle */}
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={groupByDate}
                                onChange={(e) => setGroupByDate(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-cyan-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-white">Group by date</span>
                        </label>

                        {/* Clear Filters */}
                        {(filter.category || filter.priority || filter.isRead) && (
                            <button
                                onClick={handleClearFilters}
                                className="text-sm text-primary dark:text-cyan-400 hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-cyan-400"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Failed to load notifications
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                            {error}
                        </p>
                        <button
                            onClick={() => fetchNotifications()}
                            className="px-4 py-2 bg-primary dark:bg-cyan-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-cyan-700 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            No notifications
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                            {filter.category || filter.priority || filter.isRead
                                ? "No notifications match your filters. Try adjusting your filters."
                                : "You're all caught up! No notifications to show."}
                        </p>
                    </div>
                ) : groupByDate ? (
                    <>
                        {renderNotificationGroup('Today', groupedNotifications.today)}
                        {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
                        {renderNotificationGroup('This Week', groupedNotifications.thisWeek)}
                        {renderNotificationGroup('Older', groupedNotifications.older)}
                    </>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDelete}
                                compact={false}
                            />
                        ))}
                    </div>
                )}
            </div>


            {/* Preferences Modal */}
            {
                showPreferences && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            {/* Background overlay */}
                            <div
                                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                aria-hidden="true"
                                onClick={() => setShowPreferences(false)}
                            ></div>

                            {/* Modal alignment trick */}
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            {/* Modal Panel */}
                            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                                <NotificationPreferences onClose={() => setShowPreferences(false)} />
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
