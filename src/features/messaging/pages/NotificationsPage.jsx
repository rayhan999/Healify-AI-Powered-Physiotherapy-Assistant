import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppNavBar } from "../../../components/layout";

export default function NotificationsPage({ userType = "patient" }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "exercise",
      title: "Time for your morning exercises!",
      message: "You have 3 exercises scheduled for today: Shoulder Rotation, Arm Raises, and Wall Push-ups.",
      time: "10 mins ago",
      read: false,
      icon: "exercise",
      action: "Start Exercises",
      actionLink: "/patient-dashboard",
    },
    {
      id: 2,
      type: "message",
      title: "New message from Dr. Sarah Williams",
      message: "How are you feeling today? Let me know if you have any concerns.",
      time: "25 mins ago",
      read: false,
      icon: "message",
      action: "View Message",
      actionLink: "/messages",
    },
    {
      id: 3,
      type: "achievement",
      title: "Achievement Unlocked: 7-Day Streak! 🔥",
      message: "Congratulations! You've completed exercises for 7 days in a row. Keep up the excellent work!",
      time: "1 hour ago",
      read: true,
      icon: "trophy",
      action: "View Achievements",
      actionLink: "/patient-progress",
    },
    {
      id: 4,
      type: "reminder",
      title: "Pain Level Check-in",
      message: "It's time for your daily pain level assessment. This helps your therapist track your progress.",
      time: "2 hours ago",
      read: true,
      icon: "health",
      action: "Report Pain Level",
      actionLink: "/patient-dashboard",
    },
    {
      id: 5,
      type: "system",
      title: "Session Report Available",
      message: "Your progress report for this week is now available. Review your performance and improvements.",
      time: "5 hours ago",
      read: true,
      icon: "report",
      action: "View Report",
      actionLink: "/patient-progress",
    },
    {
      id: 6,
      type: "exercise",
      title: "Missed Exercise Alert",
      message: "You missed your afternoon exercise session yesterday. Try to stay consistent for better results!",
      time: "1 day ago",
      read: true,
      icon: "warning",
    },
    {
      id: 7,
      type: "message",
      title: "Therapist added new exercise",
      message: "Dr. Sarah Williams has added 'Neck Stretches' to your exercise plan. Check it out!",
      time: "2 days ago",
      read: true,
      icon: "new",
      action: "View Exercises",
      actionLink: "/patient-dashboard",
    },
    {
      id: 8,
      type: "achievement",
      title: "50 Exercises Completed! 💪",
      message: "Amazing progress! You've completed 50 exercises. You're well on your way to recovery.",
      time: "3 days ago",
      read: true,
      icon: "trophy",
    },
  ]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const getIconComponent = (iconType) => {
    switch (iconType) {
      case "exercise":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "message":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case "trophy":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case "health":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case "report":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "new":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "exercise":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "message":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      case "achievement":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
      case "reminder":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
      case "system":
        return "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400";
      default:
        return "bg-primary/10 dark:bg-cyan-900/30 text-primary dark:text-cyan-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <AppNavBar userType={userType} userName="John Doe" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(userType === "patient" ? "/patient-dashboard" : "/therapist-dashboard")}
            className="flex items-center gap-2 text-text-muted dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-text-primary dark:text-white">Notifications</h1>
              <p className="text-text-muted dark:text-slate-400 mt-1">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : "You're all caught up!"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-primary dark:text-cyan-400 hover:bg-primary/10 dark:hover:bg-cyan-900/30 rounded-lg transition font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                filter === "all"
                  ? "bg-primary dark:bg-cyan-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                filter === "unread"
                  ? "bg-primary dark:bg-cyan-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("exercise")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                filter === "exercise"
                  ? "bg-primary dark:bg-cyan-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Exercises
            </button>
            <button
              onClick={() => setFilter("message")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                filter === "message"
                  ? "bg-primary dark:bg-cyan-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setFilter("achievement")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                filter === "achievement"
                  ? "bg-primary dark:bg-cyan-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Achievements
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-4 hover:shadow-lg transition ${
                  !notification.read ? "border-l-4 border-l-primary dark:border-l-cyan-500" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(notification.type)}`}>
                    {getIconComponent(notification.icon)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${!notification.read ? "text-text-primary dark:text-white" : "text-text-muted dark:text-slate-400"}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 ml-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary dark:bg-cyan-400 rounded-full flex-shrink-0"></div>
                        )}
                        <span className="text-xs text-text-muted dark:text-slate-400 whitespace-nowrap">{notification.time}</span>
                      </div>
                    </div>

                    <p className="text-sm text-text-body dark:text-slate-300 mb-3">{notification.message}</p>

                    <div className="flex items-center gap-2">
                      {notification.action && (
                        <button
                          onClick={() => navigate(notification.actionLink)}
                          className="px-4 py-2 bg-primary/10 dark:bg-cyan-900/30 text-primary dark:text-cyan-400 text-sm font-medium rounded-lg hover:bg-primary/20 dark:hover:bg-cyan-900/50 transition"
                        >
                          {notification.action}
                        </button>
                      )}

                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="px-4 py-2 text-text-muted dark:text-slate-400 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                        >
                          Mark as read
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="ml-auto p-2 text-text-muted dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        title="Delete notification"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">No notifications</h3>
              <p className="text-text-muted dark:text-slate-400">You're all caught up! Check back later for updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
