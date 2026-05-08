import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';

/* ─── Column definitions ─────────────────────────────────────────── */
const BASE_COLS = [
  { key: 'pid',           label: 'PID',    color: 'text-white',          render: (v) => `P${v}` },
  { key: 'arrival_time',  label: 'Arr',    color: 'text-slate-400'       },
  { key: 'burst_time',    label: 'Burst',  color: 'text-slate-400'       },
  { key: 'finish_time',   label: 'Finish', color: 'text-accent-emerald', render: (v) => v ?? '—' },
  { key: 'waiting_time',  label: 'Wait',   color: 'text-accent-amber'    },
  { key: 'turnaround_time', label: 'TAT',  color: 'text-secondary',      render: (v) => v ?? '—' },
  { key: 'response_time', label: 'Resp',   color: 'text-primary',        render: (v) => v ?? '—' },
];

const PRIORITY_COL = { key: 'priority', label: 'Pri', color: 'text-slate-400' };

/* ─── MetricsTable ───────────────────────────────────────────────── *
 *  Pure visual upgrade; all data props are unchanged.
 * ─────────────────────────────────────────────────────────────────── */
const MetricsTable = ({ processes }) => {
  const { algorithm } = useSimulationStore();
  const isPriorityAlgo = algorithm.toLowerCase().includes('priority');

  const cols = isPriorityAlgo
    ? [BASE_COLS[0], BASE_COLS[1], BASE_COLS[2], PRIORITY_COL, ...BASE_COLS.slice(3)]
    : BASE_COLS;

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-separate" style={{ borderSpacing: '0 4px' }}>

          {/* Head */}
          <thead>
            <tr>
              {cols.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap ${col.color} sticky top-0`}
                  style={{
                    background: 'rgba(7,11,20,0.9)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
            {/* Subtle header underline */}
            <tr>
              <td
                colSpan={cols.length}
                style={{ padding: 0, height: '1px' }}
              >
                <div className="kernel-divider" />
              </td>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {processes.map((p, rowIdx) => (
              <tr
                key={p.pid}
                className="metrics-row group"
              >
                {cols.map((col, colIdx) => {
                  const raw = p[col.key];
                  const displayed = col.render ? col.render(raw) : raw;
                  const isFirst = colIdx === 0;
                  const isLast  = colIdx === cols.length - 1;

                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 text-sm font-mono font-semibold ${col.color} transition-all duration-200`}
                      style={{
                        background: rowIdx % 2 === 0
                          ? 'rgba(22,27,46,0.5)'
                          : 'rgba(13,17,32,0.4)',
                        borderTop:    '1px solid rgba(255,255,255,0.03)',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        borderLeft:   isFirst ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        borderRight:  isLast  ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        borderRadius: isFirst ? '10px 0 0 10px' : isLast ? '0 10px 10px 0' : '0',
                      }}
                    >
                      {/* PID with left accent bar */}
                      {isFirst ? (
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-0.5 h-5 rounded-full flex-shrink-0"
                            style={{
                              background: `hsl(${(p.pid * 73) % 360}, 80%, 65%)`,
                              boxShadow: `0 0 6px hsl(${(p.pid * 73) % 360}, 80%, 65%)`,
                            }}
                          />
                          {displayed}
                        </div>
                      ) : (
                        displayed
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Empty state */}
            {processes.length === 0 && (
              <tr>
                <td
                  colSpan={cols.length}
                  className="py-16 text-center"
                >
                  <p className="text-[11px] text-slate-600 font-semibold uppercase tracking-widest">
                    No data yet — run a simulation to populate the table
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsTable;
