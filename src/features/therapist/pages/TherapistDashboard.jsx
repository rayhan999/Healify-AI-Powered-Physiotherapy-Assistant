import React, { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useLanguage, useAuth } from "../../../contexts";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

export default function TherapistDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  const activeTab = location.pathname.split("/").pop() || "overview";

  const languages = {
    en: {
      name: 'English',
      flag: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24" height="12">
        <clipPath id="s">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="t">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <g clipPath="url(#s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    },
    fi: {
      name: 'Suomi',
      flag: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 1100" width="24" height="14.6">
        <rect width="1800" height="1100" fill="#fff" />
        <rect width="1800" height="300" y="400" fill="#003580" />
        <rect width="300" height="1100" x="500" fill="#003580" />
      </svg>
    }
  };

  // Use real user data from auth context
  const therapistData = {
    name: user?.full_name || user?.username || "Therapist",
    email: user?.email || "",
    specialty: "Physiotherapy Specialist", // Could come from user profile later
    totalPatients: 24,
    activePatients: 18,
    pendingApprovals: 3,
    avgAdherence: 82,
  };

  const notifications = [
    { id: 1, type: "alert", message: "Jane Smith reported pain level 7 in Lower Back", time: "10 mins ago" },
    { id: 2, type: "warning", message: "Alternative exercise approval needed for Sarah Williams", time: "25 mins ago" },
    { id: 3, type: "success", message: "John Doe completed all exercises with 92% accuracy", time: "1 hour ago" },
    { id: 4, type: "info", message: "New patient registration: Mike Thompson", time: "2 hours ago" },
    { id: 5, type: "alert", message: "Tom Brown missed scheduled session", time: "3 hours ago" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Handlers
  const setActiveTab = (tab) => {
    if (tab === 'overview') {
      navigate('/therapist-dashboard');
    } else {
      navigate(`/therapist-dashboard/${tab}`);
    }
  };

  const navItems = [
    { id: "overview", label: t('therapistDashboard.nav.overview'), path: "/therapist-dashboard", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: "patients", label: t('therapistDashboard.nav.patients'), path: "/therapist-dashboard/patients", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { id: "prescriptions", label: t('therapistDashboard.nav.prescriptions'), path: "/therapist-dashboard/prescriptions", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { id: "monitoring", label: t('therapistDashboard.nav.monitoring'), path: "/therapist-dashboard/monitoring", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { id: "approvals", label: t('therapistDashboard.nav.approvals'), path: "/therapist-dashboard/approvals", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    // { id: "analytics", label: t('therapistDashboard.nav.analytics'), path: "/therapist-dashboard/analytics", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg> },
    { id: "chatbot", label: t('dashboard.chat'), path: "/therapist-dashboard/chatbot", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
    { id: "ai-assistant", label: t('dashboard.aiAssistant'), path: "/therapist-dashboard/ai-assistant", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
    { id: "profile", label: t('therapistDashboard.nav.profile'), path: "/therapist-dashboard/profile", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      user={{ name: therapistData.name, role: therapistData.specialty }}
      notifications={notifications}
      languages={languages}
      header={t(`dashboard.${activeTab}`) || activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      subHeader={`${t('dashboard.welcome')}, ${therapistData.name}`}
    >
      <Outlet context={{ therapistData, setActiveTab }} />
    </DashboardLayout>
  );
}
