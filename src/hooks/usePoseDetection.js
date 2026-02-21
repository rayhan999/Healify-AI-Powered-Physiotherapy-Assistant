import { useRef, useEffect, useState } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Camera } from "@mediapipe/camera_utils";

export const usePoseDetection = (videoRef, canvasRef, processLandmarks, showCameraFeed, countdown, processingEnabledRef) => {
  const [running, setRunning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [poseInitialized, setPoseInitialized] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    fps: 0,
    processingTime: 0,
    frameCount: 0,
    skippedFrames: 0,
    errors: [],
    poseDetected: false,
    currentRepFrames: 0,
  });

  const poseRef = useRef(null);
  const frameCountRef = useRef(0);
  const skippedFramesRef = useRef(0);
  const lastFrameTimeRef = useRef(Date.now());
  const countdownRef = useRef(null);
  const requestRef = useRef(null);
  const runningRef = useRef(false); // To track running state in loop

  // Sync countdown to ref
  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  // Initialize Pose ONCE on mount - prevents reloading model files
  useEffect(() => {
    console.log("🎬 Preloading MediaPipe Pose models (one-time initialization)...");

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    poseRef.current = pose;
    setPoseInitialized(true);
    console.log("✅ MediaPipe Pose models preloaded and ready");

    return () => {
      console.log("🛑 Cleanup Pose");
      setPoseInitialized(false);
      if (poseRef.current) {
        poseRef.current.close();
        poseRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Update results handler when dependencies change (without recreating Pose)
  useEffect(() => {
    if (!poseInitialized || !poseRef.current) {
      console.log("⏳ Waiting for Pose initialization...");
      return;
    }

    console.log("🔄 Updating Pose results handler");

    let lastProcessTime = 0;

    const onResults = (results) => {
      const now = Date.now();
      frameCountRef.current++;

      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!canvas || !video) return;

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
      }

      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const shouldShowFeed = showCameraFeed;

      if (shouldShowFeed && results.image) {
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const poseDetected = results.poseLandmarks && results.poseLandmarks.length === 33;

      // Show countdown and skip processing during countdown
      if (countdownRef.current !== null) {
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 120px Arial";
        ctx.textAlign = "center";
        ctx.fillText(countdownRef.current, canvas.width / 2, canvas.height / 2 + 40);

        // Skip landmark processing during countdown
        ctx.restore();
        return;
      } else if (poseDetected) {
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: "#00FFAA",
          lineWidth: 4,
        });
        drawLandmarks(ctx, results.poseLandmarks, {
          color: "#FF0000",
          fillColor: "#FFFFFF",
          radius: 4,
        });

        const landmarks33 = results.poseLandmarks.map((lm) => ({
          x: lm.x,
          y: lm.y,
          z: lm.z,
          visibility: lm.visibility,
        }));

        lastProcessTime = processLandmarks(landmarks33);
      } else {
        skippedFramesRef.current++;

        ctx.fillStyle = "#9CA3AF";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("No Pose Detected", canvas.width / 2, canvas.height / 2);
      }

      ctx.restore();

      if (frameCountRef.current % 30 === 0) {
        const elapsed = (now - lastFrameTimeRef.current) / 1000;
        const fps = 30 / elapsed;

        setDebugInfo((prev) => ({
          fps: Math.round(fps),
          processingTime: Math.round(lastProcessTime * 100) / 100,
          frameCount: frameCountRef.current,
          skippedFrames: skippedFramesRef.current,
          poseDetected: poseDetected,
          ...prev,
          errors: prev.errors,
        }));

        lastFrameTimeRef.current = now;
      }
    };

    poseRef.current.onResults(onResults);
  }, [poseInitialized, processLandmarks, showCameraFeed]); // Update handler when these change

  const loop = async () => {
    if (!runningRef.current) return;

    if (videoRef.current && videoRef.current.readyState >= 2 && poseRef.current) {
      try {
        await poseRef.current.send({ image: videoRef.current });
      } catch (e) {
        console.error("Pose send error:", e);
      }
    }
    
    if (runningRef.current) {
      requestRef.current = requestAnimationFrame(loop);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            resolve();
          };
        });
        await videoRef.current.play();
        
        runningRef.current = true;
        setRunning(true);
        
        // Reset counters
        frameCountRef.current = 0;
        skippedFramesRef.current = 0;
        lastFrameTimeRef.current = Date.now();
        
        // Start loop
        requestRef.current = requestAnimationFrame(loop);
      }
    } catch (err) {
      console.error("❌ Camera start error:", err);
      setDebugInfo((prev) => ({
        ...prev,
        errors: [...prev.errors, `Camera: ${err.message}`].slice(-3),
      }));
      stopCamera();
    }
  };

  const stopCamera = () => {
    console.log("🛑 Stopping camera");
    runningRef.current = false;
    setRunning(false);
    
    // Cancel animation frame first
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    // Stop all media tracks to turn off camera indicator
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      
      console.log(`🎥 Stopping ${tracks.length} track(s)`);
      tracks.forEach((track) => {
        console.log(`  Stopping track: ${track.kind}, state: ${track.readyState}`);
        track.stop();
        console.log(`  After stop, state: ${track.readyState}`);
      });
      
      // Clear the video source
      videoRef.current.srcObject = null;
      videoRef.current.src = "";
      videoRef.current.load(); // Force reload to clear any cached stream
    }

    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      console.log("✅ Canvas cleared");
    }
    
    console.log("✅ Camera stopped successfully");
  };

  const isTogglingRef = useRef(false);

  const toggleCamera = async (setCountdownCallback) => {
    if (isTogglingRef.current) return;
    isTogglingRef.current = true;

    try {
      if (running) {
        stopCamera();
        processingEnabledRef.current = false;
        if (setCountdownCallback) setCountdownCallback(null);
      } else {
        console.log("▶️ Starting camera sequence");
        
        // 1. Start Camera
        await startCamera();
        
        // 2. Countdown
        if (setCountdownCallback && runningRef.current) {
          processingEnabledRef.current = false;
          
          setCountdownCallback(3);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          if (!runningRef.current) return; // Check if stopped during wait
          setCountdownCallback(2);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          if (!runningRef.current) return;
          setCountdownCallback(1);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          if (!runningRef.current) return;
          setCountdownCallback(null);
        }
        
        // 3. Enable Processing
        if (runningRef.current) {
          processingEnabledRef.current = true;
        }
      }
    } finally {
      setIsAnalyzing(false);
      isTogglingRef.current = false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    camera: null, // No longer using Camera object
    running,
    isAnalyzing,
    setIsAnalyzing,
    debugInfo,
    setDebugInfo,
    toggleCamera,
    processingEnabledRef
  };
};
