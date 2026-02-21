import React from "react";
import { NavLink } from "react-router-dom";
import { HealifyLogo } from "../ui";
import { useLanguage } from "../../contexts";

export function DashboardSidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  navItems, 
  logout,
  title = "Healify" 
}) {
  const { t } = useLanguage();

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-healify-dark-blue dark:bg-gradient-to-b dark:from-[#0a3d4a] dark:to-[#024B87] text-white transition-all duration-300 flex flex-col relative z-20`}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {sidebarOpen && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="w-10 h-10">
                <HealifyLogo size="md" className="w-full h-full" />
              </div>
            </div>
            <span className="font-bold text-lg">{title}</span>
          </div>
        )}
        {!sidebarOpen && (
          <div className="flex justify-center w-full">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="w-10 h-10">
                <HealifyLogo size="md" className="w-full h-full" />
              </div>
            </div>
          </div>
        )}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto !overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path || (item.id === "overview" ? "" : item.id)}
            end={item.id === "overview"}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${isActive
                ? "bg-primary text-white shadow-lg font-bold"
                : "text-white/80 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <div className={`${!sidebarOpen && "mx-auto"}`}>
              {item.icon}
            </div>
            {sidebarOpen && <span>{item.label}</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
            {item.badge && sidebarOpen && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
            {item.badge && !sidebarOpen && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-300 hover:bg-white/10 hover:text-red-200 w-full ${!sidebarOpen && "justify-center"}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {sidebarOpen && <span>{t('common.logout')}</span>}
        </button>
      </div>
    </aside>
  );
}
