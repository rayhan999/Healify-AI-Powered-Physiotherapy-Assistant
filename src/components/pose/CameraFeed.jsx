import React from "react";

const CameraFeed = ({
  videoRef,
  canvasRef,
  toggleCamera,
  running,
  showCameraFeed,
  setShowCameraFeed,
  sessionAccuracy,
  showCompletionPopup,
  onNext,
  onRestart,
  exerciseName,
  isLastExercise
}) => {
  return (
    <div className="flex-[3] flex flex-col items-center justify-center bg-gray-800 p-4">
      <video
        ref={videoRef}
        className="hidden"
        width="640"
        height="480"
        autoPlay
        playsInline
      ></video>

      <div className="relative w-full flex justify-center">
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          className="rounded-2xl bg-black shadow-lg w-full max-w-3xl border-2 border-cyan-500"
        ></canvas>

        {showCompletionPopup ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl w-full max-w-3xl mx-auto border-2 border-green-500/50">
            <div className="text-center p-6 w-full max-w-md">
              <div className="flex items-center justify-center gap-3 mb-2">
                <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-3xl font-bold text-green-400">Exercise Completed!</h3>
              </div>
              <p className="text-gray-300 mb-6 text-lg">
                You've finished <span className="text-white font-bold">{exerciseName}</span>
              </p>
              <div className="flex gap-3 flex-col w-full max-w-xs mx-auto">
                <button 
                  onClick={onNext}
                  className="w-full py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-bold transition shadow-md border border-green-500/30 flex items-center justify-center gap-2"
                >
                  {isLastExercise ? (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save & End Session
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Save & Next Exercise
                    </>
                  )}
                </button>
                <button 
                  onClick={onRestart}
                  className="w-full py-3 bg-gray-700/30 hover:bg-gray-700/50 text-white rounded-lg font-bold transition shadow-md border border-gray-600/30 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Restart This Exercise
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-4 w-full flex justify-center space-x-6 items-center">
            <button
              onClick={() => toggleCamera()}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition shadow-md border ${
                running 
                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30" 
                  : "bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
              }`}
            >
              <span className="flex items-center gap-2">
                {running ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="1" />
                    </svg>
                    Stop
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Start
                  </>
                )}
              </span>
            </button>
            <button
              onClick={() => setShowCameraFeed(!showCameraFeed)}
              className="px-6 py-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition font-semibold shadow-md text-white border border-gray-600/30"
            >
              <span className="flex items-center gap-2">
                {showCameraFeed ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    Hide Feed
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Show Feed
                  </>
                )}
              </span>
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 w-full max-w-3xl h-6 bg-gray-900 rounded-lg overflow-hidden border border-gray-600 shadow-inner">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${sessionAccuracy ? sessionAccuracy?.toFixed(1) : 0}%`,
            background:
              sessionAccuracy < 50
                ? "#f87171" // red
                : sessionAccuracy < 80
                ? "#facc15" // yellow
                : "#34d399", // green
          }}
        />
      </div>
      <div className="text-white mt-1 text-center font-semibold">
        Overall Accuracy: {sessionAccuracy ? sessionAccuracy.toFixed(1) : 0}%
      </div>
    </div>
  );
};

export default CameraFeed;
