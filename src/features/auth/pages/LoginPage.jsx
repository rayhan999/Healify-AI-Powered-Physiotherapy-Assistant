import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar } from "../../../components/layout";
import AuthIllustration from "../../../assets/AuthIllustration";
import { useLanguage, useAuth } from "../../../contexts";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please enter email and password");

    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      // Redirect based on the role returned from backend
      const userRole = user.role?.toLowerCase();
      
      if (userRole === "patient") {
        navigate("/patient-dashboard");
      } else if (userRole === "therapist") {
        navigate("/therapist-dashboard");
      } else {
        // Fallback or error if role is unknown
        setError("Unknown user role");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <NavBar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-stretch gap-8">
          <div className="hidden md:block md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
            <div className="relative h-full min-h-[480px]">
              <AuthIllustration />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end">
                <div className="p-8 text-white max-w-sm">
                  <h2 className="text-3xl font-bold">{t('auth.aiPoweredPartner')}</h2>
                  <p className="mt-2 text-sm">{t('auth.aiPoweredDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">{t('auth.welcomeBack')}</h1>
              <p className="text-text-muted dark:text-slate-400 mb-6">{t('auth.welcomeSubtitle')}</p>

              <button
                type="button"
                className="w-full mb-4 flex items-center justify-center gap-3 border border-border dark:border-slate-600 rounded-md py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                onClick={() => alert("Sign in with Google placeholder")}
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
                <span className="text-sm text-text-body dark:text-slate-300">{t('auth.signInWith')}</span>
              </button>

              <div className="flex items-center mb-5">
                <hr className="flex-grow border-border-light dark:border-slate-600" />
                <span className="px-2 text-text-muted dark:text-slate-400 text-sm">{t('auth.orDivider')}</span>
                <hr className="flex-grow border-border-light dark:border-slate-600" />
              </div>

              <form onSubmit={submit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-text-body dark:text-slate-300 text-sm mb-1">{t('auth.email')}</label>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    placeholder={t('auth.enterEmail')}
                    className="w-full border border-border dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-700 text-text-primary dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-text-body dark:text-slate-300 text-sm mb-1">{t('auth.password')}</label>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder={t('auth.enterPassword')}
                      className="w-full border border-border dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-700 text-text-primary dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan-400 transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>


                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-text-body dark:text-slate-300">
                    <input type="checkbox" className="accent-primary dark:accent-cyan-400" /> {t('auth.rememberMe')}
                  </label>
                  <button type="button" onClick={() => alert("Forgot password flow")} className="text-primary-light dark:text-cyan-400 hover:underline font-medium">
                    {t('auth.forgotPassword')}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary dark:bg-cyan-600 text-white py-2 rounded-md hover:bg-primary-dark dark:hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in..." : t('auth.login')}
                </button>
              </form>

              <p className="text-center text-text-muted dark:text-slate-400 text-sm mt-4">
                {t('auth.noAccount')}{" "}
                <button onClick={() => navigate("/signup")} className="text-primary dark:text-cyan-400 font-medium hover:underline">
                  {t('auth.signup')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
