import React from "react";

export function StatCard({ icon, title, value, subtitle, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition cursor-pointer group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
          +2.5%
          <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </span>
      </div>
      <div>
        <h3 className="text-text-muted dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-text-primary dark:text-cyan-300">{value}</p>
        <p className="text-xs text-text-muted dark:text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

export function ActivityItem({ patient, activity, accuracy, time, status }) {
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer group">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-healify-light-cyan flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
        {patient.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-text-primary dark:text-slate-200 truncate">{patient}</h4>
          <span className="text-xs text-text-muted dark:text-slate-400 whitespace-nowrap">{time}</span>
        </div>
        <p className="text-xs text-text-muted dark:text-slate-400 truncate">{activity}</p>
      </div>
      <div className="text-right">
        <div className={`text-sm font-bold ${
          accuracy >= 90 ? 'text-green-600 dark:text-green-400' :
          accuracy >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {accuracy}%
        </div>
        <div className="text-[10px] text-text-muted dark:text-slate-500">Accuracy</div>
      </div>
    </div>
  );
}

export function AlertItem({ patient, pain, location }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl hover:shadow-sm transition cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-text-primary dark:text-slate-200">{patient}</h4>
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">Reported Pain Level: {pain}/10</p>
        <p className="text-xs text-text-muted dark:text-slate-400">Location: {location}</p>
      </div>
      <button className="px-3 py-1 bg-white dark:bg-slate-800 text-xs font-bold text-text-primary dark:text-slate-200 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition">
        Review
      </button>
    </div>
  );
}

export function PrescriptionItem({ patient, exercises, startDate, completion }) {
  return (
    <div className="p-4 border border-border dark:border-slate-600 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-700 transition">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-text-primary dark:text-slate-200">{patient}</h4>
        <span className="text-sm text-primary dark:text-cyan-400 font-bold">{completion}% Complete</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {exercises.map((ex, i) => (
          <span key={i} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
            {ex}
          </span>
        ))}
      </div>
      <p className="text-xs text-text-muted dark:text-slate-400">Started: {startDate}</p>
    </div>
  );
}
