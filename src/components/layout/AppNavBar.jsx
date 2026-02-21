import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HealifyLogo } from "../ui";
import { useTheme } from "../../contexts";
import { useLanguage } from "../../contexts";
import NotificationBell from "../notifications/NotificationBell";

export default function AppNavBar({ userType = "patient", userName = "User" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const languages = {
    en: { name: 'English', flag: '🇬🇧' },
    fi: { name: 'Suomi', flag: '🇫🇮' }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const dashboardPath = userType === "patient" ? "/patient-dashboard" : "/therapist-dashboard";
  const profilePath = userType === "patient" ? "/patient-profile" : "/therapist-profile";
  const settingsPath = userType === "patient" ? "/patient-settings" : "/therapist-settings";
  const helpSupportPath = userType === "patient" ? "/patient-help-support" : "/therapist-help-support";
  const aiAssistantPath = userType === "patient" ? "/ai-assistant" : "/therapist-ai-assistant";
  const messagesPath = "/messages";
  const notificationsPath = "/notifications";

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-white dark:bg-gradient-to-br dark:from-cyan-700 dark:to-teal-600 rounded-full flex items-center justify-center shadow-md">
              <div className="w-10 h-10">
                <HealifyLogo size="md" className="w-full h-full" />
              </div>
            </div>
            <span className="text-xl font-bold text-text-primary dark:text-white">Healify</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(dashboardPath)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive(dashboardPath)
                ? "bg-primary dark:bg-cyan-600 text-white"
                : "text-text-muted dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-text-primary dark:hover:text-white"
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate(profilePath)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive(profilePath)
                ? "bg-primary dark:bg-cyan-600 text-white"
                : "text-text-muted dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-text-primary dark:hover:text-white"
                }`}
            >
              Profile
            </button>
            <button
              onClick={() => navigate(settingsPath)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive(settingsPath)
                ? "bg-primary dark:bg-cyan-600 text-white"
                : "text-text-muted dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-text-primary dark:hover:text-white"
                }`}
            >
              Settings
            </button>
            <button
              onClick={() => navigate(helpSupportPath)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive(helpSupportPath)
                ? "bg-primary dark:bg-cyan-600 text-white"
                : "text-text-muted dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-text-primary dark:hover:text-white"
                }`}
            >
              Help & Support
            </button>
            <button
              onClick={() => navigate(aiAssistantPath)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isActive(aiAssistantPath)
                ? "bg-primary dark:bg-cyan-600 text-white"
                : "text-text-muted dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-text-primary dark:hover:text-white"
                }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Assistant
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200"
                aria-label="Select language"
                title="Language"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50">
                  {Object.entries(languages).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => {
                        changeLanguage(code);
                        setLangOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 ${language === code ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20' : 'text-gray-700 dark:text-slate-300'
                        }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(messagesPath)}
              className={`relative p-2 rounded-lg transition-all ${isActive(messagesPath)
                ? "bg-primary/10 dark:bg-cyan-900/30 text-primary dark:text-cyan-400"
                : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              title="Messages"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            <NotificationBell />

            <div className="hidden md:flex items-center gap-3 ml-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-text-primary dark:text-white">{userName}</p>
                <p className="text-xs text-text-muted dark:text-slate-400 capitalize">{userType}</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 text-text-muted dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:inline font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
