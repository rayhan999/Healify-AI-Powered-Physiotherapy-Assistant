import React, { useState } from "react";
import { useLanguage } from "../../../contexts";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { useToast } from "../../../components/ui";
import LiveExerciseTracking from '../../exercise/pages/LiveExerciseTracking';
import ExerciseTracker from '../../exercise/pages/ExerciseTracker';
import { useNavigate } from "react-router-dom";
import { useGetTodayExercisesQuery } from "../../../services/api/patientsApi";
import { useAuth } from "../../../contexts/AuthContext";

export default function LiveTrackingSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showFullTracking, setShowFullTracking] = useState(false);
  const [searchParams] = useSearchParams();
  const prescriptionId = searchParams.get('prescription_id');
  
  // Fetch today's exercises - refetch every time user visits this page
  const { data: todayExercisesData, isLoading: loadingExercises } = useGetTodayExercisesQuery(
    user?.id,
    { 
      skip: !user?.id,
      refetchOnMountOrArgChange: true // Force refresh on every page visit
    }
  );

  // Extract exercises array - API might return { exercises: [...] } or just [...]
  const todayExercises = Array.isArray(todayExercisesData) 
    ? todayExercisesData 
    : todayExercisesData?.exercises || [];

  // Check if all exercises are completed
  const allExercisesCompleted = todayExercises.length > 0 && todayExercises.every(exercise => 
    exercise.status === 'completed' || exercise.completed || exercise.isCompleted || exercise.is_completed
  );

  console.log("📋 Today's exercises data:", todayExercisesData);
  console.log("📋 Extracted exercises:", todayExercises);
  console.log("✅ All exercises completed:", allExercisesCompleted);

  // If prescription_id is present, show ExerciseTracker
  if (prescriptionId) {
    return <ExerciseTracker prescriptionId={prescriptionId} />;
  }

  if (showFullTracking) {
    return (
      <LiveExerciseTracking
        onComplete={(sessionData) => {
          setShowFullTracking(false);
        }}
        onExit={() => setShowFullTracking(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-transparent dark:border-cyan-900">
        <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300">{t('patientDashboard.liveTracking.title')}</h3>
        <p className="text-text-muted dark:text-slate-300 mb-6">{t('patientDashboard.liveTracking.subtitle')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary/10 to-healify-light-cyan/10 dark:from-cyan-900/30 dark:to-cyan-800/20 rounded-xl p-6 text-center border border-primary/20 dark:border-cyan-700">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-bold text-text-primary dark:text-cyan-300 mb-1">{t('patientDashboard.liveTracking.liveCamera')}</h4>
            <p className="text-sm text-text-muted dark:text-slate-400 dark:text-slate-400">{t('patientDashboard.liveTracking.liveCameraDesc')}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-700">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-text-primary dark:text-cyan-300 mb-1">{t('patientDashboard.liveTracking.aiFeedback')}</h4>
            <p className="text-sm text-text-muted dark:text-slate-400 dark:text-slate-400">{t('patientDashboard.liveTracking.aiFeedbackDesc')}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 rounded-xl p-6 text-center border border-orange-200 dark:border-orange-700">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h4 className="font-bold text-text-primary dark:text-cyan-300 mb-1">{t('patientDashboard.liveTracking.autoCount')}</h4>
            <p className="text-sm text-text-muted dark:text-slate-400 dark:text-slate-400">{t('patientDashboard.liveTracking.autoCountDesc')}</p>
          </div>
        </div>

        {/* Today's Assigned Exercises */}
        {loadingExercises ? (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
            <p className="text-center text-text-muted dark:text-slate-400">Loading today's exercises...</p>
          </div>
        ) : todayExercises && todayExercises.length > 0 ? (
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-cyan-900/20 dark:to-cyan-800/10 rounded-xl border border-blue-200 dark:border-cyan-700">
            <h4 className="font-bold text-text-primary dark:text-cyan-300 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Today's Assigned Exercises
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {todayExercises.map((exercise, index) => {
                console.log(`Exercise ${index}:`, exercise);
                const isCompleted = exercise.status === 'completed' || exercise.completed || exercise.isCompleted || exercise.is_completed || false;
               
                return (
                  <div key={index} className={`bg-white dark:bg-slate-800 rounded-lg p-3 border ${isCompleted ? 'border-green-400 dark:border-green-600' : 'border-blue-200 dark:border-cyan-700'}`}>
                    <div className="flex items-start gap-2">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCompleted ? 'bg-green-500 text-white' : 'bg-primary/10 dark:bg-cyan-900/40 text-primary dark:text-cyan-300'}`}>
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className={`font-semibold text-sm ${isCompleted ? 'text-green-700 dark:text-green-400' : 'text-text-primary dark:text-slate-200'}`}>
                            {exercise.exerciseName || exercise.name || exercise.exercise_name || 'Exercise'}
                          </h5>
                          {isCompleted && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                              ✓ Done
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted dark:text-slate-400 mt-1">
                          {exercise.reps || exercise.repetitions || 0} reps
                          {exercise.sets && ` × ${exercise.sets} sets`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
            <p className="text-center text-yellow-700 dark:text-yellow-400">
              No exercises assigned. If you want to perform standalone exercises, please visit the <button onClick={() => navigate('/patient-dashboard/exercises')} className="underline font-semibold hover:text-green-800 dark:hover:text-green-200">Exercise Page</button>.
            </p>
          </div>
        )}

        {/* All Exercises Completed Info */}
        {allExercisesCompleted && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h5 className="font-bold text-green-700 dark:text-green-400 mb-1">🎉 All Exercises Completed!</h5>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Great job! You've completed all assigned exercises for today. 
                  If you want to perform standalone exercises, please visit the <button onClick={() => navigate('/patient-dashboard/exercises')} className="underline font-semibold hover:text-green-800 dark:hover:text-green-200">Exercise Page</button>.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate(`/patient-dashboard/tracking/exercise-tracker`)}
          disabled={allExercisesCompleted || todayExercises.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
            allExercisesCompleted || todayExercises.length === 0
              ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-primary to-healify-light-cyan text-white hover:shadow-2xl transform hover:scale-105'
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start Live Exercise Session
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-transparent dark:border-cyan-900">
        <h4 className="text-lg font-bold text-text-primary dark:text-cyan-300 mb-4">{t('patientDashboard.liveTracking.howItWorks')}</h4>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 dark:bg-cyan-900/40 rounded-full flex items-center justify-center text-primary dark:text-cyan-300 font-bold">
              1
            </div>
            <div>
              <h5 className="font-semibold text-text-primary dark:text-slate-200">{t('patientDashboard.liveTracking.step1Title')}</h5>
              <p className="text-sm text-text-muted dark:text-slate-400 dark:text-slate-400">{t('patientDashboard.liveTracking.step1Desc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 dark:bg-cyan-900/40 rounded-full flex items-center justify-center text-primary dark:text-cyan-300 font-bold">
              2
            </div>
            <div>
              <h5 className="font-semibold text-text-primary dark:text-slate-200">{t('patientDashboard.liveTracking.step2Title')}</h5>
              <p className="text-sm text-text-muted dark:text-slate-400 dark:text-slate-400">{t('patientDashboard.liveTracking.step2Desc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 dark:bg-cyan-900/40 rounded-full flex items-center justify-center text-primary dark:text-cyan-300 font-bold">
              3
            </div>
            <div>
              <h5 className="font-semibold text-text-primary dark:text-slate-200">{t('patientDashboard.liveTracking.step3Title')}</h5>
              <p className="text-sm text-text-muted dark:text-slate-400 dark:text-slate-400">{t('patientDashboard.liveTracking.step3Desc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 dark:bg-cyan-900/40 rounded-full flex items-center justify-center text-primary dark:text-cyan-300 font-bold">
              4
            </div>
            <div>
              <h5 className="font-semibold text-text-primary dark:text-slate-200">{t('patientDashboard.liveTracking.step4Title')}</h5>
              <p className="text-sm text-text-muted dark:text-slate-400 dark:text-slate-400">{t('patientDashboard.liveTracking.step4Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

