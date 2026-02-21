import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { LandingPage, AboutPage, HelpSupport } from "./pages";
import { LoginPage, SignupPage } from "./features/auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PatientDashboard, PatientSettings, PatientProfile } from "./features/patient";
import MyPrescriptions from "./features/patient/pages/MyPrescriptions";
import { TherapistDashboard, TherapistSettings, TherapistProfile } from "./features/therapist";
import { MessagingPage } from "./features/messaging";
import { SubscriptionPage } from "./features/subscription";
import ExerciseTracker from "./features/exercise/pages/ExerciseTracker";
import ChatPage from "./features/chat/pages/ChatPage";
import AIAssistant from "./components/AIAssistant";
import NotificationList from "./pages/NotificationList";

// Import dashboard sections (will be exported from dashboard files)
import { OverviewSection as TherapistOverview } from "./features/therapist/components/sections/OverviewSection";
import { PatientsSection } from "./features/therapist/components/sections/PatientsSection";
import { PrescriptionsSection } from "./features/therapist/components/sections/PrescriptionsSection";
import { MonitoringSection } from "./features/therapist/components/sections/MonitoringSection";
import { ApprovalsSection } from "./features/therapist/components/sections/ApprovalsSection";
import { AnalyticsSection } from "./features/therapist/components/sections/AnalyticsSection";

// Import patient dashboard page components
import PatientOverview from "./features/patient/pages/Overview";
import ExercisesSection from "./features/patient/pages/Exercises";
import LiveTrackingSection from "./features/patient/pages/LiveTracking";
import SessionHistorySection from "./features/patient/pages/SessionHistory";
import ProgressReportSection from "./features/patient/pages/ProgressReport";
import PainAssessmentSection from "./features/patient/pages/PainAssessment";
import PatientProfileSection from "./features/patient/pages/Profile";

import { RootLayout } from "./components/layout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/help-support",
        element: <HelpSupport />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/about",
        element: <AboutPage userType="patient" />,
      },
      {
        path: "/therapist-about",
        element: <AboutPage userType="therapist" />,
      },
      // Patient Routes
      {
        element: <ProtectedRoute allowedRoles={["patient"]} />,
        children: [
          {
            path: "/patient-dashboard",
            element: <PatientDashboard />,
            children: [
              { index: true, element: <Navigate to="overview" replace /> },
              { path: "overview", element: <PatientOverview /> },
              { path: "exercises", element: <ExercisesSection /> },
              { path: "tracking", element: <LiveTrackingSection /> },
              { path: "history", element: <SessionHistorySection /> },
              { path: "progress", element: <ProgressReportSection /> },
              { path: "requests-reports", element: <PainAssessmentSection /> },
              { path: "chatbot", element: <ChatPage /> },
              { path: "ai-assistant", element: <AIAssistant userType="patient" /> },
              { path: "profile", element: <PatientProfileSection /> },
              { path: "prescriptions", element: <MyPrescriptions /> },
              { path: "tracking/exercise-tracker", element: <ExerciseTracker /> },
            ],
          },
          {
            path: "/patient-settings",
            element: <PatientSettings />,
          },
          {
            path: "/patient-profile",
            element: <PatientProfile />,
          },
          {
            path: "/patient-help-support",
            element: <HelpSupport userType="patient" userName="Patient User" />,
          },
          {
            path: "/messages",
            element: <MessagingPage userType="patient" />,
          },
          {
            path: "/notifications",
            element: <NotificationList />,
          },
          {
            path: "/subscription",
            element: <SubscriptionPage userType="patient" />,
          },
        ]
      },
      // Therapist Routes
      {
        element: <ProtectedRoute allowedRoles={["therapist"]} />,
        children: [
          {
            path: "/therapist-dashboard",
            element: <TherapistDashboard />,
            children: [
              { index: true, element: <Navigate to="overview" replace /> },
              { path: "overview", element: <TherapistOverview /> },
              { path: "patients", element: <PatientsSection /> },
              { path: "prescriptions", element: <PrescriptionsSection /> },
              { path: "monitoring", element: <MonitoringSection /> },
              { path: "approvals", element: <ApprovalsSection /> },
              { path: "analytics", element: <AnalyticsSection /> },
              { path: "chatbot", element: <ChatPage /> },
              { path: "ai-assistant", element: <AIAssistant userType="therapist" /> },
              { path: "profile", element: <TherapistProfile /> },
            ],
          },
          {
            path: "/therapist-settings",
            element: <TherapistSettings />,
          },
          {
            path: "/therapist-profile",
            element: <TherapistProfile />,
          },
          {
            path: "/therapist-help-support",
            element: <HelpSupport userType="therapist" userName="Therapist User" />,
          },
          {
            path: "/therapist-messages",
            element: <MessagingPage userType="therapist" />,
          },
          {
            path: "/therapist-notifications",
            element: <NotificationList />,
          },
          {
            path: "/therapist-subscription",
            element: <SubscriptionPage userType="therapist" />,
          },
        ]
      },

    ],
  },
]);
