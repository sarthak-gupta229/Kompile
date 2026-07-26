import React from "react";

function DonutChart({ easy = 0, medium = 0, hard = 0 }) {
  const total = easy + medium + hard;
  const r = 42;
  const circ = 2 * Math.PI * r;

  const easyDash = total ? (easy / total) * circ : 0;
  const mediumDash = total ? (medium / total) * circ : 0;
  const hardDash = total ? (hard / total) * circ : 0;

  const easyOffset = 0;
  const mediumOffset = -easyDash;
  const hardOffset = -(easyDash + mediumDash);

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" className="shrink-0">
      <circle
        cx="55"
        cy="55"
        r={r}
        fill="none"
        stroke="#2e2e2e"
        strokeWidth="10"
      />

      <circle
        cx="55"
        cy="55"
        r={r}
        fill="none"
        stroke="#22c55e"
        strokeWidth="10"
        strokeDasharray={`${easyDash} ${circ}`}
        strokeDashoffset={easyOffset}
        strokeLinecap="butt"
        transform="rotate(-90 55 55)"
      />

      <circle
        cx="55"
        cy="55"
        r={r}
        fill="none"
        stroke="#f89f1b"
        strokeWidth="10"
        strokeDasharray={`${mediumDash} ${circ}`}
        strokeDashoffset={mediumOffset}
        strokeLinecap="butt"
        transform="rotate(-90 55 55)"
      />

      <circle
        cx="55"
        cy="55"
        r={r}
        fill="none"
        stroke="#ef4444"
        strokeWidth="10"
        strokeDasharray={`${hardDash} ${circ}`}
        strokeDashoffset={hardOffset}
        strokeLinecap="butt"
        transform="rotate(-90 55 55)"
      />

      <text
        x="55"
        y="51"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontWeight="bold"
      >
        {total}
      </text>
      <text x="55" y="65" textAnchor="middle" fill="#71717a" fontSize="9">
        Solved
      </text>
    </svg>
  );
}

export default DonutChart;
