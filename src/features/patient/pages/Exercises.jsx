import React, { useState } from "react";
import { useLanguage } from "../../../contexts";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useToast } from "../../../components/ui";
import ExerciseLibrary from '../../exercise/pages/ExerciseLibrary';
import { EXERCISE_METADATA } from '../../../constants/exerciseData';

export default function ExercisesSection({ hasPrescription }) {
  const { patientData } = useOutletContext() || {};
  const prescriptionStatus = patientData?.hasPrescription ?? hasPrescription;
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState(prescriptionStatus ? "prescribed" : "all");
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [selectedReps, setSelectedReps] = useState({});
  const navigate = useNavigate();

  if (showExerciseLibrary) {
    return (
      <ExerciseLibrary
        onStartExercise={(exercise) => {
          setShowExerciseLibrary(false);
        }}
        onClose={() => setShowExerciseLibrary(false)}
      />
    );
  }

  // Map EXERCISE_METADATA to the format expected by the UI
  // Note: We're simulating "prescribed" vs "all" for now by just splitting the list or reusing it.
  // In a real app, prescribed would come from API.
  const exerciseList = Object.entries(EXERCISE_METADATA).map(([key, data], index) => ({
    id: index + 1,
    name: data.label,
    difficulty: data.difficulty,
    duration: "5 min", // Default duration as it's not in metadata yet
    gradient: index % 2 === 0 ? "from-blue-400 to-blue-600" : "from-purple-400 to-purple-600", // Simple alternating gradient
    bodyPart: data.targetBodyPart ? data.targetBodyPart.toLowerCase() : "general"
  }));

  const prescribedExercises = exerciseList;
  const allExercises = exerciseList;

  const exercises = viewMode === "prescribed" ? prescribedExercises : allExercises;

  return (
    <div className="space-y-6">
      {prescriptionStatus && (
        <div className="flex gap-4">
          <button
            onClick={() => setViewMode("prescribed")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              viewMode === "prescribed"
                ? "bg-primary text-white"
                : "bg-white dark:bg-slate-800 text-text-body dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-transparent dark:border-cyan-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {t('patientDashboard.exercises.title')}
            </span>
          </button>
          <button
            onClick={() => setViewMode("all")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              viewMode === "all"
                ? "bg-primary text-white"
                : "bg-white dark:bg-slate-800 text-text-body dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-transparent dark:border-cyan-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {t('patientDashboard.exercises.filterAll')}
            </span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => {
          const getExerciseIllustration = (bodyPart) => {
            switch(bodyPart) {
              case "shoulder":
                return (
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="20" r="8" fill="white" opacity="0.9"/>
                      <line x1="50" y1="28" x2="50" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <g style={{ transformOrigin: '50px 35px', animation: 'pushUpArms 2s ease-in-out infinite' }}>
                        <line x1="50" y1="35" x2="30" y2="45" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                        <line x1="30" y1="45" x2="25" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                         <line x1="50" y1="35" x2="70" y2="45" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                        <line x1="70" y1="45" x2="75" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </g>
                      <line x1="50" y1="55" x2="40" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="55" x2="60" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </div>
                );
              case "full body":
                return (
                   <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                       <circle cx="50" cy="25" r="8" fill="white" opacity="0.9"/>
                       <line x1="50" y1="33" x2="50" y2="60" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                       <g style={{ transformOrigin: '50px 40px', animation: 'jumpJacksArms 1.5s ease-in-out infinite' }}>
                          <line x1="50" y1="40" x2="30" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                          <line x1="50" y1="40" x2="70" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                       </g>
                       <g style={{ transformOrigin: '50px 60px', animation: 'jumpJacksLegs 1.5s ease-in-out infinite' }}>
                          <line x1="50" y1="60" x2="35" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                          <line x1="50" y1="60" x2="65" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                       </g>
                    </svg>
                   </div>
                );
              case "legs":
                return (
                   <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                       <circle cx="50" cy="20" r="8" fill="white" opacity="0.9"/>
                       <line x1="50" y1="28" x2="50" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                       <line x1="50" y1="35" x2="35" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                       <line x1="50" y1="35" x2="65" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                       <line x1="50" y1="55" x2="50" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                       <g style={{ transformOrigin: '50px 55px', animation: 'highKnees 1s ease-in-out infinite' }}>
                         <line x1="50" y1="55" x2="65" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                         <line x1="65" y1="55" x2="65" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                       </g>
                    </svg>
                   </div>
                );
              case "knee":
                return (
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="15" r="7" fill="white" opacity="0.9"/>
                      <line x1="50" y1="22" x2="50" y2="45" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="28" x2="35" y2="38" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="28" x2="65" y2="38" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="45" x2="45" y2="65" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="45" y1="65" x2="43" y2="80" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <g style={{ transformOrigin: '50px 45px', animation: 'kneeFlex 2s ease-in-out infinite' }}>
                        <line x1="50" y1="45" x2="55" y2="60" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                        <g style={{ transformOrigin: '55px 60px', animation: 'kneeFlexLower 2s ease-in-out infinite' }}>
                          <line x1="55" y1="60" x2="65" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                        </g>
                      </g>
                    </svg>
                  </div>
                );
              case "back":
                return (
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="25" r="7" fill="white" opacity="0.9"/>
                      <g style={{ transformOrigin: '50px 50px', animation: 'backExtension 2.5s ease-in-out infinite' }}>
                        <path d="M 50 32 Q 50 45, 50 55" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
                        <line x1="50" y1="38" x2="30" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                        <line x1="50" y1="38" x2="70" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </g>
                      <line x1="50" y1="55" x2="43" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="55" x2="57" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="43" y1="75" x2="40" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="57" y1="75" x2="60" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </div>
                );
              case "hip":
                return (
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="18" r="7" fill="white" opacity="0.9"/>
                      <line x1="50" y1="25" x2="50" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="30" x2="30" y2="35" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="30" x2="70" y2="35" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="48" x2="45" y2="70" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="45" y1="70" x2="43" y2="82" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <g style={{ transformOrigin: '50px 48px', animation: 'hipStretch 2.5s ease-in-out infinite' }}>
                        <line x1="50" y1="48" x2="70" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                        <line x1="70" y1="55" x2="80" y2="58" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </g>
                    </svg>
                  </div>
                );
              case "ankle":
                return (
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="15" r="7" fill="white" opacity="0.9"/>
                      <line x1="50" y1="22" x2="50" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="28" x2="35" y2="40" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="28" x2="65" y2="40" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="48" x2="42" y2="68" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="42" y1="68" x2="42" y2="80" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="42" y1="80" x2="38" y2="80" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="48" x2="58" y2="68" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="58" y1="68" x2="58" y2="80" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <circle cx="58" cy="80" r="3" fill="white" opacity="0.8"/>
                      <g style={{ transformOrigin: '58px 80px', animation: 'ankleRotate 2s linear infinite' }}>
                        <circle cx="58" cy="80" r="6" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"/>
                        <line x1="58" y1="80" x2="66" y2="80" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </g>
                    </svg>
                  </div>
                );
              case "neck":
                return (
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <g style={{ transformOrigin: '50px 30px', animation: 'neckStretch 2.5s ease-in-out infinite' }}>
                        <circle cx="50" cy="22" r="8" fill="white" opacity="0.9"/>
                        <line x1="50" y1="30" x2="50" y2="35" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </g>
                      <line x1="50" y1="35" x2="50" y2="60" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="40" x2="38" y2="28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="38" y1="28" x2="42" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="40" x2="62" y2="28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="60" x2="43" y2="78" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="60" x2="57" y2="78" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="43" y1="78" x2="40" y2="88" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="57" y1="78" x2="60" y2="88" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </div>
                );
              default:
                return (
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="20" r="8" fill="white" opacity="0.9"/>
                      <line x1="50" y1="28" x2="50" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="35" x2="35" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="35" x2="65" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="55" x2="40" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="50" y1="55" x2="60" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </div>
                );
            }
          };

          return (
            <div
              key={exercise.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover-lift cursor-pointer border border-transparent dark:border-cyan-900"
            >
              <div className={`h-40 bg-gradient-to-br ${exercise.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="relative z-10">
                  {getExerciseIllustration(exercise.bodyPart)}
                </div>
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-bold">{exercise.bodyPart.toUpperCase()}</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-text-primary dark:text-cyan-300 mb-2">{exercise.name}</h4>
                <div className="flex items-center gap-4 text-sm text-text-muted dark:text-slate-400 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-slate-500">Reps:</label>
                    <select
                      value={selectedReps[exercise.id] || 10}
                      onChange={(e) => {
                         const val = parseInt(e.target.value);
                         setSelectedReps(prev => ({ ...prev, [exercise.id]: val }));
                      }}
                      className="bg-gray-100 dark:bg-slate-700 border-none text-text-primary dark:text-slate-200 text-sm rounded-md px-2 py-1 font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors focus:ring-2 focus:ring-primary/50"
                    >
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <span
                    className={`px-2 py-1 rounded font-medium ${
                      exercise.difficulty === "Beginner"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : exercise.difficulty === "Intermediate"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {exercise.difficulty}
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const reps = selectedReps[exercise.id] || 10;
                    navigate(`/patient-dashboard/tracking/exercise-tracker?exercise_name=${encodeURIComponent(exercise.name)}&reps=${reps}`);
                  }}
                  className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
                >
                  {t('patientDashboard.exercises.startExercise')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => setShowExerciseLibrary(true)}
          className="px-8 py-4 bg-gradient-to-r from-primary to-healify-light-cyan text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold inline-flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {t('patientDashboard.exercises.title')}
        </button>
        <p className="text-text-muted dark:text-slate-400 text-sm mt-2">
          {t('patientDashboard.exercises.subtitle')}
        </p>
      </div>
    </div>
  );
}

