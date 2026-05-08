import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Cpu, ArrowRight } from 'lucide-react';

const ReadyQueue = () => {
  const { readyQueue } = useSimulationStore();

  return (
    <div className="mt-8 flex items-center gap-6">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Status</span>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <Cpu size={16} className="text-primary" />
          <span className="text-xs font-black text-white uppercase italic tracking-widest">Ready Queue</span>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar min-h-[80px]">
        {readyQueue.length > 0 ? (
          readyQueue.map((process, index) => (
            <React.Fragment key={process.pid}>
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-20 h-14 rounded-2xl bg-dark-800 border-2 border-dark-600 flex flex-col items-center justify-center relative group-hover:border-primary/50 transition-all shadow-lg overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                   <span className="text-sm font-black text-white">P{process.pid}</span>
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Burst: {process.burst_time}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
              </div>
              {index < readyQueue.length - 1 && (
                <ArrowRight size={14} className="text-slate-700 animate-pulse" />
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-dark-800/50 border border-dashed border-dark-600/30">
             <span className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] italic">Queue Vacant — System Idle</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadyQueue;
