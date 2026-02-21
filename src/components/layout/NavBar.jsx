import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { HealifyLogo } from "../ui";
import { useTheme } from "../../contexts";
import { useLanguage } from "../../contexts";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, changeLanguage, t } = useLanguage();

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <HealifyLogo size="sm" />
              <span className="font-semibold text-text-primary dark:text-white text-lg">Healify</span>
            </Link>
            <nav className="hidden md:flex items-center gap-2 ml-6">
              <Link
                to="/"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/'
                    ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/about' || location.pathname === '/therapist-about'
                    ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/subscription"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/subscription' || location.pathname === '/therapist-subscription'
                    ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {t('nav.pricing')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-2 items-center">
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/login'
                    ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {t('nav.signIn')}
              </Link>
              <Link
                to="/signup"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/signup'
                    ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {t('nav.signUp')}
              </Link>

              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="p-2 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200"
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
            </nav>

            <button
              className="md:hidden p-2 rounded-md focus:outline-none"
              onClick={() => setOpen(s => !s)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-text-body dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden py-2 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/'
                    ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/about' || location.pathname === '/therapist-about'
                    ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/subscription"
                onClick={() => setOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/subscription' || location.pathname === '/therapist-subscription'
                    ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {t('nav.pricing')}
              </Link>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/login'
                    ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {t('nav.signIn')}
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === '/signup'
                    ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {t('nav.signUp')}
              </Link>

              <div className="px-4 py-2">
                <p className="text-xs text-gray-500 dark:text-slate-500 mb-2">Language</p>
                <div className="flex flex-col gap-2">
                  {Object.entries(languages).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => {
                        changeLanguage(code);
                        setOpen(false);
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${language === code
                          ? 'text-primary dark:text-cyan-400 bg-primary/5 dark:bg-cyan-900/20'
                          : 'text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  toggleDarkMode();
                  setOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-2"
              >
                {darkMode ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Light Mode
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
