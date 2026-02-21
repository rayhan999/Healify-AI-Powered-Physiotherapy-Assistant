const API_BASE_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL;

class NotificationService {
    /**
     * Get auth token from localStorage
     */
    getAuthToken() {
        return localStorage.getItem('token');
    }

    /**
     * Get headers with authentication
     */
    getHeaders() {
        const token = this.getAuthToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    /**
     * Get all notifications with optional filters
     * @param {Object} params - Query parameters (skip, limit, is_read, category, priority, is_archived)
     * @returns {Promise<Array>} Array of notification objects
     */
    async getNotifications(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${API_BASE_URL}/notifications${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to fetch notifications');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    /**
     * Get unread notification count
     * @returns {Promise<Object>} Object with count property
     */
    async getUnreadCount() {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to fetch unread count');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching unread count:', error);
            throw error;
        }
    }

    /**
     * Get notification statistics
     * @returns {Promise<Object>} Statistics object
     */
    async getStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/stats`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to fetch stats');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }

    /**
     * Get a specific notification by ID
     * @param {string} notificationId - Notification ID
     * @returns {Promise<Object>} Notification object
     */
    async getNotification(notificationId) {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to fetch notification');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching notification:', error);
            throw error;
        }
    }

    /**
     * Mark a notification as read
     * @param {string} notificationId - Notification ID
     * @returns {Promise<Object>} Updated notification object
     */
    async markAsRead(notificationId) {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify({ is_read: true })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to mark as read');
            }

            return response.json();
        } catch (error) {
            console.error('Error marking as read:', error);
            throw error;
        }
    }

    /**
     * Mark a notification as unread
     * @param {string} notificationId - Notification ID
     * @returns {Promise<Object>} Updated notification object
     */
    async markAsUnread(notificationId) {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify({ is_read: false })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to mark as unread');
            }

            return response.json();
        } catch (error) {
            console.error('Error marking as unread:', error);
            throw error;
        }
    }

    /**
     * Mark all notifications as read
     * @returns {Promise<Object>} Object with updated_count property
     */
    async markAllAsRead() {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
                method: 'PATCH',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to mark all as read');
            }

            return response.json();
        } catch (error) {
            console.error('Error marking all as read:', error);
            throw error;
        }
    }

    /**
     * Delete a notification
     * @param {string} notificationId - Notification ID
     * @returns {Promise<Object>} Success message
     */
    async deleteNotification(notificationId) {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to delete notification');
            }

            return response.json();
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }

    /**
     * Archive a notification
     * @param {string} notificationId - Notification ID
     * @returns {Promise<Object>} Updated notification object
     */
    async archiveNotification(notificationId) {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify({ is_archived: true })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to archive notification');
            }

            return response.json();
        } catch (error) {
            console.error('Error archiving notification:', error);
            throw error;
        }
    }

    /**
     * Get user notification preferences
     * @returns {Promise<Object>} Preferences object
     */
    async getPreferences() {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/preferences/me`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to fetch preferences');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching preferences:', error);
            throw error;
        }
    }

    /**
     * Update user notification preferences
     * @param {Object} preferences - Preferences object
     * @returns {Promise<Object>} Updated preferences object
     */
    async updatePreferences(preferences) {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/preferences/me`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(preferences)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to update preferences');
            }

            return response.json();
        } catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
        }
    }
}

export default new NotificationService();
