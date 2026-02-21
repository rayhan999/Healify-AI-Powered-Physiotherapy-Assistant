import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar, NavBar, Footer } from "../../../components/layout";
import { useToast, LoadingSpinner } from "../../../components/ui";
import { useLanguage } from "../../../contexts";

export default function SubscriptionPage({ userType = "patient" }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#pricing-plans') {
      setTimeout(() => {
        const element = document.getElementById('pricing-plans');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const plans = [
    {
      id: "basic",
      name: t('subscription.plans.basicName'),
      description: t('subscription.plans.basicDesc'),
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        t('subscription.features.basic1'),
        t('subscription.features.basic2'),
        t('subscription.features.basic3'),
        t('subscription.features.basic4'),
        t('subscription.features.basic5'),
        t('subscription.features.basic6'),
      ],
      color: "from-slate-600 to-slate-700",
      darkColor: "dark:from-slate-700 dark:to-slate-800",
      recommended: false,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: "premium",
      name: t('subscription.plans.premiumName'),
      description: t('subscription.plans.premiumDesc'),
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      features: [
        t('subscription.features.premium1'),
        t('subscription.features.premium2'),
        t('subscription.features.premium3'),
        t('subscription.features.premium4'),
        t('subscription.features.premium5'),
        t('subscription.features.premium6'),
        t('subscription.features.premium7'),
        t('subscription.features.premium8'),
      ],
      color: "from-primary to-healify-light-cyan",
      darkColor: "dark:from-cyan-700 dark:to-teal-600",
      recommended: true,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: "professional",
      name: t('subscription.plans.proName'),
      description: t('subscription.plans.proDesc'),
      monthlyPrice: 99.99,
      yearlyPrice: 999.99,
      features: [
        t('subscription.features.pro1'),
        t('subscription.features.pro2'),
        t('subscription.features.pro3'),
        t('subscription.features.pro4'),
        t('subscription.features.pro5'),
        t('subscription.features.pro6'),
        t('subscription.features.pro7'),
        t('subscription.features.pro8'),
        t('subscription.features.pro9'),
        t('subscription.features.pro10'),
      ],
      color: "from-healify-dark-blue to-primary",
      darkColor: "dark:from-cyan-800 dark:to-cyan-900",
      recommended: false,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
  ];

  const faqs = [
    {
      question: t('subscription.faq.q1'),
      answer: t('subscription.faq.a1')
    },
    {
      question: t('subscription.faq.q2'),
      answer: t('subscription.faq.a2')
    },
    {
      question: t('subscription.faq.q3'),
      answer: t('subscription.faq.a3')
    },
    {
      question: t('subscription.faq.q4'),
      answer: t('subscription.faq.a4')
    },
    {
      question: t('subscription.faq.q5'),
      answer: t('subscription.faq.a5')
    },
    {
      question: t('subscription.faq.q6'),
      answer: t('subscription.faq.a6')
    }
  ];

  const getPrice = (plan) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    return ((monthlyCost - yearlyCost) / monthlyCost * 100).toFixed(0);
  };

  const handleConfirmPayment = async () => {
    setIsProcessingPayment(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Payment successful! Your subscription has been activated.");
      setShowPaymentModal(false);
      setSelectedPlan(null);
      navigate(userType === "patient" ? "/patient-dashboard" : "/therapist-dashboard");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <TopBar />
      <NavBar />

      <section className="relative bg-gradient-to-br from-healify-dark-blue via-primary to-healify-light-cyan dark:from-slate-900 dark:via-cyan-950 dark:to-slate-800 py-20 px-4 overflow-hidden animate-gradientShift">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-[10%] w-96 h-96 bg-white/10 dark:bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-healify-light-cyan/20 dark:bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 dark:bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-cyan-900/30 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 dark:border-cyan-800 mb-6 animate-fadeInDown">
              <svg className="w-5 h-5 text-white dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-white dark:text-cyan-100">{t('subscription.hero.badge')}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white dark:text-cyan-50 mb-6 leading-tight animate-fadeInUp">
              {t('subscription.hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-healify-light-cyan to-white dark:from-cyan-300 dark:via-cyan-100 dark:to-cyan-300">
                {t('subscription.hero.titleHighlight')}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed animate-fadeInUp delay-100">
              {t('subscription.hero.subtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fadeInUp delay-200">
              <div className="flex items-center gap-2 text-white/90 dark:text-cyan-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium">{t('subscription.hero.trust1')}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 dark:text-cyan-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-sm font-medium">{t('subscription.hero.trust2')}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 dark:text-cyan-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-medium">{t('subscription.hero.trust3')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-2 inline-flex gap-2 border border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 text-white shadow-lg transform scale-105"
                    : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                {t('subscription.billing.monthly')}
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 text-white shadow-lg transform scale-105"
                    : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                {t('subscription.billing.yearly')}
                <span className="absolute -top-3 -right-3 px-3 py-1 bg-green-500 text-white text-xs rounded-full font-bold shadow-lg animate-pulse">
                  {t('subscription.billing.saveLabel')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing-plans" className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:ring-4 hover:ring-primary dark:hover:ring-cyan-500 border border-gray-100 dark:border-cyan-900/50 dark:hover:shadow-[0_8px_40px_0_rgba(34,211,238,0.4)] animate-fadeInUp ${
                  plan.recommended ? "transform scale-105 md:scale-110 z-10" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0 left-0">
                    <div className="bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 text-white text-center py-3 text-sm font-bold tracking-wider">
                      {t('subscription.plans.mostPopular')}
                    </div>
                  </div>
                )}

                <div className={`p-8 ${plan.recommended ? 'pt-16' : 'pt-8'}`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${plan.color} ${plan.darkColor} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transform transition-transform duration-500 hover:rotate-12 hover:scale-110`}>
                    {plan.icon}
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-slate-400 mb-6 min-h-[3rem]">{plan.description}</p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-400 dark:to-teal-400">
                        ${getPrice(plan)}
                      </span>
                      <span className="text-gray-600 dark:text-slate-400 text-lg font-medium">
                        /{billingCycle === "monthly" ? t('subscription.plans.perMonth') : t('subscription.plans.perYear')}
                      </span>
                    </div>
                    {billingCycle === "yearly" && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-green-600 dark:text-green-400 font-bold">
                          {t('subscription.plans.saveYearly', { percent: getSavings(plan), amount: (plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(2) })}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowPaymentModal(true);
                    }}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-8 ${
                      plan.recommended
                        ? "bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 text-white hover:shadow-2xl hover-glow"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {t('subscription.plans.startTrial')}
                  </button>

                  <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                      {t('subscription.plans.included')}
                    </p>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-slate-300 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-gray-200 dark:border-slate-600">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('subscription.enterprise.title')}
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  {t('subscription.enterprise.desc')}
                </p>
              </div>
              <button
                onClick={() => navigate(userType === "patient" ? "/patient-help-support" : "/therapist-help-support")}
                className="px-8 py-4 bg-gradient-to-r from-healify-dark-blue to-primary dark:from-cyan-800 dark:to-cyan-700 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                {t('subscription.enterprise.cta')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('subscription.comparison.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-400 dark:to-teal-400">{t('subscription.comparison.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400">
              {t('subscription.comparison.subtitle')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-700 border-b-2 border-gray-200 dark:border-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('subscription.comparison.headerFeatures')}</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('subscription.comparison.headerBasic')}</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      <div className="flex flex-col items-center">
                        {t('subscription.comparison.headerPremium')}
                        <span className="text-xs bg-primary dark:bg-cyan-600 text-white px-2 py-1 rounded-full mt-1">{t('subscription.comparison.popular')}</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('subscription.comparison.headerProfessional')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {[
                    { feature: t('subscription.comparison.feature1'), basic: t('subscription.comparison.feature1Basic'), premium: t('subscription.comparison.feature1Premium'), pro: t('subscription.comparison.feature1Pro') },
                    { feature: t('subscription.comparison.feature2'), basic: true, premium: true, pro: true },
                    { feature: t('subscription.comparison.feature3'), basic: false, premium: true, pro: true },
                    { feature: t('subscription.comparison.feature4'), basic: false, premium: t('subscription.comparison.feature4Premium'), pro: t('subscription.comparison.feature4Pro') },
                    { feature: t('subscription.comparison.feature5'), basic: false, premium: false, pro: true },
                    { feature: t('subscription.comparison.feature6'), basic: false, premium: false, pro: t('subscription.comparison.feature6Pro') },
                    { feature: t('subscription.comparison.feature7'), basic: false, premium: false, pro: true },
                    { feature: t('subscription.comparison.feature8'), basic: false, premium: true, pro: t('subscription.comparison.feature8Pro') },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.basic === 'boolean' ? (
                          row.basic ? (
                            <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-300 dark:text-slate-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-slate-300">{row.basic}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-primary/5 dark:bg-cyan-900/10">
                        {typeof row.premium === 'boolean' ? (
                          row.premium ? (
                            <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-300 dark:text-slate-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-slate-300 font-semibold">{row.premium}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-300 dark:text-slate-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-slate-300">{row.pro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('subscription.faq.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-400 dark:to-teal-400">{t('subscription.faq.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400">
              {t('subscription.faq.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-4">{faq.question}</h3>
                  <svg
                    className="w-6 h-6 text-primary dark:text-cyan-400 transform transition-transform duration-300 group-open:rotate-180 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-gray-200 dark:border-slate-600">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('subscription.faq.stillQuestions')}</h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              {t('subscription.faq.contactDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate(userType === "patient" ? "/patient-help-support#contact" : "/therapist-help-support#contact")}
                className="px-6 py-3 bg-primary dark:bg-cyan-600 text-white font-semibold rounded-lg hover:bg-primary-dark dark:hover:bg-cyan-700 transition-all duration-300 transform hover:scale-105">
                {t('subscription.faq.contactSupport')}
              </button>
              <button
                onClick={() => {
                  toast.info("Demo booking feature coming soon! Please contact us at info@healify.com");
                }}
                className="px-6 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300">
                {t('subscription.faq.scheduleDemo')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('subscription.testimonials.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-400 dark:to-teal-400">{t('subscription.testimonials.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400">
              {t('subscription.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: t('subscription.testimonials.t1'),
                author: t('subscription.testimonials.t1Author'),
                role: t('subscription.testimonials.t1Role'),
                avatar: "E"
              },
              {
                quote: t('subscription.testimonials.t2'),
                author: t('subscription.testimonials.t2Author'),
                role: t('subscription.testimonials.t2Role'),
                avatar: "M"
              },
              {
                quote: t('subscription.testimonials.t3'),
                author: t('subscription.testimonials.t3Author'),
                role: t('subscription.testimonials.t3Role'),
                avatar: "J"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-cyan-900/50 dark:shadow-[0_8px_32px_0_rgba(34,211,238,0.2)] dark:hover:shadow-[0_8px_40px_0_rgba(34,211,238,0.35)]"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-healify-dark-blue via-primary to-healify-light-cyan dark:from-slate-900 dark:via-cyan-950 dark:to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-cyan-50 mb-6">
            {t('subscription.cta.title')}
          </h2>
          <p className="text-xl text-white/90 dark:text-slate-200 mb-10 leading-relaxed">
            {t('subscription.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="px-10 py-5 bg-white text-primary dark:bg-cyan-600 dark:text-white hover:bg-gray-100 dark:hover:bg-cyan-700 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover-glow"
            >
              {t('subscription.cta.start')}
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-10 py-5 bg-transparent border-3 border-white text-white dark:border-cyan-400 dark:text-cyan-400 hover:bg-white/10 dark:hover:bg-cyan-400/10 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              {t('subscription.cta.learn')}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/80 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">{t('subscription.cta.hipaa')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">{t('subscription.cta.security')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span className="font-medium">{t('subscription.cta.moneyBack')}</span>
            </div>
          </div>
        </div>
      </section>

      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-slate-700 animate-slideInUp">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('subscription.modal.title')}</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">{selectedPlan.name} Plan</h3>
                  <div className={`w-12 h-12 bg-gradient-to-br ${selectedPlan.color} ${selectedPlan.darkColor} rounded-xl flex items-center justify-center text-white`}>
                    {selectedPlan.icon}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-slate-400">14-day free trial</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-slate-400">After trial ({billingCycle})</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${getPrice(selectedPlan)}</span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-slate-600 my-3"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">Due Today</span>
                    <span className="font-bold text-primary dark:text-cyan-400 text-2xl">$0.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-cyan-900/20 border border-blue-200 dark:border-cyan-800 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-900 dark:text-cyan-100 font-medium mb-1">{t('subscription.modal.noPayment')}</p>
                    <p className="text-sm text-blue-700 dark:text-cyan-200">
                      {t('subscription.modal.trialInfo', { cycle: billingCycle })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600 transition"
                >
                  {t('subscription.modal.cancel')}
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span>{t('subscription.modal.processing')}</span>
                    </>
                  ) : (
                    t('subscription.modal.confirm')
                  )}
                </button>
              </div>

              <p className="text-xs text-center text-gray-500 dark:text-slate-500 mt-4">
                {t('subscription.modal.terms')}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
