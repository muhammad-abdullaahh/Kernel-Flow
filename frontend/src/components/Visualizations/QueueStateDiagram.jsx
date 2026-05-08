import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { motion, AnimatePresence } from 'framer-motion';

const QueueStateDiagram = () => {
  const { readyQueue } = useSimulationStore();

  return (
    <div className="rounded-xl bg-slate-900/50 p-6 border border-slate-800">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Ready Queue</h3>
      <div className="flex flex-wrap gap-3">
        <AnimatePresence>
          {readyQueue.length === 0 ? (
            <p className="text-xs text-slate-600 italic">Empty queue</p>
          ) : (
            readyQueue.map((p, idx) => (
              <motion.div
                key={`${p.pid}-${idx}`}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex h-16 w-24 flex-col items-center justify-center rounded-lg border border-primary-500/30 bg-primary-500/10 p-2 shadow-lg shadow-primary-500/5"
              >
                <span className="text-xs font-bold text-primary-400">P{p.pid}</span>
                <div className="mt-1 flex gap-2">
                   <div className="flex flex-col items-center">
                     <span className="text-[8px] text-slate-500 uppercase">Rem</span>
                     <span className="text-[10px] font-mono font-bold text-slate-300">{p.remaining_time}</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-[8px] text-slate-500 uppercase">Pri</span>
                     <span className="text-[10px] font-mono font-bold text-slate-300">{p.priority}</span>
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      {/* Visual queue line */}
      <div className="mt-4 h-1 w-full rounded-full bg-slate-800">
         <div className="h-full w-4 bg-primary-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default QueueStateDiagram;
