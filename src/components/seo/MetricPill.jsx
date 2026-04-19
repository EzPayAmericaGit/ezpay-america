import React from "react";

function metricColor(metric, value) {
  if (value === null || value === undefined) return "bg-gray-100 text-gray-500";
  const thresholds = {
    fcp:  { good: 1800, poor: 3000 },
    lcp:  { good: 2500, poor: 4000 },
    tbt:  { good: 200,  poor: 600  },
    cls:  { good: 0.1,  poor: 0.25 },
    si:   { good: 3400, poor: 5800 },
  };
  const t = thresholds[metric];
  if (!t) return "bg-gray-100 text-gray-600";
  if (value <= t.good) return "bg-green-100 text-green-700";
  if (value <= t.poor) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function formatVal(metric, value) {
  if (value === null || value === undefined) return "–";
  if (metric === "cls") return value.toFixed(3);
  if (metric === "tbt") return `${value}ms`;
  return `${(value / 1000).toFixed(1)}s`;
}

export default function MetricPill({ metric, label, value }) {
  return (
    <div className={`rounded-xl px-4 py-3 text-center ${metricColor(metric, value)}`}>
      <div className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-70">{label}</div>
      <div className="text-lg font-bold">{formatVal(metric, value)}</div>
    </div>
  );
}