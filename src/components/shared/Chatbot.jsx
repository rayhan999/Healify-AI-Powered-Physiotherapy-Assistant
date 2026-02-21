import React, { useState } from "react";
import { useLanguage } from "../../contexts";

/**
 * Messaging component for patient-therapist communication
 * Messenger-style layout with conversation list and chat window
 * @param {Object} props
 * @param {string} props.userType - Either "patient" or "therapist"
 */
export function MessagingSystem({ userType = "patient" }) {
  const { t } = useLanguage();
  
  // Get user-specific translations based on userType
  const translationKey = userType === "therapist" ? "therapistDashboard" : "patientDashboard";
  
  // Mock conversation history - will be replaced with real data from backend
  const [conversations, setConversations] = useState(
    userType === "therapist" 
      ? [
          // Therapist sees their patients
          {
            id: 1,
            name: "Sarah Johnson",
            role: "Patient",
            avatar: "👤",
            lastMessage: "Thank you for the exercise plan!",
            timestamp: "2 min ago",
            unread: 1,
            isOnline: true,
          },
          {
            id: 2,
            name: "Michael Chen",
            role: "Patient",
            avatar: "👤",
            lastMessage: "When is my next appointment?",
            timestamp: "1 hour ago",
            unread: 0,
            isOnline: false,
          },
          {
            id: 3,
            name: "Emma Williams",
            role: "Patient",
            avatar: "👤",
            lastMessage: "The exercises are helping a lot",
            timestamp: "Yesterday",
            unread: 0,
            isOnline: true,
          },
        ]
      : [
          // Patient sees their therapist(s)
          {
            id: 1,
            name: "Dr. James Smith",
            role: "Physiotherapist",
            avatar: "👨‍⚕️",
            lastMessage: "Keep up with the daily exercises",
            timestamp: "10 min ago",
            unread: 0,
            isOnline: true,
          },
          {
            id: 2,
            name: "Dr. Lisa Anderson",
            role: "Physiotherapist",
            avatar: "👩‍⚕️",
            lastMessage: "Your progress looks great!",
            timestamp: "2 days ago",
            unread: 0,
            isOnline: false,
          },
        ]
  );

  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock messages - will be loaded from backend based on conversation
  const [messages, setMessages] = useState([
    {
      role: "received",
      text: userType === "therapist" 
        ? "Hi Doctor, I've been doing the exercises you recommended."
        : "Hello! How are you feeling today?",
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderName: activeConversation.name,
    },
    {
      role: "sent",
      text: userType === "therapist"
        ? "That's great! How is your pain level now?"
        : "Much better, thank you! The exercises are really helping.",
      timestamp: new Date(Date.now() - 3000000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      role: "sent",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setInput("");
    
    // Simulate typing indicator (will be real with WebSocket)
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full w-full">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex border border-gray-200 dark:border-slate-700" style={{ height: "75vh" }}>
        
        {/* LEFT SIDEBAR - Conversation List */}
        <div className="w-80 border-r border-gray-200 dark:border-slate-700 flex flex-col bg-gray-50 dark:bg-slate-900">
          {/* Sidebar Header */}
          <div className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              💬 Messages
            </h2>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={userType === "therapist" ? "Search patients..." : "Search therapists..."}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-slate-400">
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`p-4 cursor-pointer transition-all border-b border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 ${
                    activeConversation.id === conv.id
                      ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-l-primary"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar with online indicator */}
                    <div className="relative flex-shrink-0">
                      <div className="text-3xl">{conv.avatar}</div>
                      {conv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {conv.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-slate-500">{conv.role}</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-slate-400 flex-shrink-0 ml-2">
                          {conv.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-slate-400 truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDE - Chat Window */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-primary to-healify-light-cyan border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="text-3xl">{activeConversation.avatar}</div>
                  {activeConversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {activeConversation.name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {activeConversation.isOnline ? "Active now" : "Offline"} • {activeConversation.role}
                  </p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="p-2 text-white hover:bg-white/20 rounded-lg transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="p-2 text-white hover:bg-white/20 rounded-lg transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-slate-900">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "sent" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex flex-col max-w-md">
                  {msg.role === "received" && (
                    <span className="text-xs text-gray-500 dark:text-slate-500 mb-1 ml-1">
                      {msg.senderName}
                    </span>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.role === "sent"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 shadow-sm rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-xs text-gray-500 dark:text-slate-500 mt-1 ${msg.role === "sent" ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
            <div className="flex gap-3 items-center">
              {/* Attachment Button */}
              <button className="p-2 text-gray-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition" title="Attach file">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              {/* Input Field */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 dark:border-slate-600 rounded-full px-5 py-3 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark dark:hover:bg-cyan-600 transition shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
