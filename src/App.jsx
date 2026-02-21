import React from "react";
import { RouterProvider } from "react-router-dom";
import { ToastProvider } from "./components/ui";
import { ThemeProvider, LanguageProvider, AuthProvider, NotificationProvider } from "./contexts";
import { router } from "./router";

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <NotificationProvider>
              <RouterProvider router={router} />
            </NotificationProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

// just commneted out this line