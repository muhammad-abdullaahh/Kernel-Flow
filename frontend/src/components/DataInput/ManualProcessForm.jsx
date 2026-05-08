import React, { useState } from 'react';
import { Plus, Trash2, Hash, Cpu, Clock } from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';
import { NeonButton, SectionLabel } from '../UI/UIComponents';

/* ─── Process Creator  (replaces ManualProcessForm) ─────────────── *
 *  All logic (handleAdd, removeProcess, formData state) is preserved.
 *  Only the visual presentation is changed.
 * ─────────────────────────────────────────────────────────────────── */
const ManualProcessForm = () => {
  const { processes, setProcesses, algorithm } = useSimulationStore();
  const isPriorityAlgo = algorithm.toLowerCase().includes('priority');

  const [formData, setFormData] = useState({
    arrival_time: 0,
    burst_time: 1,
    priority: 5,
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newPid =
      processes.length > 0
        ? Math.max(...processes.map((p) => p.pid)) + 1
        : 1;
    setProcesses([...processes, { 
      pid: newPid, 
      arrival_time: parseInt(formData.arrival_time) || 0,
      burst_time: parseInt(formData.burst_time) || 1,
      priority: parseInt(formData.priority) || 5
    }]);
  };

  const removeProcess = (pid) => {
    setProcesses(processes.filter((p) => p.pid !== pid));
  };

  /* ── Colour cycle for PID badges ── */
  const pidColors = [
    { bg: 'rgba(0,240,255,0.08)',   border: 'rgba(0,240,255,0.2)',    text: '#00F0FF' },
    { bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.2)',  text: '#C084FC' },
    { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',   text: '#34d399' },
    { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)',   text: '#fbbf24' },
    { bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.2)',  text: '#fb7185' },
  ];

  const pidColor = (pid) => pidColors[(pid - 1) % pidColors.length];

  return (
    <div className="space-y-5">

      {/* ── Input Form ───────────────────────────────────────────── */}
      <form onSubmit={handleAdd} className="space-y-4">

        <div className="grid grid-cols-2 gap-10">
          {/* Arrival */}
          <div className="space-y-3">
            <SectionLabel>Arrival Time</SectionLabel>
            <div className="relative">
              <Clock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500/60 pointer-events-none" />
              <input
                type="number"
                min="0"
                value={formData.arrival_time}
                onChange={(e) =>
                  setFormData({ ...formData, arrival_time: e.target.value })
                }
                className="kernel-input pl-14"
                placeholder="0"
              />
            </div>
          </div>

          {/* Burst */}
          <div className="space-y-3">
            <SectionLabel>Burst Time</SectionLabel>
            <div className="relative">
              <Cpu size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500/60 pointer-events-none" />
              <input
                type="number"
                min="1"
                value={formData.burst_time}
                onChange={(e) =>
                  setFormData({ ...formData, burst_time: e.target.value })
                }
                className="kernel-input pl-14"
                placeholder="1"
              />
            </div>
          </div>
        </div>

        {/* Priority (conditional) */}
        {isPriorityAlgo && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <SectionLabel>Priority Level</SectionLabel>
              <span
                className="text-sm font-mono font-bold"
                style={{ color: '#00F0FF' }}
              >
                {formData.priority}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: parseInt(e.target.value) })
              }
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono font-bold px-0.5">
              <span>Low (1)</span>
              <span>High (10)</span>
            </div>
          </div>
        )}

        {/* Submit */}
        <NeonButton type="submit" variant="secondary" icon={Plus} className="w-full py-5 text-lg">
          Quick Add Process
        </NeonButton>
      </form>

      {/* ── Process Queue ─────────────────────────────────────────── */}
      <div className="kernel-divider" />

      {processes.length > 0 && (
        <div className="flex items-center justify-between mb-1">
          <SectionLabel>Process Queue</SectionLabel>
          <span
            className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg"
            style={{
              background: 'rgba(0,240,255,0.08)',
              border: '1px solid rgba(0,240,255,0.15)',
              color: '#00F0FF',
            }}
          >
            {processes.length} PCB{processes.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
        {processes.map((p) => {
          const color = pidColor(p.pid);
          return (
            <div
              key={p.pid}
              className="process-tag group"
            >
              <div className="flex items-center gap-3">
                {/* PID Badge */}
                <div
                  className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl text-xs font-mono font-black"
                  style={{
                    background: color.bg,
                    border: `1px solid ${color.border}`,
                    color: color.text,
                  }}
                >
                  P{p.pid}
                </div>

                {/* Meta */}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white">Process {p.pid}</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 flex gap-2">
                    <span>Arr: <b className="text-slate-400">{p.arrival_time}</b></span>
                    <span>Burst: <b className="text-slate-400">{p.burst_time}</b></span>
                    {isPriorityAlgo && (
                      <span>Pri: <b className="text-slate-400">{p.priority}</b></span>
                    )}
                  </span>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeProcess(p.pid)}
                className="flex-shrink-0 p-2 rounded-xl text-slate-600 hover:text-accent-rose hover:bg-accent-rose/10 transition-all duration-200"
              >
                <Trash2 size={15} strokeWidth={2} />
              </button>
            </div>
          );
        })}

        {processes.length === 0 && (
          <div
            className="py-10 flex flex-col items-center justify-center gap-3 rounded-2xl"
            style={{
              border: '1px dashed rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.01)',
            }}
          >
            <Hash size={24} strokeWidth={1} className="text-slate-700" />
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">
              No processes yet
            </span>
            <span className="text-[10px] text-slate-700">
              Fill in arrival &amp; burst time above
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualProcessForm;
