import React, { useRef, useState, useEffect } from "react";
import { usePoseDetection } from "../hooks/usePoseDetection";
import { useExerciseSession } from "../hooks/useExerciseSession";
import { useNavigate } from "react-router-dom";
import CameraFeed from "./pose/CameraFeed";
import SessionStats from "./pose/SessionStats";
import ControlPanel from "./pose/ControlPanel";
import SummaryModal from "./pose/SummaryModal";
import RequestChangeModal from "./common/RequestChangeModal";

import { useSaveReportMutation, useAnalyzeSessionMutation } from "../services/api/prescriptionsApi";
import { useToast } from "../components/ui";
import { getUserOrientation, checkOrientationAlignment } from "../utils/orientationDetector";
import { getExerciseMetadata } from "../constants/exerciseData";

import { useAuth } from "../contexts/AuthContext";

export default function PoseExtractor({ exercises, selectedExercise, setSelectedExercise, prescriptionId, therapistId }) {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCameraFeed, setShowCameraFeed] = useState(true);
  const [countdown, setCountdown] = useState(null);

  // State for multi-exercise session
  const [completedExercisesData, setCompletedExercisesData] = useState([]);
  const [showConfirmNav, setShowConfirmNav] = useState(false);
  const [pendingNavDirection, setPendingNavDirection] = useState(null); // 'prev', 'next', or 'end_session'
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [isAnalyzingSession, setIsAnalyzingSession] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [hasStartedExercising, setHasStartedExercising] = useState(false); // Track if user has ever started
  const [lastAnalyzedExercises, setLastAnalyzedExercises] = useState(null); // Store exercises for retry

  // Orientation Alignment State
  const [isOrientationAligned, setIsOrientationAligned] = useState(false);
  const [currentOrientation, setCurrentOrientation] = useState({ yaw: 0, pitch: 0 });
  const [orientationFeedback, setOrientationFeedback] = useState('');
  const [showOrientationCheck, setShowOrientationCheck] = useState(false);
  const [orientationReadyCountdown, setOrientationReadyCountdown] = useState(null);
  const [hasPassedInitialAlignment, setHasPassedInitialAlignment] = useState(false);

  // Pain Report State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [reportSubmitContext, setReportSubmitContext] = useState(null); // 'pain_button' or 'exit_modal'

  const processingEnabledRef = useRef(false);
  const countdownRef = useRef(null);

  const {
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
    handleEndExercise: handleEndSingleExercise,
    currentRepFramesRef,
    setSummaryData
  } = useExerciseSession(selectedExercise, processingEnabledRef, countdownRef);

  // Wrapper for processLandmarks that checks orientation first
  const processLandmarksWithOrientation = (landmarks) => {
    // If we've already passed alignment or no landmarks, just run the normal processor
    if (hasPassedInitialAlignment || !landmarks || !selectedExercise) {
      return processLandmarks(landmarks);
    }

    // Get current orientation
    const orientation = getUserOrientation(landmarks);
    setCurrentOrientation(orientation);

    // Get required orientation for this exercise
    const exerciseMetadata = getExerciseMetadata(selectedExercise.name);
    const requiredOrientation = exerciseMetadata?.requiredOrientation;

    if (!requiredOrientation) {
      // No orientation requirement, proceed normally
      setShowOrientationCheck(false);
      setHasPassedInitialAlignment(true);
      processingEnabledRef.current = true;
      return processLandmarks(landmarks);
    }

    // Check if orientation is aligned
    const { isAligned, feedback } = checkOrientationAlignment(orientation, requiredOrientation);

    setOrientationFeedback(feedback);
    setShowOrientationCheck(true);

    // If not aligned, block rep counting
    if (!isAligned) {
      setIsOrientationAligned(false);
      setOrientationReadyCountdown(null);

      // Stop processing if camera is running but orientation is wrong
      if (running && processingEnabledRef.current) {
        processingEnabledRef.current = false;
      }

      return 0; // Return 0 processing time
    }

    // Orientation is aligned!
    if (!isOrientationAligned) {
      setIsOrientationAligned(true);

      // Start countdown to begin exercise
      if (!orientationReadyCountdown) {
        setOrientationReadyCountdown(3);

        // Auto-start after 3 seconds
        setTimeout(() => {
          setOrientationReadyCountdown(null);
          setShowOrientationCheck(false);
          setHasPassedInitialAlignment(true);
          processingEnabledRef.current = true;
        }, 3000);
      }

      return 0; // Don't process during ready countdown
    }

    return 0;
  };

  const {
    camera,
    running,
    debugInfo,
    toggleCamera: toggleCameraInternal
  } = usePoseDetection(videoRef, canvasRef, processLandmarksWithOrientation, showCameraFeed, countdown, processingEnabledRef);

  const [saveReport] = useSaveReportMutation();
  const [analyzeSession] = useAnalyzeSessionMutation();

  const handleSaveReport = async () => {
    try {
      // The summary is already in HTML format from the backend (or null if failed)
      const htmlData = summaryData?.summary || null;

      // Construct analysis data from local state ensures we send the actual performance data
      const totalReps = completedExercisesData.reduce((acc, ex) => acc + (ex.totalReps || 0), 0);
      const avgAccuracy = completedExercisesData.length > 0
        ? completedExercisesData.reduce((acc, ex) => acc + (ex.accuracy || 0), 0) / completedExercisesData.length
        : 0;

      const analysisData = {
        total_reps: summaryData?.total_reps || totalReps,
        exercises_completed: summaryData?.exercises_completed || completedExercisesData.length,
        average_accuracy: summaryData?.average_accuracy || Math.round(avgAccuracy),
        // Estimate duration if not tracked: ~5 mins per exercise or derived from timestamps if available
        duration_minutes: summaryData?.duration_minutes || Math.ceil(completedExercisesData.length * 5),
        pain_level: summaryData?.pain_level || 0,
        patient_notes: summaryData?.patient_notes || "",
        improvements: summaryData?.improvements || [], // Keep AI suggestions if available
        exercises_detail: summaryData?.exercises_detail || completedExercisesData
      };

      await saveReport({
        prescriptionId: prescriptionId || null,
        html_data: htmlData,
        analysis_data: analysisData
      }).unwrap();

      toast.success("Report saved successfully!");
      setShowSummaryModal(false);
      navigate('/patient-dashboard/tracking');
    } catch (error) {
      console.error("Failed to save report:", error);
      toast.error("Failed to save report: " + (error?.data?.message || error.message));
    }
  };

  const handleRetryAnalysis = async () => {
    if (!lastAnalyzedExercises || lastAnalyzedExercises.length === 0) {
      toast.error("No exercise data available to retry");
      return;
    }

    setIsAnalyzingSession(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const data = await analyzeSession({
        exercises: lastAnalyzedExercises,
        patient_id: user?.id || "test_user_123"
      }).unwrap();

      console.log("📊 Retry Analysis Result:", data);
      setSummaryData(data);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("❌ Retry Analysis Failed:", error);
      toast.error("Failed to generate report. Please try again later.");

      // Keep the error summary with exercise data
      const errorSummary = {
        summary: `<div style="color: #ef4444; padding: 20px; text-align: center;">
          <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">⚠️ Report Generation Failed</h2>
          <p style="margin-bottom: 10px; font-size: 16px; color: #f87171;">Unfortunately, for some reason the report didn't generate.</p>
          <p style="font-size: 14px; color: #9ca3af; margin-bottom: 20px;">The admins will look into it and regenerate the report for you.</p>
          <p style="margin-top: 20px; font-size: 14px; color: #a3a3a3;">Your exercise data has been recorded and will be reviewed.</p>
        </div>`,
        total_reps: lastAnalyzedExercises.reduce((acc, ex) => acc + (ex.totalReps || 0), 0),
        exercises_completed: lastAnalyzedExercises.length,
        average_accuracy: lastAnalyzedExercises.length > 0
          ? Math.round(lastAnalyzedExercises.reduce((acc, ex) => acc + (ex.accuracy || 0), 0) / lastAnalyzedExercises.length)
          : 0,
        improvements: [],
        exercises_detail: lastAnalyzedExercises,
        error: true
      };

      setSummaryData(errorSummary);
    } finally {
      setIsAnalyzingSession(false);
    }
  };

  const toggleCamera = () => {
    toggleCameraInternal(setCountdown);
  };

  // Check for exercise completion
  useEffect(() => {
    if (selectedExercise?.reps && repCount >= selectedExercise.reps && !showCompletionPopup) {
      console.log("🎉 Exercise completed! Saving data immediately...");

      // Save data immediately when exercise completes
      saveCurrentData();

      // Show completion popup
      setShowCompletionPopup(true);
      if (running) {
        toggleCameraInternal(setCountdown); // Stop camera
      }
    }
  }, [repCount, selectedExercise, showCompletionPopup, running]);

  // Track if user has started exercising
  useEffect(() => {
    if (repCount > 0 && !hasStartedExercising) {
      setHasStartedExercising(true);
    }
  }, [repCount, hasStartedExercising]);

  // Reset orientation state when exercise changes or camera starts
  useEffect(() => {
    setIsOrientationAligned(false);
    setOrientationReadyCountdown(null);
    setHasPassedInitialAlignment(false);
    setOrientationFeedback('');

    // Determine if we need to show check initially
    const meta = getExerciseMetadata(selectedExercise?.name);
    if (meta?.requiredOrientation && running) {
      setShowOrientationCheck(true);
      processingEnabledRef.current = false;
    } else {
      setShowOrientationCheck(false);
      if (running) {
        setHasPassedInitialAlignment(true);
        processingEnabledRef.current = true;
      }
    }
  }, [selectedExercise?.name, running]);


  // Save current exercise data
  const saveCurrentData = () => {
    const currentData = {
      exercise: selectedExercise.name,
      reps: allReps,
      totalReps: repCount,
      accuracy: sessionAccuracy,
      timestamp: new Date().toISOString()
    };

    setCompletedExercisesData(prev => {
      // Remove existing data for this exercise if any (overwrite)
      const filtered = prev.filter(e => e.exercise !== selectedExercise.name);
      return [...filtered, currentData];
    });
  };

  const navigateToExercise = (direction) => {
    const currentIndex = exercises.findIndex(e => e.name === selectedExercise.name);
    let nextIndex = currentIndex;

    if (direction === 'prev' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (direction === 'next' && currentIndex < exercises.length - 1) {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex !== currentIndex) {
      setSelectedExercise(exercises[nextIndex]);
      resetSession();
      setShowConfirmNav(false);
      setShowCompletionPopup(false);
      setPendingNavDirection(null);
    }
  };

  const handleNavRequest = (direction) => {
    // If reps not completed, ask for confirmation
    if (repCount < (selectedExercise?.reps || 10)) {
      setPendingNavDirection(direction);
      setShowConfirmNav(true);
    } else {
      // If completed, save and go
      saveCurrentData();
      navigateToExercise(direction);
    }
  };

  // Pain Report Logic
  const handleReportPain = () => {
    console.log("🤕 Pain Report button clicked");
    setReportSubmitContext('pain_button');
    setShowRequestModal(true);
  };

  const handleReportSubmit = async (formData) => {
    console.log("📋 Report submitted, context:", reportSubmitContext);
    // Report submitted by modal itself, close it and show continue modal
    setShowRequestModal(false);

    if (reportSubmitContext === 'pain_button') {
      console.log("✅ Showing continue exercising modal");
      // From Pain Report button - show continue modal
      setShowContinueModal(true);
    } else if (reportSubmitContext === 'exit_modal') {
      console.log("🚪 Redirecting to tracking from exit modal");
      // From EXIT modal REPORT ISSUE button - redirect to tracking
      navigate('/patient-dashboard/tracking');
    }
  };

  const handleContinueExercising = (shouldContinue) => {
    setShowContinueModal(false);
    if (!shouldContinue) {
      // User chose NO - check if any exercises are fully completed
      const fullyCompletedExercises = completedExercisesData.filter(ex => {
        const prescribedExercise = exercises.find(e => e.name === ex.exercise);
        const prescribedReps = prescribedExercise?.reps || 10;
        return ex.reps && ex.reps.length > 0 && ex.totalReps >= prescribedReps;
      });

      console.log("📊 Checking completed exercises after pain report:", fullyCompletedExercises);

      if (fullyCompletedExercises.length > 0) {
        // Has completed exercises - generate report
        proceedEndSession(completedExercisesData);
      } else {
        // No completed exercises - navigate back to tracking
        navigate('/patient-dashboard/tracking');
      }
    }
    // If YES, just close modal and stay on page
  };

  const handleReportIssueFromExitModal = () => {
    // Close exit confirmation, open report modal with exit context
    setShowConfirmNav(false);
    setReportSubmitContext('exit_modal');
    setShowRequestModal(true);
  };

  const confirmNavigation = () => {
    // User chose to discard current progress
    if (pendingNavDirection === 'end_session') {
      // EXIT ANYWAY - proceed to end session without saving current exercise
      setShowConfirmNav(false);
      setPendingNavDirection(null);
      proceedEndSession();
    } else {
      // Navigation - discard partial data
      navigateToExercise(pendingNavDirection);
    }
  };

  const handleCompletionNext = () => {
    console.log("🎯 handleCompletionNext called");
    console.log("📊 Current exercise:", selectedExercise.name);
    console.log("📊 Current repCount:", repCount);
    console.log("📊 Current allReps length:", allReps?.length);
    console.log("📊 Current sessionAccuracy:", sessionAccuracy);

    // Build current exercise data
    const currentData = {
      exercise: selectedExercise.name,
      reps: allReps,
      totalReps: repCount,
      accuracy: sessionAccuracy,
      timestamp: new Date().toISOString()
    };

    // Create complete data array including current exercise
    const updatedCompletedData = completedExercisesData.filter(e => e.exercise !== selectedExercise.name);
    if (allReps && allReps.length > 0) {
      updatedCompletedData.push(currentData);
    }

    console.log("📊 Complete data array being used:", updatedCompletedData);
    // Note: Data was already saved when completion popup appeared

    setShowCompletionPopup(false); // Close popup immediately
    const currentIndex = exercises.findIndex(e => e.name === selectedExercise.name);
    if (currentIndex < exercises.length - 1) {
      navigateToExercise('next');
    } else {
      // Last exercise completed, end session with complete data
      console.log("🏁 Last exercise - calling proceedEndSession with complete data");
      proceedEndSession(updatedCompletedData);
    }
  };

  const handleCompletionRestart = () => {
    resetSession();
    setShowCompletionPopup(false);
    if (!running) toggleCamera();
  };

  const onEndSession = async () => {
    if (running) {
      toggleCameraInternal(setCountdown);
    }

    // STEP 1: Check if user is in the middle of an exercise
    const requiredReps = selectedExercise?.reps || 10;
    const isInMiddle = repCount > 0 && repCount < requiredReps;

    if (isInMiddle) {
      // STEP 2: Show 3-button confirmation modal
      setPendingNavDirection('end_session');
      setShowConfirmNav(true);
      return;
    }

    // STEP 3: Not in middle, proceed with analysis
    let finalCompletedData = [...completedExercisesData];

    // If fully completed current exercise, add it
    if (repCount >= requiredReps) {
      const currentData = {
        exercise: selectedExercise.name,
        reps: allReps,
        totalReps: repCount,
        accuracy: sessionAccuracy,
        timestamp: new Date().toISOString()
      };
      // Remove any existing data for this exercise and add the new one
      finalCompletedData = finalCompletedData.filter(e => e.exercise !== selectedExercise.name);
      if (allReps && allReps.length > 0) {
        finalCompletedData.push(currentData);
      }
    }

    console.log("📊 Final data being sent to proceedEndSession:", finalCompletedData);
    proceedEndSession(finalCompletedData);
  };

  const proceedEndSession = async (dataToAnalyze = null) => {
    const finalData = dataToAnalyze || completedExercisesData;

    // Filter for ONLY fully completed exercises
    const fullyCompletedExercises = finalData.filter(ex => {
      const prescribedExercise = exercises.find(e => e.name === ex.exercise);
      const prescribedReps = prescribedExercise?.reps || 10;
      return ex.reps && ex.reps.length > 0 && ex.totalReps >= prescribedReps;
    });

    console.log("📊 Fully completed exercises:", fullyCompletedExercises);

    // If zero exercises completed fully, redirect to tracking
    if (fullyCompletedExercises.length === 0) {
      console.log("No exercises completed fully. Redirecting to tracking.");
      navigate('/patient-dashboard/tracking');
      return;
    }

    setShowCompletionPopup(false);
    setLastAnalyzedExercises(fullyCompletedExercises); // Store for retry
    setIsAnalyzingSession(true);
    setAnalysisProgress(0);

    // Simulate progress while API is processing
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) return 90; // Stop at 90%, complete when API returns
        return prev + 3; // Increment by 3% each time
      });
    }, 800); // Update every 800ms (slower)

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const data = await analyzeSession({
        exercises: fullyCompletedExercises,
        patient_id: user?.id || "test_user_123"
      }).unwrap();

      clearInterval(progressInterval);
      setAnalysisProgress(100); // Complete!

      // Small delay to show 100%
      await new Promise(resolve => setTimeout(resolve, 300));

      console.log("📊 Session Analysis Result:", data);
      setSummaryData(data);
      setShowSummaryModal(true);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("❌ Analysis Failed:", error);

      // Create error summary data
      const errorSummary = {
        summary: `<div style="color: #ef4444; padding: 20px; text-align: center;">
          <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">⚠️ Report Generation Failed</h2>
          <p style="margin-bottom: 10px; font-size: 16px; color: #f87171;">Unfortunately, for some reason the report didn't generate.</p>
          <p style="font-size: 14px; color: #9ca3af; margin-bottom: 20px;">The admins will look into it and regenerate the report for you.</p>
          <p style="margin-top: 20px; font-size: 14px; color: #a3a3a3;">Your exercise data has been recorded and will be reviewed.</p>
        </div>`,
        total_reps: fullyCompletedExercises.reduce((acc, ex) => acc + (ex.totalReps || 0), 0),
        exercises_completed: fullyCompletedExercises.length,
        average_accuracy: fullyCompletedExercises.length > 0
          ? Math.round(fullyCompletedExercises.reduce((acc, ex) => acc + (ex.accuracy || 0), 0) / fullyCompletedExercises.length)
          : 0,
        improvements: [],
        exercises_detail: fullyCompletedExercises,
        error: true
      };

      setSummaryData(errorSummary);
      setShowSummaryModal(true);
    } finally {
      setIsAnalyzingSession(false);
    }
  };

  // We need to intercept the SummaryModal data. 
  // The SummaryModal uses `summaryData` from the hook.
  // If we want to show session summary, we should probably pass a prop to SummaryModal.

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] bg-gray-900 text-white flex flex-col rounded-xl overflow-hidden shadow-xl relative">

      {/* Exit Confirmation Modal - 3 Buttons */}
      {showConfirmNav && pendingNavDirection === 'end_session' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">⚠️ Exit Session?</h3>
            <p className="text-gray-300 mb-6 text-lg">
              Current exercise data ({repCount}/{selectedExercise?.reps || 10} reps) will be lost.
            </p>
            <div className="flex gap-4 flex-col">
              <button
                onClick={() => { setShowConfirmNav(false); setPendingNavDirection(null); }}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReportIssueFromExitModal}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition"
              >
                🤕 Report Issue
              </button>
              <button
                onClick={confirmNavigation}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition"
              >
                Exit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Confirmation Modal - 2 Buttons */}
      {showConfirmNav && pendingNavDirection !== 'end_session' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">⚠️ Unsaved Progress</h3>
            <p className="text-gray-300 mb-6 text-lg">
              You haven't completed the prescribed reps for <span className="text-white font-bold">{selectedExercise.name}</span>.
              <br /><br />
              If you leave now, your current progress for this exercise will be <span className="text-red-400 font-bold">LOST</span>.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => { setShowConfirmNav(false); setPendingNavDirection(null); }}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmNavigation}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition"
              >
                Confirm & Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Loading Overlay */}
      {isAnalyzingSession && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="text-center p-8 max-w-md w-full">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mb-6"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Analyzing Session...</h3>
            <p className="text-gray-400 mb-6">Please wait while AI generates your performance report.</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${analysisProgress}%` }}
              ></div>
            </div>
            <p className="text-cyan-400 font-semibold text-sm">{analysisProgress}%</p>
          </div>
        </div>
      )}

      {/* Continue Exercising Modal - After Pain Report */}
      {showContinueModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full border border-green-500/50 shadow-2xl">
            <h3 className="text-2xl font-bold text-green-400 mb-4">✅ Report Submitted</h3>
            <p className="text-gray-300 mb-6 text-lg">
              Your report has been submitted for review. Do you want to continue exercising?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleContinueExercising(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition"
              >
                No
              </button>
              <button
                onClick={() => handleContinueExercising(true)}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}



      <div className="flex flex-1 flex-col lg:flex-row">
        <CameraFeed
          videoRef={videoRef}
          canvasRef={canvasRef}
          toggleCamera={toggleCamera}
          running={running}
          showCameraFeed={showCameraFeed}
          setShowCameraFeed={setShowCameraFeed}
          sessionAccuracy={sessionAccuracy}
          showCompletionPopup={showCompletionPopup}
          onNext={handleCompletionNext}
          onRestart={handleCompletionRestart}
          exerciseName={selectedExercise?.name}
          isLastExercise={exercises.findIndex(e => e.name === selectedExercise.name) === exercises.length - 1}
        />


        {showOrientationCheck && running && !hasPassedInitialAlignment && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md w-full px-4">
            {!isOrientationAligned ? (
              // Misaligned - Show Warning
              <div className="bg-red-600/95 backdrop-blur-sm border-4 border-red-400 rounded-2xl p-6 shadow-2xl animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white">⚠️ Align Your Body</h3>
                </div>
                <p className="text-white text-lg font-semibold mb-2">
                  {orientationFeedback || 'Please align your body correctly to start'}
                </p>
                <div className="bg-white/20 rounded-lg p-3 mt-3">
                  <p className="text-white text-sm font-mono">
                    Yaw: {currentOrientation.yaw}° | Pitch: {currentOrientation.pitch}°
                  </p>
                </div>
              </div>
            ) : orientationReadyCountdown !== null ? (
              // Aligned - Show Ready Countdown
              <div className="bg-green-600/95 backdrop-blur-sm border-4 border-green-400 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white">✅ Perfect Alignment!</h3>
                </div>
                <p className="text-white text-xl font-bold text-center">
                  Starting in {orientationReadyCountdown}...
                </p>
                <div className="bg-white/20 rounded-lg p-3 mt-3">
                  <p className="text-white text-sm font-mono text-center">
                    Get ready to exercise!
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}


        <SessionStats
          selectedExercise={selectedExercise}
          repCount={repCount}
          isUp={isUp}
          debugInfo={{ ...debugInfo, currentRepFrames: currentRepFramesRef.current.length }}
          countdown={countdown}
          allReps={allReps}
          exerciseInfo={exerciseInfo}
        />
      </div>

      <SummaryModal
        showSummaryModal={showSummaryModal}
        setShowSummaryModal={(show) => {
          setShowSummaryModal(show);
          if (!show) {
            navigate('/patient-dashboard/tracking');
          }
        }}
        isAnalyzing={isAnalyzing}
        summaryData={summaryData}
        resetSession={resetSession}
        onSave={handleSaveReport}
        onRetry={handleRetryAnalysis}
        prescriptionId={prescriptionId}
      />

      <ControlPanel
        handlePrev={() => handleNavRequest('prev')}
        handleNext={() => handleNavRequest('next')}
        resetSession={resetSession}
        handleEndExercise={onEndSession}
        handleReportPain={handleReportPain}
        repCount={repCount}
        exercises={exercises}
        selectedExercise={selectedExercise}
        isAnalyzing={isAnalyzing}
        showCompletionPopup={showCompletionPopup}
        hasStartedExercising={hasStartedExercising}
      />

      {/* Pain Report Modal */}
      <RequestChangeModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleReportSubmit}
        currentExercise={selectedExercise?.name}
        exerciseList={exercises.map(ex => ex.name)}
        defaultReason="Painful"
        prescriptionId={prescriptionId}
        therapistId={therapistId}
      />
    </div>
  );
}
