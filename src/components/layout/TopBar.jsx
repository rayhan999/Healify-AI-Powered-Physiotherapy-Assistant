import React from "react";

export default function TopBar() {
  return (
    <div className="bg-healify-dark-blue dark:bg-slate-950 text-white text-xs sm:text-sm py-2 px-4 border-b border-healify-dark-blue/20 dark:border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6">
          <a href="tel:+358123456789" className="flex items-center gap-2 hover:text-healify-light-cyan dark:hover:text-cyan-400 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+358 123 456 789</span>
          </a>

          <a href="mailto:info@healify.com" className="flex items-center gap-2 hover:text-healify-light-cyan dark:hover:text-cyan-400 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">info@healify.com</span>
            <span className="sm:hidden">Email Us</span>
          </a>

          <div className="flex items-center gap-2 text-white/90 dark:text-slate-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden md:inline">Jyväskylä, Finland</span>
            <span className="md:hidden">Finland</span>
          </div>
        </div>

        <div className="text-white/90 dark:text-slate-300">
          <a href="https://healify.com" className="hover:text-healify-light-cyan dark:hover:text-cyan-400 transition">
            www.healify.com
          </a>
        </div>
      </div>
    </div>
  );
}
