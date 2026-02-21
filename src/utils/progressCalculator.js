// src/utils/progressCalculator.js

// Helper to convert time periods to days
const getDaysInPeriod = (unit) => {
  const mapping = {
    daily: 1,
    days: 1,
    weekly: 7,
    weeks: 7,
    monthly: 30,
    months: 30,
  };
  return mapping[unit?.toLowerCase()] || 1;
};

// Helper to parse "3x10" or "30" into a single number (30)
export const parseReps = (repsString) => {
  if (!repsString) return 0;
  // Handle "3x10" format
  if (repsString.toString().toLowerCase().includes('x')) {
    const parts = repsString.toLowerCase().split('x');
    return parts.reduce((acc, val) => acc * parseInt(val.trim() || 1), 1);
  }
  return parseInt(repsString) || 0;
};

export const calculateTotalTarget = (exercise) => {
  if (!exercise) return 0;

  // 1. Calculate how many reps per single session
  const repsPerSession = parseReps(exercise.reps);

  // 2. Calculate Total Days of the program
  const durationValue = parseInt(exercise.durationValue) || 0;
  const durationUnitDays = getDaysInPeriod(exercise.durationUnit);
  const totalProgramDays = durationValue * durationUnitDays;

  // 3. Calculate Rate (Sessions per day)
  const frequencyValue = parseInt(exercise.frequencyValue) || 0;
  const frequencyPeriodDays = getDaysInPeriod(exercise.frequencyPeriod);
  
  // Example: 3 times (value) per week (7 days) = 3/7 sessions per day
  const sessionsPerDay = frequencyValue / frequencyPeriodDays;

  // 4. Total Expected Sessions
  const totalSessions = sessionsPerDay * totalProgramDays;

  // 5. Total Expected Reps
  return Math.round(totalSessions * repsPerSession);
};

export const calculateProgress = (totalCompletedReps, targetReps) => {
  if (!targetReps || targetReps === 0) return 0;
  const percent = (totalCompletedReps / targetReps) * 100;
  return Math.min(Math.round(percent), 100); // Cap at 100% or leave uncapped
};
