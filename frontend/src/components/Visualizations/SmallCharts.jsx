import React from 'react';

export const CPUUtilizationGauge = ({ value }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-dark-600"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="url(#neon-gradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          strokeLinecap="round"
          fill="transparent"
        />
        <defs>
          <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-black text-white leading-none">{Math.round(value)}%</span>
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Utilization</span>
      </div>
    </div>
  );
};

export const Sparkline = ({ data }) => {
  // Simplified sparkline
  return (
    <div className="flex items-end gap-[2px] h-full w-full px-2">
      {data.map((v, i) => (
        <div 
          key={i}
          className="flex-1 bg-primary/40 rounded-t-sm"
          style={{ height: `${v}%`, transition: 'height 0.3s' }}
        />
      ))}
    </div>
  );
};
