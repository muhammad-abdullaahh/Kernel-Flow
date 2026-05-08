import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings2,
  BarChart4,
  Zap,
  Activity,
  History,
  TrendingUp,
  Timer,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import { useSimulation } from '../hooks/useSimulation';
import { simulationApi } from '../api/simulationApi';

import GanttChart         from '../components/Visualizations/GanttChart';
import ReadyQueue         from '../components/Visualizations/ReadyQueue';
import { GlassCard, NeonButton, SectionLabel, KernelSelect, Modal } from '../components/UI/UIComponents';
import ManualProcessForm  from '../components/DataInput/ManualProcessForm';
import SimulationLog      from '../components/SimulationControls/SimulationLog';
import MetricsTable       from '../components/MetricsDisplay/MetricsTable';

/* ─── SimulationView ──────────────────────────────────────────────── *
 *  Full UI/UX redesign.
 *  All store bindings, hook calls, and conditional rendering logic
 *  are preserved exactly — only the JSX structure/styling is updated.
 * ─────────────────────────────────────────────────────────────────── */
const SimulationView = () => {
  const {
    algorithm, setAlgorithm,
    timeQuantum, setTimeQuantum,
    isRunning, isPaused,
    simulationSpeed, setSimulationSpeed,
    metrics,
    processes,
    resetSimulation,
  } = useSimulationStore();

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const wasRunningRef = React.useRef(false);

  const { startSimulation, stopSimulation, togglePause, step, error } = useSimulation();
  const [algorithms, setAlgorithms] = useState([
    'FCFS', 'SJF', 'SRTF', 'RR', 'Priority Preemptive', 'Priority Non-preemptive',
  ]);

  useEffect(() => {
    simulationApi
      .getAlgorithms()
      .then(res => setAlgorithms(res.data.algorithms))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isRunning) {
      wasRunningRef.current = true;
    } else if (wasRunningRef.current && !isRunning) {
      // Small delay to let the last state update settle
      const timer = setTimeout(() => setShowCompletionModal(true), 500);
      wasRunningRef.current = false;
      return () => clearTimeout(timer);
    }
  }, [isRunning]);

  /* ── Derived ── */
  const engineActive = isRunning && !isPaused;

  return (
    <div className="flex flex-col gap-6 pb-10 animate-fade-in">

      <div className="grid grid-cols-12 gap-5">
        {/* ── Timeline ────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8">
          <GlassCard
            title="Kernel Simulation Timeline"
            subtitle="CPU instruction flow"
            icon={Activity}
            accent="cyan"
            className={engineActive ? 'glass-card-active h-full' : 'h-full'}
            actions={
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                style={
                  engineActive
                    ? { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }
                    : { background: 'rgba(255,255,255,0.03)', color: '#475569', border: '1px solid rgba(255,255,255,0.05)' }
                }
              >
                <span className={`w-1.5 h-1.5 rounded-full ${engineActive ? 'bg-accent-emerald animate-pulse' : 'bg-slate-700'}`} />
                {engineActive ? 'Live' : 'Idle'}
              </div>
            }
          >
            <div className="h-[400px]">
              <GanttChart />
            </div>
            <div className="mt-4">
              <ReadyQueue />
            </div>
          </GlassCard>
        </div>

        {/* ── Event Stream ────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4">
          <GlassCard
            title="Event Stream"
            subtitle="Tick-by-tick system log"
            icon={History}
            accent="purple"
            className="h-full"
          >
            <div className="h-[460px]">
              <SimulationLog />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ROW 2 — Three-column control zone
          Col A (4/12): Setup  →  Process Creator + Strategy
          Col B (5/12): Analytics Table + Summary Stats
          Col C (3/12): Execution Controls + Event Stream
          ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-5">

        {/* ── COL A: Setup ──────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">

          {/* Process Creator */}
          <GlassCard
            title="Process Creator"
            subtitle="Define workload parameters"
            icon={Settings2}
            accent="purple"
          >
            <ManualProcessForm />
          </GlassCard>

          {/* Strategy */}
          <GlassCard
            title="Scheduling Strategy"
            subtitle="Algorithm & execution mode"
            icon={Zap}
            accent="cyan"
            overflowVisible
          >
            <div className="space-y-5">

              {/* Algorithm selector */}
              <div className="space-y-2">
                <SectionLabel>Algorithm</SectionLabel>
                <KernelSelect
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  options={algorithms}
                  disabled={isRunning}
                />
              </div>

              {/* Time Quantum (RR only) */}
              {algorithm === 'RR' && (
                <div className="space-y-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between">
                    <SectionLabel>Time Quantum</SectionLabel>
                    <span
                      className="text-base font-mono font-bold"
                      style={{ color: '#00F0FF', textShadow: '0 0 10px rgba(0,240,255,0.5)' }}
                    >
                      {timeQuantum} ms
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1" max="10" step="1"
                    value={timeQuantum}
                    onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] font-mono font-bold text-slate-600">
                    <span>1 ms</span><span>10 ms</span>
                  </div>
                </div>
              )}

            </div>
          </GlassCard>
        </div>

        {/* ── COL B: Analytics ──────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">

          {/* Kernel Analytics Table */}
          <GlassCard
            title="Kernel Analytics"
            subtitle="Per-process performance metrics (PCB)"
            icon={BarChart4}
            accent="purple"
            className="flex-1"
          >
            <MetricsTable processes={processes} />
          </GlassCard>

          {/* ── Summary Stats row ── */}
        </div>

        {/* ── COL C: Execution Controls + Event Stream ───────────────── */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">

          {/* Action Center */}
          <GlassCard
            title="Action Center"
            subtitle="Engine controls"
            icon={Cpu}
            accent="cyan"
          >
            <div className="space-y-3">

              {/* Start / Pause+Step */}
              {!isRunning ? (
                <NeonButton
                  variant="start"
                  onClick={startSimulation}
                  icon={Play}
                  className="w-full py-4 text-sm font-bold"
                >
                  Start Engine
                </NeonButton>
              ) : (
                <div className="flex gap-2.5">
                  <NeonButton
                    variant="secondary"
                    onClick={togglePause}
                    icon={isPaused ? Play : Pause}
                    className="flex-1 py-4 text-xs"
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </NeonButton>
                  <NeonButton
                    variant="ghost"
                    onClick={step}
                    icon={SkipForward}
                    className="flex-1 py-4 text-xs"
                  >
                    Step
                  </NeonButton>
                </div>
              )}

              {/* Reset */}
              <NeonButton
                variant="reset"
                onClick={() => { stopSimulation(); resetSimulation(); }}
                icon={RotateCcw}
                className="w-full py-3.5 text-sm font-bold"
              >
                Reset Simulation
              </NeonButton>

              {/* Error */}
              {error && (
                <div
                  className="p-3 rounded-xl text-[11px] font-semibold text-accent-rose text-center animate-slide-up"
                  style={{
                    background: 'rgba(251,113,133,0.08)',
                    border: '1px solid rgba(251,113,133,0.2)',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Summary Stats Row */}
              <div className="grid grid-cols-1 gap-3 mt-1">
                {/* Avg Wait */}
                <div
                  className="stat-card p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-300 hover:scale-[1.02]"
                  style={{ minHeight: '100px' }}
                >
                  <div className="flex items-center gap-2.5">
                    <Timer size={14} className="text-slate-500 group-hover:text-primary transition-colors" strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 group-hover:text-slate-400 transition-colors">
                      Avg Wait
                    </span>
                  </div>
                  <span
                    className="text-3xl font-mono font-black leading-none transition-all duration-300"
                    style={{
                      color: '#00F0FF',
                      textShadow: '0 0 20px rgba(0,240,255,0.4)',
                    }}
                  >
                    {Number(metrics.avg_waiting_time || 0).toFixed(2)}
                  </span>
                  <span className="text-[8px] text-slate-600 font-medium tracking-widest uppercase">
                    ms
                  </span>
                </div>

                {/* Avg TAT */}
                <div
                  className="stat-card p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-300 hover:scale-[1.02]"
                  style={{ minHeight: '100px' }}
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp size={14} className="text-slate-500 group-hover:text-secondary transition-colors" strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 group-hover:text-slate-400 transition-colors">
                      Avg TAT
                    </span>
                  </div>
                  <span
                    className="text-3xl font-mono font-black leading-none transition-all duration-300"
                    style={{
                      color: '#C084FC',
                      textShadow: '0 0 20px rgba(192,132,252,0.4)',
                    }}
                  >
                    {Number(metrics.avg_turnaround_time || 0).toFixed(2)}
                  </span>
                  <span className="text-[8px] text-slate-600 font-medium tracking-widest uppercase">
                    ms
                  </span>
                </div>

                {/* Throughput */}
                <div
                  className="stat-card p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-300 hover:scale-[1.02]"
                  style={{ minHeight: '100px' }}
                >
                  <div className="flex items-center gap-2.5">
                    <Zap size={14} className="text-slate-500 group-hover:text-accent-emerald transition-colors" strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 group-hover:text-slate-400 transition-colors">
                      Throughput
                    </span>
                  </div>
                  <span
                    className="text-2xl font-mono font-black transition-all duration-300"
                    style={{
                      color: '#34d399',
                      textShadow: '0 0 20px rgba(52,211,153,0.4)',
                    }}
                  >
                    {metrics.completed} / {metrics.total_time || 0}
                  </span>
                  <span className="text-[8px] text-slate-600 font-medium tracking-widest uppercase">
                    proc/ms
                  </span>
                </div>

                {/* CPU Utilization */}
                <div
                  className="stat-card p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-300 hover:scale-[1.02]"
                  style={{ minHeight: '100px' }}
                >
                  <div className="flex items-center gap-2.5">
                    <Activity size={14} className="text-slate-500 group-hover:text-accent-rose transition-colors" strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 group-hover:text-slate-400 transition-colors">
                      CPU Load
                    </span>
                  </div>
                  <span
                    className="text-2xl font-mono font-black transition-all duration-300"
                    style={{
                      color: '#fb7185',
                      textShadow: '0 0 20px rgba(251,113,133,0.4)',
                    }}
                  >
                    {Number(metrics.cpu_load || 0).toFixed(1)}
                  </span>
                  <span className="text-[8px] text-slate-600 font-medium tracking-widest uppercase">
                    %
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>

      <Modal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="Simulation Complete"
        icon={CheckCircle2}
        accent="cyan"
      >
        The kernel has successfully finished processing all scheduled workloads. 
        Review the final performance metrics in the analytics dashboard.
      </Modal>
    </div>
  );
};

export default SimulationView;
