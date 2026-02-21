import React, { useState, useEffect } from "react";
import { AppNavBar } from "../components/layout";

export default function HelpSupport({ userType = "patient", userName = "User" }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'faq', 'guides', 'contact'].includes(hash)) {
      setActiveSection(hash);
    }
  }, []);

  const patientFaqs = [
    {
      id: 1,
      question: "How do I start my first exercise session?",
      answer: "Navigate to 'Exercises' from the sidebar, select an exercise from your prescribed plan, then tap 'Start Session'. Position your camera so your full body is visible, and the AI Coach will guide you through the exercise with real-time feedback.",
    },
    {
      id: 2,
      question: "What if the AI can't detect my posture correctly?",
      answer: "Ensure you have good lighting and your full body is visible in the frame. Stand 5-6 feet away from the camera. If issues persist, try adjusting camera angle or check our Camera Setup Guide in Video Tutorials.",
    },
    {
      id: 3,
      question: "How do I report pain during exercises?",
      answer: "If you experience pain, stop the exercise immediately. You can report pain through the 'Pain Report' section in the sidebar. Rate the pain level (1-10), select the body area, and describe what you felt. Your therapist will be notified instantly.",
    },
    {
      id: 4,
      question: "What does my accuracy score mean?",
      answer: "Your accuracy score (0-100%) measures how closely your movements match the correct form. 80%+ is excellent, 60-79% is good, below 60% means you should review the technique or contact your therapist for guidance.",
    },
    {
      id: 5,
      question: "How do I contact my therapist?",
      answer: "You can view your assigned therapist in the Overview section. For urgent matters, use the 'Send Summary to Therapist' option. For routine questions, send a message through your patient profile, and they'll respond within 24 hours.",
    },
    {
      id: 6,
      question: "What happens if I miss a session?",
      answer: "Don't worry! Your plan is flexible. You can complete missed sessions the next day. However, consistency is important for recovery. If you need to skip multiple sessions, inform your therapist so they can adjust your plan.",
    },
  ];

  const therapistFaqs = [
    {
      id: 1,
      question: "How do I create a new prescription for a patient?",
      answer: "Go to 'Prescriptions' → 'Create New Prescription'. Search our exercise database or use AI recommendations based on the patient's condition. Assign exercises, set reps/sets/frequency, then save and send to the patient.",
    },
    {
      id: 2,
      question: "How do I respond to pain alerts?",
      answer: "Pain alerts appear in your dashboard notifications with an 'Urgent' tag. Click to view details including pain level, location, and when it occurred. Review the patient's recent activity, then approve safer alternatives or adjust the plan immediately.",
    },
    {
      id: 3,
      question: "What do the adherence metrics mean?",
      answer: "Adherence shows the percentage of prescribed exercises completed on time. 80%+ is excellent, 60-79% needs encouragement, below 60% requires intervention. Check the Analytics section for detailed patient engagement trends.",
    },
    {
      id: 4,
      question: "How do I approve alternative exercises?",
      answer: "When the AI suggests an alternative due to pain or difficulty, you'll receive a notification. Review the suggestion, check patient history, then click 'Approve' or 'Suggest Custom Alternative'. Changes update instantly in the patient's plan.",
    },
    {
      id: 5,
      question: "Can I manage multiple patients efficiently?",
      answer: "Yes! Use the 'My Patients' tab to see all patients at a glance. Sort by adherence, recent activity, or alerts. Set up notification preferences to focus on urgent matters. The Morning Briefing gives you a quick daily overview.",
    },
    {
      id: 6,
      question: "How do I access evidence-based guidelines?",
      answer: "Use the AI Assistant chatbot to query research, best practices, and clinical guidelines. It has access to up-to-date physiotherapy literature and can provide evidence-based recommendations for treatment planning.",
    },
  ];

  const troubleshootingGuides = [
    {
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: "Camera Not Detected",
      steps: [
        "Check browser permissions (allow camera access)",
        "Try a different browser (Chrome recommended)",
        "Restart your device",
        "Ensure no other app is using the camera",
      ],
    },
    {
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "AI Tracking Inaccurate",
      steps: [
        "Improve lighting (natural light works best)",
        "Ensure full body is visible in frame",
        "Stand 5-6 feet from camera",
        "Remove clutter from background",
        "Wear fitted clothing (not loose/baggy)",
      ],
    },
    {
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: "Notifications Not Working",
      steps: [
        "Enable notifications in browser settings",
        "Check notification preferences in Settings",
        "Verify email address is correct",
        "Check spam/junk folder for emails",
      ],
    },
    {
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "App Running Slow",
      steps: [
        "Close unnecessary browser tabs",
        "Clear browser cache and cookies",
        "Check internet connection speed",
        "Update browser to latest version",
        "Try using a different device",
      ],
    },
  ];

  const contactCategories = [
    "Technical Issue",
    "Exercise Question",
    "Billing & Subscription",
    "Account Access",
    "Feature Request",
    "Bug Report",
    "General Inquiry",
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(
      `Support ticket submitted!\n\nCategory: ${contactForm.category}\nSubject: ${contactForm.subject}\n\nOur team will respond within 24 hours to your registered email.`
    );
    setContactForm({ subject: "", category: "", message: "" });
  };

  const faqs = userType === "patient" ? patientFaqs : therapistFaqs;

  return (
    <>
      <AppNavBar userType={userType} userName={userName} />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-4">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-gradient-to-r from-healify-dark-blue via-primary to-healify-light-cyan dark:from-slate-800 dark:via-slate-700 dark:to-slate-700 text-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Help & Support Center</h1>
            <p className="text-white/90 text-lg">
              We're here to help you every step of your recovery journey
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <button
            onClick={() => setActiveSection("overview")}
            className={`p-4 rounded-lg transition ${
              activeSection === "overview"
                ? "bg-white dark:bg-cyan-600 text-primary dark:text-white"
                : "bg-white/10 hover:bg-white/20 dark:bg-slate-600/50 dark:hover:bg-slate-600"
            }`}
          >
            <div className="flex justify-center mb-2">
              <svg className={`w-8 h-8 ${activeSection === "overview" ? "text-primary dark:text-white" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="font-semibold text-sm">Overview</div>
          </button>
          <button
            onClick={() => setActiveSection("faq")}
            className={`p-4 rounded-lg transition ${
              activeSection === "faq"
                ? "bg-white dark:bg-cyan-600 text-primary dark:text-white"
                : "bg-white/10 hover:bg-white/20 dark:bg-slate-600/50 dark:hover:bg-slate-600"
            }`}
          >
            <div className="flex justify-center mb-2">
              <svg className={`w-8 h-8 ${activeSection === "faq" ? "text-primary dark:text-white" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="font-semibold text-sm">FAQs</div>
          </button>
          <button
            onClick={() => setActiveSection("troubleshoot")}
            className={`p-4 rounded-lg transition ${
              activeSection === "troubleshoot"
                ? "bg-white dark:bg-cyan-600 text-primary dark:text-white"
                : "bg-white/10 hover:bg-white/20 dark:bg-slate-600/50 dark:hover:bg-slate-600"
            }`}
          >
            <div className="flex justify-center mb-2">
              <svg className={`w-8 h-8 ${activeSection === "troubleshoot" ? "text-primary dark:text-white" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="font-semibold text-sm">Troubleshoot</div>
          </button>
          <button
            onClick={() => setActiveSection("contact")}
            className={`p-4 rounded-lg transition ${
              activeSection === "contact"
                ? "bg-white dark:bg-cyan-600 text-primary dark:text-white"
                : "bg-white/10 hover:bg-white/20 dark:bg-slate-600/50 dark:hover:bg-slate-600"
            }`}
          >
            <div className="flex justify-center mb-2">
              <svg className={`w-8 h-8 ${activeSection === "contact" ? "text-primary dark:text-white" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="font-semibold text-sm">Contact Us</div>
          </button>
        </div>
      </div>

      {activeSection === "overview" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary dark:text-cyan-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">
                Getting Started
              </h3>
            </div>
            <ul className="space-y-3">
              {userType === "patient" ? (
                <>
                  <li className="flex items-start gap-3 text-text-body dark:text-slate-200">
                    <span className="text-primary dark:text-cyan-300 mt-1">•</span>
                    <span>Complete your profile with medical history</span>
                  </li>
                  <li className="flex items-start gap-3 text-text-body dark:text-slate-200">
                    <span className="text-primary dark:text-cyan-300 mt-1">•</span>
                    <span>Set up your camera for exercise tracking</span>
                  </li>
                  <li className="flex items-start gap-3 text-text-body dark:text-slate-200">
                    <span className="text-primary dark:text-cyan-300 mt-1">•</span>
                    <span>Review exercises prescribed by your therapist</span>
                  </li>
                  <li className="flex items-start gap-3 text-text-body dark:text-slate-200">
                    <span className="text-primary dark:text-cyan-300 mt-1">•</span>
                    <span>Start your first session with AI guidance</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-3 text-text-body dark:text-slate-200">
                    <span className="text-primary dark:text-cyan-300 mt-1">•</span>
                    <span>Verify your license and complete profile</span>
                  </li>
                  <li className="flex items-start gap-3 text-text-body dark:text-slate-200">
                    <span className="text-primary dark:text-cyan-300 mt-1">•</span>
                    <span>Add patients via email invitation</span>
                  </li>
                  <li className="flex items-start gap-3 text-text-body dark:text-slate-200">
                    <span className="text-primary dark:text-cyan-300 mt-1">•</span>
                    <span>Create your first exercise prescription</span>
                  </li>
                  <li className="flex items-start gap-3 text-text-body dark:text-slate-200">
                    <span className="text-primary dark:text-cyan-300 mt-1">•</span>
                    <span>Monitor patient progress daily</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-healify-light-cyan/10 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-healify-light-cyan dark:text-cyan-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">
                Video Tutorials
              </h3>
            </div>
            <div className="space-y-3">
              <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-left transition flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 dark:bg-cyan-900/30 rounded flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary dark:text-cyan-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary dark:text-slate-200">
                    Camera Setup Guide
                  </p>
                  <p className="text-sm text-text-muted dark:text-slate-400">3:24 min</p>
                </div>
              </button>
              <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-left transition flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 dark:bg-cyan-900/30 rounded flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary dark:text-cyan-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary dark:text-slate-200">
                    {userType === "patient"
                      ? "Your First Exercise Session"
                      : "Creating Prescriptions"}
                  </p>
                  <p className="text-sm text-text-muted dark:text-slate-400">5:12 min</p>
                </div>
              </button>
              <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-left transition flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 dark:bg-cyan-900/30 rounded flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary dark:text-cyan-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary dark:text-slate-200">
                    Dashboard Navigation
                  </p>
                  <p className="text-sm text-text-muted dark:text-slate-400">4:08 min</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-healify-light-cyan text-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Quick Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Email Support</p>
                  <p className="text-sm text-white/80">support@healify.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Phone Support</p>
                  <p className="text-sm text-white/80">1-800-HEALIFY</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Support Hours</p>
                  <p className="text-sm text-white/80">Mon-Fri: 9AM - 6PM EST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-healify-dark-blue/10 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-healify-dark-blue dark:text-cyan-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">Resources</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-primary dark:text-cyan-300 hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>User Guide (PDF)</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-primary dark:text-cyan-300 hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  <span>Exercise Library</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-primary dark:text-cyan-300 hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Privacy & Security</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-primary dark:text-cyan-300 hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Mobile App (Coming Soon)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeSection === "faq" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden hover:border-primary dark:hover:border-cyan-600 transition"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                  }
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  <span className="font-semibold text-text-primary dark:text-slate-200 pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-primary dark:text-cyan-300 transition-transform flex-shrink-0 ${
                      expandedFaq === faq.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedFaq === faq.id && (
                  <div className="p-4 pt-0 bg-gray-50 dark:bg-slate-700">
                    <p className="text-text-body dark:text-slate-200">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-healify-light-cyan/10 dark:from-cyan-900/30 dark:to-cyan-900/20 rounded-lg border border-primary/20 dark:border-cyan-900">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary dark:bg-cyan-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-primary dark:text-cyan-300 text-lg">
                  Still have questions?
                </h3>
                <p className="text-text-muted dark:text-slate-400">
                  Can't find what you're looking for? Contact our support team.
                </p>
              </div>
              <button
                onClick={() => setActiveSection("contact")}
                className="px-6 py-3 bg-primary dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-dark dark:hover:bg-cyan-700 transition font-semibold"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === "troubleshoot" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">
            Troubleshooting Guide
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {troubleshootingGuides.map((guide, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-slate-600 rounded-lg p-6 hover:border-primary dark:hover:border-cyan-600 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                    {React.cloneElement(guide.icon, {
                      className: "w-8 h-8 text-primary dark:text-cyan-300"
                    })}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary dark:text-cyan-300">
                    {guide.title}
                  </h3>
                </div>
                <ol className="space-y-2">
                  {guide.steps.map((step, stepIndex) => (
                    <li
                      key={stepIndex}
                      className="flex items-start gap-3 text-text-body dark:text-slate-200"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 dark:bg-cyan-900/30 rounded-full flex items-center justify-center text-primary dark:text-cyan-300 text-sm font-semibold">
                        {stepIndex + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="mt-6 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h4 className="font-bold text-red-800 dark:text-red-300 mb-1">
                  Experiencing Severe Pain?
                </h4>
                <p className="text-red-700 dark:text-red-400 mb-3">
                  If you're experiencing severe or unusual pain during exercises,
                  stop immediately and contact your therapist or healthcare
                  provider. Do not continue with exercises that cause pain.
                </p>
                <button className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition font-semibold">
                  Report Emergency
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "contact" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-text-primary dark:text-cyan-300 mb-6">
            Contact Support Team
          </h2>

          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-body dark:text-slate-300 font-semibold mb-2">
                  Category
                </label>
                <select
                  value={contactForm.category}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, category: e.target.value })
                  }
                  className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan-600 transition"
                  required
                >
                  <option value="">Select a category</option>
                  {contactCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-body dark:text-slate-300 font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  placeholder="Brief description of your issue"
                  className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan-600 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-text-body dark:text-slate-300 font-semibold mb-2">
                Message
              </label>
              <textarea
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                placeholder="Please describe your issue in detail..."
                rows={6}
                className="w-full border border-border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan-600 transition resize-none"
                required
              />
              <p className="text-sm text-text-muted dark:text-slate-400 mt-2">
                We typically respond within 24 hours during business days.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="px-8 py-3 bg-primary dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-dark dark:hover:bg-cyan-700 transition font-semibold shadow-lg hover:shadow-xl"
              >
                Submit Ticket
              </button>
              <button
                type="button"
                onClick={() =>
                  setContactForm({ subject: "", category: "", message: "" })
                }
                className="px-8 py-3 bg-gray-100 dark:bg-slate-700 text-text-body dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition font-semibold"
              >
                Clear Form
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-600">
            <h3 className="text-lg font-bold text-text-primary dark:text-cyan-300 mb-4">
              Other Ways to Reach Us
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-primary dark:text-cyan-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <h4 className="font-semibold text-text-primary dark:text-slate-200">Live Chat</h4>
                </div>
                <p className="text-sm text-text-muted dark:text-slate-400 mb-3">
                  Chat with our support team in real-time
                </p>
                <button className="text-primary dark:text-cyan-300 font-semibold text-sm hover:underline">
                  Start Chat →
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-primary dark:text-cyan-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <h4 className="font-semibold text-text-primary dark:text-slate-200">
                    Knowledge Base
                  </h4>
                </div>
                <p className="text-sm text-text-muted dark:text-slate-400 mb-3">
                  Browse articles and documentation
                </p>
                <button className="text-primary dark:text-cyan-300 font-semibold text-sm hover:underline">
                  Browse Articles →
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-primary dark:text-cyan-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  <h4 className="font-semibold text-text-primary dark:text-slate-200">Community</h4>
                </div>
                <p className="text-sm text-text-muted dark:text-slate-400 mb-3">
                  Join our user community forum
                </p>
                <button className="text-primary dark:text-cyan-300 font-semibold text-sm hover:underline">
                  Join Forum →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </>
  );
}
