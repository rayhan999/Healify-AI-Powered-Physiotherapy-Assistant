import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar, NavBar, Footer } from "../components/layout";
import { useLanguage } from "../contexts";

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <TopBar />
      <NavBar />

      <section className="relative bg-gradient-to-br from-healify-dark-blue via-primary to-healify-light-cyan dark:from-slate-900 dark:via-cyan-950 dark:to-slate-800 min-h-screen flex items-center py-20 px-4 overflow-hidden animate-gradientShift">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 dark:bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-healify-light-cyan/20 dark:bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white/5 dark:bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 mb-6 animate-fadeInDown">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-sm font-semibold">{t('landing.hero.badge')}</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight animate-fadeInUp delay-100">
                {t('landing.hero.title')}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-healify-light-cyan to-white animate-pulse">
                  {t('landing.hero.titleHighlight')}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl animate-fadeInUp delay-200">
                {t('landing.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fadeInUp delay-300">
                <button
                  onClick={() => navigate("/signup")}
                  className="px-10 py-5 bg-white text-primary font-bold text-lg rounded-xl hover:shadow-2xl hover-glow transition-all duration-300 transform hover:scale-110"
                >
                  {t('landing.hero.ctaPatient')}
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-10 py-5 bg-transparent border-3 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
                >
                  {t('landing.hero.ctaTherapist')}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 animate-fadeInUp delay-400">
                <div className="text-center hover-lift">
                  <p className="text-4xl md:text-5xl font-black">{t('landing.hero.trustBadge1').split(' ')[0]}</p>
                  <p className="text-white/80 text-sm mt-1">{t('landing.hero.trustBadge1').split(' ').slice(1).join(' ')}</p>
                </div>
                <div className="text-center hover-lift">
                  <p className="text-4xl md:text-5xl font-black">{t('landing.hero.trustBadge3').split(' ')[0]}</p>
                  <p className="text-white/80 text-sm mt-1">{t('landing.hero.trustBadge3').split(' ').slice(1).join(' ')}</p>
                </div>
                <div className="text-center hover-lift">
                  <p className="text-4xl md:text-5xl font-black">24/7</p>
                  <p className="text-white/80 text-sm mt-1">AI Support</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute top-0 right-0 z-20 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-300 animate-fadeInRight delay-500 hover-lift animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{t('landing.hero.floatingCard1Title')}</p>
                    <p className="text-white/80 text-sm">{t('landing.hero.floatingCard1Subtitle')}</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-40 left-0 z-20 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-300 animate-fadeInLeft delay-600 hover-lift animate-float" style={{ animationDelay: '1.6s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{t('landing.hero.floatingCard2Title')}</p>
                    <p className="text-white/80 text-sm">{t('landing.hero.floatingCard2Subtitle')}</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-20 z-20 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-300 animate-fadeInRight delay-700 hover-lift animate-float" style={{ animationDelay: '2.1s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{t('landing.hero.floatingCard3Title')}</p>
                    <p className="text-white/80 text-sm">{t('landing.hero.floatingCard3Subtitle')}</p>
                  </div>
                </div>
              </div>

              <div className="relative h-full flex items-center justify-center z-10">
                <div className="w-80 h-80 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                    <svg className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary dark:text-white mb-4">
              {t('landing.howItWorks.title')} <span className="text-primary dark:text-cyan-400">{t('landing.howItWorks.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-text-muted dark:text-slate-300 max-w-2xl mx-auto">
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white dark:bg-slate-900 hover:bg-gradient-to-br hover:from-primary hover:to-healify-light-cyan dark:hover:from-cyan-800 dark:hover:to-teal-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 animate-slideInScale hover:animate-[shake_1s_ease-in-out_infinite]">
              <div className="w-16 h-16 bg-healify-light-cyan/20 dark:bg-cyan-900/30 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary dark:text-cyan-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary dark:text-white group-hover:text-white mb-4">
                {t('landing.howItWorks.card1Title')}
              </h3>
              <ul className="space-y-3 text-text-body dark:text-slate-300 group-hover:text-white">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card1Point1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card1Point2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card1Point3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card1Point4')}</span>
                </li>
              </ul>
            </div>

            <div className="group bg-white dark:bg-slate-900 hover:bg-gradient-to-br hover:from-primary hover:to-healify-light-cyan dark:hover:from-cyan-800 dark:hover:to-teal-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform md:scale-105 animate-slideInScale delay-200 hover:animate-[shake_1s_ease-in-out_infinite]">
              <div className="w-16 h-16 bg-healify-light-cyan/20 dark:bg-cyan-900/30 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary dark:text-cyan-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary dark:text-white group-hover:text-white mb-4">
                {t('landing.howItWorks.card2Title')}
              </h3>
              <ul className="space-y-3 text-text-body dark:text-slate-300 group-hover:text-white">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card2Point1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card2Point2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card2Point3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card2Point4')}</span>
                </li>
              </ul>
            </div>

            <div className="group bg-white dark:bg-slate-900 hover:bg-gradient-to-br hover:from-primary hover:to-healify-light-cyan dark:hover:from-cyan-800 dark:hover:to-teal-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 animate-slideInScale delay-400 hover:animate-[shake_1s_ease-in-out_infinite]">
              <div className="w-16 h-16 bg-healify-dark-blue/20 dark:bg-cyan-900/30 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-healify-dark-blue dark:text-cyan-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary dark:text-white group-hover:text-white mb-4">
                {t('landing.howItWorks.card3Title')}
              </h3>
              <ul className="space-y-3 text-text-body dark:text-slate-300 group-hover:text-white">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-healify-dark-blue dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card3Point1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-healify-dark-blue dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card3Point2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-healify-dark-blue dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card3Point3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-healify-dark-blue dark:text-cyan-400 group-hover:text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{t('landing.howItWorks.card3Point4')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-healify-dark-blue dark:bg-cyan-950 py-12 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-[5%] w-64 h-64 bg-primary/20 dark:bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-healify-light-cyan/20 dark:bg-teal-500/15 rounded-full blur-3xl"></div>
          <div className="absolute top-8 left-[15%] text-healify-light-cyan/20 text-3xl">❄</div>
          <div className="absolute top-12 right-[20%] text-white/15 text-4xl">❄</div>
          <div className="absolute bottom-12 left-[25%] text-primary/20 text-5xl">❄</div>
          <div className="absolute bottom-8 right-[15%] text-healify-light-cyan/15 text-3xl">❄</div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-800 dark:to-teal-700 p-10 md:p-12 flex flex-col justify-center">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-4 animate-pulse">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <span>{t('landing.winterSale.badge')}</span>
                  </div>

                  <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4 animate-fadeInLeft">
                    {t('landing.winterSale.title')}
                  </h2>

                  <div className="flex items-end gap-3 mb-6 animate-fadeInLeft delay-200">
                    <div className="bg-white rounded-2xl px-8 py-4 shadow-xl hover-lift">
                      <p className="text-7xl font-black text-primary">{t('landing.winterSale.discount')}<span className="text-4xl">%</span></p>
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">{t('landing.winterSale.off')}</p>
                  </div>

                  <p className="text-xl text-white/90 mb-4">
                    {t('landing.winterSale.description')}
                  </p>

                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                </div>
              </div>

              <div className="p-10 md:p-12 flex flex-col justify-center bg-gray-50 dark:bg-slate-900">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-3">
                    {t('landing.winterSale.heading')}
                  </h3>
                  <p className="text-text-body dark:text-slate-300 mb-6">
                    {t('landing.winterSale.subheading')}
                  </p>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary dark:text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-body dark:text-slate-300">{t('landing.winterSale.feature1')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary dark:text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-body dark:text-slate-300">{t('landing.winterSale.feature2')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary dark:text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-body dark:text-slate-300">{t('landing.winterSale.feature3')}</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => navigate("/signup")}
                  className="w-full py-4 bg-primary dark:bg-cyan-600 text-white font-bold text-lg rounded-xl hover:bg-primary-dark dark:hover:bg-cyan-700 transition shadow-lg transform hover:scale-105 mb-3"
                >
                  {t('landing.winterSale.cta')}
                </button>

                <div className="flex items-center justify-center gap-2 text-text-muted dark:text-slate-400 text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('landing.winterSale.validity')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary dark:text-white mb-4 animate-fadeInUp">
              {t('landing.benefits.title')}
            </h2>
            <p className="text-xl text-text-muted dark:text-slate-300 max-w-2xl mx-auto animate-fadeInUp delay-100">
              {t('landing.benefits.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center hover-lift animate-slideInScale delay-100">
              <div className="w-20 h-20 bg-healify-light-cyan/20 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                <svg className="w-10 h-10 text-primary dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">{t('landing.benefits.benefit1Title')}</h3>
              <p className="text-text-muted dark:text-slate-300">{t('landing.benefits.benefit1Desc')}</p>
            </div>

            <div className="text-center hover-lift animate-slideInScale delay-200">
              <div className="w-20 h-20 bg-healify-light-cyan/20 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                <svg className="w-10 h-10 text-primary dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">{t('landing.benefits.benefit2Title')}</h3>
              <p className="text-text-muted dark:text-slate-300">{t('landing.benefits.benefit2Desc')}</p>
            </div>

            <div className="text-center hover-lift animate-slideInScale delay-300">
              <div className="w-20 h-20 bg-healify-light-cyan/20 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                <svg className="w-10 h-10 text-primary dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">{t('landing.benefits.benefit3Title')}</h3>
              <p className="text-text-muted dark:text-slate-300">{t('landing.benefits.benefit3Desc')}</p>
            </div>

            <div className="text-center hover-lift animate-slideInScale delay-400">
              <div className="w-20 h-20 bg-healify-light-cyan/20 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                <svg className="w-10 h-10 text-primary dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">{t('landing.benefits.benefit4Title')}</h3>
              <p className="text-text-muted dark:text-slate-300">{t('landing.benefits.benefit4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 dark:bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-healify-light-cyan/20 dark:bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-healify-dark-blue/10 dark:bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-cyan-900/30 backdrop-blur-sm px-5 py-2 rounded-full mb-6 animate-fadeInDown">
              <svg className="w-5 h-5 text-primary dark:text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-sm font-semibold text-primary dark:text-cyan-400">{t('landing.testimonials.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary dark:text-white mb-4 animate-fadeInUp">
              {t('landing.testimonials.title')}
            </h2>
            <p className="text-xl text-text-muted dark:text-slate-300 max-w-2xl mx-auto animate-fadeInUp delay-100">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group animate-fadeInUp delay-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-healify-light-cyan to-healify-dark-blue dark:from-cyan-800 dark:via-teal-700 dark:to-slate-800 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="flex gap-1 mb-4 justify-end">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 transform group-hover:rotate-[360deg] transition-transform duration-700"
                      style={{ transitionDelay: `${i * 100}ms` }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-text-body dark:text-slate-300 leading-relaxed mb-6 italic text-lg">
                  {t('landing.testimonials.testimonial1')}
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent mb-6"></div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md transform group-hover:scale-110 transition-transform duration-500">
                      S
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary dark:text-white text-lg">{t('landing.testimonials.testimonial1Author')}</h4>
                    <p className="text-sm text-text-muted dark:text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary dark:bg-cyan-400 rounded-full"></span>
                      {t('landing.testimonials.testimonial1Role')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group animate-fadeInUp delay-400">
              <div className="absolute inset-0 bg-gradient-to-br from-healify-dark-blue via-primary to-healify-light-cyan dark:from-slate-800 dark:via-cyan-800 dark:to-teal-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-healify-dark-blue to-primary dark:from-slate-700 dark:to-cyan-700 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="flex gap-1 mb-4 justify-end">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 transform group-hover:rotate-[360deg] transition-transform duration-700"
                      style={{ transitionDelay: `${i * 100}ms` }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-text-body dark:text-slate-300 leading-relaxed mb-6 italic text-lg">
                  {t('landing.testimonials.testimonial2')}
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent mb-6"></div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-healify-dark-blue to-primary dark:from-slate-700 dark:to-cyan-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md transform group-hover:scale-110 transition-transform duration-500">
                      M
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary dark:text-white text-lg">{t('landing.testimonials.testimonial2Author')}</h4>
                    <p className="text-sm text-text-muted dark:text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-healify-dark-blue dark:bg-cyan-400 rounded-full"></span>
                      {t('landing.testimonials.testimonial2Role')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group animate-fadeInUp delay-500">
              <div className="absolute inset-0 bg-gradient-to-br from-healify-light-cyan via-primary to-healify-dark-blue dark:from-teal-700 dark:via-cyan-800 dark:to-slate-800 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-healify-light-cyan to-primary dark:from-teal-600 dark:to-cyan-700 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="flex gap-1 mb-4 justify-end">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 transform group-hover:rotate-[360deg] transition-transform duration-700"
                      style={{ transitionDelay: `${i * 100}ms` }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-text-body dark:text-slate-300 leading-relaxed mb-6 italic text-lg">
                  {t('landing.testimonials.testimonial3')}
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent mb-6"></div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-healify-light-cyan to-primary dark:from-teal-600 dark:to-cyan-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md transform group-hover:scale-110 transition-transform duration-500">
                      E
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary dark:text-white text-lg">{t('landing.testimonials.testimonial3Author')}</h4>
                    <p className="text-sm text-text-muted dark:text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-healify-light-cyan dark:bg-cyan-400 rounded-full"></span>
                      {t('landing.testimonials.testimonial3Role')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group hover-lift animate-fadeInUp delay-500">
              <div className="inline-block relative">
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-400 dark:to-teal-400 mb-2 group-hover:scale-110 transition-transform duration-300">{t('landing.testimonials.stats1')}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-400 dark:to-teal-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <p className="text-text-muted dark:text-slate-400 text-sm font-medium">{t('landing.testimonials.stats1Label')}</p>
            </div>
            <div className="text-center group hover-lift animate-fadeInUp delay-600">
              <div className="inline-block relative">
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-healify-dark-blue dark:from-cyan-400 dark:to-cyan-600 mb-2 group-hover:scale-110 transition-transform duration-300">{t('landing.testimonials.stats2')}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-healify-dark-blue dark:from-cyan-400 dark:to-cyan-600 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <p className="text-text-muted dark:text-slate-400 text-sm font-medium">{t('landing.testimonials.stats2Label')}</p>
            </div>
            <div className="text-center group hover-lift animate-fadeInUp delay-700">
              <div className="inline-block relative">
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-healify-light-cyan to-primary dark:from-teal-400 dark:to-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300">{t('landing.testimonials.stats3')}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-healify-light-cyan to-primary dark:from-teal-400 dark:to-cyan-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <p className="text-text-muted dark:text-slate-400 text-sm font-medium">{t('landing.testimonials.stats3Label')}</p>
            </div>
            <div className="text-center group hover-lift animate-fadeInUp delay-800">
              <div className="inline-block relative">
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-healify-dark-blue to-healify-light-cyan dark:from-cyan-600 dark:to-teal-400 mb-2 group-hover:scale-110 transition-transform duration-300">{t('landing.testimonials.stats4')}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-healify-dark-blue to-healify-light-cyan dark:from-cyan-600 dark:to-teal-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <p className="text-text-muted dark:text-slate-400 text-sm font-medium">{t('landing.testimonials.stats4Label')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-healify-dark-blue to-primary dark:from-slate-900 dark:to-cyan-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 animate-fadeInUp">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-white/90 dark:text-cyan-100 animate-fadeInUp delay-100">
            {t('landing.cta.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fadeInUp delay-200">
            <button
              onClick={() => navigate("/signup?type=patient")}
              className="px-8 py-4 bg-white dark:bg-cyan-600 text-healify-dark-blue dark:text-white font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-cyan-700 transition shadow-lg transform hover:scale-105 hover-glow"
            >
              {t('landing.cta.ctaPatient')}
            </button>
            <button
              onClick={() => navigate("/signup?type=therapist")}
              className="px-8 py-4 bg-healify-light-cyan dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-opacity-90 dark:hover:bg-teal-700 transition shadow-lg transform hover:scale-105"
            >
              {t('landing.cta.ctaTherapist')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
