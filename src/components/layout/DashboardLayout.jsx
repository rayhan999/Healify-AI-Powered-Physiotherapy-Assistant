import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, useAuth } from "../../contexts";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";

export function DashboardLayout({
  navItems,
  user,
  notifications,
  header,
  subHeader,
  children,
  languages
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex transition-colors duration-200">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navItems={navItems}
        logout={() => {
          logout();
          navigate("/login");
        }}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardTopBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          notificationOpen={notificationOpen}
          setNotificationOpen={setNotificationOpen}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          langOpen={langOpen}
          setLangOpen={setLangOpen}
          notificationRef={notificationRef}
          profileRef={profileRef}
          langRef={langRef}
          notifications={notifications}
          user={user}
          languages={languages}
          header={header}
          subHeader={subHeader}
        />

        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-slate-900 p-6 transition-colors duration-200">
          {children}
        </div>
      </main>
    </div>
  );
}
