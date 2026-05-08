import React from 'react';

/* ─── CPUUtilizationGauge ─────────────────────────────────────────── *
 *  Visual-only upgrade. The value prop and all calculations are
 *  preserved exactly.
 * ─────────────────────────────────────────────────────────────────── */
export const CPUUtilizationGauge = ({ value }) => {
  const radius = 38;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  /* Colour shifts from cyan → emerald → amber → rose based on load */
  const hue  = value < 60 ? 183 : value < 80 ? 152 : value < 90 ? 38 : 355;
  const color = `hsl(${hue}, 90%, 65%)`;
  const glow  = `hsla(${hue}, 90%, 65%, 0.45)`;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Ring */}
      <div className="relative" style={{ width: 90, height: 90 }}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full -rotate-90"
          style={{ overflow: 'visible' }}
        >
          {/* Track */}
          <circle
            cx="50" cy="50" r={radius}
            strokeWidth={strokeWidth}
            stroke="rgba(255,255,255,0.05)"
            fill="none"
          />
          {/* Progress arc */}
          <circle
            cx="50" cy="50" r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${glow})`,
              transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease',
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-lg font-mono font-black leading-none"
            style={{ color, textShadow: `0 0 12px ${glow}` }}
          >
            {Math.round(value)}%
          </span>
        </div>
      </div>

      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        CPU Load
      </span>
    </div>
  );
};

export default CPUUtilizationGauge;
