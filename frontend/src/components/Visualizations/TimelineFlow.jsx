import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';

const TimelineFlow = () => {
  const { ganttData, currentTime } = useSimulationStore();
  
  // Get last 8 events for the flow
  const recentData = ganttData.slice(-8).reverse();

  return (
    <div className="rounded-xl bg-slate-900/50 p-6 border border-slate-800">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Timeline Flow</h3>
      <div className="relative border-l border-slate-700 pl-6 space-y-4">
        {recentData.map((d, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary-500 ring-4 ring-slate-950"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-300">Process P{d.pid} running</p>
                <p className="text-[10px] text-slate-500">Time: {d.start} - {d.end}</p>
              </div>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-primary-400">
                dur: {d.end - d.start}
              </span>
            </div>
          </div>
        ))}
        {recentData.length === 0 && (
          <p className="text-xs text-slate-600 italic">No activity recorded</p>
        )}
      </div>
    </div>
  );
};

export default TimelineFlow;
