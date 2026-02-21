import { differenceInDays, addDays, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';

/**
 * Helper to convert various Duration Units to Days
 */
const getDurationInDays = (value, unit) => {
  const val = parseInt(value, 10);
  if (isNaN(val)) return 0;
  
  switch (unit?.toLowerCase()) {
    case 'days': return val;
    case 'weeks': return val * 7;
    case 'months': return val * 30; // Approximation
    default: return val;
  }
};

/**
 * 1. FILTER: Is the exercise still valid based on its Duration?
 * Example: Prescribed for 1 month. If today is Day 32, returns false.
 */
export const isExerciseActive = (exercise, prescriptionStartDate, targetDate = new Date()) => {
  const start = new Date(prescriptionStartDate);
  const now = new Date(targetDate);
  
  const durationDays = getDurationInDays(exercise.durationValue, exercise.durationUnit);
  const daysElapsed = differenceInDays(now, start);

  // If we assume start date is Day 0. 
  // If duration is 30 days, it is active if daysElapsed is 0 to 29.
  return daysElapsed >= 0 && daysElapsed < durationDays;
};

/**
 * 2. QUOTA: Has the user met their frequency quota for the current period?
 * Example: "3 times weekly". Checks if user already did 3 sessions this week.
 */
export const getExerciseStatusForToday = (exercise, completedSessions, targetDate = new Date()) => {
  const now = new Date(targetDate);
  const period = exercise.frequencyPeriod?.toLowerCase() || 'daily';
  const targetFrequency = parseInt(exercise.frequencyValue, 10) || 1;

  // Filter sessions that match this exercise
  const exerciseSessions = completedSessions.filter(s => s.exercise_name === exercise.name);

  let currentPeriodSessions = [];

  if (period === 'daily') {
    // For daily, we just look at TODAY
    currentPeriodSessions = exerciseSessions.filter(s => 
      differenceInDays(new Date(s.completed_at), now) === 0
    );
  } else if (period === 'weekly') {
    // For weekly, we look at the current week window
    const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(now, { weekStartsOn: 1 });
    
    currentPeriodSessions = exerciseSessions.filter(s => 
      isWithinInterval(new Date(s.completed_at), { start, end })
    );
  } else if (period === 'monthly') {
     // Monthly logic...
     const currentMonth = now.getMonth();
     currentPeriodSessions = exerciseSessions.filter(s => 
       new Date(s.completed_at).getMonth() === currentMonth
     );
  }

  const completedCount = currentPeriodSessions.length;
  const isCompletedForPeriod = completedCount >= targetFrequency;

  return {
    isActivePeriod: true, // This function assumes isExerciseActive was already checked
    completedCount,
    targetFrequency,
    isCompletedForPeriod,
    remainingRaw: Math.max(0, targetFrequency - completedCount)
  };
};

/**
 * MAIN FUNCTION: Get the unified list for "Today's To-Do List"
 */
export const getDailyPrescriptionList = (prescription, completedSessions = [], targetDate = new Date()) => {
  if (!prescription || !prescription.exercises) return [];

  const startDate = prescription.created_at || prescription.createdAt || new Date();

  return prescription.exercises.map(exercise => {
    // 1. Check Duration Validity
    const isDurationActive = isExerciseActive(exercise, startDate, targetDate);

    if (!isDurationActive) {
      return { ...exercise, status: 'EXPIRED', reason: 'Duration ended' };
    }

    // 2. Check Frequency Status
    const statusInfo = getExerciseStatusForToday(exercise, completedSessions, targetDate);

    // 3. Determine Final Display Status
    let status = 'TODO';
    if (statusInfo.isCompletedForPeriod) {
      status = 'COMPLETED_QUOTA'; // e.g. "Done for the week"
    } else {
      // Logic nuance: If it's weekly 3x, and I haven't done it today, 
      // but I still need to do it... is it 'TODO' today?
      // Yes, unless we want to enforce specific off-days. 
      // For simplicity, if quota isn't met, it's available to do.
      status = 'TODO';
    }

    return {
      ...exercise,
      status, // 'TODO', 'COMPLETED_QUOTA', 'EXPIRED'
      progress: {
        completed: statusInfo.completedCount,
        target: statusInfo.targetFrequency,
        unit: exercise.frequencyPeriod
      }
    };
  });
};
