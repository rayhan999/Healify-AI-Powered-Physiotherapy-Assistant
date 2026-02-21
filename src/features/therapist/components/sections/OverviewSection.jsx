import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../contexts";
import { useGetTherapistDashboardQuery } from "../../../../services/api/analyticsApi";
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Calendar, 
  FileText,
  TrendingUp,
  BarChart3,
  Clock
} from "lucide-react";

export function OverviewSection({ setActiveTab }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const { data: analytics, isLoading, error } = useGetTherapistDashboardQuery();

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
          <p className="text-red-500 mb-4">{t('therapistDashboard.overview.error.loadFailed')}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            {t('therapistDashboard.overview.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  const cards = analytics?.cards || {};
  const charts = analytics?.charts || {};
  const recentActivity = analytics?.recent_activity || [];
  const pendingPainReports = analytics?.recent_requests || [];

  // Stats cards configuration
  const stats = [
    {
      title: t('therapistDashboard.overview.statsCards.totalPatients'),
      value: cards.total_patients || 0,
      subtitle: `${cards.active_patients || 0} ${t('therapistDashboard.overview.statsCards.active')}`,
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
      onClick: () => setActiveTab?.("patients")
    },
    {
      title: t('therapistDashboard.overview.statsCards.pendingReviews'),
      value: cards.pending_reviews || 0,
      subtitle: t('therapistDashboard.overview.statsCards.requiresAttention'),
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "bg-orange-100 dark:bg-orange-900",
      iconColor: "text-orange-600 dark:text-orange-400",
      onClick: () => setActiveTab?.("approvals")
    },
    {
      title: t('therapistDashboard.overview.statsCards.todaysSessions'),
      value: cards.todays_sessions || 0,
      subtitle: t('therapistDashboard.overview.statsCards.completedToday'),
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: t('therapistDashboard.overview.statsCards.activePrescriptions'),
      value: cards.total_active_prescriptions || 0,
      subtitle: t('therapistDashboard.overview.statsCards.currentlyActive'),
      icon: <FileText className="w-6 h-6" />,
      color: "bg-cyan-100 dark:bg-cyan-900",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      onClick: () => setActiveTab?.("prescriptions")
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={stat.onClick}
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 transition-all hover:shadow-xl ${
              stat.onClick ? 'cursor-pointer hover:scale-105' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <div className={stat.iconColor}>{stat.icon}</div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
              {stat.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-500">
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patients Over Time - Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">
              {t('therapistDashboard.overview.charts.patientsOverTime')}
            </h3>
          </div>
          <div className="relative h-64">
            {charts.patients_over_time && charts.patients_over_time.length > 0 ? (
              <>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 dark:text-slate-400">
                  {[...Array(5)].map((_, i) => {
                    const maxTotal = Math.max(...charts.patients_over_time.map(d => d.total));
                    const value = Math.round((maxTotal / 4) * (4 - i));
                    return <div key={i}>{value}</div>;
                  })}
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
                    <path
                      d={(() => {
                        const maxTotal = Math.max(...charts.patients_over_time.map(d => d.total));
                        const points = charts.patients_over_time.map((item, index) => {
                          const x = (index / (charts.patients_over_time.length - 1)) * 400;
                          const y = 200 - (item.total / maxTotal) * 180;
                          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ');
                        return points;
                      })()}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Area fill */}
                    <path
                      d={(() => {
                        const maxTotal = Math.max(...charts.patients_over_time.map(d => d.total));
                        const points = charts.patients_over_time.map((item, index) => {
                          const x = (index / (charts.patients_over_time.length - 1)) * 400;
                          const y = 200 - (item.total / maxTotal) * 180;
                          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ');
                        return `${points} L 400 200 L 0 200 Z`;
                      })()}
                      fill="url(#areaGradient)"
                      opacity="0.3"
                    />
                    
                    {/* Data points */}
                    {charts.patients_over_time.map((item, index) => {
                      const maxTotal = Math.max(...charts.patients_over_time.map(d => d.total));
                      const x = (index / (charts.patients_over_time.length - 1)) * 400;
                      const y = 200 - (item.total / maxTotal) * 180;
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
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-slate-400">
                    {charts.patients_over_time.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="font-medium">{item.date}</div>
                        <div className="text-green-600 dark:text-green-400 font-semibold">+{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400">
                {t('therapistDashboard.overview.error.noData')}
              </div>
            )}
          </div>
        </div>

        {/* Common Pain Triggers */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">
              {t('therapistDashboard.overview.charts.commonPainTriggers')}
            </h3>
          </div>
          <div className="space-y-3">
            {charts.common_pain_triggers?.filter(item => item.trigger).map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-slate-300">
                    {item.trigger || t('therapistDashboard.overview.charts.notSpecified')}
                  </span>
                  <span className="text-gray-600 dark:text-slate-400">
                    {item.percentage.toFixed(1)}% ({item.count})
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {(!charts.common_pain_triggers || charts.common_pain_triggers.filter(item => item.trigger).length === 0) && (
              <p className="text-center text-gray-500 dark:text-slate-400 py-4">
                {t('therapistDashboard.overview.error.noPainTriggers')}
              </p>
            )}
          </div>
        </div>

        {/* Most Effective Exercises */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">
              {t('therapistDashboard.overview.charts.mostEffectiveExercises')}
            </h3>
          </div>
          <div className="space-y-4">
            {charts.most_effective_exercises?.map((item, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {item.exercise}
                  </h4>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {item.average_accuracy}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {t('therapistDashboard.overview.charts.completedTimes', { count: item.count })}
                </p>
              </div>
            ))}
            {(!charts.most_effective_exercises || charts.most_effective_exercises.length === 0) && (
              <p className="text-center text-gray-500 dark:text-slate-400 py-4">
                {t('therapistDashboard.overview.error.noExerciseData')}
              </p>
            )}
          </div>
        </div>

        {/* Activity Distribution - Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-purple-500" />
            <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">
              {t('therapistDashboard.overview.charts.activityDistribution')}
            </h3>
          </div>
          
          {charts.activity_heatmap && charts.activity_heatmap.length > 0 ? (
            <div className="flex items-center justify-center gap-8">
              {/* Pie Chart */}
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {(() => {
                    const data = charts.activity_heatmap.slice(-7);
                    const total = data.reduce((sum, item) => sum + item.count, 0);
                    let currentAngle = 0;
                    
                    const colors = [
                      '#0891b2', // cyan-600
                      '#06b6d4', // cyan-500
                      '#22d3ee', // cyan-400
                      '#67e8f9', // cyan-300
                      '#14b8a6', // teal-500
                      '#2dd4bf', // teal-400
                      '#5eead4', // teal-300
                    ];
                    
                    return data.map((item, index) => {
                      const percentage = (item.count / total) * 100;
                      const angle = (item.count / total) * 360;
                      const startAngle = currentAngle;
                      const endAngle = currentAngle + angle;
                      
                      // Calculate path for pie slice
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      const x1 = 100 + 90 * Math.cos(startRad);
                      const y1 = 100 + 90 * Math.sin(startRad);
                      const x2 = 100 + 90 * Math.cos(endRad);
                      const y2 = 100 + 90 * Math.sin(endRad);
                      const largeArc = angle > 180 ? 1 : 0;
                      
                      const path = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`;
                      
                      currentAngle = endAngle;
                      
                      return (
                        <g key={index}>
                          <path
                            d={path}
                            fill={colors[index % colors.length]}
                            className="transition-all hover:opacity-80 cursor-pointer"
                            stroke="white"
                            strokeWidth="2"
                          >
                            <title>{`${new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}: ${item.count} (${percentage.toFixed(1)}%)`}</title>
                          </path>
                        </g>
                      );
                    });
                  })()}
                  
                  {/* Center circle for donut effect */}
                  <circle cx="100" cy="100" r="50" fill="white" className="dark:fill-slate-800" />
                  
                  {/* Center text */}
                  <text x="100" y="95" textAnchor="middle" className="fill-gray-800 dark:fill-white font-bold text-xl rotate-90" transform="rotate(90 100 100)">
                    {charts.activity_heatmap.slice(-7).reduce((sum, item) => sum + item.count, 0)}
                  </text>
                  <text x="100" y="110" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400 text-xs rotate-90" transform="rotate(90 100 100)">
                    {t('therapistDashboard.overview.charts.total')}
                  </text>
                </svg>
              </div>
              
              {/* Legend */}
              <div className="space-y-2">
                {charts.activity_heatmap.slice(-7).map((item, index) => {
                  const total = charts.activity_heatmap.slice(-7).reduce((sum, i) => sum + i.count, 0);
                  const percentage = ((item.count / total) * 100).toFixed(1);
                  const colors = [
                    'bg-cyan-600',
                    'bg-cyan-500',
                    'bg-cyan-400',
                    'bg-cyan-300',
                    'bg-teal-500',
                    'bg-teal-400',
                    'bg-teal-300',
                  ];
                  
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`}></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800 dark:text-white">
                          {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-slate-400">
                          {item.count} {t('therapistDashboard.overview.charts.sessions')} ({percentage}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-slate-400">
              {t('therapistDashboard.overview.error.noActivityData')}
            </div>
          )}
        </div>
          {/* Pending Patient Requests */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">
              {t('therapistDashboard.overview.charts.pendingRequests')}
            </h3>
          </div>
          {/* <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold">
            {pendingPainReports.length} Pending
          </span> */}
        </div>
        
        {pendingPainReports.length > 0 ? (
          <div className="space-y-4">
            {pendingPainReports.slice(0, 5).map((request, index) => {
              // Determine request type and assign colors + icons
              const isPainReport = request.pain_level || request.pain_location;
              const isPrescriptionChange = !isPainReport && request.description;
              
              const requestTypeInfo = isPainReport 
                ? {
                    border: 'border-red-500',
                    bg: 'bg-red-50 dark:bg-red-900/10',
                    badgeBg: 'bg-red-100 dark:bg-red-900/30',
                    badgeText: 'text-red-700 dark:text-red-300',
                    type: t('therapistDashboard.overview.charts.painReport'),
                    icon: '🔴'
                  }
                : isPrescriptionChange
                ? {
                    border: 'border-blue-500',
                    bg: 'bg-blue-50 dark:bg-blue-900/10',
                    badgeBg: 'bg-blue-100 dark:bg-blue-900/30',
                    badgeText: 'text-blue-700 dark:text-blue-300',
                    type: t('therapistDashboard.overview.charts.prescriptionChange'),
                    icon: '💊'
                  }
                : {
                    border: 'border-orange-500',
                    bg: 'bg-orange-50 dark:bg-orange-900/10',
                    badgeBg: 'bg-orange-100 dark:bg-orange-900/30',
                    badgeText: 'text-orange-700 dark:text-orange-300',
                    type: t('therapistDashboard.overview.charts.generalRequest'),
                    icon: '📝'
                  };
              
              return (
                <div 
                  key={index}
                  className={`border-l-4 ${requestTypeInfo.border} ${requestTypeInfo.bg} rounded-r-lg p-4 hover:shadow-md transition-all cursor-pointer`}
                  onClick={() => setActiveTab?.("approvals")}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <span className="text-2xl flex-shrink-0">{requestTypeInfo.icon}</span>
                    
                    <div className="flex-1">
                      {/* Header with name and type badge */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="font-semibold text-gray-800 dark:text-white">
                          {request.patient_name}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${requestTypeInfo.badgeBg} ${requestTypeInfo.badgeText}`}>
                          {requestTypeInfo.type}
                        </span>
                        {request.pain_level && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-4 rounded-sm ${
                                  i < request.pain_level
                                    ? 'bg-red-500'
                                    : 'bg-gray-300 dark:bg-slate-600'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 dark:text-slate-400 ml-1">
                              {request.pain_level}/5
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Pain location */}
                      {request.pain_location && (
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm text-gray-700 dark:text-slate-300">
                            <span className="font-medium">{t('therapistDashboard.overview.charts.location')}</span> {request.pain_location}
                          </span>
                        </div>
                      )}
                      
                      {/* Description */}
                      {request.description && (
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                          {request.description}
                        </p>
                      )}
                      
                      {/* No details fallback */}
                      {!request.pain_level && !request.pain_location && !request.description && (
                        <p className="text-sm text-gray-500 dark:text-slate-400 italic mb-2">
                          {t('therapistDashboard.overview.error.noAdditionalDetails')}
                        </p>
                      )}
                      
                      {/* Footer with timestamp and status */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(request.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'pending' 
                            ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                            : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {pendingPainReports.length > 5 && (
              <button
                onClick={() => setActiveTab?.("approvals")}
                className="w-full py-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
              >
                View all {pendingPainReports.length} requests →
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-slate-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t('therapistDashboard.overview.error.noPendingRequests')}</p>
          </div>
        )}
      </div>
      </div>

    

      {/* Recent Activity Feed */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">
            {t('therapistDashboard.overview.charts.recentActivity')}
          </h3>
          <button 
            onClick={() => setActiveTab?.("monitoring")}
            className="text-primary dark:text-cyan-400 text-sm font-semibold hover:underline"
          >
            {t('therapistDashboard.overview.charts.viewAll')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                  {t('therapistDashboard.overview.table.patientName')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                  {t('therapistDashboard.overview.table.exercise')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                  {t('therapistDashboard.overview.table.accuracy')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                  {t('therapistDashboard.overview.table.date')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
              {recentActivity.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {activity.patient_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {activity.patient_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">
                    {activity.exercise_name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            activity.accuracy >= 80 ? 'bg-green-500' :
                            activity.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${activity.accuracy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                        {activity.accuracy}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentActivity.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-slate-400">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{t('therapistDashboard.overview.error.noRecentActivity')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
