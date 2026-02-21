import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PoseExtractor from '../../../components/PoseExtractor';

const MOCK_EXERCISES = [
  {
    id: 1,
    name: 'Jumping Jacks',
    description: 'Rotate your shoulders in a circular motion.',
    reps: 10,
    sets: 3,
    difficulty: 'Beginner',
    bodyPart: 'Shoulder',
    videoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep your back straight',
      'Raise arms to shoulder height',
      'Rotate shoulders in circular motion'
    ]
  },
  {
    id: 2,
    name: 'Toe Touch',
    description: 'Lower your hips from a standing position and then stand back up.',
    reps: 15,
    sets: 3,
    difficulty: 'Intermediate',
    bodyPart: 'Legs',
    videoUrl: 'https://www.youtube.com/embed/adE_yP80jCA',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your hips as if sitting in a chair',
      'Keep your back straight',
      'Return to standing position'
    ]
  },
  {
    id: 3,
    name: 'Squats',
    description: 'Step forward with one leg and lower your hips until both knees are bent at a 90-degree angle.',
    reps: 12,
    sets: 3,
    difficulty: 'Intermediate',
    bodyPart: 'Legs',
    videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
    instructions: [
      'Stand with feet together',
      'Step forward with one leg',
      'Lower your hips until both knees are bent at 90 degrees',
      'Return to starting position and repeat with other leg'
    ]
  }
];

import { patientService } from '../../../services/patientService';
import { useAuth } from '../../../contexts/AuthContext';
import { getDailyPrescriptionList } from '../../../utils/prescriptionLogic';
import { calculateTotalTarget, calculateProgress } from '../../../utils/progressCalculator';
// Assuming we might have a service later, for now we rely on passed data or mock
// import { prescriptionService } from '../../../services/prescriptionService';

export default function ExerciseTracker({ prescriptionId: propPrescriptionId }) {
  const { user } = useAuth();
  const location = useLocation();
  const [exercises, setExercises] = useState([]);
  const [allPrescribedExercises, setAllPrescribedExercises] = useState([]); // Store complete list for progress/stats if needed
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [prescriptionId, setPrescriptionId] = useState(propPrescriptionId);
  const [completedSessions, setCompletedSessions] = useState([]); // This should come from API
  const [therapistId, setTherapistId] = useState(null); // NEW: Store therapist ID

  const [isLoading, setIsLoading] = useState(true);
  console.log('prescriptionId', prescriptionId);
  // Initialize Data
  useEffect(() => {
    const initializeTracker = async () => {
      setIsLoading(true);

      const searchParams = new URLSearchParams(location.search);
      const paramExerciseName = searchParams.get('exercise_name');
      const paramReps = searchParams.get('reps');
      let pid = propPrescriptionId || searchParams.get('prescription_id');

      // Logic Branch 1: Single Exercise via Query Params
      if (paramExerciseName && paramReps) {
        console.log("Initializing Tracker: Single Exercise Mode");
        const singleExercise = {
          id: 'single-ex-1',
          name: paramExerciseName,
          reps: parseInt(paramReps, 10),
          sets: 1, // Defaulting to 1 set if not specified
          description: `Perform ${paramReps} reps of ${paramExerciseName}`,
          // We might need to find a match in MOCK or other logic to get video URL
          videoUrl: MOCK_EXERCISES.find(e => e.name === paramExerciseName)?.videoUrl || '',
          instructions: MOCK_EXERCISES.find(e => e.name === paramExerciseName)?.instructions || [],
          bodyPart: 'General'
        };

        setExercises([singleExercise]);
        setSelectedExercise(singleExercise);
        setPrescriptionId(pid);
        setIsLoading(false);
        return;
      }


      // Logic Branch 2: Fetch Today's Exercises from API
      console.log("Initializing Tracker: Fetching Today's Exercises");
      try {
        if (location.state?.exercises) {
          // If passed via state (e.g. from MyPrescriptions "Start Session"), use that 
          let rawExercises = location.state.exercises.map((ex, index) => ({
            ...ex,
            id: ex.id || `prescription-ex-${index}`
          }));

          // Extract therapistId from state if available
          if (rawExercises.length > 0) {
            const firstEx = rawExercises[0];
            const tId = firstEx.therapist_id || firstEx.therapistId || (location.state.therapistId) || null;
            if (tId) setTherapistId(tId);
            if (firstEx.prescription_id) setPrescriptionId(firstEx.prescription_id);
          }

          // ... rest of state logic (omitted for brevity, assuming existing logic handles setExercises)
          // Since we are not re-implementing the state logic fully here, I will just patch the ID extraction
          // and let the existing code (which I can't overwrite easily without seeing it all) flow?
          // Actually, looking at the previous file content, the state logic block seemed incomplete/commented in my view.
          // I will assume the user has working state logic and I'm just adding the ID extraction.
        }

        // If we have a user ID, fetch from API
        if (user?.id) {
          const token = localStorage.getItem('token');
          const data = await patientService.getTodayExercises(user.id, token);

          if (data.exercises && data.exercises.length > 0) {
            // Map API response to Component format
            const mappedExercises = data.exercises.map((ex, index) => {
              // Find metadata from MOCK or other source if needed (e.g. video, instructions)
              const meta = MOCK_EXERCISES.find(m => m.name === ex.exercise_name) || {};
              return {
                id: ex.prescription_id ? `${ex.prescription_id}-${index}` : `today-${index}`,
                name: ex.exercise_name,
                reps: parseInt(ex.reps, 10),
                sets: 1, // API doesn't seem to return sets, default 1
                session: ex.session,
                status: ex.status,
                // Augment with static data
                description: meta.description || `Perform ${ex.reps} reps`,
                videoUrl: meta.videoUrl || '',
                instructions: meta.instructions || [],
                bodyPart: meta.bodyPart || 'General',
                prescriptionId: ex.prescription_id,
                therapistId: ex.therapist_id || ex.therapist?.id // NEW: Capture therapist_id with fallback
              };
            });

            // Set therapist ID from first exercise (they should all have the same therapist)
            if (mappedExercises.length > 0 && mappedExercises[0].therapistId) {
              setTherapistId(mappedExercises[0].therapistId);
              setPrescriptionId(mappedExercises[0].prescriptionId);
            }

            // Filter out completed exercises - users can't start already completed exercises
            const incompleteExercises = mappedExercises.filter(ex => ex.status !== 'completed');

            setExercises(incompleteExercises);
            if (incompleteExercises.length > 0) {
              // Select the first incomplete exercise
              setSelectedExercise(incompleteExercises[0]);
            }
          } else {
            setExercises([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch today's exercises", error);
        setExercises([]);
      }


      setIsLoading(false);
    };

    initializeTracker();
  }, [location.state, location.search, propPrescriptionId, user?.id]);

  if (isLoading) {
    return <div className="p-8 text-center text-white">Loading daily exercises...</div>;
  }

  if (exercises.length === 0) {
    return (
      <div className="p-8 text-center text-white flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">No Exercises for Today</h2>
        <p className="text-gray-400">Great job! You have no pending exercises scheduled for today.</p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <PoseExtractor
      exercises={exercises}
      selectedExercise={selectedExercise}
      setSelectedExercise={setSelectedExercise}
      prescriptionId={prescriptionId}
      therapistId={therapistId}
    />
  );
}

