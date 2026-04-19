import React from "react";

function scoreColor(score) {
  if (score === null || score === undefined) return { text: "text-gray-400", bg: "bg-gray-200", ring: "#d1d5db" };
  if (score >= 90) return { text: "text-green-600", bg: "bg-green-100", ring: "#16a34a" };
  if (score >= 50) return { text: "text-amber-600", bg: "bg-amber-100", ring: "#d97706" };
  return { text: "text-red-600", bg: "bg-red-100", ring: "#dc2626" };
}

export default function ScoreGauge({ label, score, size = 80 }) {
  const { text, bg, ring } = scoreColor(score);
  const radius = (size / 2) - 6;
  const circ = 2 * Math.PI * radius;
  const fill = score != null ? (score / 100) * circ : 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative flex items-center justify-center rounded-full ${bg}`} style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute top-0 left-0 -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="5" />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={ring} strokeWidth="5"
            strokeDasharray={circ}
            strokeDashoffset={circ - fill}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <span className={`font-bold ${text} z-10`} style={{ fontSize: size * 0.22 }}>
          {score != null ? score : "–"}
        </span>
      </div>
      <span className="text-xs text-gray-500 font-medium text-center leading-tight max-w-[80px]">{label}</span>
    </div>
  );
}