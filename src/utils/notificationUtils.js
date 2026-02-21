/**
 * Get icon/emoji for notification category
 * @param {string} category - Notification category
 * @returns {string} Icon/emoji for the category
 */
export const getNotificationIcon = (category) => {
    const icons = {
        prescription: '💊',
        new_prescription: '💊',
        NEW_PRESCRIPTION: '💊',
        prescription_updated: '📝',
        PRESCRIPTION_UPDATED: '📝',
        request: '📝',
        request_replied: '💬',
        REQUEST_REPLIED: '💬',
        exercise: '🏃',
        exercise_completed: '✅',
        EXERCISE_COMPLETED: '✅',
        system: '⚙️',
        chat: '💬',
        appointment: '📅',
        patient_pain_report: '⚠️',
        PATIENT_PAIN_REPORT: '⚠️',
        new_patient_request: '📥',
        NEW_PATIENT_REQUEST: '📥'
    };
    return icons[category] || '🔔';
};

/**
 * Get color for notification priority
 * @param {string} priority - Notification priority (low, medium, high, urgent)
 * @returns {string} Color code for the priority
 */
export const getPriorityColor = (priority) => {
    const colors = {
        low: '#4CAF50',      // Green
        medium: '#2196F3',   // Blue
        high: '#FF9800',     // Orange
        urgent: '#F44336'    // Red
    };
    return colors[priority] || '#2196F3';
};

/**
 * Get Tailwind CSS classes for priority border
 * @param {string} priority - Notification priority
 * @returns {string} Tailwind CSS classes
 */
export const getPriorityBorderClass = (priority) => {
    const classes = {
        low: 'border-l-4 border-green-500',
        medium: 'border-l-4 border-blue-500',
        high: 'border-l-4 border-orange-500',
        urgent: 'border-l-4 border-red-500'
    };
    return classes[priority] || 'border-l-4 border-blue-500';
};

/**
 * Get human-readable title for notification type
 * @param {string} type - Notification type
 * @returns {string} Human-readable title
 */
export const getNotificationTitle = (type) => {
    const titles = {
        // Patient notifications
        new_prescription: 'New Prescription',
        prescription_updated: 'Prescription Updated',
        request_replied: 'Request Replied',
        exercise_reminder: 'Exercise Reminder',
        appointment_reminder: 'Appointment Reminder',

        // Therapist notifications
        new_patient_request: 'New Patient Request',
        patient_pain_report: 'Patient Pain Report',
        exercise_completed: 'Exercise Completed',
        exercise_missed: 'Exercise Missed',
        new_patient: 'New Patient',

        // System notifications
        account_verified: 'Account Verified',
        password_reset: 'Password Reset',
        system_alert: 'System Alert'
    };
    return titles[type] || 'Notification';
};

/**
 * Get category label for display
 * @param {string} category - Notification category
 * @returns {string} Category label
 */
export const getCategoryLabel = (category) => {
    const labels = {
        prescription: 'Prescription',
        new_prescription: 'New Prescription',
        NEW_PRESCRIPTION: 'New Prescription',
        prescription_updated: 'Prescription Update',
        PRESCRIPTION_UPDATED: 'Prescription Update',
        request: 'Request',
        request_replied: 'Request Updated',
        REQUEST_REPLIED: 'Request Updated',
        exercise: 'Exercise',
        exercise_completed: 'Exercise Completed',
        EXERCISE_COMPLETED: 'Exercise Completed',
        system: 'System',
        chat: 'Chat',
        appointment: 'Appointment',
        patient_pain_report: 'Pain Report',
        PATIENT_PAIN_REPORT: 'Pain Report',
        new_patient_request: 'New Patient Request',
        NEW_PATIENT_REQUEST: 'New Patient Request'
    };
    return labels[category] || category;
};

/**
 * Get priority label for display
 * @param {string} priority - Notification priority
 * @returns {string} Priority label
 */
export const getPriorityLabel = (priority) => {
    const labels = {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        urgent: 'Urgent'
    };
    return labels[priority] || priority;
};

/**
 * Determine if notification requires action
 * @param {Object} notification - Notification object
 * @returns {boolean} True if action is required
 */
export const requiresAction = (notification) => {
    return notification?.metadata?.action_required === true;
};

/**
 * Get action URL from notification
 * @param {Object} notification - Notification object
 * @returns {string|null} Action URL or null
 */
export const getActionUrl = (notification) => {
    return notification?.metadata?.action_url || null;
};

/**
 * Group notifications by date
 * @param {Array} notifications - Array of notification objects
 * @returns {Object} Notifications grouped by date
 */
export const groupNotificationsByDate = (notifications) => {
    const groups = {
        today: [],
        yesterday: [],
        thisWeek: [],
        older: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    notifications.forEach(notification => {
        const notifDate = new Date(notification.created_at);
        const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

        if (notifDay.getTime() === today.getTime()) {
            groups.today.push(notification);
        } else if (notifDay.getTime() === yesterday.getTime()) {
            groups.yesterday.push(notification);
        } else if (notifDate >= weekAgo) {
            groups.thisWeek.push(notification);
        } else {
            groups.older.push(notification);
        }
    });

    return groups;
};

/**
 * Filter notifications by criteria
 * @param {Array} notifications - Array of notification objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered notifications
 */
export const filterNotifications = (notifications, filters = {}) => {
    let filtered = [...notifications];

    if (filters.category) {
        filtered = filtered.filter(n => n.category === filters.category);
    }

    if (filters.priority) {
        filtered = filtered.filter(n => n.priority === filters.priority);
    }

    if (filters.isRead !== undefined) {
        filtered = filtered.filter(n => n.is_read === filters.isRead);
    }

    if (filters.isArchived !== undefined) {
        filtered = filtered.filter(n => n.is_archived === filters.isArchived);
    }

    return filtered;
};

/**
 * Sort notifications by date (newest first)
 * @param {Array} notifications - Array of notification objects
 * @returns {Array} Sorted notifications
 */
export const sortNotificationsByDate = (notifications) => {
    return [...notifications].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });
};
