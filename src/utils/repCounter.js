/**
 * Repetition Counter Utility
 * 
 * This file contains logic for detecting repetitions for various exercises.
 * Each exercise function takes landmarks and the current state, and returns
 * the updated state and whether a rep was completed.
 */

const CONSECUTIVE_FRAMES_REQUIRED = 2;

/**
 * Calculates the angle between three points (A, B, C).
 * B is the vertex.
 */
const calculateAngle = (a, b, c) => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
};

const exercises = {
  /**
   * Jumping Jack / Shoulder Press Logic
   * Checks if the right wrist goes above the right shoulder.
   */
  jumping_jack: (landmarks, state) => {
    const rightWristY = landmarks[16].y;
    const rightShoulderY = landmarks[12].y;
    const diff = rightWristY - rightShoulderY;

    const LIFT_THRESHOLD = -0.1;
    const DROP_THRESHOLD = 0.1;

    let { isUp, consecutiveDownFrames } = state;
    let isRepCompleted = false;
    let feedback = "";

    if (!isUp && diff < LIFT_THRESHOLD) {
      isUp = true;
      consecutiveDownFrames = 0;
    } else if (isUp && diff > DROP_THRESHOLD) {
      consecutiveDownFrames++;

      if (consecutiveDownFrames >= CONSECUTIVE_FRAMES_REQUIRED) {
        isUp = false;
        consecutiveDownFrames = 0;
        isRepCompleted = true;
        feedback = "Good rep!";
      }
    } else {
      consecutiveDownFrames = 0;
    }

    return {
      isRepCompleted,
      newState: { isUp, consecutiveDownFrames },
      feedback,
      isUpState: isUp
    };
  },

  /**
   * Squat Logic
   * Uses the angle of the knee (Hip-Knee-Ankle).
   */
  squat: (landmarks, state) => {
    // Left side: Hip(23), Knee(25), Ankle(27)
    // Right side: Hip(24), Knee(26), Ankle(28)
    // Using left side for now, or average
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    const angle = calculateAngle(leftHip, leftKnee, leftAnkle);

    const DOWN_THRESHOLD = 90; // Deep squat
    const UP_THRESHOLD = 160; // Standing straight

    let { isUp, consecutiveDownFrames } = state; // isUp here means "Standing"
    let isRepCompleted = false;
    let feedback = "";

    // Initial state assumption: User starts standing (isUp = true)
    if (state.isUp === undefined) isUp = true;

    if (isUp && angle < DOWN_THRESHOLD) {
      isUp = false; // Now in squat position
      consecutiveDownFrames = 0;
      feedback = "Good depth!";
    } else if (!isUp && angle > UP_THRESHOLD) {
      consecutiveDownFrames++;

      if (consecutiveDownFrames >= CONSECUTIVE_FRAMES_REQUIRED) {
        isUp = true; // Back to standing
        consecutiveDownFrames = 0;
        isRepCompleted = true;
        feedback = "Squat completed!";
      }
    } else {
       // Maintain current state counters if in between
       if (!isUp) consecutiveDownFrames = 0; // Reset if we wiggle while down? Or just keep counting when we go up.
       // Actually for "up" detection we need consecutive frames ABOVE threshold.
       if (!isUp && angle <= UP_THRESHOLD) consecutiveDownFrames = 0;
    }

    return {
      isRepCompleted,
      newState: { isUp, consecutiveDownFrames },
      feedback,
      isUpState: !isUp // "Up" in UI usually means "Active" part of rep? Or just literal Up/Down. 
                       // For squat: Standing (Up) -> Squat (Down). 
                       // Let's map isUpState to "Is Squatting" (Down) for UI visualization if needed, or just keep it literal.
                       // Let's keep it literal: True = Standing, False = Squatting.
    };
  },

  /**
   * Push-up Logic
   * Uses the angle of the elbow (Shoulder-Elbow-Wrist).
   */
  push_up: (landmarks, state) => {
    // Left side: Shoulder(11), Elbow(13), Wrist(15)
    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];

    const angle = calculateAngle(leftShoulder, leftElbow, leftWrist);

    const DOWN_THRESHOLD = 90; // Chest near floor
    const UP_THRESHOLD = 160; // Arms extended

    let { isUp, consecutiveDownFrames } = state; // isUp means "Arms Extended"
    let isRepCompleted = false;
    let feedback = "";

    if (state.isUp === undefined) isUp = true;

    if (isUp && angle < DOWN_THRESHOLD) {
      isUp = false; // Down position
      consecutiveDownFrames = 0;
      feedback = "Low enough!";
    } else if (!isUp && angle > UP_THRESHOLD) {
      consecutiveDownFrames++;

      if (consecutiveDownFrames >= CONSECUTIVE_FRAMES_REQUIRED) {
        isUp = true; // Back up
        consecutiveDownFrames = 0;
        isRepCompleted = true;
        feedback = "Push-up completed!";
      }
    } else {
        if (!isUp && angle <= UP_THRESHOLD) consecutiveDownFrames = 0;
    }

    return {
      isRepCompleted,
      newState: { isUp, consecutiveDownFrames },
      feedback,
      isUpState: isUp // True = Up (Rest), False = Down (Work)
    };
  },

  /**
   * Toe Touch Logic
   * Uses the angle of the hip (Shoulder-Hip-Knee).
   */
  toe_touch: (landmarks, state) => {
    // Left side: Shoulder(11), Hip(23), Knee(25)
    const leftShoulder = landmarks[11];
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];

    const angle = calculateAngle(leftShoulder, leftHip, leftKnee);

    const DOWN_THRESHOLD = 100; // Bending forward
    const UP_THRESHOLD = 160; // Standing straight

    let { isUp, consecutiveDownFrames } = state; // isUp means "Standing"
    let isRepCompleted = false;
    let feedback = "";

    if (state.isUp === undefined) isUp = true;

    if (isUp && angle < DOWN_THRESHOLD) {
      isUp = false; // Bent over
      consecutiveDownFrames = 0;
      feedback = "Good stretch!";
    } else if (!isUp && angle > UP_THRESHOLD) {
      consecutiveDownFrames++;

      if (consecutiveDownFrames >= CONSECUTIVE_FRAMES_REQUIRED) {
        isUp = true; // Back to standing
        consecutiveDownFrames = 0;
        isRepCompleted = true;
        feedback = "Toe touch completed!";
      }
    } else {
        if (!isUp && angle <= UP_THRESHOLD) consecutiveDownFrames = 0;
    }

    return {
      isRepCompleted,
      newState: { isUp, consecutiveDownFrames },
      feedback,
      isUpState: !isUp // False = Standing (Rest), True = Bent (Work) - wait, usually Up=Rest. 
                       // Squat: Up=Standing(Rest). Pushup: Up=Extended(Rest).
                       // Toe Touch: Up=Standing(Rest). 
                       // So isUpState should be !isUp if we want "Active" state, or just isUp if we want "Standing" state.
                       // Let's match Squat: isUpState: !isUp (which was False=Squatting?). 
                       // Squat code says: isUpState: !isUp. Wait, Squat code says:
                       // isUp = true (Standing). isUpState = !isUp = false. So False means Standing?
                       // Let's check Squat again.
                       // Squat: isUp=true(Standing). Returns isUpState: !isUp (False).
                       // So for Squat, False = Standing.
                       // Pushup: isUp=true(Extended). Returns isUpState: isUp (True).
                       // This is inconsistent. 
                       // Let's stick to the logic: isUp variable tracks the state machine.
                       // For Toe Touch, isUp=true is Standing.
                       // I will return isUpState: !isUp to match Squat since it's a similar "down and up" movement.
    };
  },
  high_knees: (landmarks, state) => {
    const rightHipY = landmarks[24].y;
    const rightKneeY = landmarks[26].y;
    const leftHipY = landmarks[23].y;
    const leftKneeY = landmarks[25].y;

    // Calculate relative height (Hip Y - Knee Y)
    // Positive = Knee above Hip
    // Negative = Knee below Hip (Normal standing is ~ -0.4 to -0.2)
    const rightVal = rightHipY - rightKneeY;
    const leftVal = leftHipY - leftKneeY;

    // Thresholds
    const UP_THRESHOLD = -0.15;   // Knee is coming up (thigh ~45 deg)
    const DOWN_THRESHOLD = -0.20; // Knee is down (standing)

    let {
      leftLifted = false,
      rightLifted = false,
      activeLeg = null // 'left', 'right', or null
    } = state;

    let isRepCompleted = false;
    let feedback = "";

    // State Machine
    if (activeLeg === null) {
      // Ready for a new lift
      if (leftVal > UP_THRESHOLD) {
        activeLeg = 'left';
        leftLifted = true;
        feedback = "Left Up";
        console.log(">>> Left Leg Up Detected");
      } else if (rightVal > UP_THRESHOLD) {
        activeLeg = 'right';
        rightLifted = true;
        feedback = "Right Up";
        console.log(">>> Right Leg Up Detected");
      }
    } else if (activeLeg === 'left') {
      // Waiting for Left to go down
      if (leftVal < DOWN_THRESHOLD) {
        activeLeg = null;
        console.log(">>> Left Leg Down");
      }
    } else if (activeLeg === 'right') {
      // Waiting for Right to go down
      if (rightVal < DOWN_THRESHOLD) {
        activeLeg = null;
        console.log(">>> Right Leg Down");
      }
    }

    // Check for Rep Completion (Both legs must have been lifted and returned down)
    if (leftLifted && rightLifted && activeLeg === null) {
      isRepCompleted = true;
      feedback = "Good Rep!";
      console.log(">>> Rep Completed!");
      
      // Reset flags for next rep
      leftLifted = false;
      rightLifted = false;
    }

    // Debug Log
    // console.log(`[HighKnees] L:${leftVal.toFixed(2)} R:${rightVal.toFixed(2)} | Active:${activeLeg} | Flags: L=${leftLifted} R=${rightLifted}`);

    return {
      isRepCompleted,
      newState: { leftLifted, rightLifted, activeLeg },
      feedback,
      isUpState: (activeLeg !== null) // Visual feedback: Active when a leg is up
    };
  },

};

/**
 * Main function to check for repetitions.
 * 
 * @param {Array} landmarks - Array of 33 pose landmarks from MediaPipe.
 * @param {string} exerciseType - The type of exercise (e.g., 'jumping_jack').
 * @param {Object} currentState - The current state object (must contain exercise-specific state).
 * @returns {Object} - { isRepCompleted, newState, feedback, isUpState }
 */
export const checkRepetition = (landmarks, exerciseType, currentState) => {
  const handler = exercises[exerciseType] || exercises['jumping_jack'];
  
  // Initialize state if empty
  const safeState = currentState || { isUp: false, consecutiveDownFrames: 0 };
  
  return handler(landmarks, safeState);
};
