import React, { useState } from "react";
import { useSubmitPatientRequestMutation } from "../../services/api/patientsApi";
import { useAuth } from "../../contexts/AuthContext";

export default function RequestChangeModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting, 
  defaultReason = "Too Difficult",
  exerciseList = [],
  currentExercise = "",
  therapistId = null,
  prescriptionId = null
}) {
  const { user } = useAuth();
  const [submitRequest, { isLoading: isSubmittingApi }] = useSubmitPatientRequestMutation();
  
  const [requestReason, setRequestReason] = useState(defaultReason);
  const [requestNotes, setRequestNotes] = useState("");
  const [painLocation, setPainLocation] = useState("");
  const [painLevel, setPainLevel] = useState(5);
  const [exerciseName, setExerciseName] = useState(currentExercise);

  // Update reason when defaultReason changes
  React.useEffect(() => {
    if (isOpen) {
      setRequestReason(defaultReason);
      setExerciseName(currentExercise);
    }
  }, [isOpen, defaultReason, currentExercise]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const submitData = { 
      reason: requestReason, 
      notes: requestNotes,
      exerciseName: exerciseName,
      patientId: user?.id
    };
    
    // Include therapist ID if available
    if (therapistId) {
      submitData.therapistId = therapistId;
    }
    
    // Include prescription ID if available
    if (prescriptionId) {
      submitData.prescriptionId = prescriptionId;
    }
    
    // Include pain data if reason is "Painful"
    if (requestReason === "Painful") {
      submitData.painLocation = painLocation;
      submitData.painLevel = painLevel;
    }
    
    console.log("📋 Request Change/Pain Report Submission:", submitData);
    
    try {
      // Call the API mutation
      await submitRequest(submitData).unwrap();
      
      // Call parent's onSubmit callback (for any additional handling)
      onSubmit(submitData);
      
      // Reset form
      setRequestReason("Too Difficult");
      setRequestNotes("");
      setPainLocation("");
      setPainLevel(5);
      setExerciseName("");
      
      // Close modal on success
      onClose();
    } catch (error) {
      console.error("Failed to submit request:", error);
      // Close modal even on error (error will be logged)
      onClose();
    }
  };

  const isPainRelated = requestReason === "Painful";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-text-primary dark:text-cyan-300">Request Change / Report Issue</h3>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text-primary dark:text-slate-400 dark:hover:text-slate-200 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-slate-300 mb-2">
              Reason
            </label>
            <select
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="Too Difficult">All Exercises are too difficult</option>
              <option value="Too Easy">Exercises are too easy</option>
              <option value="Painful">Exercises cause pain</option>
              <option value="Schedule Conflict">Cannot fit into schedule</option>
              <option value="Specific Issue">Issue with this specific exercise</option>
              <option value="Other">Other</option>
            </select>
          </div>


          {/* Exercise Name and Pain Location on same row */}
          <div className={`grid gap-4 ${isPainRelated ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Exercise Name Dropdown */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-slate-300 mb-2">
                Exercise Name {exerciseList.length > 0 && "(Optional)"}
              </label>
              {exerciseList.length > 0 ? (
                <select
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">All exercises / General feedback</option>
                  {exerciseList.map((exercise, idx) => (
                    <option key={idx} value={exercise}>
                      {exercise}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  placeholder="Enter exercise name (optional)"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              )}
            </div>

            {/* Pain Location - only show when "Painful" is selected */}
            {isPainRelated && (
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-slate-300 mb-2">
                  Pain Location
                </label>
                <input
                  type="text"
                  value={painLocation}
                  onChange={(e) => setPainLocation(e.target.value)}
                  placeholder="e.g., Lower back, Right knee..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            )}
          </div>



          {/* Pain Level - full width when shown */}
          {isPainRelated && (
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-slate-300 mb-2">
                Pain Level: <span className="text-primary dark:text-cyan-400 font-bold">{painLevel}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-text-muted dark:text-slate-400 mt-1">
                <span>Mild (1)</span>
                <span>Moderate (5)</span>
                <span>Severe (10)</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-slate-300 mb-2">
              Details
            </label>
            <textarea
              value={requestNotes}
              onChange={(e) => setRequestNotes(e.target.value)}
              placeholder="Please describe why you need a change or report pain..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-text-primary dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] resize-none"
            />
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl flex gap-3 text-sm text-yellow-800 dark:text-yellow-200">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Your therapist will be notified immediately about this report.</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-text-primary dark:text-slate-200 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isSubmittingApi}
            className="flex-1 py-2.5 bg-primary hover:bg-primary-dark dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-xl font-medium transition shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {(isSubmitting || isSubmittingApi) ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              "Submit Report"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
