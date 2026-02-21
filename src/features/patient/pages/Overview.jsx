import React from "react";
import { useLanguage } from "../../../contexts";
import { useGetPatientDashboardQuery } from "../../../services/api/analyticsApi";
import { 
  Activity, 
  TrendingUp, 
  Award,
  User,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  BarChart3,
  Target
} from "lucide-react";

function StatCard({ icon, title, value, subtitle, color, iconColor }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
        {title}
      </p>
      <p className="text-xs text-gray-500 dark:text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

export default function OverviewSection() {
  const { t } = useLanguage();
  
  const { data: analytics, isLoading, error } = useGetPatientDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">{t('patientDashboard.overview.error.loadFailed')}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            {t('patientDashboard.overview.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  const progress = analytics?.personal_progress || {};
  const visualizations = analytics?.visualizations || {};
  const breakdown = analytics?.exercise_breakdown || {};

  // Stats cards
  const stats = [
    {
      title: t('patientDashboard.overview.statsCards.sessionsCompleted'),
      value: progress.sessions_completed || 0,
      subtitle: t('patientDashboard.overview.statsCards.totalSessionsFinished'),
      icon: <Activity className="w-6 h-6" />,
      color: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: t('patientDashboard.overview.statsCards.averageFormScore'),
      value: `${progress.average_form_score || 0}%`,
      subtitle: t('patientDashboard.overview.statsCards.overallAccuracy'),
      icon: <Award className="w-6 h-6" />,
      color: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: t('patientDashboard.overview.statsCards.currentStreak'),
      value: `${progress.current_streak || 0} ${t('patientDashboard.overview.statsCards.days')}`,
      subtitle: t('patientDashboard.overview.statsCards.keepItUp'),
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-orange-100 dark:bg-orange-900",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
   
    {
      title: t('patientDashboard.overview.statsCards.totalRequests'),
      value: progress.total_requests || 0,
      subtitle: t('patientDashboard.overview.statsCards.submittedByYou'),
      icon: <MessageSquare className="w-6 h-6" />,
      color: "bg-pink-100 dark:bg-pink-900",
      iconColor: "text-pink-600 dark:text-pink-400",
    }, {
      title: t('patientDashboard.overview.statsCards.currentTherapist'),
      value: progress.current_therapist || t('patientDashboard.overview.statsCards.notAssigned'),
      subtitle: t('patientDashboard.overview.statsCards.yourCareProvider'),
      icon: <User className="w-6 h-6" />,
      color: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* First Row: Accuracy Trend (3/4) + Today's Exercises (1/4) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Accuracy Trend - Line Chart */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">
                {t('patientDashboard.overview.charts.accuracyTrend')}
              </h3>
            </div>
            <div className="relative h-64">
              {visualizations.accuracy_trend && visualizations.accuracy_trend.length > 0 ? (
                <>
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 dark:text-slate-400">
                    {[100, 75, 50, 25, 0].map((value, i) => (
                      <div key={i}>{value}%</div>
                    ))}
                  </div>
                  
                  {/* Chart area */}
                  <div className="ml-8 h-full">
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      {/* Grid lines */}
                      {[...Array(5)].map((_, i) => (
                        <line
                          key={i}
                          x1="0"
                          y1={i * 50}
                          x2="400"
                          y2={i * 50}
                          stroke="currentColor"
                          className="text-gray-200 dark:text-slate-700"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {/* Line path */}
                      {visualizations.accuracy_trend.length > 1 && (
                        <>
                          <path
                            d={(() => {
                              const points = visualizations.accuracy_trend.map((item, index) => {
                                const x = (index / (visualizations.accuracy_trend.length - 1)) * 400;
                                const y = 200 - (item.average_accuracy / 100) * 180;
                                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                              }).join(' ');
                              return points;
                            })()}
                            fill="none"
                            stroke="url(#accuracyLineGradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Area fill */}
                          <path
                            d={(() => {
                              const points = visualizations.accuracy_trend.map((item, index) => {
                                const x = (index / (visualizations.accuracy_trend.length - 1)) * 400;
                                const y = 200 - (item.average_accuracy / 100) * 180;
                                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                              }).join(' ');
                              return `${points} L 400 200 L 0 200 Z`;
                            })()}
                            fill="url(#accuracyAreaGradient)"
                            opacity="0.3"
                          />
                        </>
                      )}
                      
                      {/* Data points */}
                      {visualizations.accuracy_trend.map((item, index) => {
                        const x = visualizations.accuracy_trend.length > 1 
                          ? (index / (visualizations.accuracy_trend.length - 1)) * 400 
                          : 200;
                        const y = 200 - (item.average_accuracy / 100) * 180;
                        return (
                          <g key={index}>
                            <circle
                              cx={x}
                              cy={y}
                              r="4"
                              fill="white"
                              stroke="currentColor"
                              className="text-primary"
                              strokeWidth="2"
                            />
                          </g>
                        );
                      })}
                      
                      {/* Gradients */}
                      <defs>
                        <linearGradient id="accuracyLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <linearGradient id="accuracyAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-slate-400">
                      {visualizations.accuracy_trend.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="font-medium">
                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-blue-600 dark:text-blue-400 font-semibold">
                            {item.average_accuracy}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400">
                  {t('patientDashboard.overview.error.noAccuracyData')}
                </div>
              )}
            </div>
          </div>

          {/* Today's Exercises */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-bold text-text-primary dark:text-cyan-300">
                {t('patientDashboard.overview.charts.todaysExercises')}
              </h3>
            </div>
            <div className="space-y-3">
              {visualizations.todays_exercises && visualizations.todays_exercises.length > 0 ? (
                visualizations.todays_exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      exercise.completed ? "bg-green-500" : "bg-gray-300 dark:bg-slate-600"
                    }`}>
                      {exercise.completed && (
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${
                        exercise.completed 
                          ? "text-text-muted dark:text-slate-400 line-through" 
                          : "text-text-primary dark:text-slate-200"
                      }`}>
                        {exercise.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-xs text-text-muted dark:text-slate-400">
                        {exercise.session}
                      </p>
                    </div>
                    {exercise.completed && (
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        ✓
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-slate-400 text-sm">
                  <p>{t('patientDashboard.overview.error.noExercisesToday')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Second Row: Favourite Exercises + Exercise Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          

          {/* Exercise Breakdown */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-text-primary dark:text-cyan-300">
              {t('patientDashboard.overview.charts.exerciseBreakdown')}
            </h3>
          </div>
          <div className="space-y-4">
            {/* Best Performing */}
            <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 dark:bg-green-900/20 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-green-700 dark:text-green-400 text-sm">
                  {t('patientDashboard.overview.charts.bestPerforming')}
                </h4>
              </div>
              <p className="font-bold text-lg text-gray-800 dark:text-white mb-1">
                {breakdown.best_performing_exercise?.exercise || "N/A"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(breakdown.best_performing_exercise?.average_accuracy || 0)}%
                </span>
                <span className="text-xs text-gray-600 dark:text-slate-400">
                  {t('patientDashboard.overview.charts.averageAccuracy')}
                </span>
              </div>
            </div>

            {/* Needs Improvement */}
            <div className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50 dark:bg-orange-900/20 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <h4 className="font-semibold text-orange-700 dark:text-orange-400 text-sm">
                  {t('patientDashboard.overview.charts.needsImprovement')}
                </h4>
              </div>
              <p className="font-bold text-lg text-gray-800 dark:text-white mb-1">
                {breakdown.needs_improvement?.exercise || "N/A"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(breakdown.needs_improvement?.average_accuracy || 0)}%
                </span>
                <span className="text-xs text-gray-600 dark:text-slate-400">
                  average accuracy
                </span>
              </div>
            </div>
          </div>
          </div>
          {/* Favourite Exercises - Vertical Bar Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">
                {t('patientDashboard.overview.charts.favouriteExercises')}
              </h3>
            </div>
            <div className="h-64">
              {visualizations.favourite_exercises && visualizations.favourite_exercises.length > 0 ? (
                <div className="h-full flex items-end justify-center gap-6 px-4">
                  {visualizations.favourite_exercises.map((exercise, index) => {
                    const maxCount = Math.max(...visualizations.favourite_exercises.map(e => e.count));
                    const heightPercentage = (exercise.count / maxCount) * 100;
                    
                   
                    
                    return (
                      <div key={index} className="flex flex-col items-center w-20 h-full pb-6">
                        {/* Bar area with flex-1 to take available height */}
                        <div className="flex-1 w-full relative flex items-end justify-center">
                          {/* Count above bar - absolute positioned */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                            <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                              {exercise.count}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">{t('patientDashboard.overview.charts.times')}</div>
                          </div>
                          
                          {/* The actual bar */}
                          <div 
                            className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 rounded-t-lg transition-all hover:opacity-80 relative group"
                            style={{ height: `${heightPercentage}%`, minHeight: '8px' }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              {exercise.count} sessions
                            </div>
                          </div>
                        </div>
                        
                        {/* Exercise name at bottom */}
                        <div className="text-xs font-medium text-gray-700 dark:text-slate-300 text-center w-full truncate">
                          {exercise.exercise}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400">
                  <p>{t('patientDashboard.overview.error.noExerciseHistory')}</p>
                </div>
              )}
            </div>
          </div>
           {/* Motivational Banner */}
      <div className="bg-gradient-to-r from-primary via-cyan-500 to-teal-500 dark:from-[#024B87] dark:via-[#1B9AAE] dark:to-[#0a3d4a] rounded-xl flex items-center justify-center shadow-lg p-8 text-white">
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-16 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center">
            <Award className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-2">{t('patientDashboard.overview.motivational.keepUpGreatWork')}</h3>
            <p className="text-white/90 dark:text-white/80 text-xl">
              {t('patientDashboard.overview.motivational.completedSessions', { count: progress.sessions_completed || 0, accuracy: progress.average_form_score || 0 })}
              {progress.current_streak > 0 && ` ${t('patientDashboard.overview.motivational.onStreak', { days: progress.current_streak })}`}
            </p>
          </div>
        </div>
      </div>
        </div>
      </div>

     
    </div>
  );
}
