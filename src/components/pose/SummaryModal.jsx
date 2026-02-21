import React from "react";

const SummaryModal = ({
  showSummaryModal,
  setShowSummaryModal,
  isAnalyzing,
  summaryData,
  resetSession,
  onSave,
  onRetry,
  prescriptionId,
}) => {
  if (!showSummaryModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-3xl p-0 max-w-3xl w-full shadow-2xl border border-gray-700 relative flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-900/50 p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">{summaryData?.error ? '⚠️' : '✨'}</span> 
            {summaryData?.error ? 'Session Report' : 'Session Insights'}
          </h2>
          {summaryData?.total_exercises && !summaryData?.error && (
             <div className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium">
               {summaryData.total_exercises} Exercises Completed
             </div>
          )}
          {summaryData?.error && (
             <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium">
               Error Occurred
             </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              {/* Spinner */}
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Generating Report...</h3>
                <p className="text-gray-400 text-sm">Analyzing your form and performance</p>
              </div>
            </div>
          ) : summaryData ? (
            <div className="space-y-4 text-gray-300 leading-relaxed session-analysis-content">
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: summaryData.summary }}
              />
            </div>
          ) : (
             <div className="text-center py-12 text-red-400">
               Failed to load summary data.
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-900/50 border-t border-gray-700 flex justify-center gap-4">
          {summaryData?.error && (
            <button
              onClick={onRetry}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>🔄</span> Retry Report Generation
            </button>
          )}
          <button
            onClick={onSave}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-900/20 flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>💾</span> {summaryData?.error ? 'Save Data to Regenerate Report' : prescriptionId ? 'Save & Send Report' : 'Save Report'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SummaryModal;
