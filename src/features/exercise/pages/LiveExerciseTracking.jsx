import React, { useState, useRef, useEffect } from "react";

export default function LiveExerciseTracking({ exercise, onComplete, onExit }) {
  const [trackingState, setTrackingState] = useState("setup");
  const [cameraPermission, setCameraPermission] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [feedback, setFeedback] = useState("Position yourself in frame");
  const [painLevel, setPainLevel] = useState(0);
  const [sessionData, setSessionData] = useState({
    duration: 0,
    totalReps: 0,
    avgAccuracy: 0,
    painReported: false,
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  const exerciseData = exercise || {
    name: "Shoulder Rotation",
    targetReps: 10,
    sets: 3,
    currentSet: 1,
    bodyPart: "Shoulder",
    difficulty: "Beginner",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Keep your back straight",
      "Raise arms to shoulder height",
      "Rotate shoulders in circular motion",
    ],
    demoVideoUrl: "/demo-videos/shoulder-rotation.mp4",
  };

  useEffect(() => {
    if (trackingState === "setup" || trackingState === "calibrating" || trackingState === "ready" || trackingState === "tracking" || trackingState === "paused") {
      if (!videoRef.current?.srcObject) {
        setupCamera();
      }
    }

    return () => {
      if (trackingState === "completed") {
        stopCamera();
      }
    };
  }, [trackingState]);

  const setupCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support camera access");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.error("Video play error:", err);
          });
          setCameraPermission("granted");

          setTimeout(() => {
            if (trackingState === "setup") {
              setTrackingState("calibrating");
            }
          }, 1000);
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraPermission("denied");

      let errorMessage = "Camera access denied. ";
      if (err.name === "NotAllowedError") {
        errorMessage += "Please allow camera access and refresh the page.";
      } else if (err.name === "NotFoundError") {
        errorMessage += "No camera found on your device.";
      } else if (err.name === "NotReadableError") {
        errorMessage += "Camera is being used by another application.";
      } else {
        errorMessage += err.message || "Please check your browser settings.";
      }

      setFeedback(errorMessage);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    if (isTracking && trackingState === "tracking") {
      const interval = setInterval(() => {
        const newAccuracy = Math.floor(Math.random() * 20) + 80;
        setAccuracy(newAccuracy);

        if (Math.random() > 0.85) {
          setRepCount((prev) => {
            const newCount = prev + 1;
            if (newCount === exerciseData.targetReps) {
              setTimeout(() => setTrackingState("completed"), 500);
            }
            return newCount;
          });
        }

        const feedbackMessages = [
          "Great form! Keep going!",
          "Perfect posture!",
          "Slightly adjust your left arm",
          "Good! Maintain that position",
          "Excellent execution!",
        ];
        setFeedback(feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isTracking, trackingState]);

  useEffect(() => {
    if (trackingState === "tracking") {
      timerRef.current = setInterval(() => {
        setSessionData((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [trackingState]);

  const handleStartTracking = () => {
    setTrackingState("tracking");
    setIsTracking(true);
    setFeedback("Starting exercise...");
  };

  const handlePauseTracking = () => {
    setIsTracking(false);
    setTrackingState("paused");
    setFeedback("Exercise paused");
  };

  const handleResumeTracking = () => {
    setIsTracking(true);
    setTrackingState("tracking");
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setTrackingState("pain-check");
  };

  const handlePainSubmit = (hasPain) => {
    if (hasPain) {
      setSessionData((prev) => ({ ...prev, painReported: true }));
    }
    setSessionData((prev) => ({
      ...prev,
      totalReps: repCount,
      avgAccuracy: accuracy,
    }));
    setTrackingState("completed");
  };

  const handleCompleteSession = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    if (onComplete) {
      onComplete(sessionData);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (trackingState === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healify-dark-blue to-primary dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-text-primary dark:text-cyan-300 mb-2">
                Camera Setup
              </h1>
              <p className="text-text-muted dark:text-slate-300">
                Setting up your camera for exercise tracking
              </p>
            </div>

            <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6" style={{ paddingBottom: "56.25%" }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              {cameraPermission === "denied" && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 dark:bg-slate-900">
                  <div className="text-center text-white p-6">
                    <svg className="w-16 h-16 mx-auto mb-4 text-red-400 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
                    <p className="text-gray-300 dark:text-slate-300 mb-4">
                      Please enable camera permissions in your browser settings to continue.
                    </p>
                    <button
                      onClick={setupCamera}
                      className="px-6 py-2 bg-primary dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-dark dark:hover:bg-cyan-700 transition"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800 dark:text-green-200 font-medium">Stand 5-6 feet away from camera</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800 dark:text-green-200 font-medium">Ensure your full body is visible</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800 dark:text-green-200 font-medium">Good lighting from the front</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onExit && onExit()}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-text-body dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setTrackingState("calibrating")}
                disabled={cameraPermission !== "granted"}
                className="flex-1 px-6 py-3 bg-primary dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-dark dark:hover:bg-cyan-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trackingState === "calibrating") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healify-dark-blue to-primary dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-10 h-10 text-primary dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-text-primary dark:text-cyan-300 mb-2">
                Calibrating AI Coach
              </h1>
              <p className="text-text-muted dark:text-slate-300">
                Stand in the T-pose for calibration
              </p>
            </div>

            <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6" style={{ paddingBottom: "56.25%" }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="mb-4">
                    <svg className="w-32 h-32 mx-auto text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold">Stand with arms extended horizontally</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-text-primary dark:text-slate-200">Calibration Progress</span>
                <span className="text-sm font-semibold text-primary dark:text-cyan-300">75%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-600 dark:to-cyan-400 rounded-full transition-all duration-500" style={{ width: "75%" }}></div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setTrackingState("setup")}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-text-body dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setTrackingState("ready")}
                className="flex-1 px-6 py-3 bg-primary dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-dark dark:hover:bg-cyan-700 transition font-semibold"
              >
                Calibration Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trackingState === "ready") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary dark:text-cyan-300 mb-2">
                    {exerciseData.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-text-muted dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {exerciseData.bodyPart}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {exerciseData.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Set {exerciseData.currentSet} of {exerciseData.sets}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onExit && onExit()}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  <svg className="w-6 h-6 text-text-muted dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-cyan-900/20 border border-blue-200 dark:border-cyan-800 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 dark:text-cyan-300 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Exercise Instructions
                </h3>
                <ol className="space-y-2">
                  {exerciseData.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3 text-blue-800 dark:text-cyan-200">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-200 dark:bg-cyan-700 rounded-full flex items-center justify-center text-blue-900 dark:text-cyan-100 text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-primary/10 to-healify-light-cyan/10 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-xl p-6 text-center border border-primary/20 dark:border-cyan-800">
                <p className="text-text-muted dark:text-slate-400 text-sm mb-1">Target Reps</p>
                <p className="text-3xl font-bold text-primary dark:text-cyan-300">{exerciseData.targetReps}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-800">
                <p className="text-text-muted dark:text-slate-400 text-sm mb-1">Sets</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-300">{exerciseData.sets}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 text-center border border-orange-200 dark:border-orange-800">
                <p className="text-text-muted dark:text-slate-400 text-sm mb-1">Current Set</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-300">{exerciseData.currentSet}</p>
              </div>
            </div>

            <button
              onClick={handleStartTracking}
              className="w-full py-4 bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-600 dark:to-cyan-400 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Start Exercise
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (trackingState === "tracking" || trackingState === "paused") {
    return (
      <div className="min-h-screen bg-gray-900 dark:bg-slate-950 flex flex-col">
        <div className="bg-gradient-to-r from-healify-dark-blue to-primary dark:from-slate-800 dark:to-slate-700 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">{exerciseData.name}</h2>
              <span className="px-3 py-1 bg-white/20 dark:bg-cyan-900/30 rounded-full text-sm">
                Set {exerciseData.currentSet}/{exerciseData.sets}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-white/70 dark:text-slate-300">Duration</p>
                <p className="text-lg font-bold">{formatTime(sessionData.duration)}</p>
              </div>
              <button
                onClick={handleStopTracking}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg font-semibold transition"
              >
                Stop
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1 relative bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />

            {isTracking && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 w-3 h-3 bg-primary rounded-full animate-pulse" style={{ transform: "translate(-50%, -50%)" }}></div>
                <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-primary rounded-full animate-pulse" style={{ transform: "translate(-150%, -50%)" }}></div>
                <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-primary rounded-full animate-pulse" style={{ transform: "translate(50%, -50%)" }}></div>
              </div>
            )}

            {trackingState === "paused" && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white mb-4">Exercise Paused</h3>
                  <button
                    onClick={handleResumeTracking}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
                  >
                    Resume
                  </button>
                </div>
              </div>
            )}

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className={`px-6 py-3 rounded-full font-semibold shadow-lg backdrop-blur-md ${
                accuracy >= 90 ? "bg-green-500/90 text-white" :
                accuracy >= 70 ? "bg-yellow-500/90 text-white" :
                "bg-red-500/90 text-white"
              }`}>
                {feedback}
              </div>
            </div>
          </div>

          <div className="w-96 bg-gray-800 dark:bg-slate-900 p-6 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-primary to-healify-light-cyan dark:from-cyan-700 dark:to-cyan-500 rounded-xl p-6 text-center">
              <p className="text-white/80 dark:text-cyan-100 text-sm mb-2">Reps Completed</p>
              <p className="text-6xl font-black text-white mb-2">{repCount}</p>
              <p className="text-white/80 dark:text-cyan-100 text-sm">of {exerciseData.targetReps}</p>
            </div>

            <div className="bg-gray-700 dark:bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white dark:text-cyan-300 font-semibold">Accuracy</p>
                <p className="text-2xl font-bold text-white dark:text-cyan-200">{accuracy}%</p>
              </div>
              <div className="w-full h-3 bg-gray-600 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    accuracy >= 90 ? "bg-green-500 dark:bg-green-400" :
                    accuracy >= 70 ? "bg-yellow-500 dark:bg-yellow-400" :
                    "bg-red-500 dark:bg-red-400"
                  }`}
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-700 dark:bg-slate-800 rounded-xl p-4">
              <h4 className="text-white dark:text-cyan-300 font-semibold mb-3">Demonstration</h4>
              <div className="bg-black dark:bg-slate-950 rounded-lg overflow-hidden aspect-video">
                <div className="w-full h-full flex items-center justify-center text-white/50 dark:text-slate-400">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {trackingState === "tracking" ? (
                <button
                  onClick={handlePauseTracking}
                  className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white rounded-lg font-semibold transition"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={handleResumeTracking}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                  Resume
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trackingState === "pain-check") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healify-dark-blue to-primary dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-text-primary dark:text-cyan-300 mb-2">
                Pain Check
              </h1>
              <p className="text-text-muted dark:text-slate-300">
                Did you experience any pain during this exercise?
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-text-body dark:text-slate-200 font-semibold mb-4">
                Pain Level (0 = No pain, 10 = Severe pain)
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500 dark:accent-red-400"
              />
              <div className="flex justify-between mt-2 text-sm text-text-muted dark:text-slate-400">
                <span>No Pain</span>
                <span className="text-2xl font-bold text-text-primary dark:text-cyan-300">{painLevel}</span>
                <span>Severe</span>
              </div>
            </div>

            {painLevel > 0 && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  <strong>Note:</strong> Your therapist will be notified of this pain report.
                  They may adjust your exercise plan accordingly.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => handlePainSubmit(false)}
                className="flex-1 px-6 py-3 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition font-semibold"
              >
                No Pain
              </button>
              <button
                onClick={() => handlePainSubmit(true)}
                className="flex-1 px-6 py-3 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition font-semibold"
              >
                Submit Pain Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trackingState === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healify-dark-blue to-primary dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-text-primary dark:text-cyan-300 mb-2">
                Great Work!
              </h1>
              <p className="text-text-muted dark:text-slate-300 text-lg">
                You've completed the exercise set
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-800">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{formatTime(sessionData.duration)}</p>
                <p className="text-blue-800 dark:text-blue-200 text-sm">Duration</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 text-center border border-purple-200 dark:border-purple-800">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">{sessionData.totalReps}</p>
                <p className="text-purple-800 dark:text-purple-200 text-sm">Reps</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-800">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-2xl font-bold text-green-600 dark:text-green-300">{sessionData.avgAccuracy}%</p>
                <p className="text-green-800 dark:text-green-200 text-sm">Avg Accuracy</p>
              </div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-healify-light-cyan/10 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-xl border border-primary/20 dark:border-cyan-800">
              <h3 className="font-bold text-primary dark:text-cyan-300 mb-2">AI Coach Feedback</h3>
              <p className="text-text-body dark:text-slate-200">
                {sessionData.avgAccuracy >= 90
                  ? "Excellent form! You're performing this exercise with great precision. Keep up the outstanding work!"
                  : sessionData.avgAccuracy >= 70
                  ? "Good job! Your form is solid. Focus on maintaining proper posture throughout each rep for even better results."
                  : "Nice effort! Consider reviewing the demonstration video and try to match the form more closely next time."}
              </p>
            </div>

            {sessionData.painReported && (
              <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-red-800 dark:text-red-300 mb-1">Pain Reported</h4>
                    <p className="text-red-700 dark:text-red-200 text-sm">
                      Your therapist has been notified and will review your pain report.
                      They may suggest alternative exercises or adjust your plan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleCompleteSession}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-600 dark:to-cyan-400 text-white rounded-lg hover:shadow-xl transition font-semibold"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
