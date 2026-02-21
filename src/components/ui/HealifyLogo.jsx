import React from "react";

export default function HealifyLogo({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <svg
      className={`${sizes[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="healify-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#024B87", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#1B9AAE", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#52C9D3", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill="url(#healify-gradient)" opacity="0.1" />

      <path
        d="M25 30 L25 70 M25 50 L75 50 M75 30 L75 70"
        stroke="url(#healify-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M20 50 L30 50 L35 40 L42 60 L48 35 L55 65 L62 45 L70 50 L80 50"
        stroke="#52C9D3"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      <circle cx="85" cy="25" r="3" fill="#52C9D3" opacity="0.8" />
      <circle cx="90" cy="20" r="2" fill="#1B9AAE" opacity="0.6" />
    </svg>
  );
}
