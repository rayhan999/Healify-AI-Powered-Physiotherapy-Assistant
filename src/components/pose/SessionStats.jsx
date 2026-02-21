import React, { useEffect, useRef, useState } from "react";
import { getExerciseMetadata } from "../../constants/exerciseData";

const SessionStats = ({
  selectedExercise,
  repCount,
  isUp,
  debugInfo,
  countdown,
  allReps,
  exerciseInfo,
}) => {
  const resultsRef = useRef(null);
  const [activeTab, setActiveTab] = useState("video"); // 'video' or 'results'
  
  // Get metadata for the current exercise
  const exerciseMetadata = getExerciseMetadata(selectedExercise?.name);

  const prevRepsLengthRef = useRef(0);

  useEffect(() => {
    // Switch to results when new reps are added
    if (allReps.length > prevRepsLengthRef.current) {
      setActiveTab("results");
    } 
    // Switch back to video when session is reset
    else if (allReps.length === 0 && prevRepsLengthRef.current > 0) {
      setActiveTab("video");
    }

    prevRepsLengthRef.current = allReps.length;

    if (resultsRef.current) {
      resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
    }
  }, [allReps]);

  // Helper to format snake_case to Title Case
  const formatExerciseName = (name) => {
    if (!name) return "";
    return name
      .split(/[_ ]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="flex-[2] bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-700 flex flex-col p-6 space-y-4 h-full">
      <div className="space-y-2 w-full">
        <h2 className="text-3xl font-bold text-cyan-400">
          {formatExerciseName(selectedExercise?.name)}
        </h2>
        <div className="text-4xl font-bold text-white">
          {repCount}/{selectedExercise?.reps} Reps
        </div>
       
        {/* Show countdown status */}
        {countdown !== null && (
          <div className="text-lg font-bold text-yellow-400">Starting in: {countdown}</div>
        )}
      </div>

      <div className="w-full h-px bg-gray-700 my-4"></div>

      {/* Tabs Header */}
      <div className="flex border-b border-gray-700 w-full">
        <button
          className={`flex-1 py-2 text-center font-semibold transition-colors ${
            activeTab === "video"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("video")}
        >
          📺 Exercise Video
        </button>
        <button
          className={`flex-1 py-2 text-center font-semibold transition-colors ${
            activeTab === "results"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("results")}
        >
          📊 Results
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 w-full overflow-hidden flex flex-col mt-4">
        {activeTab === "video" && (
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1 bg-black rounded-xl overflow-hidden shadow-lg flex items-center justify-center relative min-h-[200px]">
              {exerciseMetadata?.videoUrl ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={exerciseMetadata.videoUrl}
                  title="Exercise Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              ) : (
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-gray-400">No video available for this exercise.</p>
                </div>
              )}
            </div>
            
            {/* Camera Angle Instruction */}
            {exerciseMetadata?.cameraAngle && (
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <h4 className="text-cyan-400 font-bold mb-1 flex items-center gap-2">
                  <span>📷</span> Camera Setup
                </h4>
                <p className="text-gray-300 text-sm">
                  {exerciseMetadata.cameraAngle}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "results" && (
          <div className="flex-1 overflow-y-auto bg-gray-900 rounded-xl p-4 shadow-inner max-h-[calc(100vh-480px)]">
            {allReps.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Session Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><span className="text-gray-400">Exercise:</span> {exerciseInfo?.exercise || formatExerciseName(selectedExercise?.name)}</p>
                    <p><span className="text-gray-400">Total Reps:</span> {allReps.length}</p>
                    <p><span className="text-gray-400">Avg Accuracy:</span> {(allReps.reduce((sum, r) => sum + r.accuracy, 0) / allReps.length).toFixed(1)}%</p>
                  </div>
                </div>

                <div ref={resultsRef} className="space-y-3">
                  {allReps.map((rep) => (
                    <div key={rep.rep} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-cyan-300">Rep {rep.rep}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${rep.is_correct_form ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                          {rep.is_correct_form ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                      <p className="text-sm mb-2">
                        <span className="text-gray-400">Accuracy:</span> {rep.accuracy.toFixed(1)}%
                      </p>
                      {rep.feedback && rep.feedback.length > 0 && (
                        <div className="text-sm bg-gray-900/50 p-3 rounded">
                          <p className="text-gray-400 text-xs mb-2">Feedback:</p>
                          <div className="text-gray-300 space-y-1 whitespace-pre-line">
                            {rep.feedback.map((f, i) => (
                              <div key={i}>{f}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>No results yet. Start exercising!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionStats;
