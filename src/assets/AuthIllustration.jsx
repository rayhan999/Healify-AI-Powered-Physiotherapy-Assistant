import React from "react";

export default function AuthIllustration() {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#024B87", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#1B9AAE", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#52C9D3", stopOpacity: 1 }} />
        </linearGradient>

        <linearGradient id="person-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1B9AAE", stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: "#024B87", stopOpacity: 0.8 }} />
        </linearGradient>

        <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#52C9D3", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#1B9AAE", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="url(#bg-gradient)" />

      <circle cx="650" cy="100" r="120" fill="white" opacity="0.05" />
      <circle cx="150" cy="500" r="100" fill="white" opacity="0.05" />
      <circle cx="700" cy="450" r="80" fill="white" opacity="0.08" />

      <g transform="translate(150, 80)">

        <g opacity="0.9">
          <rect x="20" y="100" width="180" height="220" rx="12" fill="white" opacity="0.15" />

          <g transform="translate(40, 120)">
            <circle cx="15" cy="15" r="12" fill="#52C9D3" opacity="0.3" />
            <path d="M10 15 L12 18 L15 12 L18 15 L20 15" stroke="#52C9D3" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="35" y="20" fill="white" fontSize="14" fontWeight="500">Heart Rate</text>
            <text x="35" y="40" fill="white" fontSize="20" fontWeight="700">72 bpm</text>
          </g>

          <g transform="translate(40, 190)">
            <rect x="0" y="0" width="140" height="8" rx="4" fill="white" opacity="0.2" />
            <rect x="0" y="0" width="105" height="8" rx="4" fill="url(#accent-gradient)" />
            <text x="0" y="25" fill="white" fontSize="12" opacity="0.9">Progress: 75%</text>
          </g>

          <g transform="translate(40, 245)">
            <text x="0" y="0" fill="white" fontSize="14" fontWeight="500">Reps Completed</text>
            <text x="0" y="25" fill="#52C9D3" fontSize="28" fontWeight="700">12/15</text>
          </g>
        </g>

        <g transform="translate(280, 150)">
          <ellipse cx="60" cy="280" rx="90" ry="15" fill="white" opacity="0.2" />

          <circle cx="60" cy="80" r="25" fill="white" opacity="0.9" />

          <path
            d="M60 105 L60 180"
            stroke="white"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.9"
          />

          <path
            d="M60 120 L20 100"
            stroke="white"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.9"
          />

          <path
            d="M60 120 L100 100"
            stroke="white"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.9"
          />

          <path
            d="M60 180 L40 260"
            stroke="white"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.9"
          />

          <path
            d="M60 180 L80 260"
            stroke="white"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.9"
          />

          <circle cx="60" cy="80" r="5" fill="#52C9D3" opacity="0.8">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="120" r="5" fill="#52C9D3" opacity="0.8">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="180" r="5" fill="#52C9D3" opacity="0.8">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="260" r="5" fill="#52C9D3" opacity="0.8">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.9s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="260" r="5" fill="#52C9D3" opacity="0.8">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.9s" repeatCount="indefinite" />
          </circle>
        </g>

        <g transform="translate(420, 140)" opacity="0.9">
          <rect x="0" y="0" width="140" height="160" rx="12" fill="white" opacity="0.15" />

          <g transform="translate(15, 20)">
            <circle cx="8" cy="8" r="6" fill="#52C9D3" />
            <text x="20" y="12" fill="white" fontSize="13" fontWeight="500">Posture</text>
            <text x="20" y="30" fill="#52C9D3" fontSize="16" fontWeight="700">Excellent</text>
          </g>

          <g transform="translate(15, 70)">
            <rect x="0" y="0" width="110" height="6" rx="3" fill="white" opacity="0.2" />
            <rect x="0" y="0" width="92" height="6" rx="3" fill="#52C9D3" />
            <text x="0" y="20" fill="white" fontSize="11">Form: 84%</text>
          </g>

          <g transform="translate(15, 110)">
            <rect x="0" y="0" width="30" height="30" rx="6" fill="white" opacity="0.2" />
            <text x="7" y="21" fill="#52C9D3" fontSize="18" fontWeight="700">AI</text>
            <text x="35" y="15" fill="white" fontSize="11" opacity="0.9">Real-time</text>
            <text x="35" y="28" fill="white" fontSize="11" opacity="0.9">Analysis</text>
          </g>
        </g>

        <g transform="translate(50, 420)">
          <path
            d="M0 0 L50 0 L70 -20 L90 20 L110 -30 L130 30 L150 -15 L180 0 L500 0"
            stroke="#52C9D3"
            strokeWidth="3"
            fill="none"
            opacity="0.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
          </path>
        </g>

      </g>

      <g opacity="0.3">
        <circle cx="720" cy="80" r="4" fill="white">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="750" cy="120" r="3" fill="white">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="3" fill="white">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>

      <rect
        x="0"
        y="480"
        width="800"
        height="120"
        fill="url(#bg-gradient)"
        opacity="0.6"
      />

    </svg>
  );
}
