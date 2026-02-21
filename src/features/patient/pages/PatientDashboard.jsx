import React, { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useToast } from "../../../components/ui";
import { useLanguage, useAuth } from "../../../contexts";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { language, t } = useLanguage();
  const { logout, user } = useAuth();

  const activeTab = location.pathname.split("/").pop() || "overview";

  const languages = {
    en: { name: 'English', flag: '🇬🇧' },
    fi: { name: 'Suomi', flag: '🇫🇮' }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Use real user data from auth context
  const patientData = {
    name: user?.full_name || user?.username || "Patient",
    email: user?.email || "",
    assignedTherapist: "Dr. Sarah Johnson", // This could come from API later
    hasPrescription: true,
    completedExercises: 45,
    totalExercises: 60,
    averageAccuracy: 87,
    currentStreak: 7,
  };

  const notifications = [
    { id: 1, type: "success", message: "Shoulder Rotation completed successfully!", time: "5 mins ago" },
    { id: 2, type: "alert", message: "Your therapist suggested an alternative exercise", time: "1 hour ago" },
    { id: 3, type: "info", message: "New exercise added to your plan", time: "2 hours ago" },
    { id: 4, type: "success", message: "7-day streak achieved! Keep it up!", time: "1 day ago" },
  ];

  const navItems = [
    {
      id: "overview",
      label: t('dashboard.overview'),
      path: "/patient-dashboard/overview",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: "exercises",
      label: t('dashboard.exercises'),
      path: "/patient-dashboard/exercises",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
      )
    },
    {
      id: "prescriptions",
      label: t('dashboard.prescriptions'),
      path: "/patient-dashboard/prescriptions",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: "tracking",
      label: t('dashboard.liveTracking'),
      path: "/patient-dashboard/tracking",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: "history",
      label: t('dashboard.history'),
      path: "/patient-dashboard/history",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    // {
    //   id: "progress",
    //   label: t('dashboard.progress'),
    //   path: "/patient-dashboard/progress",
    //   icon: (
    //     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    //     </svg>
    //   )
    // },
    {
      id: "requests-reports",
      label: t('dashboard.requestsReports'),
      path: "/patient-dashboard/requests-reports",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: "chat",
      label: t('dashboard.chat'),
      path: "/patient-dashboard/chatbot",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      id: "ai-assistant",
      label: t('dashboard.aiAssistant'),
      path: "/patient-dashboard/ai-assistant",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: "profile",
      label: t('dashboard.profile'),
      path: "/patient-dashboard/profile",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      user={{
        name: patientData.name,
        role: t('patientDashboard.role') || "Patient"
      }}
      notifications={notifications}
      languages={languages}
      header={t(`dashboard.${activeTab}`) || activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      subHeader={`${t('dashboard.welcome')}, ${patientData.name}`}
    >
      <Outlet context={{ patientData }} />
    </DashboardLayout>
  );
}
