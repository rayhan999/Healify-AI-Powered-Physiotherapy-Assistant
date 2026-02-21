import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar, NavBar, Footer } from "../components/layout";
import { useLanguage } from "../contexts";

export default function AboutPage({ userType = "patient" }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const team = [
    {
      name: t('about.team.member1Name'),
      role: t('about.team.member1Role'),
      specialty: t('about.team.member1Specialty'),
      experience: t('about.team.member1Experience'),
      initial: "SW"
    },
    {
      name: t('about.team.member2Name'),
      role: t('about.team.member2Role'),
      specialty: t('about.team.member2Specialty'),
      experience: t('about.team.member2Experience'),
      initial: "AT"
    },
    {
      name: t('about.team.member3Name'),
      role: t('about.team.member3Role'),
      specialty: t('about.team.member3Specialty'),
      experience: t('about.team.member3Experience'),
      initial: "JP"
    },
    {
      name: t('about.team.member4Name'),
      role: t('about.team.member4Role'),
      specialty: t('about.team.member4Specialty'),
      experience: t('about.team.member4Experience'),
      initial: "MR"
    }
  ];

  const getValues = () => [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: t('about.values.value1Title'),
      description: t('about.values.value1Desc')
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: t('about.values.value2Title'),
      description: t('about.values.value2Desc')
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t('about.values.value3Title'),
      description: t('about.values.value3Desc')
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('about.values.value4Title'),
      description: t('about.values.value4Desc')
    }
  ];

  const getMilestones = () => [
    { year: t('about.journey.milestone1Year'), event: t('about.journey.milestone1Event'), desc: t('about.journey.milestone1Desc') },
    { year: t('about.journey.milestone2Year'), event: t('about.journey.milestone2Event'), desc: t('about.journey.milestone2Desc') },
    { year: t('about.journey.milestone3Year'), event: t('about.journey.milestone3Event'), desc: t('about.journey.milestone3Desc') },
    { year: t('about.journey.milestone4Year'), event: t('about.journey.milestone4Event'), desc: t('about.journey.milestone4Desc') }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <TopBar />
      <NavBar />

      <section className="relative bg-gradient-to-br from-healify-dark-blue via-primary to-healify-light-cyan dark:from-slate-900 dark:via-cyan-950 dark:to-slate-800 py-20 px-4 overflow-hidden animate-gradientShift">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-[10%] w-96 h-96 bg-white/10 dark:bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-healify-light-cyan/20 dark:bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-transparent dark:bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-cyan-900/30 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 dark:border-cyan-800 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-cyan-400"></span>
              </span>
              <span className="text-sm font-semibold text-white dark:text-cyan-100">{t('about.hero.badge')}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white dark:text-cyan-50 mb-6 leading-tight">
              {t('about.hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-healify-light-cyan to-white dark:from-cyan-300 dark:via-cyan-100 dark:to-cyan-300">
                {t('about.hero.titleHighlight')}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 dark:text-slate-200 max-w-4xl mx-auto leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {t('about.story.title')} <span className="text-primary dark:text-cyan-400">{t('about.story.titleHighlight')}</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-700 dark:text-slate-300 leading-relaxed">
                <p>
                  {t('about.story.para1')}
                </p>
                <p>
                  {t('about.story.para2')}
                </p>
                <p>
                  {t('about.story.para3')}
                </p>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-healify-light-cyan/5 dark:from-cyan-900/20 dark:to-teal-900/20 border-l-4 border-primary dark:border-cyan-400 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2">{t('about.story.missionTitle')}</h3>
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                  {t('about.story.mission')}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-healify-dark-blue to-primary dark:from-cyan-900 dark:to-cyan-700 rounded-2xl p-8 text-white shadow-xl hover-scale transition-all duration-300">
                  <div className="text-5xl font-black mb-2">{t('about.story.stat1Value')}</div>
                  <div className="text-white/90 dark:text-cyan-50">{t('about.story.stat1Label')}</div>
                </div>
                <div className="bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-800 dark:to-teal-600 rounded-2xl p-8 text-white shadow-xl hover-scale transition-all duration-300">
                  <div className="text-5xl font-black mb-2">{t('about.story.stat2Value')}</div>
                  <div className="text-white/90 dark:text-cyan-50">{t('about.story.stat2Label')}</div>
                </div>
                <div className="bg-gradient-to-br from-healify-light-cyan to-primary dark:from-teal-700 dark:to-cyan-800 rounded-2xl p-8 text-white shadow-xl hover-scale transition-all duration-300">
                  <div className="text-5xl font-black mb-2">{t('about.story.stat3Value')}</div>
                  <div className="text-white/90 dark:text-cyan-50">{t('about.story.stat3Label')}</div>
                </div>
                <div className="bg-gradient-to-br from-primary to-healify-dark-blue dark:from-cyan-700 dark:to-cyan-900 rounded-2xl p-8 text-white shadow-xl hover-scale transition-all duration-300">
                  <div className="text-5xl font-black mb-2">{t('about.story.stat4Value')}</div>
                  <div className="text-white/90 dark:text-cyan-50">{t('about.story.stat4Label')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.values.title')} <span className="text-primary dark:text-cyan-400">{t('about.values.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {getValues().map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover-scale border border-gray-100 dark:border-slate-700"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.team.title')} <span className="text-primary dark:text-cyan-400">{t('about.team.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover-scale border border-gray-100 dark:border-slate-700"
              >
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-healify-dark-blue via-primary to-healify-light-cyan dark:from-slate-700 dark:via-cyan-700 dark:to-teal-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition">
                    {member.initial}
                  </div>
                  <div className="absolute bottom-0 right-[calc(50%-48px)] w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary dark:text-cyan-400 font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-slate-400 text-sm mb-1">
                    {member.specialty}
                  </p>
                  <p className="text-gray-500 dark:text-slate-500 text-sm">
                    {member.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.journey.title')} <span className="text-primary dark:text-cyan-400">{t('about.journey.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              {t('about.journey.subtitle')}
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-healify-dark-blue via-primary to-healify-light-cyan dark:from-cyan-800 dark:via-cyan-600 dark:to-teal-600"></div>

            <div className="space-y-12">
              {getMilestones().map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 rounded-full border-4 border-white dark:border-slate-800 shadow-lg z-10"></div>

                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover-scale border border-gray-100 dark:border-slate-700">
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 text-white font-bold rounded-full text-sm mb-3">
                        {milestone.year}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {milestone.event}
                      </h3>
                      <p className="text-gray-700 dark:text-slate-300">
                        {milestone.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.technology.title')} <span className="text-primary dark:text-cyan-400">{t('about.technology.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              {t('about.technology.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-healify-dark-blue to-primary dark:from-slate-800 dark:to-cyan-800 rounded-2xl p-8 text-white shadow-xl hover-scale transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('about.technology.tech1Title')}</h3>
              <p className="text-white/90 dark:text-cyan-100 leading-relaxed">
                {t('about.technology.tech1Desc')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary to-healify-light-cyan dark:from-slate-700 dark:to-cyan-900 rounded-2xl p-8 text-white shadow-xl hover-scale transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('about.technology.tech2Title')}</h3>
              <p className="text-white/90 dark:text-cyan-100 leading-relaxed">
                {t('about.technology.tech2Desc')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-healify-light-cyan to-healify-dark-blue dark:from-cyan-900 dark:to-slate-800 rounded-2xl p-8 text-white shadow-xl hover-scale transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('about.technology.tech3Title')}</h3>
              <p className="text-white/90 dark:text-cyan-100 leading-relaxed">
                {t('about.technology.tech3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-healify-dark-blue via-primary to-healify-light-cyan dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 animate-gradientShift">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-cyan-50 mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-xl text-white/90 dark:text-slate-200 mb-10 leading-relaxed">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="px-10 py-5 bg-white text-primary dark:bg-cyan-600 dark:text-white hover:bg-gray-100 dark:hover:bg-cyan-700 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover-glow"
            >
              {t('about.cta.ctaStart')}
            </button>
            <button
              onClick={() => navigate("/help-support")}
              className="px-10 py-5 bg-transparent border-3 border-white text-white dark:border-cyan-400 dark:text-cyan-400 hover:bg-white/10 dark:hover:bg-cyan-400/10 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              {t('about.cta.ctaLearn')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
