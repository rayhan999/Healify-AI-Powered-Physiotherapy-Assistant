/**
 * Get relative time string from ISO date string
 * @param {string} dateString - ISO 8601 datetime string
 * @returns {string} Relative time string (e.g., "Just now", "5m ago", "2h ago")
 */
export const getRelativeTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    }
    if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
    }

    // For older dates, return formatted date
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};

/**
 * Format date to full datetime string
 * @param {string} dateString - ISO 8601 datetime string
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Check if a notification is recent (within last 24 hours)
 * @param {string} dateString - ISO 8601 datetime string
 * @returns {boolean} True if notification is recent
 */
export const isRecent = (dateString) => {
    if (!dateString) return false;

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    return diffInHours < 24;
};

/**
 * Check if a notification has expired
 * @param {string} expiresAt - ISO 8601 datetime string
 * @returns {boolean} True if notification has expired
 */
export const isExpired = (expiresAt) => {
    if (!expiresAt) return false;

    const expiryDate = new Date(expiresAt);
    const now = new Date();

    return now > expiryDate;
};
