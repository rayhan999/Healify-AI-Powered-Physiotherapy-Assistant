import React, { useState, useEffect, useRef } from 'react';
import { chatWithAssistant, fetchChatHistory } from '../services/aiAssistantService';
import { useTheme, useAuth } from '../contexts';
import ReactMarkdown from 'react-markdown';

/**
 * AI Assistant Component
 * ChatGPT-like interface for RAG-powered AI assistance
 */
export default function AIAssistant({ userType = 'patient' }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { darkMode } = useTheme();
    // Use auth context if available, otherwise fallback to mock for dev if needed, 
    // but requirement implies authenticated calls.
    // Assuming useAuth provides a way to get the token, usually it's stored and managed there.
    // The previous view of AuthContext showed it uses localStorage for token.
    const token = localStorage.getItem("token");

    // Welcome messages based on user type
    const welcomeMessages = {
        patient: "Hello! I'm your AI assistant. I can help answer questions about your physiotherapy exercises, recovery progress, and general health information. What would you like to know?",
        therapist: "Hello! I'm your AI assistant. I can help you with patient care, treatment plans, and answer questions based on uploaded medical documents. How can I assist you today?"
    };

    // Load chat history
    useEffect(() => {
        const loadHistory = async () => {
            if (!token) return;

            try {
                const history = await fetchChatHistory(token);
                if (history && history.length > 0) {
                    setMessages(history);
                } else {
                    setMessages([
                        {
                            id: 1,
                            role: 'ai',
                            content: welcomeMessages[userType],
                            timestamp: new Date()
                        }
                    ]);
                }
            } catch (err) {
                console.error("Failed to load chat history:", err);
                // Fallback to welcome message on error
                setMessages([
                    {
                        id: 1,
                        role: 'ai',
                        content: welcomeMessages[userType],
                        timestamp: new Date()
                    }
                ]);
            }
        };

        loadHistory();
    }, [token, userType]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(), // Optimistic ID
            type: 'user', // Ensure this matches backend 'role' for consistent rendering if we were mixing
            // The backend returns 'role', frontend uses 'type'. We need to be consistent. 
            // The history loader sets 'role', so we should probably stick to 'role' or map it.
            // Let's check how the history is returned. 
            // Requirement says backend returns: { role: "user", content: "...", timestamp: "..." }
            // Current frontend uses: { type: 'user', content: '...', timestamp: ... }
            // I will map the backend response to frontend structure in the fetch or adjust frontend to use 'role'.
            // Adjusting frontend to use 'role' might be cleaner but 'type' is used in styling.
            // Let's map 'role' -> 'type' (user->user, ai->ai) which is identical.
            // Wait, existing code uses `type`. The backend uses `role`.
            // I'll update the `loadHistory` (above) to NOT map if I change the frontend to use `role` or 
            // I'll map `role` to `type` in the state.
            // Let's use `role` locally as well to match backend.
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        // Add user message immediately (Optimistic update)
        // Note: We are switching 'type' to 'role' for consistency with backend history.
        // We need to update the render logic too.
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setError('');
        setIsLoading(true);

        try {
            // Get AI response
            const aiResponse = await chatWithAssistant(inputMessage, userType, token);

            const aiMessage = {
                id: Date.now() + 1,
                role: 'ai',
                content: aiResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            setError(err.message || 'Failed to get response. Please try again.');
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 dark:bg-slate-900">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <svg className="w-8 h-8 text-primary dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Assistant
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        {userType === 'patient'
                            ? 'Get personalized help with your physiotherapy journey'
                            : 'AI-powered assistance for patient care and treatment planning'}
                    </p>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.map((message, index) => (
                        <div
                            key={message.id || index}
                            className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                }`}
                        >
                            {/* Avatar */}
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.role === 'user'
                                    ? 'bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-600 dark:to-teal-500'
                                    : 'bg-gray-300 dark:bg-slate-600'
                                    }`}
                            >
                                {message.role === 'user' ? (
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-white dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex-1 max-w-2xl ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <div
                                    className={`inline-block px-4 py-3 rounded-2xl ${message.role === 'user'
                                        ? 'bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-600 dark:to-teal-500 text-white'
                                        : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                                        }`}
                                >
                                    <div className="text-sm md:text-base break-words">
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                strong: ({ node, ...props }) => <span className="font-bold" {...props} />,
                                                em: ({ node, ...props }) => <span className="italic" {...props} />,
                                                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-2" {...props} />,
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1 px-2">
                                    {formatTime(new Date(message.timestamp))}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 dark:bg-slate-600 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div className="bg-gray-100 dark:bg-slate-700 px-4 py-3 rounded-2xl">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-300">Error</p>
                                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-4 py-4 shadow-lg">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                    <div className="flex gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message here..."
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim() || isLoading}
                            className="px-6 py-3 bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-600 dark:to-teal-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="hidden sm:inline">Sending...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span className="hidden sm:inline">Send</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
