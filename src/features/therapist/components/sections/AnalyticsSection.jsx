import React from "react";
import { useLanguage } from "../../../../contexts";

export function AnalyticsSection() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
          <h4 className="text-text-muted dark:text-slate-400 text-sm mb-2">{t('therapistDashboard.stats.avgAdherence')}</h4>
          <p className="text-4xl font-bold text-primary dark:text-cyan-300">82%</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 5% from last month</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
          <h4 className="text-text-muted dark:text-slate-400 text-sm mb-2">{t('therapistDashboard.analytics.averageAccuracy')}</h4>
          <p className="text-4xl font-bold text-primary dark:text-cyan-300">86%</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 3% from last month</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
          <h4 className="text-text-muted dark:text-slate-400 text-sm mb-2">{t('therapistDashboard.analytics.painTrends')}</h4>
          <p className="text-4xl font-bold text-orange-500 dark:text-orange-400">12</p>
          <p className="text-xs text-text-muted dark:text-slate-400 mt-2">3 high priority</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">{t('therapistDashboard.analytics.patientActivity')}</h3>
            <p className="text-xs text-text-muted dark:text-slate-400 mt-1">Weekly compliance tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-900">
              <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-bold text-green-600 dark:text-green-400">+14.7%</span>
            </div>
            <select className="text-xs border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200">
              <option>Last 7 weeks</option>
              <option>Last 4 weeks</option>
              <option>Last 12 weeks</option>
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-slate-900/50 dark:to-slate-800/30 rounded-xl p-8 relative overflow-hidden border border-blue-100 dark:border-slate-600">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 dark:bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-healify-light-cyan/5 dark:bg-cyan-400/5 rounded-full blur-3xl"></div>

          <div className="absolute inset-0 px-8 py-8">
            <div className="h-full flex flex-col justify-between">
              {[100, 75, 50, 25, 0].map((value, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium w-8 text-right">{value}%</span>
                  <div className="flex-1 h-px bg-gray-200/80 dark:bg-slate-600/80"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-64 pl-14">
            {[
              { week: "W1", value: 75, patients: 24, change: "+2%", x: 7.14 },
              { week: "W2", value: 78, patients: 24, change: "+4%", x: 21.43 },
              { week: "W3", value: 80, patients: 23, change: "+3%", x: 35.71 },
              { week: "W4", value: 82, patients: 24, change: "+2.5%", x: 50 },
              { week: "W5", value: 85, patients: 25, change: "+3.7%", x: 64.29 },
              { week: "W6", value: 83, patients: 24, change: "-2.4%", x: 78.57 },
              { week: "W7", value: 86, patients: 24, change: "+3.6%", x: 92.86 },
            ].map((item, i) => {
              const height = (item.value / 100) * 200;
              const yPosition = 100 - item.value;
              return (
                <div
                  key={i}
                  className="absolute bottom-0 group cursor-pointer"
                  style={{
                    left: `${item.x}%`,
                    transform: 'translateX(-50%)',
                    animation: `slideUp 0.6s ease-out ${i * 0.1}s both`,
                    height: '100%'
                  }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 transform scale-95 group-hover:scale-100">
                    <div className="bg-gray-900 dark:bg-slate-800 text-white text-xs rounded-xl px-4 py-3 whitespace-nowrap shadow-2xl border border-gray-700 dark:border-slate-600">
                      <div className="font-bold text-sm mb-1.5">{item.week}</div>
                      <div className="text-healify-light-cyan dark:text-cyan-300 font-semibold text-base mb-1">{item.value}%</div>
                      <div className="text-gray-300 dark:text-slate-300 text-xs mb-1">{item.patients} Active Patients</div>
                      <div className={`text-xs font-semibold ${parseFloat(item.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.change} vs prev week
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent border-t-gray-900 dark:border-t-slate-800"></div>
                    </div>
                  </div>

                  <div
                    className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ bottom: `calc(${item.value}% + 25px)` }}
                  >
                    <span className="text-xs font-bold text-primary dark:text-cyan-300 whitespace-nowrap">{item.value}%</span>
                  </div>

                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div
                      className="w-0.5 bg-gradient-to-t from-primary to-healify-light-cyan"
                      style={{ height: `${height}px` }}
                    ></div>

                    <div
                      className="absolute flex items-center justify-center"
                      style={{ bottom: `${height}px`, transform: 'translateY(50%)' }}
                    >
                      <div className="absolute w-6 h-6 bg-primary/20 rounded-full animate-ping"></div>
                      <div className="relative w-4 h-4 bg-gradient-to-br from-primary to-healify-light-cyan rounded-full border-2 border-white shadow-lg group-hover:scale-150 transition-transform duration-300"></div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#024B87" />
                  <stop offset="50%" stopColor="#1B9AAE" />
                  <stop offset="100%" stopColor="#52C9D3" />
                </linearGradient>
              </defs>
              <polyline
                points="7.14%,25% 21.43%,22% 35.71%,20% 50%,18% 64.29%,15% 78.57%,17% 92.86%,14%"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: '1200',
                  strokeDashoffset: '1200',
                  animation: 'drawStroke 2s ease-out forwards'
                }}
              />
            </svg>
          </div>

          <div className="relative pl-14 mt-4">
            {[
              { label: "Week 1", x: 7.14 },
              { label: "Week 2", x: 21.43 },
              { label: "Week 3", x: 35.71 },
              { label: "Week 4", x: 50 },
              { label: "Week 5", x: 64.29 },
              { label: "Week 6", x: 78.57 },
              { label: "Week 7", x: 92.86 },
            ].map((item, i) => (
              <div
                key={i}
                className="absolute"
                style={{ left: `${item.x}%`, transform: 'translateX(-50%)' }}
              >
                <div className="text-center">
                  <span className="text-xs font-semibold text-text-primary dark:text-cyan-300 block">{item.label.split(' ')[0]}</span>
                  <span className="text-xs text-text-muted dark:text-slate-400">{item.label.split(' ')[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl p-4 border border-green-200 dark:border-green-900 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-bold text-green-700 dark:text-green-300">Highest</span>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">86%</div>
            <div className="text-xs text-green-600/80 dark:text-green-400/80">Week 7</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-100/50 dark:from-blue-900/20 dark:to-cyan-900/10 rounded-xl p-4 border border-blue-200 dark:border-cyan-900 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-primary dark:text-cyan-300">Average</span>
            </div>
            <div className="text-3xl font-bold text-primary dark:text-cyan-300 mb-1">81%</div>
            <div className="text-xs text-primary/80 dark:text-cyan-300/80">7 weeks</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-100/50 dark:from-purple-900/20 dark:to-indigo-900/10 rounded-xl p-4 border border-purple-200 dark:border-purple-900 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300">Growth</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">+14.7%</div>
            <div className="text-xs text-purple-600/80 dark:text-purple-400/80">Since W1</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes drawStroke {
          to {
            strokeDashoffset: 0;
          }
        }
      `}</style>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300 mb-4">Common Pain Triggers</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <span className="font-medium text-text-primary dark:text-cyan-300">Lower Back Pain</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 dark:bg-red-400" style={{ width: "75%" }}></div>
              </div>
              <span className="text-sm font-bold text-text-muted dark:text-slate-400">75%</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <span className="font-medium text-text-primary dark:text-cyan-300">Knee Discomfort</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 dark:bg-orange-400" style={{ width: "55%" }}></div>
              </div>
              <span className="text-sm font-bold text-text-muted dark:text-slate-400">55%</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <span className="font-medium text-text-primary dark:text-cyan-300">Shoulder Pain</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 dark:bg-yellow-400" style={{ width: "40%" }}></div>
              </div>
              <span className="text-sm font-bold text-text-muted dark:text-slate-400">40%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300 mb-4">Most Effective Exercises</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <p className="font-bold text-text-primary dark:text-cyan-300">Shoulder Rotation</p>
              <p className="text-sm text-text-muted dark:text-slate-400">Avg accuracy: 92% • Low pain reports</p>
            </div>
            <span className="text-2xl">⭐</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <p className="font-bold text-text-primary dark:text-cyan-300">Hip Stretch</p>
              <p className="text-sm text-text-muted dark:text-slate-400">Avg accuracy: 89% • Low pain reports</p>
            </div>
            <span className="text-2xl">⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
}
