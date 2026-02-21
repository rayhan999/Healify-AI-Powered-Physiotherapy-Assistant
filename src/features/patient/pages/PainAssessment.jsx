import React from "react";
import { useGetPatientRequestsQuery } from "../../../services/api/patientsApi";

export default function PainAssessmentSection() {
  const { data: requests = [], isLoading, error } = useGetPatientRequestsQuery();

  const getReasonBadge = (reason) => {
    const badges = {
      "Painful": { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", icon: "🔴" },
      "Too Difficult": { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", icon: "⚠️" },
      "Too Easy": { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", icon: "ℹ️" },
      "Schedule Conflict": { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", icon: "📅" },
      "Specific Issue": { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", icon: "⚡" },
      "Other": { bg: "bg-gray-100 dark:bg-gray-900/30", text: "text-gray-700 dark:text-gray-300", icon: "📝" },
    };
    return badges[reason] || badges["Other"];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-700 dark:text-red-300">Failed to load requests. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark dark:from-cyan-700 dark:to-cyan-900 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Requests & Reports</h2>
        <p className="text-white/90">View all your submitted requests and pain reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 dark:bg-cyan-900/30 rounded-lg">
              <svg className="w-6 h-6 text-primary dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-text-muted dark:text-slate-400">Total Requests</p>
              <p className="text-2xl font-bold text-text-primary dark:text-slate-200">{requests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-text-muted dark:text-slate-400">Pain Reports</p>
              <p className="text-2xl font-bold text-text-primary dark:text-slate-200">
                {requests.filter(r => r.reason === "Painful").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-text-muted dark:text-slate-400">Other Requests</p>
              <p className="text-2xl font-bold text-text-primary dark:text-slate-200">
                {requests.filter(r => r.reason !== "Painful").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-md border border-gray-100 dark:border-slate-700">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-text-primary dark:text-slate-200 mb-2">No Requests Yet</h3>
          <p className="text-text-muted dark:text-slate-400">You haven't submitted any requests or pain reports.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...requests]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Latest first
            .map((request) => {
            const badge = getReasonBadge(request.reason);
            const isPainful = request.reason === "Painful";
            
            return (
              <div 
                key={request.id} 
                className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border transition-all hover:shadow-lg ${
                  isPainful 
                    ? 'border-red-300 dark:border-red-800 ring-2 ring-red-100 dark:ring-red-900/50' 
                    : 'border-gray-100 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
                          {request.reason}
                        </span>
                        {request.exerciseName && (
                          <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {request.exerciseName}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-muted dark:text-slate-400">
                        {formatDate(request.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pain-specific details */}
                {isPainful && (request.painLocation || request.painLevel) && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-4">
                      {request.painLocation && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm font-medium text-red-700 dark:text-red-300">
                            Location: <span className="font-bold">{request.painLocation}</span>
                          </span>
                        </div>
                      )}
                      {request.painLevel && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-sm font-medium text-red-700 dark:text-red-300">
                            Pain Level: <span className="font-bold">{request.painLevel}/10</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes and Therapist Reply - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Patient Notes */}
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-text-muted dark:text-slate-400 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Details:
                    </p>
                    <p className="text-text-primary dark:text-slate-200">
                      {request.notes || '-'}
                    </p>
                  </div>

                  {/* Therapist Reply or System Message */}
                  {request.isAvoided ? (
                    // System-generated message for avoided requests
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border-2 border-amber-300 dark:border-amber-700">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1 uppercase tracking-wide">
                            System Message
                          </p>
                          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                            <strong>Your request has been reviewed.</strong> Your therapist has assessed your situation and determined that continuing with your current exercise plan is the best approach for now. 
                            Keep up the great work! 💪 If you experience any significant changes or concerns, please don't hesitate to submit a new request.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Therapist's actual reply
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Therapist's Reply:
                      </p>
                      {request.therapistReply ? (
                        <p className="text-text-primary dark:text-slate-200">{request.therapistReply}</p>
                      ) : (
                        <p className="text-text-muted dark:text-slate-400 italic text-sm">
                          Waiting for therapist response...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
