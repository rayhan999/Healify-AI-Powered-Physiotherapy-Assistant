import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppNavBar } from "../../../components/layout";

export default function MessagingPage({ userType = "patient" }) {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState([
    {
      id: 1,
      name: userType === "patient" ? "Dr. Sarah Williams" : "John Doe",
      role: userType === "patient" ? "Physiotherapist" : "Patient",
      avatar: null,
      lastMessage: "How are you feeling today?",
      lastMessageTime: "2 mins ago",
      unreadCount: 2,
      online: true,
      messages: [
        {
          id: 1,
          sender: userType === "patient" ? "therapist" : "patient",
          text: "Hello! How did your exercises go today?",
          time: "10:30 AM",
          date: "Today",
          read: true,
        },
        {
          id: 2,
          sender: userType === "patient" ? "me" : "me",
          text: "Hi! They went well. I completed all 3 sets of shoulder rotations.",
          time: "10:32 AM",
          date: "Today",
          read: true,
        },
        {
          id: 3,
          sender: userType === "patient" ? "therapist" : "patient",
          text: "Great! Any pain or discomfort?",
          time: "10:33 AM",
          date: "Today",
          read: true,
        },
        {
          id: 4,
          sender: userType === "patient" ? "me" : "me",
          text: "Just a little tightness, but nothing major. Pain level was about 2/10.",
          time: "10:35 AM",
          date: "Today",
          read: true,
        },
        {
          id: 5,
          sender: userType === "patient" ? "therapist" : "patient",
          text: "That's good progress! The tightness should decrease as you continue. Keep up the good work!",
          time: "10:36 AM",
          date: "Today",
          read: true,
        },
        {
          id: 6,
          sender: userType === "patient" ? "therapist" : "patient",
          text: "How are you feeling today?",
          time: "2 mins ago",
          date: "Today",
          read: false,
        },
      ],
    },
    {
      id: 2,
      name: userType === "patient" ? "Support Team" : "Sarah Johnson",
      role: userType === "patient" ? "Healify Support" : "Patient",
      avatar: null,
      lastMessage: "Your subscription has been renewed",
      lastMessageTime: "1 hour ago",
      unreadCount: 0,
      online: false,
      messages: [
        {
          id: 1,
          sender: userType === "patient" ? "support" : "patient",
          text: "Hello! Your subscription has been renewed successfully.",
          time: "9:15 AM",
          date: "Today",
          read: true,
        },
      ],
    },
  ]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedChat && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat, chats]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage = {
      id: selectedChat.messages.length + 1,
      sender: "me",
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      read: true,
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: messageInput,
              lastMessageTime: "Just now",
            }
          : chat
      )
    );

    setMessageInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const markAsRead = (chatId) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, unreadCount: 0 }
          : chat
      )
    );
  };

  const currentChat = chats.find(c => c.id === selectedChat);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <AppNavBar userType={userType} userName="John Doe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(userType === "patient" ? "/patient-dashboard" : "/therapist-dashboard")}
            className="flex items-center gap-2 text-text-muted dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-text-primary dark:text-white">Messages</h1>
          <p className="text-text-muted dark:text-slate-400 mt-1">
            {userType === "patient"
              ? "Chat with your therapist and support team"
              : "Chat with your patients"
            }
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
          <div className="grid grid-cols-12 h-full">
            <div className="col-span-12 md:col-span-4 border-r border-gray-200 dark:border-slate-700 flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-cyan-500 focus:border-transparent"
                  />
                  <svg className="w-5 h-5 text-gray-400 dark:text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100% - 80px)' }}>
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat.id);
                      markAsRead(chat.id);
                    }}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition border-b border-gray-200 dark:border-slate-700 ${
                      selectedChat === chat.id ? "bg-primary/5 dark:bg-cyan-900/20 border-l-4 border-l-primary dark:border-l-cyan-500" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-text-primary dark:text-white truncate">{chat.name}</h3>
                        <span className="text-xs text-text-muted dark:text-slate-400 flex-shrink-0 ml-2">{chat.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-text-muted dark:text-slate-400 mb-1">{chat.role}</p>
                      <p className="text-sm text-text-body dark:text-slate-300 truncate">{chat.lastMessage}</p>
                    </div>

                    {chat.unreadCount > 0 && (
                      <div className="flex-shrink-0 w-6 h-6 bg-primary dark:bg-cyan-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{chat.unreadCount}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-12 md:col-span-8 flex flex-col h-full">
              {currentChat ? (
                <>
                  <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                          {currentChat.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {currentChat.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-bold text-text-primary dark:text-white">{currentChat.name}</h2>
                        <p className="text-xs text-text-muted dark:text-slate-400">
                          {currentChat.online ? "Online" : "Offline"} • {currentChat.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition" title="Voice Call">
                        <svg className="w-5 h-5 text-text-muted dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition" title="Video Call">
                        <svg className="w-5 h-5 text-text-muted dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition" title="More Options">
                        <svg className="w-5 h-5 text-text-muted dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 500px)', minHeight: '300px' }}>
                    {currentChat.messages.map((message, index) => {
                      const showDate = index === 0 || currentChat.messages[index - 1].date !== message.date;

                      return (
                        <React.Fragment key={message.id}>
                          {showDate && (
                            <div className="flex justify-center my-4">
                              <span className="px-3 py-1 bg-gray-200 dark:bg-slate-700 rounded-full text-xs text-text-muted dark:text-slate-300">
                                {message.date}
                              </span>
                            </div>
                          )}

                          <div className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-xs lg:max-w-md ${message.sender === "me" ? "order-2" : "order-1"}`}>
                              <div
                                className={`rounded-2xl px-4 py-2 ${
                                  message.sender === "me"
                                    ? "bg-primary dark:bg-cyan-600 text-white rounded-br-none"
                                    : "bg-gray-100 dark:bg-slate-700 text-text-primary dark:text-white rounded-bl-none"
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                              </div>
                              <div className={`flex items-center gap-1 mt-1 ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                                <span className="text-xs text-text-muted dark:text-slate-400">{message.time}</span>
                                {message.sender === "me" && (
                                  <svg className={`w-4 h-4 ${message.read ? "text-primary dark:text-cyan-400" : "text-gray-400 dark:text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex-shrink-0">
                    <div className="flex items-end gap-2">
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition flex-shrink-0" title="Attach File">
                        <svg className="w-6 h-6 text-text-muted dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>

                      <div className="flex-1 relative">
                        <textarea
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          rows="1"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-cyan-500 focus:border-transparent resize-none"
                          style={{ minHeight: '48px', maxHeight: '120px' }}
                        />
                      </div>

                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition flex-shrink-0" title="Emoji">
                        <svg className="w-6 h-6 text-text-muted dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>

                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="p-3 bg-primary dark:bg-cyan-600 text-white rounded-xl hover:bg-primary-dark dark:hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        title="Send Message"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">No conversation selected</h3>
                    <p className="text-text-muted dark:text-slate-400">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
