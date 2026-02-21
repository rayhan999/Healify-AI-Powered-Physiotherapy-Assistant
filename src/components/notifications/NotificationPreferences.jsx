import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts';

export default function NotificationPreferences({ onClose }) {
    const { getPreferences, updatePreferences } = useNotifications();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [prefs, setPrefs] = useState({
        email_enabled: true,
        push_enabled: true,
        categories: {
            prescription: true,
            request: true,
            exercise: true,
            system: true,
            chat: true,
            appointment: true
        }
    });

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            setLoading(true);
            const data = await getPreferences();
            if (data) {
                setPrefs({
                    email_enabled: data.email_enabled ?? true,
                    push_enabled: data.push_enabled ?? true,
                    categories: {
                        prescription: true,
                        request: true,
                        exercise: true,
                        system: true,
                        chat: true,
                        appointment: true,
                        ...data.categories
                    }
                });
            }
        } catch (err) {
            setError('Failed to load preferences');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key, isCategory = false) => {
        setPrefs(prev => {
            if (isCategory) {
                return {
                    ...prev,
                    categories: {
                        ...prev.categories,
                        [key]: !prev.categories[key]
                    }
                };
            }
            return {
                ...prev,
                [key]: !prev[key]
            };
        });
        // Clear messages when user makes changes
        setError(null);
        setSuccess(null);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            await updatePreferences(prefs);
            setSuccess('Preferences saved successfully');

            // Auto-dismiss success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to save preferences');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 max-w-2xl mx-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Notification Preferences
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    Manage how and when you receive notifications
                </p>
            </div>

            <div className="p-6 space-y-8">
                {/* Validation Messages */}
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm">
                        {success}
                    </div>
                )}

                {/* Global Channels */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Delivery Channels
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">Receive important updates via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={prefs.email_enabled}
                                    onChange={() => handleToggle('email_enabled')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-cyan-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">Receive real-time alerts on your device</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={prefs.push_enabled}
                                    onChange={() => handleToggle('push_enabled')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-cyan-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Notification Categories
                    </h3>
                    <div className="space-y-4">
                        {[
                            { id: 'prescription', label: 'Prescriptions', desc: 'Updates about your prescriptions and plans' },
                            { id: 'request', label: 'Requests', desc: 'Status updates on your requests' },
                            { id: 'exercise', label: 'Exercises', desc: 'Reminders and updates for exercises' },
                            { id: 'appointment', label: 'Appointments', desc: 'Reminders for upcoming sessions' },
                            { id: 'chat', label: 'Messages', desc: 'New messages from your therapist' },
                            { id: 'system', label: 'System', desc: 'Account and system related alerts' },
                        ].map(category => (
                            <div key={category.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{category.label}</p>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">{category.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={prefs.categories[category.id]}
                                        onChange={() => handleToggle(category.id, true)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-primary dark:bg-cyan-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {saving && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    Save Preferences
                </button>
            </div>
        </div>
    );
}
