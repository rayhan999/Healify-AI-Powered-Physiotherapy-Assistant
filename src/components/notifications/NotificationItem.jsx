import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getRelativeTime } from '../../utils/timeUtils';
import {
    getNotificationIcon,
    getPriorityBorderClass,
    requiresAction,
    getActionUrl
} from '../../utils/notificationUtils';

import { useAuth } from '../../contexts';

export default function NotificationItem({
    notification,
    onMarkAsRead,
    onDelete,
    onClick,
    compact = false
}) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleClick = () => {
        // Mark as read if unread
        if (!notification.is_read && onMarkAsRead) {
            onMarkAsRead(notification.id);
        }

        // Navigate to action URL if available
        const actionUrl = getActionUrl(notification);
        if (actionUrl) {
            // Intercept backend-style chat URLs and redirect to our frontend route
            if (actionUrl.includes('/chat/conversations/')) {
                const role = user?.role || 'patient';
                navigate(role === 'therapist' ? '/therapist-dashboard/chatbot' : '/patient-dashboard/chatbot');
            }
            // Intercept /prescriptions/:id and redirect to dashboard with state
            else if (actionUrl.match(/^\/prescriptions\/([a-zA-Z0-9]+)/)) {
                const match = actionUrl.match(/^\/prescriptions\/([a-zA-Z0-9]+)/);
                const prescriptionId = match[1];
                const role = user?.role || 'patient';
                const targetPath = role === 'therapist'
                    ? '/therapist-dashboard/prescriptions'
                    : '/patient-dashboard/prescriptions';

                navigate(targetPath, { state: { openPrescriptionId: prescriptionId } });
            }
            // Intercept generic requests URL from backend
            else if (actionUrl === '/requests' || actionUrl === '/patient-requests') {
                const role = user?.role || 'patient';
                if (role === 'therapist') {
                    // Check if linked to a prescription
                    const prescriptionId = notification.metadata?.prescription_id || notification.metadata?.prescriptionId;
                    if (prescriptionId) {
                        navigate('/therapist-dashboard/prescriptions', {
                            state: { openPrescriptionId: prescriptionId }
                        });
                    } else {
                        // Default to approvals for general requests
                        navigate('/therapist-dashboard/approvals', {
                            state: { highlightRequestId: notification.file_id || notification.related_id }
                        });
                    }
                } else {
                    navigate('/patient-dashboard/requests-reports');
                }
            }
            else {
                navigate(actionUrl);
            }
        } else {
            // Smart navigation based on category if no explicit actionUrl
            const role = user?.role || 'patient';

            switch (notification.category) {
                case 'chat':
                case 'message':
                    navigate(role === 'therapist' ? '/therapist-dashboard/chatbot' : '/patient-dashboard/chatbot');
                    break;
                case 'appointment':
                    navigate(role === 'therapist' ? '/therapist-dashboard/overview' : '/patient-dashboard/overview');
                    break;
                case 'exercise':
                    if (role === 'patient') navigate('/patient-dashboard/exercises');
                    break;
                case 'request':
                    if (role === 'therapist') navigate('/therapist-dashboard/approvals');
                    break;
                case 'prescription':
                case 'new_prescription':
                case 'prescription_updated':
                    navigate(role === 'therapist' ? '/therapist-dashboard/prescriptions' : '/patient-dashboard/prescriptions');
                    break;
                case 'PATIENT_PAIN_REPORT':
                case 'patient_pain_report':
                case 'NEW_PATIENT_REQUEST':
                case 'new_patient_request':
                    if (role === 'therapist') {
                        const prescriptionId = notification.metadata?.prescription_id || notification.metadata?.prescriptionId;
                        if (prescriptionId) {
                            navigate('/therapist-dashboard/prescriptions', {
                                state: { openPrescriptionId: prescriptionId }
                            });
                        } else {
                            navigate('/therapist-dashboard/approvals', {
                                state: { highlightRequestId: notification.file_id || notification.related_id }
                            });
                        }
                    } else {
                        navigate('/patient-dashboard/overview');
                    }
                    break;
                default:
                    // No specific navigation for other categories
                    break;
            }
        }

        // Call custom onClick handler
        if (onClick) {
            onClick(notification);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(notification.id);
        }
    };

    const handleMarkAsRead = (e) => {
        e.stopPropagation();
        if (onMarkAsRead) {
            onMarkAsRead(notification.id);
        }
    };

    const icon = getNotificationIcon(notification.category);
    const priorityClass = getPriorityBorderClass(notification.priority);
    const hasAction = requiresAction(notification);
    const isPainReport = notification.category === 'PATIENT_PAIN_REPORT' || notification.category === 'patient_pain_report';
    const isPatientRequest = notification.category === 'NEW_PATIENT_REQUEST' || notification.category === 'new_patient_request';

    // Critical styling for pain reports
    const containerClasses = isPainReport
        ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 ring-1 ring-red-500/20'
        : isPatientRequest
            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 ring-1 ring-amber-500/20'
            : !notification.is_read
                ? 'bg-blue-50 dark:bg-cyan-900/10 border-gray-200 dark:border-slate-700'
                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700';

    return (
        <div
            onClick={handleClick}
            className={`
        ${priorityClass}
        ${containerClasses}
        ${compact ? 'p-3' : 'p-4'}
        rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer
        border
      `}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 text-2xl">
                    {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            {/* Title */}
                            <h4 className={`
                ${!notification.is_read ? 'font-bold' : 'font-semibold'}
                ${compact ? 'text-sm' : 'text-base'}
                text-gray-900 dark:text-white truncate
              `}>
                                {notification.title}
                            </h4>

                            {/* Message */}
                            <p className={`
                ${compact ? 'text-xs' : 'text-sm'}
                text-gray-600 dark:text-slate-400 mt-1
                ${compact ? 'line-clamp-1' : 'line-clamp-2'}
              `}>
                                {notification.message}
                            </p>

                            {/* Metadata */}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500 dark:text-slate-500">
                                    {getRelativeTime(notification.created_at)}
                                </span>

                                {hasAction && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
                                        Action Required
                                    </span>
                                )}

                                {notification.priority === 'urgent' && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                        Urgent
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Unread indicator */}
                        {!notification.is_read && (
                            <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions (show on hover for non-compact) */}
                {!compact && (
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.is_read && (
                            <button
                                onClick={handleMarkAsRead}
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                                title="Mark as read"
                                aria-label="Mark as read"
                            >
                                <svg className="w-4 h-4 text-gray-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        )}

                        <button
                            onClick={handleDelete}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete"
                            aria-label="Delete notification"
                        >
                            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
