import React, { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Terminal, Clock } from 'lucide-react';

/* ─── Log type metadata ──────────────────────────────────────────── */
const LOG_STYLES = {
  start: {
    border:    'rgba(0,240,255,0.2)',
    bg:        'rgba(0,240,255,0.04)',
    badgeBg:   'rgba(0,240,255,0.12)',
    badgeText: '#00F0FF',
    dot:       '#00F0FF',
    label:     'EXEC',
  },
  switch: {
    border:    'rgba(192,132,252,0.2)',
    bg:        'rgba(192,132,252,0.04)',
    badgeBg:   'rgba(192,132,252,0.12)',
    badgeText: '#C084FC',
    dot:       '#C084FC',
    label:     'CTX',
  },
  stop: {
    border:    'rgba(251,113,133,0.2)',
    bg:        'rgba(251,113,133,0.04)',
    badgeBg:   'rgba(251,113,133,0.12)',
    badgeText: '#fb7185',
    dot:       '#fb7185',
    label:     'STOP',
  },
  arrival: {
    border:    'rgba(251,191,36,0.2)',
    bg:        'rgba(251,191,36,0.04)',
    badgeBg:   'rgba(251,191,36,0.12)',
    badgeText: '#fbbf24',
    dot:       '#fbbf24',
    label:     'ARR',
  },
  default: {
    border:    'rgba(255,255,255,0.06)',
    bg:        'rgba(255,255,255,0.02)',
    badgeBg:   'rgba(255,255,255,0.06)',
    badgeText: '#64748b',
    dot:       '#334155',
    label:     'INFO',
  },
};

/* ─── SimulationLog  ──────────────────────────────────────────────── *
 *  All store data (logs) is unchanged. Only the visual treatment
 *  is improved: colour-coded borders, action badge, auto-scroll.
 * ─────────────────────────────────────────────────────────────────── */
const SimulationLog = () => {
  const { logs } = useSimulationStore();
  const bottomRef = useRef(null);

  /* Auto-scroll removed to prevent page jumping */
  useEffect(() => {
    // scrollIntoView disabled as per user request
  }, [logs]);

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">

        {logs.map((log, i) => {
          const s = LOG_STYLES[log.type] ?? LOG_STYLES.default;
          return (
            <div
              key={i}
              className="log-entry"
              style={{
                background: s.bg,
                borderColor: s.border,
              }}
            >
              {/* Header row: timestamp + badge */}
              <div className="flex items-center justify-between">
                {/* Timestamp */}
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: s.dot, boxShadow: `0 0 6px ${s.dot}` }}
                  />
                  <Clock size={10} style={{ color: s.badgeText, opacity: 0.7 }} />
                  <span
                    className="text-[10px] font-mono font-bold"
                    style={{ color: s.badgeText }}
                  >
                    T = {log.time}
                  </span>
                </div>

                {/* Action badge */}
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
                  style={{
                    background: s.badgeBg,
                    color: s.badgeText,
                  }}
                >
                  {s.label}
                </span>
              </div>

              {/* Message */}
              <p
                className="text-[11px] font-medium leading-snug pl-3"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                {log.message}
              </p>
            </div>
          );
        })}

        {/* Empty state */}
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4 py-12">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Terminal size={22} strokeWidth={1.5} className="text-slate-700" />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">
                Awaiting Engine
              </p>
              <p className="text-[10px] text-slate-700 mt-1">
                Events will stream here in real-time
              </p>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default SimulationLog;
