import React from "react";
import { DarkModeToggle } from "../ui";
import { useLanguage } from "../../contexts";
import NotificationBell from "../notifications/NotificationBell";

export function DashboardTopBar({
  sidebarOpen,
  setSidebarOpen,
  profileOpen,
  setProfileOpen,
  langOpen,
  setLangOpen,
  profileRef,
  langRef,
  user = { name: "User", role: "User" },
  languages,
  subHeader,
  header,
}) {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 px-8 py-4 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition text-text-primary dark:text-slate-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-cyan-300">
            {header}
          </h2>
          <p className="text-sm text-text-muted dark:text-slate-400">
            {subHeader}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
          >
            <span className="text-xl">{languages[language]?.flag}</span>
            <span className="text-sm font-medium text-text-primary dark:text-slate-200">{languages[language]?.name}</span>
            <svg className={`w-4 h-4 text-gray-500 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
            </svg>
          </button>

          {langOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2">
              {Object.entries(languages).map(([code, lang]) => (
                <button
                  key={code}
                  onClick={() => {
                    changeLanguage(code);
                    setLangOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition
                    ${language === code ? 'bg-primary/5 text-primary dark:text-cyan-300' : 'text-text-primary dark:text-slate-200'}
                  `}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {language === code && (
                    <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <DarkModeToggle />

        <NotificationBell />

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-xl transition"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-healify-light-cyan rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-bold text-text-primary dark:text-slate-200">{user.name}</p>
              <p className="text-xs text-text-muted dark:text-slate-400">{user.role}</p>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                <p className="font-bold text-text-primary dark:text-cyan-300">{user.name}</p>
                <p className="text-xs text-text-muted dark:text-slate-400">{user.role}</p>
              </div>
              <div className="p-2">
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-sm text-text-primary dark:text-slate-200 transition flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('therapistDashboard.profileSettings')}
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-sm text-text-primary dark:text-slate-200 transition flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('therapistDashboard.profile.preferences')}
                </button>
                <div className="h-px bg-gray-100 dark:bg-slate-700 my-2"></div>
                {/* Logout button removed from here as it's usually handled by parent or sidebar, but keeping for consistency if needed */}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
