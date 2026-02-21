import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppNavBar } from "../../../components/layout";
import { useToast, LoadingSpinner, ConfirmModal } from "../../../components/ui";

export default function TherapistSettings() {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeSection, setActiveSection] = useState("profile");
  const [profileImage, setProfileImage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match!");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    setIsSavingPassword(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Preferences saved successfully!");
    } catch (error) {
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Account deleted successfully");
      setShowDeleteModal(false);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
      throw error;
    }
  };

  const SettingSection = ({ id, icon, title, description }) => (
    <div
      onClick={() => setActiveSection(id)}
      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
        activeSection === id
          ? "bg-primary text-white shadow-lg scale-105"
          : "bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"
      }`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
        activeSection === id ? "bg-white/20" : "bg-white dark:bg-slate-700"
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className={`font-semibold ${activeSection === id ? "text-white" : "text-text-primary dark:text-slate-200"}`}>
          {title}
        </h3>
        <p className={`text-xs ${activeSection === id ? "text-white/80" : "text-text-muted dark:text-slate-400"}`}>
          {description}
        </p>
      </div>
      <svg className={`w-5 h-5 ${activeSection === id ? "text-white" : "text-gray-400 dark:text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <AppNavBar userType="therapist" userName="Therapist" />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate("/therapist-dashboard")}
              className="flex items-center gap-2 text-text-muted dark:text-slate-400 hover:text-primary dark:hover:text-cyan-300 transition mb-4"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-text-primary dark:text-cyan-300">Therapist Settings</h1>
            <p className="text-text-muted dark:text-slate-400 mt-2">Manage your professional profile and practice settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <SettingSection
                id="profile"
                icon={
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                title="Professional Profile"
                description="Update credentials and photo"
              />

              <SettingSection
                id="practice"
                icon={
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
                title="Practice Settings"
                description="Availability and consultation"
              />

              <SettingSection
                id="security"
                icon={
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                title="Security"
                description="Password and authentication"
              />

              <SettingSection
                id="notifications"
                icon={
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                }
                title="Notifications"
                description="Patient and system alerts"
              />

              <SettingSection
                id="billing"
                icon={
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                }
                title="Billing & Payments"
                description="Payment methods and invoices"
              />

              <SettingSection
                id="preferences"
                icon={
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                title="Preferences"
                description="Language and display settings"
              />

              <SettingSection
                id="subscription"
                icon={
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                }
                title="Subscription & Billing"
                description="Manage your plan and payments"
              />

              <SettingSection
                id="about"
                icon={
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="About & Support"
                description="Help center and information"
              />
            </div>

            <div className="lg:col-span-2">
              {activeSection === "profile" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">Professional Profile</h2>

                  <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-700 rounded-xl border border-blue-100 dark:border-slate-600">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-healify-light-cyan flex items-center justify-center border-4 border-white shadow-lg">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-text-primary dark:text-slate-200 text-lg">Professional Photo</h3>
                      <p className="text-sm text-text-muted dark:text-slate-400 mt-1">Upload a professional headshot</p>
                      <div className="flex gap-2 mt-3">
                        <label className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition cursor-pointer">
                          Upload New
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                        {profileImage && (
                          <button
                            onClick={() => setProfileImage(null)}
                            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Dr. Sarah Johnson"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Professional Title</label>
                      <input
                        type="text"
                        defaultValue="Physical Therapist"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">License Number</label>
                      <input
                        type="text"
                        defaultValue="PT-123456"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Years of Experience</label>
                      <input
                        type="number"
                        defaultValue="8"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Specializations</label>
                      <input
                        type="text"
                        defaultValue="Sports Injury, Orthopedic Rehabilitation, Pain Management"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Bio</label>
                      <textarea
                        rows="4"
                        defaultValue="Experienced physical therapist specializing in sports injury rehabilitation and orthopedic care."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSavingProfile ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      "Save Profile Changes"
                    )}
                  </button>
                </div>
              )}

              {activeSection === "practice" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">Practice Settings</h2>

                  <div className="p-6 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600">
                    <h3 className="font-bold text-lg text-text-primary dark:text-slate-200 mb-4">Consultation Rates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Initial Consultation</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3 text-gray-500 dark:text-slate-400">$</span>
                          <input
                            type="number"
                            defaultValue="150"
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Follow-up Session</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3 text-gray-500 dark:text-slate-400">$</span>
                          <input
                            type="number"
                            defaultValue="100"
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600">
                    <h3 className="font-bold text-lg text-text-primary dark:text-slate-200 mb-4">Availability Schedule</h3>
                    <div className="space-y-3">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="flex items-center gap-4">
                          <div className="w-32">
                            <span className="text-sm font-medium dark:text-slate-200">{day}</span>
                          </div>
                          <input
                            type="time"
                            defaultValue="09:00"
                            className="px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                          />
                          <span className="text-text-muted dark:text-slate-400">to</span>
                          <input
                            type="time"
                            defaultValue="17:00"
                            className="px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                          />
                          <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600">
                    <h3 className="font-bold text-lg text-text-primary dark:text-slate-200 mb-4">Appointment Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Session Duration</label>
                        <select className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary">
                          <option>30 minutes</option>
                          <option selected>45 minutes</option>
                          <option>60 minutes</option>
                          <option>90 minutes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Max Patients Per Day</label>
                        <input
                          type="number"
                          defaultValue="12"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary transition"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success("Practice settings saved successfully!")}
                    className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition">
                    Save Practice Settings
                  </button>
                </div>
              )}

              {activeSection === "security" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">Security Settings</h2>

                  <div className="p-6 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600">
                    <h3 className="font-bold text-lg text-text-primary dark:text-slate-200 mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          required
                        />
                      </div>
                      {passwordError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {passwordError}
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={isSavingPassword}
                        className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSavingPassword ? (
                          <>
                            <LoadingSpinner size="sm" color="white" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-900">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary dark:text-slate-200">Two-Factor Authentication</h3>
                          <p className="text-sm text-text-muted dark:text-slate-400 mt-1">Protect patient data with enhanced security</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white text-sm rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "notifications" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">Notification Preferences</h2>

                  <NotificationToggle
                    title="New Patient Requests"
                    description="Get notified when a new patient requests an appointment"
                    defaultChecked={true}
                  />
                  <NotificationToggle
                    title="Appointment Reminders"
                    description="Receive reminders before upcoming sessions"
                    defaultChecked={true}
                  />
                  <NotificationToggle
                    title="Patient Messages"
                    description="Notifications when patients send messages"
                    defaultChecked={true}
                  />
                  <NotificationToggle
                    title="Exercise Compliance Alerts"
                    description="Get alerted when patient adherence drops below threshold"
                    defaultChecked={true}
                  />
                  <NotificationToggle
                    title="Pain Level Alerts"
                    description="Notifications for significant pain level changes"
                    defaultChecked={true}
                  />
                  <NotificationToggle
                    title="AI Analysis Reports"
                    description="Receive AI-generated patient progress reports"
                    defaultChecked={false}
                  />
                </div>
              )}

              {activeSection === "billing" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">Billing & Payments</h2>

                  <div className="p-6 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600">
                    <h3 className="font-bold text-lg text-text-primary dark:text-slate-200 mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-blue-600 dark:bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
                            VISA
                          </div>
                          <div>
                            <p className="font-semibold text-sm dark:text-slate-200">•••• •••• •••• 4242</p>
                            <p className="text-xs text-text-muted dark:text-slate-400">Expires 12/25</p>
                          </div>
                        </div>
                        <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">Remove</button>
                      </div>
                      <button className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-primary hover:bg-blue-50 dark:hover:bg-slate-700 transition text-sm font-semibold text-text-muted dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400">
                        + Add Payment Method
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-900">
                    <h3 className="font-bold text-lg text-text-primary dark:text-slate-200 mb-4">Payout Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Bank Account</label>
                        <input
                          type="text"
                          defaultValue="Chase Bank - ****4567"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Payout Schedule</label>
                        <select className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary">
                          <option>Weekly</option>
                          <option selected>Bi-weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-text-primary dark:text-slate-200">Recent Invoices</h3>
                      <button className="text-sm text-primary dark:text-cyan-400 hover:underline">View All</button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg text-sm dark:text-slate-200">
                        <span>October 2024</span>
                        <span className="font-semibold">$3,450.00</span>
                        <button className="text-primary dark:text-cyan-400 hover:underline">Download</button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg text-sm dark:text-slate-200">
                        <span>September 2024</span>
                        <span className="font-semibold">$3,200.00</span>
                        <button className="text-primary dark:text-cyan-400 hover:underline">Download</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "preferences" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">Preferences</h2>

                  <div>
                    <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Language</label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Finnish</option>
                      <option>Swedish</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Time Zone</label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition">
                      <option>Eastern Time (ET)</option>
                      <option>Pacific Time (PT)</option>
                      <option>Central Time (CT)</option>
                      <option>Mountain Time (MT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-body dark:text-slate-300 mb-2">Date Format</label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <NotificationToggle
                    title="Dark Mode"
                    description="Enable dark theme for reduced eye strain"
                    defaultChecked={false}
                  />

                  <NotificationToggle
                    title="Email Digest"
                    description="Receive daily summary of patient activities"
                    defaultChecked={true}
                  />

                  <button
                    onClick={handleSavePreferences}
                    disabled={isSavingPreferences}
                    className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSavingPreferences ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </button>
                </div>
              )}

              {activeSection === "subscription" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">Subscription & Billing</h2>

                  <div className="p-6 bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-900 dark:to-cyan-800 rounded-xl text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">Professional Plan</h3>
                        <p className="text-white/90 text-sm mt-1">Active subscription</p>
                      </div>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">ACTIVE</span>
                    </div>
                    <p className="text-white/90">Next billing: March 24, 2024</p>
                    <p className="text-white/90">$99.99/month</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate("/therapist-subscription#pricing-plans")}
                      className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
                    >
                      View Full Subscription Details
                    </button>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600">
                    <h3 className="font-bold text-lg text-text-primary dark:text-slate-200 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate("/therapist-subscription#pricing-plans")}
                        className="w-full py-3 bg-white dark:bg-slate-800 text-text-primary dark:text-slate-200 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition text-sm font-semibold">
                        Upgrade Plan
                      </button>
                      <button
                        onClick={() => toast.info("Payment method update feature coming soon! Please contact support for assistance.")}
                        className="w-full py-3 bg-white dark:bg-slate-800 text-text-primary dark:text-slate-200 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition text-sm font-semibold">
                        Update Payment Method
                      </button>
                      <button
                        onClick={() => toast.success("Your billing history has been sent to your email address.")}
                        className="w-full py-3 bg-white dark:bg-slate-800 text-text-primary dark:text-slate-200 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition text-sm font-semibold">
                        View Billing History
                      </button>
                      <button
                        onClick={() => toast.warning("To cancel your subscription, please contact our support team at support@healify.com")}
                        className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition text-sm font-semibold">
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "about" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">About & Support</h2>

                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-700 rounded-xl border border-blue-100 dark:border-slate-600">
                    <h3 className="font-bold text-text-primary dark:text-slate-200 mb-2">Need Help?</h3>
                    <p className="text-sm text-text-muted dark:text-slate-400 mb-4">Visit our comprehensive help center with FAQs, guides, and contact information</p>
                    <button
                      onClick={() => navigate("/therapist-help-support")}
                      className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
                    >
                      Visit Help Center
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-primary dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h4 className="font-semibold text-text-primary dark:text-slate-200">Priority Support</h4>
                      </div>
                      <p className="text-sm text-text-muted dark:text-slate-400">support@healify.com</p>
                      <p className="text-xs text-text-muted dark:text-slate-400 mt-1">24/7 dedicated support for professionals</p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-primary dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <h4 className="font-semibold text-text-primary dark:text-slate-200">Account Manager</h4>
                      </div>
                      <p className="text-sm text-text-muted dark:text-slate-400">+1 (555) 123-4567</p>
                      <p className="text-xs text-text-muted dark:text-slate-400 mt-1">Available 24/7</p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                      <h4 className="font-semibold text-text-primary dark:text-slate-200 mb-2">App Version</h4>
                      <p className="text-sm text-text-muted dark:text-slate-400">Healify Professional v2.1.0</p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                      <h4 className="font-semibold text-text-primary dark:text-slate-200 mb-3">Legal & Compliance</h4>
                      <div className="space-y-2">
                        <button className="text-sm text-primary dark:text-cyan-400 hover:underline block">Professional Terms of Service</button>
                        <button className="text-sm text-primary dark:text-cyan-400 hover:underline block">Privacy Policy</button>
                        <button className="text-sm text-primary dark:text-cyan-400 hover:underline block">HIPAA Compliance</button>
                        <button className="text-sm text-primary dark:text-cyan-400 hover:underline block">Liability Insurance Info</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your professional account? This action cannot be undone and all your data including patient records will be permanently removed."
        confirmText="Delete Account"
        cancelText="Cancel"
        type="danger"
        requirePassword={true}
      />
    </div>
  );
}

function NotificationToggle({ title, description, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
      <div className="flex-1">
        <h4 className="font-semibold text-text-primary dark:text-slate-200">{title}</h4>
        <p className="text-sm text-text-muted dark:text-slate-400 mt-1">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          checked ? "bg-primary" : "bg-gray-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
            checked ? "transform translate-x-7" : ""
          }`}
        />
      </button>
    </div>
  );
}
