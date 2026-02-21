import React from "react";

const ControlPanel = ({
  handlePrev,
  handleNext,
  resetSession,
  handleEndExercise,
  handleReportPain,
  repCount,
  exercises,
  selectedExercise,
  isAnalyzing,
  showCompletionPopup,
  hasStartedExercising = false
}) => {
  const currentIndex = exercises.findIndex((e) => e.name === selectedExercise.name);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === exercises.length - 1;
  const disableControls = showCompletionPopup || isAnalyzing;

  return (
    <div className="bg-gray-800 dark:bg-slate-800 p-4 border-t border-gray-700 dark:border-slate-700 flex justify-between items-center">
      <button
        onClick={handlePrev}
        disabled={isFirst || disableControls}
        className="px-6 py-3 rounded-lg bg-gray-700/30 dark:bg-slate-700/30 hover:bg-gray-700/50 dark:hover:bg-slate-700/50 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center text-white border border-gray-600/30 dark:border-slate-600/30"
      >
        <span className="flex items-center gap-2 text-lg">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </span>
        {!isFirst && (
          <span className="text-xs text-gray-400 dark:text-slate-400 mt-1">
            {exercises[currentIndex - 1].name}
          </span>
        )}
      </button>
      <div className="flex gap-3">
        <button
          onClick={resetSession}
          disabled={repCount === 0 || disableControls}
          className="px-6 py-3 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-yellow-400 border border-yellow-500/30"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </span>
        </button>
        <button
            onClick={handleReportPain}
            disabled={disableControls || !hasStartedExercising}
            className="px-6 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-red-400 border border-red-500/30"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Pain Report
          </span>
        </button>
        <button
          onClick={handleEndExercise}
          disabled={isAnalyzing || !hasStartedExercising}
          className="px-8 py-3 rounded-lg bg-primary/20 dark:bg-cyan-500/20 hover:bg-primary/30 dark:hover:bg-cyan-500/30 transition font-semibold shadow-md disabled:opacity-50 text-lg disabled:cursor-not-allowed text-primary dark:text-cyan-400 border border-primary/30 dark:border-cyan-500/30"
        >
          <span className="flex items-center gap-2">
            {isAnalyzing ? (
              <>
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                End Session
              </>
            )}
          </span>
        </button>
      </div>
      <button
        onClick={handleNext}
        disabled={isLast || disableControls}
        className="px-6 py-3 rounded-lg bg-gray-700/30 dark:bg-slate-700/30 hover:bg-gray-700/50 dark:hover:bg-slate-700/50 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center text-white border border-gray-600/30 dark:border-slate-600/30"
      >
        <span className="flex items-center gap-2 text-lg">
          Next
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
        {!isLast && (
          <span className="text-xs text-gray-400 dark:text-slate-400 mt-1">
            {exercises[currentIndex + 1].name}
          </span>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;
