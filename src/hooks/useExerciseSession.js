import { useState, useRef, useCallback, useEffect } from "react";
import { checkRepetition } from "../utils/repCounter";
import { preprocessReps, calculateSizeReduction } from "../utils/framePreprocessor";

export const useExerciseSession = (selectedExercise, processingEnabledRef, countdownRef) => {
  const [repCount, setRepCount] = useState(0);
  const [isUp, setIsUp] = useState(false);
  const [apiStatus, setApiStatus] = useState("");
  const [allReps, setAllReps] = useState([]);
  const [exerciseInfo, setExerciseInfo] = useState(null);
  const [sessionAccuracy, setSessionAccuracy] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentRepFramesRef = useRef([]);
  const completedRepsRef = useRef([]);
  // Use a generic state ref to hold all exercise-specific state (isUp, peakCount, etc.)
  const exerciseStateRef = useRef({ isUp: false, consecutiveDownFrames: 0 });

  const alpha = 0.2;

  // Adaptive evaluation strategy
  const shouldEvaluateRep = (currentRep, targetReps) => {
    // Always evaluate rep 1 for quick feedback
    if (currentRep === 1) return { shouldEvaluate: true, repsToSend: 1 };

    // Always evaluate the last rep
    if (currentRep === targetReps) return { shouldEvaluate: true, repsToSend: 1 };

    // Progressive gap strategy based on rep count
    let gap;
    if (currentRep <= 5) {
      gap = 2; // Reps 2-5: evaluate every 2 reps
    } else if (currentRep <= 10) {
      gap = 3; // Reps 6-10: evaluate every 3 reps
    } else {
      gap = 4; // Reps 11+: evaluate every 4 reps
    }

    // Check if we should evaluate based on the gap
    const shouldEvaluate = currentRep % gap === 0;
    return { shouldEvaluate, repsToSend: gap };
  };

  // Helper to convert string to snake_case
  const toSnakeCase = (str) => {
    return str
      ? str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('_')
      : '';
  };

  const processLandmarks = useCallback(
    (landmarks) => {
      if (!processingEnabledRef.current || countdownRef.current !== null) return 0;

      const startTime = performance.now();

      if (!landmarks || landmarks.length !== 33) return 0;

      try {
        const flatLandmarks = [];
        landmarks.forEach((lm) => {
          flatLandmarks.push(lm.x, lm.y, lm.z, lm.visibility || 0.99);
        });

        currentRepFramesRef.current.push(flatLandmarks);

        const exerciseName = toSnakeCase(selectedExercise?.name || "jumping_jack");

        const { isRepCompleted, newState, isUpState } = checkRepetition(
          landmarks,
          exerciseName,
          exerciseStateRef.current
        );

        // Update the state ref with the new state returned by the counter
        exerciseStateRef.current = { ...exerciseStateRef.current, ...newState };
        setIsUp(isUpState);

        if (isRepCompleted) {
          const repFrames = [...currentRepFramesRef.current];
          completedRepsRef.current.push({ frames: repFrames });

          console.log(`✅ Rep completed with ${repFrames.length} frames`);

          currentRepFramesRef.current = [];

          setRepCount((prev) => {
            const updated = prev + 1;
            const targetReps = selectedExercise?.reps || 10;

            // Adaptive evaluation logic
            const { shouldEvaluate, repsToSend } = shouldEvaluateRep(updated, targetReps);

            if (shouldEvaluate && completedRepsRef.current.length >= repsToSend) {
              const repsToSendData = completedRepsRef.current.slice(-repsToSend);

              // 🚀 Preprocess frames to 50 before sending (83% payload reduction)
              const preprocessedReps = preprocessReps(repsToSendData, 50);

              // Log size reduction for monitoring
              const sizeStats = calculateSizeReduction(repsToSendData, preprocessedReps);
              console.log(`📤 Sending to API (Rep ${updated}/${targetReps}):`, {
                totalReps: preprocessedReps.length,
                originalFrames: repsToSendData.map((r) => r.frames.length),
                preprocessedFrames: preprocessedReps.map((r) => r.frames.length),
                payloadReduction: `${sizeStats.reductionPercent}%`,
                originalSize: `${sizeStats.originalSizeKB} KB`,
                preprocessedSize: `${sizeStats.preprocessedSizeKB} KB`,
                strategy: updated === 1 ? 'First rep (quick feedback)' :
                  updated === targetReps ? 'Last rep (final check)' :
                    `Every ${repsToSend} reps`
              });

              fetch(`${import.meta.env.VITE_API_URL}/api/v1/exercise/evaluate/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  user_id: "test_user_123",
                  exercise: exerciseName,
                  reps: preprocessedReps, // ✅ Send preprocessed data
                }),
              })
                .then((r) => {
                  if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
                  return r.json();
                })
                .then((data) => {
                  console.log("🔥 API Response:", data);

                  if (!exerciseInfo) {
                    setExerciseInfo({
                      exercise: data.exercise,
                      user_id: data.user_id,
                    });
                  }

                  setAllReps((prev) => {
                    const previousCount = prev.length;
                    const newReps = data.results.map((r, i) => ({
                      ...r,
                      rep: previousCount + i + 1,
                    }));

                    let ema = sessionAccuracy;
                    newReps.forEach((r) => {
                      if (ema === null) {
                        ema = r.accuracy;
                      } else {
                        ema = alpha * r.accuracy + (1 - alpha) * ema;
                      }
                    });

                    setSessionAccuracy(ema);

                    return [...prev, ...newReps];
                  });

                  const latestAccuracy = data.results[0]?.accuracy || 0;
                  setApiStatus(`✅ Accuracy: ${latestAccuracy}%`);

                  setTimeout(() => setApiStatus(""), 5000);
                })
                .catch((err) => {
                  console.error("❌ API Error:", err);
                  setApiStatus("❌ API Failed");
                  setTimeout(() => setApiStatus(""), 3000);
                });
            }
            return updated;
          });
        }

        return performance.now() - startTime;
      } catch (error) {
        console.error("Error processing landmarks:", error);
        // We might want to propagate error up or handle it here
        return 0;
      }
    },
    [selectedExercise, exerciseInfo, sessionAccuracy]
  );

  const resetSession = () => {
    setRepCount(0);
    setAllReps([]);
    setSessionAccuracy(null);
    setApiStatus("");
    setSummaryData(null);
    setIsUp(false);
    currentRepFramesRef.current = [];
    completedRepsRef.current = [];
    exerciseStateRef.current = { isUp: false, consecutiveDownFrames: 0 };
  };

  const handleEndExercise = async (toggleCameraCallback, running) => {
    if (running) {
      toggleCameraCallback();
    }

    setIsAnalyzing(true);
    setShowSummaryModal(true);

    try {
      const exerciseName = toSnakeCase(selectedExercise?.name || "jumping_jack");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gemini/analyze/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exercise_type: exerciseName,
          rep_data: allReps,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 Analysis Result:", data);
      setSummaryData(data);
    } catch (error) {
      console.error("❌ Analysis Failed:", error);
      setApiStatus("❌ Analysis Failed");
      setShowSummaryModal(false);
      setTimeout(() => setApiStatus(""), 3000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    repCount,
    isUp,
    apiStatus,
    allReps,
    exerciseInfo,
    sessionAccuracy,
    showSummaryModal,
    setShowSummaryModal,
    summaryData,
    isAnalyzing,
    processLandmarks,
    resetSession,
    handleEndExercise,
    currentRepFramesRef, // Exposed for debug info
    setSummaryData // Exposed for multi-exercise session handling
  };
};
