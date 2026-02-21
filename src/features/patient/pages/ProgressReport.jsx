import React, { useState } from "react";
import { useLanguage } from "../../../contexts";
import { useOutletContext } from "react-router-dom";
import { useToast } from "../../../components/ui";
export default function ProgressReportSection() {
  const { t } = useLanguage();
  const toast = useToast();
  const [timeRange, setTimeRange] = useState("30days");

  const progressData = {
    overall: {
      recoveryProgress: 75,
      totalSessions: 24,
      completedExercises: 156,
      currentStreak: 7,
      avgAccuracy: 88,
      totalMinutes: 720,
    },
    weeklyProgress: [
      { week: "Week 1", progress: 20, sessions: 3, accuracy: 75 },
      { week: "Week 2", progress: 35, sessions: 5, accuracy: 80 },
      { week: "Week 3", progress: 48, sessions: 4, accuracy: 82 },
      { week: "Week 4", progress: 60, sessions: 6, accuracy: 85 },
      { week: "Week 5", progress: 75, sessions: 6, accuracy: 88 },
    ],
    painLevels: [
      { date: "Feb 1", level: 7 },
      { date: "Feb 5", level: 6 },
      { date: "Feb 10", level: 5 },
      { date: "Feb 15", level: 4 },
      { date: "Feb 20", level: 2 },
    ],
    exerciseBreakdown: [
      { name: "Shoulder Rotation", completed: 45, target: 50, accuracy: 92 },
      { name: "Arm Raises", completed: 38, target: 40, accuracy: 88 },
      { name: "Wall Push-ups", completed: 30, target: 35, accuracy: 85 },
      { name: "Neck Stretches", completed: 28, target: 30, accuracy: 90 },
      { name: "Scapular Squeezes", completed: 15, target: 25, accuracy: 80 },
    ],
    achievements: [
      { id: 1, title: "First Week Complete", icon: "target", date: "Jan 22, 2024", unlocked: true },
      { id: 2, title: "7 Day Streak", icon: "fire", date: "Jan 28, 2024", unlocked: true },
      { id: 3, title: "50 Exercises Done", icon: "muscle", date: "Feb 5, 2024", unlocked: true },
      { id: 4, title: "Perfect Form Expert", icon: "star", date: "Feb 12, 2024", unlocked: true },
      { id: 5, title: "100 Exercises Milestone", icon: "trophy", date: "Feb 18, 2024", unlocked: true },
      { id: 6, title: "Pain Reduced by 50%", icon: "heart", date: "Feb 20, 2024", unlocked: true },
      { id: 7, title: "30 Day Streak", icon: "sparkle", date: "Locked", unlocked: false },
      { id: 8, title: "Recovery Champion", icon: "crown", date: "Locked", unlocked: false },
    ],
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-text-muted mt-1">{t('patientDashboard.progress.subtitle')}</p>
          </div>

          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="7days">{t('patientDashboard.progress.timePeriod.sevenDays')}</option>
              <option value="30days">{t('patientDashboard.progress.timePeriod.thirtyDays')}</option>
              <option value="90days">{t('patientDashboard.progress.timePeriod.ninetyDays')}</option>
              <option value="all">{t('patientDashboard.progress.timePeriod.allTime')}</option>
            </select>

            <button
              onClick={() => toast.success("Progress report downloaded successfully! Check your downloads folder.")}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('patientDashboard.progress.downloadReport')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-transparent dark:border-cyan-900">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-text-muted dark:text-slate-400 text-sm mb-1">{t('patientDashboard.progress.recoveryProgress')}</p>
              <p className="text-3xl font-bold text-text-primary dark:text-cyan-300">{progressData.overall.recoveryProgress}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-primary dark:bg-cyan-600 h-2 rounded-full transition-all"
              style={{ width: `${progressData.overall.recoveryProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-transparent dark:border-cyan-900">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted dark:text-slate-400 text-sm mb-1">{t('patientDashboard.progress.totalSessions')}</p>
              <p className="text-3xl font-bold text-text-primary dark:text-cyan-300">{progressData.overall.totalSessions}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 12% {t('patientDashboard.progress.thisWeek')}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-transparent dark:border-cyan-900">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted dark:text-slate-400 text-sm mb-1">{t('patientDashboard.progress.currentStreak')}</p>
              <p className="text-3xl font-bold text-text-primary dark:text-cyan-300">{progressData.overall.currentStreak}</p>
              <p className="text-sm text-text-muted dark:text-slate-400 dark:text-slate-400 mt-1">{t('patientDashboard.progress.days')} in a row</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-transparent dark:border-cyan-900">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted dark:text-slate-400 text-sm mb-1">{t('patientDashboard.progress.avgAccuracy')}</p>
              <p className="text-3xl font-bold text-text-primary dark:text-cyan-300">{progressData.overall.avgAccuracy}%</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 5% improvement</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-transparent dark:border-cyan-900">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-primary dark:text-cyan-300">{t('patientDashboard.progress.weeklyProgress')}</h2>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-text-muted dark:text-slate-400">{t('patientDashboard.progress.chartProgress')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-text-muted dark:text-slate-400">{t('patientDashboard.progress.chartAccuracy')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {progressData.weeklyProgress.map((week, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-text-muted">{week.week}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-primary font-semibold">{week.progress}%</span>
                    <span className="text-green-600 font-semibold">{week.accuracy}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary to-healify-light-cyan h-3 rounded-full transition-all"
                      style={{ width: `${week.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${week.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-transparent dark:border-cyan-900">
          <h2 className="text-xl font-bold text-text-primary dark:text-cyan-300 mb-6">Pain Level Trend</h2>

          <div className="space-y-3 mb-6">
            {progressData.painLevels.map((entry, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-12">{entry.date}</span>
                <div className="flex-1 flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-6 rounded ${
                        i < entry.level
                          ? entry.level <= 3
                            ? "bg-green-500"
                            : entry.level <= 6
                            ? "bg-yellow-500"
                            : "bg-red-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  ))}
                </div>
                <span className={`text-sm font-bold w-8 ${
                  entry.level <= 3 ? "text-green-600" :
                  entry.level <= 6 ? "text-yellow-600" : "text-red-600"
                }`}>
                  {entry.level}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-red-50 dark:from-green-900/20 dark:to-red-900/20 rounded-lg p-4 border border-transparent dark:border-green-700/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-text-primary dark:text-slate-200">Pain Reduction</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">71%</span>
            </div>
            <p className="text-xs text-text-muted dark:text-slate-400">From 7/10 to 2/10 in 20 days</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-transparent dark:border-cyan-900">
        <h2 className="text-xl font-bold text-text-primary dark:text-cyan-300 mb-6">Exercise Breakdown</h2>

        <div className="space-y-4">
          {progressData.exerciseBreakdown.map((exercise, index) => (
            <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary dark:text-slate-200">{exercise.name}</h3>
                  <p className="text-sm text-text-muted dark:text-slate-400">
                    {exercise.completed} / {exercise.target} completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{exercise.accuracy}% accuracy</p>
                  <p className="text-xs text-text-muted">
                    {Math.round((exercise.completed / exercise.target) * 100)}% of target
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted dark:text-slate-400">Completion</span>
                    <span className="font-medium">
                      {Math.round((exercise.completed / exercise.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(exercise.completed / exercise.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted dark:text-slate-400">Accuracy</span>
                    <span className="font-medium">{exercise.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${exercise.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-transparent dark:border-cyan-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-primary dark:text-cyan-300">Achievements</h2>
          <span className="text-sm text-text-muted dark:text-slate-400">
            {progressData.achievements.filter(a => a.unlocked).length} / {progressData.achievements.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {progressData.achievements.map((achievement) => {
            const renderIcon = (iconType, unlocked) => {
              const iconColor = unlocked ? "text-primary dark:text-cyan-400" : "text-gray-400 dark:text-slate-500";

              switch(iconType) {
                case "target":
                  return (
                    <svg className={`w-12 h-12 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  );
                case "fire":
                  return (
                    <svg className={`w-12 h-12 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                  );
                case "muscle":
                  return (
                    <svg className={`w-12 h-12 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  );
                case "star":
                  return (
                    <svg className={`w-12 h-12 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  );
                case "trophy":
                  return (
                    <svg className={`w-12 h-12 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  );
                case "heart":
                  return (
                    <svg className={`w-12 h-12 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  );
                case "sparkle":
                  return (
                    <svg className={`w-12 h-12 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  );
                case "crown":
                  return (
                    <svg className={`w-12 h-12 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  );
                default:
                  return null;
              }
            };

            return (
              <div
                key={achievement.id}
                className={`relative rounded-xl p-4 text-center transition-all ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-primary/10 to-healify-light-cyan/10 dark:from-cyan-900/20 dark:to-teal-900/10 border-2 border-primary/20 dark:border-cyan-700/30 hover:shadow-lg cursor-pointer"
                    : "bg-gray-50 dark:bg-slate-700/50 border-2 border-gray-200 dark:border-slate-600 opacity-60"
                }`}
              >
                <div className="flex justify-center mb-2">{renderIcon(achievement.icon, achievement.unlocked)}</div>
                <h3 className={`font-semibold text-sm mb-1 ${
                  achievement.unlocked ? "text-text-primary dark:text-cyan-200" : "text-gray-400 dark:text-slate-500"
                }`}>
                  {achievement.title}
                </h3>
                <p className="text-xs text-text-muted dark:text-slate-400">{achievement.date}</p>

                {achievement.unlocked && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mt-8 border border-transparent dark:border-cyan-900">
        <h2 className="text-xl font-bold text-text-primary dark:text-cyan-300 mb-4">Therapist Notes & Feedback</h2>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-blue-900 dark:text-blue-300">Dr. Sarah Williams</p>
              <span className="text-xs text-blue-600 dark:text-blue-400">Feb 20, 2024</span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Excellent progress this week! Your form has improved significantly. Keep up the great work with the shoulder rotations.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 p-4 rounded">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-green-900 dark:text-green-300">Dr. Sarah Williams</p>
              <span className="text-xs text-green-600 dark:text-green-400">Feb 15, 2024</span>
            </div>
            <p className="text-sm text-green-800 dark:text-green-200">
              Great adherence to the exercise plan. I've added 2 new exercises to help with range of motion. Start with 1 set each and gradually increase.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-400 p-4 rounded">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-yellow-900 dark:text-yellow-300">Dr. Sarah Williams</p>
              <span className="text-xs text-yellow-600 dark:text-yellow-400">Feb 10, 2024</span>
            </div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              I noticed some sessions with lower accuracy. Remember to follow the on-screen guidance carefully. If you experience pain above 5/10, stop and contact me.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

