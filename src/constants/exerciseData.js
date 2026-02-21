export const EXERCISE_METADATA = {
  jumping_jacks: {
    videoUrl: "https://www.youtube.com/embed/c4DAnQ6DtF8",
    cameraAngle: "Front facing, full body visible. Ensure your hands touch above your head.",
    label: "Jumping Jacks",
    targetBodyPart: "Full Body",
    difficulty: "Beginner",
    requiredOrientation: { yawMin: -40, yawMax: 40, pitchMin: 0, pitchMax: 45 }
  },
  toe_touch: {
    videoUrl: "https://www.youtube.com/embed/adE_yP80jCA",
    cameraAngle: "Side view recommended. Ensure your feet are shoulder-width apart.",
    label: "Toe Touch",
    targetBodyPart: "Back",
    difficulty: "Beginner",
    requiredOrientation: { yawMin: 50, yawMax: 130, pitchMin: 0, pitchMax: 50 }
  },
  squats: {
    videoUrl: "https://www.youtube.com/embed/aclHkVaku9U",
    cameraAngle: "Side view recommended. Keep your back straight and heels on the ground.",
    label: "Squats",
    targetBodyPart: "Knee",
    difficulty: "Intermediate",
    requiredOrientation: { yawMin: -45, yawMax: 45, pitchMin: 0, pitchMax: 45 }
  },
  high_knees: {
    videoUrl: "https://www.youtube.com/embed/a5y35NQutzc",
    cameraAngle: "Side view recommended. Lift your knees to hip height.",
    label: "High Knees",
    targetBodyPart: "Legs",
    difficulty: "Beginner",
    requiredOrientation: { yawMin: 50, yawMax: 130, pitchMin: 0, pitchMax: 40 }
  },
  push_ups: {
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
    cameraAngle: "Side view. Keep your body in a straight line.",
    label: "Push Ups",
    targetBodyPart: "Shoulder",
    difficulty: "Intermediate",
    requiredOrientation: { yawMin: 50, yawMax: 130, pitchMin: 40, pitchMax: 130 }
  }
};

export const getExerciseMetadata = (exerciseName) => {
  if (!exerciseName) return null;
  
  // Normalize the name: lowercase and replace spaces with underscores
  const normalizedName = exerciseName.toLowerCase().replace(/\s+/g, '_');
  
  // Try to find exact match or match with 's' removed (singular/plural)
  let data = EXERCISE_METADATA[normalizedName];
  
  if (!data) {
    // Try removing trailing 's' (e.g. squats -> squat)
    if (normalizedName.endsWith('s')) {
       data = EXERCISE_METADATA[normalizedName.slice(0, -1)];
    }
    // Try adding 's'
    else {
       data = EXERCISE_METADATA[normalizedName + 's'];
    }
  }
  
  return data || {
    videoUrl: "",
    cameraAngle: "Ensure full body is visible in the camera frame.",
    label: exerciseName,
    targetBodyPart: "General",
    difficulty: "Beginner"
  };
};
