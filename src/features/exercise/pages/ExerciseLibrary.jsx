import React, { useState } from "react";

const getExerciseIllustration = (category) => {
  const illustrations = {
    shoulder: (
      <div className="relative">
        <svg className="w-32 h-32 text-white" viewBox="0 0 100 100">
          <circle cx="50" cy="20" r="8" fill="white" opacity="0.9"/>
          <line x1="50" y1="28" x2="50" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <g style={{ transformOrigin: '50px 35px' }} className="animate-[shoulderRotate_3s_ease-in-out_infinite]">
            <line x1="50" y1="35" x2="30" y2="45" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="30" y1="45" x2="25" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </g>
          <g style={{ transformOrigin: '50px 35px', animationDelay: '1.5s' }} className="animate-[shoulderRotate_3s_ease-in-out_infinite_reverse]">
            <line x1="50" y1="35" x2="70" y2="45" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="70" y1="45" x2="75" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </g>
          <line x1="50" y1="55" x2="40" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="55" x2="60" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="40" y1="75" x2="38" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="60" y1="75" x2="62" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <style>{`
          @keyframes shoulderRotate {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-15deg); }
            75% { transform: rotate(15deg); }
            100% { transform: rotate(0deg); }
          }
        `}</style>
      </div>
    ),
    knee: (
      <div className="relative">
        <svg className="w-32 h-32 text-white" viewBox="0 0 100 100">
          <circle cx="50" cy="15" r="7" fill="white" opacity="0.9"/>
          <g className="animate-[kneeBend_2s_ease-in-out_infinite]">
            <line x1="50" y1="22" x2="50" y2="45" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="28" x2="35" y2="38" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="28" x2="65" y2="38" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="45" x2="45" y2="65" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="45" x2="55" y2="65" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="45" y1="65" x2="43" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="55" y1="65" x2="57" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </g>
        </svg>
        <style>{`
          @keyframes kneeBend {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(8px); }
          }
        `}</style>
      </div>
    ),
    neck: (
      <div className="relative">
        <svg className="w-32 h-32 text-white" viewBox="0 0 100 100">
          <g style={{ transformOrigin: '50px 28px' }} className="animate-[neckTilt_3s_ease-in-out_infinite]">
            <circle cx="50" cy="20" r="8" fill="white" opacity="0.9"/>
          </g>
          <line x1="50" y1="28" x2="50" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="35" x2="35" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="35" x2="65" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="55" x2="43" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="55" x2="57" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="43" y1="75" x2="41" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="57" y1="75" x2="59" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <style>{`
          @keyframes neckTilt {
            0%, 100% { transform: translateX(0); }
            33% { transform: translateX(4px); }
            66% { transform: translateX(-4px); }
          }
        `}</style>
      </div>
    ),
    hip: (
      <div className="relative">
        <svg className="w-32 h-32 text-white" viewBox="0 0 100 100">
          <circle cx="50" cy="18" r="7" fill="white" opacity="0.9"/>
          <g className="animate-[hipLunge_2.5s_ease-in-out_infinite]">
            <line x1="50" y1="25" x2="50" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="30" x2="30" y2="35" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="30" x2="70" y2="35" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="48" x2="60" y2="65" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="60" y1="65" x2="62" y2="78" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="48" x2="35" y2="60" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="35" y1="60" x2="28" y2="70" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </g>
        </svg>
        <style>{`
          @keyframes hipLunge {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(3px); }
          }
        `}</style>
      </div>
    ),
    ankle: (
      <div className="relative">
        <svg className="w-32 h-32 text-white" viewBox="0 0 100 100">
          <circle cx="35" cy="25" r="7" fill="white" opacity="0.9"/>
          <line x1="35" y1="32" x2="35" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="35" y1="50" x2="20" y2="60" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="35" y1="50" x2="50" y2="60" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="35" y1="50" x2="55" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="55" y1="55" x2="75" y2="58" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <g style={{ transformOrigin: '80px 62px', animationDuration: '3s' }} className="animate-spin">
            <ellipse cx="80" cy="62" rx="8" ry="4" fill="white" opacity="0.9"/>
          </g>
          <circle cx="80" cy="62" r="6" fill="none" stroke="white" strokeWidth="1" opacity="0.5"/>
        </svg>
      </div>
    ),
    back: (
      <div className="relative">
        <svg className="w-32 h-32 text-white" viewBox="0 0 100 100">
          <circle cx="50" cy="45" r="7" fill="white" opacity="0.9"/>
          <g className="animate-[backLift_2.5s_ease-in-out_infinite]">
            <path d="M 50 52 Q 50 60, 50 70" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <line x1="50" y1="55" x2="35" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="55" x2="65" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </g>
          <line x1="50" y1="70" x2="43" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="70" x2="57" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <style>{`
          @keyframes backLift {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}</style>
      </div>
    ),
    wrist: (
      <div className="relative">
        <svg className="w-32 h-32 text-white" viewBox="0 0 100 100">
          <circle cx="50" cy="20" r="7" fill="white" opacity="0.9"/>
          <line x1="50" y1="27" x2="50" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="35" x2="70" y2="40" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <g style={{ transformOrigin: '70px 40px' }} className="animate-[wristBend_2s_ease-in-out_infinite]">
            <line x1="70" y1="40" x2="75" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </g>
          <line x1="50" y1="35" x2="30" y2="45" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="50" x2="45" y2="70" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="50" x2="55" y2="70" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="45" y1="70" x2="43" y2="80" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="55" y1="70" x2="57" y2="80" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <style>{`
          @keyframes wristBend {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-25deg); }
          }
        `}</style>
      </div>
    ),
    leg: (
      <div className="relative">
        <svg className="w-32 h-32 text-white" viewBox="0 0 100 100">
          <circle cx="50" cy="20" r="7" fill="white" opacity="0.9"/>
          <g className="animate-[squat_2.5s_ease-in-out_infinite]">
            <line x1="50" y1="27" x2="50" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="35" x2="30" y2="38" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="35" x2="70" y2="38" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="48" x2="42" y2="65" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="48" x2="58" y2="65" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="42" y1="65" x2="40" y2="78" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="58" y1="65" x2="60" y2="78" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </g>
        </svg>
        <style>{`
          @keyframes squat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(6px); }
          }
        `}</style>
      </div>
    ),
  };

  return illustrations[category] || (
    <svg className="w-32 h-32 text-white" viewBox="0 0 200 200" fill="currentColor">
      <circle cx="100" cy="50" r="20" />
      <rect x="90" y="70" width="20" height="60" rx="10" />
      <rect x="85" y="130" width="12" height="50" rx="6" />
      <rect x="103" y="130" width="12" height="50" rx="6" />
      <rect x="65" y="80" width="12" height="40" rx="6" transform="rotate(-30 71 100)" />
      <rect x="123" y="80" width="12" height="40" rx="6" transform="rotate(30 129 100)" />
    </svg>
  );
};

export default function ExerciseLibrary({ onStartExercise, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedExercise, setSelectedExercise] = useState(null);

  const exercises = [
    {
      id: 1,
      name: "Shoulder Rotation",
      category: "shoulder",
      difficulty: "beginner",
      equipment: "none",
      duration: "5 min",
      reps: 10,
      sets: 3,
      description: "Gentle shoulder rotation exercise to improve mobility and reduce stiffness.",
      benefits: ["Improves shoulder mobility", "Reduces stiffness", "Strengthens rotator cuff"],
      instructions: [
        "Stand with feet shoulder-width apart",
        "Keep your back straight",
        "Raise arms to shoulder height",
        "Rotate shoulders in circular motion"
      ],
      imageUrl: "/exercises/shoulder-rotation.jpg",
      videoUrl: "/exercises/shoulder-rotation.mp4"
    },
    {
      id: 2,
      name: "Knee Bends",
      category: "knee",
      difficulty: "beginner",
      equipment: "none",
      duration: "8 min",
      reps: 15,
      sets: 2,
      description: "Basic knee strengthening exercise to improve flexibility and strength.",
      benefits: ["Strengthens quadriceps", "Improves knee stability", "Increases flexibility"],
      instructions: [
        "Stand with feet hip-width apart",
        "Slowly bend knees to 45 degrees",
        "Hold for 2 seconds",
        "Return to starting position"
      ],
      imageUrl: "/exercises/knee-bends.jpg",
      videoUrl: "/exercises/knee-bends.mp4"
    },
    {
      id: 3,
      name: "Neck Stretches",
      category: "neck",
      difficulty: "beginner",
      equipment: "none",
      duration: "4 min",
      reps: 8,
      sets: 2,
      description: "Gentle neck stretches to relieve tension and improve range of motion.",
      benefits: ["Relieves neck tension", "Improves flexibility", "Reduces headaches"],
      instructions: [
        "Sit or stand with good posture",
        "Gently tilt head to one side",
        "Hold for 15-20 seconds",
        "Repeat on other side"
      ],
      imageUrl: "/exercises/neck-stretches.jpg",
      videoUrl: "/exercises/neck-stretches.mp4"
    },
    {
      id: 4,
      name: "Hip Flexor Stretch",
      category: "hip",
      difficulty: "intermediate",
      equipment: "mat",
      duration: "6 min",
      reps: 5,
      sets: 3,
      description: "Effective stretch for hip flexors to improve mobility and reduce lower back pain.",
      benefits: ["Improves hip mobility", "Reduces lower back pain", "Stretches hip flexors"],
      instructions: [
        "Kneel on one knee with other foot forward",
        "Keep back straight",
        "Push hips forward gently",
        "Hold for 30 seconds"
      ],
      imageUrl: "/exercises/hip-flexor.jpg",
      videoUrl: "/exercises/hip-flexor.mp4"
    },
    {
      id: 5,
      name: "Ankle Circles",
      category: "ankle",
      difficulty: "beginner",
      equipment: "none",
      duration: "3 min",
      reps: 12,
      sets: 2,
      description: "Simple ankle mobility exercise to improve circulation and flexibility.",
      benefits: ["Improves ankle mobility", "Increases circulation", "Reduces stiffness"],
      instructions: [
        "Sit comfortably with leg extended",
        "Rotate ankle in circular motion",
        "Complete circles clockwise",
        "Repeat counter-clockwise"
      ],
      imageUrl: "/exercises/ankle-circles.jpg",
      videoUrl: "/exercises/ankle-circles.mp4"
    },
    {
      id: 6,
      name: "Back Extension",
      category: "back",
      difficulty: "intermediate",
      equipment: "mat",
      duration: "7 min",
      reps: 10,
      sets: 3,
      description: "Strengthening exercise for lower back muscles to improve posture.",
      benefits: ["Strengthens lower back", "Improves posture", "Reduces back pain"],
      instructions: [
        "Lie face down on mat",
        "Place hands behind head",
        "Lift chest off ground slowly",
        "Hold for 3 seconds and lower"
      ],
      imageUrl: "/exercises/back-extension.jpg",
      videoUrl: "/exercises/back-extension.mp4"
    },
    {
      id: 7,
      name: "Wrist Flexion",
      category: "wrist",
      difficulty: "beginner",
      equipment: "light-weights",
      duration: "5 min",
      reps: 15,
      sets: 2,
      description: "Wrist strengthening exercise for improved grip and flexibility.",
      benefits: ["Strengthens wrist", "Improves grip strength", "Reduces carpal tunnel symptoms"],
      instructions: [
        "Rest forearm on table, palm up",
        "Hold light weight in hand",
        "Curl wrist upward",
        "Lower slowly and repeat"
      ],
      imageUrl: "/exercises/wrist-flexion.jpg",
      videoUrl: "/exercises/wrist-flexion.mp4"
    },
    {
      id: 8,
      name: "Hamstring Stretch",
      category: "leg",
      difficulty: "beginner",
      equipment: "none",
      duration: "6 min",
      reps: 6,
      sets: 2,
      description: "Classic hamstring stretch to improve flexibility and reduce injury risk.",
      benefits: ["Increases hamstring flexibility", "Reduces injury risk", "Improves posture"],
      instructions: [
        "Sit with one leg extended",
        "Reach toward toes gently",
        "Hold stretch for 20-30 seconds",
        "Switch legs and repeat"
      ],
      imageUrl: "/exercises/hamstring-stretch.jpg",
      videoUrl: "/exercises/hamstring-stretch.mp4"
    },
    {
      id: 9,
      name: "Resistance Band Pull",
      category: "shoulder",
      difficulty: "advanced",
      equipment: "resistance-band",
      duration: "10 min",
      reps: 12,
      sets: 3,
      description: "Advanced shoulder strengthening using resistance band.",
      benefits: ["Builds shoulder strength", "Improves stability", "Enhances muscle endurance"],
      instructions: [
        "Hold resistance band with both hands",
        "Pull band apart at chest level",
        "Squeeze shoulder blades together",
        "Return slowly to start"
      ],
      imageUrl: "/exercises/resistance-band.jpg",
      videoUrl: "/exercises/resistance-band.mp4"
    },
    {
      id: 10,
      name: "Wall Sits",
      category: "leg",
      difficulty: "intermediate",
      equipment: "none",
      duration: "8 min",
      reps: 5,
      sets: 3,
      description: "Isometric exercise to build leg strength and endurance.",
      benefits: ["Builds leg strength", "Improves endurance", "Strengthens core"],
      instructions: [
        "Stand with back against wall",
        "Slide down until knees at 90 degrees",
        "Hold position for 30-60 seconds",
        "Slide back up slowly"
      ],
      imageUrl: "/exercises/wall-sits.jpg",
      videoUrl: "/exercises/wall-sits.mp4"
    },
    {
      id: 11,
      name: "Plantar Fascia Stretch",
      category: "ankle",
      difficulty: "beginner",
      equipment: "none",
      duration: "4 min",
      reps: 10,
      sets: 2,
      description: "Targeted stretch for plantar fascia to relieve foot pain.",
      benefits: ["Relieves plantar fasciitis", "Improves foot flexibility", "Reduces heel pain"],
      instructions: [
        "Sit with one ankle on opposite knee",
        "Pull toes back gently",
        "Hold for 15-20 seconds",
        "Repeat on other foot"
      ],
      imageUrl: "/exercises/plantar-fascia.jpg",
      videoUrl: "/exercises/plantar-fascia.mp4"
    },
    {
      id: 12,
      name: "Cat-Cow Stretch",
      category: "back",
      difficulty: "beginner",
      equipment: "mat",
      duration: "5 min",
      reps: 12,
      sets: 2,
      description: "Gentle spinal mobility exercise for flexibility and pain relief.",
      benefits: ["Improves spinal flexibility", "Relieves back tension", "Enhances posture"],
      instructions: [
        "Start on hands and knees",
        "Arch back upward (cat pose)",
        "Dip back downward (cow pose)",
        "Alternate smoothly between poses"
      ],
      imageUrl: "/exercises/cat-cow.jpg",
      videoUrl: "/exercises/cat-cow.mp4"
    }
  ];

  const categories = [
    { id: "all", name: "All Exercises", icon: "M4 6h16M4 12h16M4 18h16" },
    { id: "shoulder", name: "Shoulder", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { id: "neck", name: "Neck", icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "back", name: "Back", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "hip", name: "Hip", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" },
    { id: "knee", name: "Knee", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { id: "ankle", name: "Ankle/Foot", icon: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" },
    { id: "wrist", name: "Wrist/Hand", icon: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0" },
    { id: "leg", name: "Leg", icon: "M13 10V3L4 14h7v7l9-11h-7z" }
  ];

  const difficulties = [
    { id: "all", name: "All Levels", color: "gray" },
    { id: "beginner", name: "Beginner", color: "green" },
    { id: "intermediate", name: "Intermediate", color: "yellow" },
    { id: "advanced", name: "Advanced", color: "red" }
  ];

  const equipmentTypes = [
    { id: "all", name: "All Equipment" },
    { id: "none", name: "No Equipment" },
    { id: "mat", name: "Exercise Mat" },
    { id: "light-weights", name: "Light Weights" },
    { id: "resistance-band", name: "Resistance Band" }
  ];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;
    const matchesEquipment = selectedEquipment === "all" || exercise.equipment === selectedEquipment;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner": return "text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900/20";
      case "intermediate": return "text-yellow-600 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/20";
      case "advanced": return "text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/20";
      default: return "text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700";
    }
  };

  const getEquipmentIcon = (equipment) => {
    if (equipment === "none") return "✓";
    if (equipment === "mat") return "◼";
    if (equipment === "light-weights") return "●";
    if (equipment === "resistance-band") return "~";
    return "•";
  };

  if (selectedExercise) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedExercise(null)}
              className="flex items-center gap-2 text-primary hover:text-primary-dark dark:text-cyan-300 dark:hover:text-cyan-400 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Library
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <svg className="w-6 h-6 text-text-muted dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-text-primary dark:text-cyan-300 mb-3">
                    {selectedExercise.name}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedExercise.difficulty)}`}>
                      {selectedExercise.difficulty.charAt(0).toUpperCase() + selectedExercise.difficulty.slice(1)}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-text-body dark:text-slate-200 rounded-full text-sm font-semibold">
                      {getEquipmentIcon(selectedExercise.equipment)} {selectedExercise.equipment === "none" ? "No Equipment" : selectedExercise.equipment.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </span>
                    <span className="px-3 py-1 bg-primary/10 dark:bg-cyan-900/20 text-primary dark:text-cyan-300 rounded-full text-sm font-semibold">
                      {selectedExercise.duration}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-text-body dark:text-slate-200 text-lg leading-relaxed">
                {selectedExercise.description}
              </p>
            </div>

            <div className="mb-8">
              <div className="bg-gradient-to-br from-healify-dark-blue to-primary rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-20 h-20 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-semibold opacity-70">Exercise Demonstration Video</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-slate-700 rounded-xl p-6 text-center border border-blue-200 dark:border-slate-600">
                <svg className="w-8 h-8 text-blue-600 dark:text-cyan-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-2xl font-bold text-blue-600 dark:text-cyan-300">{selectedExercise.reps}</p>
                <p className="text-blue-800 dark:text-slate-300 text-sm">Reps per Set</p>
              </div>
              <div className="bg-purple-50 dark:bg-slate-700 rounded-xl p-6 text-center border border-purple-200 dark:border-slate-600">
                <svg className="w-8 h-8 text-purple-600 dark:text-cyan-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-2xl font-bold text-purple-600 dark:text-cyan-300">{selectedExercise.sets}</p>
                <p className="text-purple-800 dark:text-slate-300 text-sm">Sets</p>
              </div>
              <div className="bg-green-50 dark:bg-slate-700 rounded-xl p-6 text-center border border-green-200 dark:border-slate-600">
                <svg className="w-8 h-8 text-green-600 dark:text-cyan-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-2xl font-bold text-green-600 dark:text-cyan-300">{selectedExercise.duration}</p>
                <p className="text-green-800 dark:text-slate-300 text-sm">Duration</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Key Benefits
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {selectedExercise.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-cyan-900">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-800 dark:text-green-300 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Step-by-Step Instructions
              </h3>
              <ol className="space-y-3">
                {selectedExercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-slate-700 rounded-lg border border-blue-200 dark:border-slate-600">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary dark:bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-blue-900 dark:text-slate-200 font-medium pt-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedExercise(null)}
                className="flex-1 px-6 py-4 bg-gray-100 dark:bg-slate-700 text-text-body dark:text-slate-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition font-semibold"
              >
                Back to Library
              </button>
              <button
                onClick={() => {
                  if (onStartExercise) {
                    onStartExercise(selectedExercise);
                  }
                }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-primary to-healify-light-cyan dark:from-cyan-600 dark:to-cyan-400 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold"
              >
                Start This Exercise
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-primary dark:text-cyan-300 mb-2">Exercise Library</h1>
            <p className="text-text-muted dark:text-slate-400">Browse and explore physiotherapy exercises</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <svg className="w-6 h-6 text-text-muted dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search exercises by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
          <h3 className="font-bold text-text-primary dark:text-cyan-300 mb-4">Filters</h3>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-body dark:text-slate-300 mb-3">Body Part</label>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 rounded-lg border-2 transition text-center ${
                    selectedCategory === category.id
                      ? "border-primary dark:border-cyan-600 bg-primary/10 dark:bg-cyan-900/20 text-primary dark:text-cyan-300"
                      : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-text-muted dark:text-slate-400 hover:border-primary/50 dark:hover:border-cyan-600/50"
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                  </svg>
                  <span className="text-xs font-semibold">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-body dark:text-slate-300 mb-3">Difficulty Level</label>
              <div className="flex gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition font-semibold text-sm ${
                      selectedDifficulty === diff.id
                        ? "border-primary dark:border-cyan-600 bg-primary/10 dark:bg-cyan-900/20 text-primary dark:text-cyan-300"
                        : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-text-muted dark:text-slate-400 hover:border-primary/50 dark:hover:border-cyan-600/50"
                    }`}
                  >
                    {diff.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-body dark:text-slate-300 mb-3">Equipment Needed</label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              >
                {equipmentTypes.map((equip) => (
                  <option key={equip.id} value={equip.id}>
                    {equip.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-text-muted dark:text-slate-400">
            Showing <span className="font-bold text-primary dark:text-cyan-300">{filteredExercises.length}</span> exercise{filteredExercises.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="relative bg-gradient-to-br from-primary to-healify-light-cyan h-48 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                  </div>

                  <div className="relative z-10">
                    {getExerciseIllustration(exercise.category)}
                  </div>

                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="text-white text-xs font-semibold capitalize">{exercise.category}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300 mb-2">{exercise.name}</h3>
                  <p className="text-text-muted dark:text-slate-400 text-sm mb-4 line-clamp-2">{exercise.description}</p>

                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-text-muted dark:text-slate-300 rounded-full text-xs font-semibold">
                      {exercise.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-text-muted dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {exercise.reps} reps
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {exercise.sets} sets
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-text-muted dark:text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-text-primary dark:text-cyan-300 mb-2">No Exercises Found</h3>
            <p className="text-text-muted dark:text-slate-400 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
                setSelectedEquipment("all");
              }}
              className="px-6 py-2 bg-primary dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-dark dark:hover:bg-cyan-500 transition font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
