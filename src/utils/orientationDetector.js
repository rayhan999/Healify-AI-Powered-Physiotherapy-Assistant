/**
 * Orientation Detector Utility
 * Calculates user's body orientation (yaw and pitch) from MediaPipe landmarks
 */

/**
 * Calculate the user's orientation angles from pose landmarks
 * @param {Array} landmarks - MediaPipe pose landmarks (33 points)
 * @returns {Object} { yaw, pitch } - Orientation angles in degrees
 */
export function getUserOrientation(landmarks) {
  if (!landmarks || landmarks.length < 33) {
    return { yaw: 0, pitch: 0 };
  }

  // MediaPipe landmark indices
  const LEFT_SHOULDER = 11;
  const RIGHT_SHOULDER = 12;
  const LEFT_HIP = 23;
  const RIGHT_HIP = 24;

  // Get shoulder landmarks
  const leftShoulder = landmarks[LEFT_SHOULDER];
  const rightShoulder = landmarks[RIGHT_SHOULDER];
  
  // Get hip landmarks (for torso calculation)
  const leftHip = landmarks[LEFT_HIP];
  const rightHip = landmarks[RIGHT_HIP];

  // Calculate shoulder midpoint
  const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
  const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
  const shoulderMidZ = (leftShoulder.z + rightShoulder.z) / 2;

  // Calculate hip midpoint
  const hipMidX = (leftHip.x + rightHip.x) / 2;
  const hipMidY = (leftHip.y + rightHip.y) / 2;
  const hipMidZ = (leftHip.z + rightHip.z) / 2;

  // Calculate shoulder vector (difference between left and right shoulder)
  const shoulderXDiff = rightShoulder.x - leftShoulder.x;
  const shoulderZDiff = rightShoulder.z - leftShoulder.z;

  // Calculate torso vector (from hip to shoulder)
  const torsoY = shoulderMidY - hipMidY;
  const torsoZ = shoulderMidZ - hipMidZ;

  // Calculate YAW (horizontal rotation) using Z-depth difference
  // When facing camera: both shoulders at similar Z depth → small Z difference
  // When side view: one shoulder much closer → large Z difference
  // 
  // The ratio of Z difference to X difference tells us the rotation:
  // - Small ratio (Z << X) = facing camera (front view)
  // - Large ratio (Z ≈ X) = side view
  
  // Calculate angle based on shoulder depth vs width
  let yaw = Math.atan2(shoulderZDiff, Math.abs(shoulderXDiff)) * (180 / Math.PI);
  
  // Normalize to -180 to 180 range where:
  // 0° = facing camera (front)
  // 90° = right side view
  // -90° = left side view
  // ±180° = facing away (back)
  
  // Determine which side based on which shoulder is further
  if (shoulderZDiff > 0) {
    // Right shoulder is further from camera (turned to the right)
    yaw = yaw;
  } else {
    // Left shoulder is further from camera (turned to the left)
    yaw = -yaw;
  }
  
  // Normalize yaw to -180 to 180 range
  if (yaw > 180) yaw -= 360;
  if (yaw < -180) yaw += 360;

  // Calculate PITCH (vertical tilt, up-down)
  // Positive pitch = leaning forward, Negative pitch = leaning backward
  let pitch = Math.atan2(torsoZ, -torsoY) * (180 / Math.PI);
  
  // Normalize pitch to 0-180 range (0 = upright, 90 = horizontal, 180 = upside down)
  pitch = Math.abs(pitch);

  return {
    yaw: Math.round(yaw),
    pitch: Math.round(pitch)
  };
}

/**
 * Check if user's orientation is within the required range for an exercise
 * @param {Object} currentOrientation - { yaw, pitch }
 * @param {Object} requiredOrientation - { yawMin, yawMax, pitchMin, pitchMax }
 * @returns {Object} { isAligned, feedback }
 */
export function checkOrientationAlignment(currentOrientation, requiredOrientation) {
  if (!requiredOrientation) {
    return { isAligned: true, feedback: '' };
  }

  const { yaw, pitch } = currentOrientation;
  const { yawMin, yawMax, pitchMin, pitchMax } = requiredOrientation;

  const yawAligned = yaw >= yawMin && yaw <= yawMax;
  const pitchAligned = pitch >= pitchMin && pitch <= pitchMax;
  const isAligned = yawAligned && pitchAligned;

  let feedback = '';
  
  if (!isAligned) {
    if (!yawAligned) {
      if (yaw < yawMin) {
        feedback = 'Turn more to your right';
      } else {
        feedback = 'Turn more to your left';
      }
    } else if (!pitchAligned) {
      if (pitch < pitchMin) {
        feedback = 'Lean forward more';
      } else {
        feedback = 'Stand more upright';
      }
    }
  }

  return { isAligned, feedback };
}
