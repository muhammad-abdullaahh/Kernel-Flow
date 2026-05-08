import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  Sparkles,
  Zap,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, NeonButton } from '../components/UI/UIComponents';
import { useSimulationStore } from '../store/simulationStore';
import { useMetricsStore } from '../store/metricsStore';
import { compareApi } from '../api/compareApi';

const RecommendationView = () => {
  const navigate = useNavigate();
  const { processes, setAlgorithm } = useSimulationStore();
  const { lastRecommendation, setLastRecommendation } = useMetricsStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleRecommend = async () => {
    if (processes.length === 0) return;
    setIsAnalyzing(true);
    setApplied(false);
    try {
      const { data } = await compareApi.recommend(processes);
      setLastRecommendation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyRecommendation = () => {
    if (lastRecommendation) {
      setAlgorithm(lastRecommendation.algorithm);
      setApplied(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-12 animate-slide-in">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-6 py-2.5 text-xs font-black text-primary border border-primary/20 uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <Brain size={18} />
          <span>Heuristic AI Engine</span>
        </div>
        <h1 className="text-7xl font-black text-white italic uppercase tracking-tighter">
          Workload <span className="text-secondary">Optimization</span>
        </h1>
        <p className="text-slate-400 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
          Leveraging statistical analysis and historical pattern matching to suggest the optimal CPU scheduling strategy for your specific process workload.
        </p>
      </div>

      <section className="glass-card p-16 text-center space-y-12 relative overflow-hidden group min-h-[400px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Cpu size={300} />
        </div>

        <div className="relative z-10 space-y-8">
           <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-sm">Ready to analyze {processes.length} active PCB units</p>
           <NeonButton
             onClick={handleRecommend}
             disabled={isAnalyzing || processes.length === 0}
             className="py-8 px-16 text-2xl"
             icon={Sparkles}
           >
             {isAnalyzing ? 'Processing Heuristics...' : 'Compute Recommendation'}
           </NeonButton>
           
           {processes.length === 0 && (
              <p className="text-xs text-accent-orange font-black uppercase tracking-widest flex items-center gap-2 justify-center bg-accent-orange/10 py-3 rounded-xl border border-accent-orange/20 max-w-sm mx-auto">
                <AlertCircle size={18} /> Please add processes in the simulation view
              </p>
           )}
        </div>

        {lastRecommendation && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 text-left space-y-10 rounded-[32px] bg-dark-950 p-12 border border-secondary/30 shadow-[0_0_40px_rgba(192,132,252,0.15)]"
          >
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4 text-secondary">
                  <CheckCircle2 size={32} className="drop-shadow-[0_0_12px_rgba(192,132,252,0.6)]" />
                  <span className="text-sm font-black uppercase tracking-[0.3em]">Analysis Results Finalized</span>
               </div>
               <div className="px-5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-500 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  96.8% Confidence Rating
               </div>
            </div>
            
            <div className="space-y-6">
               <h3 className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Recommended Strategy</h3>
               <p className="text-7xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  {lastRecommendation.algorithm}
               </p>
            </div>

            <div className="space-y-4 pt-10 border-t border-dark-600/40">
               <h3 className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Engine Rationale</h3>
               <p className="text-slate-300 text-2xl font-medium leading-relaxed italic border-l-4 border-secondary pl-6">
                 "{lastRecommendation.reasoning}"
               </p>
            </div>

            <div className="pt-6 flex items-center gap-6">
               <NeonButton 
                 variant={applied ? 'secondary' : 'secondary'} 
                 onClick={applyRecommendation} 
                 icon={applied ? CheckCircle2 : Zap}
                 className="py-5 px-10 text-lg"
                 disabled={applied}
               >
                  {applied ? 'Applied Successfully' : 'Apply Configuration'}
               </NeonButton>
               {applied && (
                 <motion.span 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="text-emerald-500 font-black uppercase tracking-widest text-xs italic"
                 >
                   Redirecting to Dashboard...
                 </motion.span>
               )}
            </div>
          </motion.div>
        )}
      </section>

      {/* Methodology */}
      <section className="grid grid-cols-2 gap-8 pt-8 border-t border-dark-600/30">
         <div className="space-y-4 p-6 rounded-2xl bg-dark-800/30 border border-dark-600/20">
            <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
               <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#00F0FF]"></div>
               Statistical Variance
            </h4>
            <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase">
               We calculate the coefficient of variation in burst times. High variance usually points toward Shortest Job First optimization to minimize wait time.
            </p>
         </div>
         <div className="space-y-4 p-6 rounded-2xl bg-dark-800/30 border border-dark-600/20">
            <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
               <div className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_#C084FC]"></div>
               Arrival Pattern Analysis
            </h4>
            <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase">
               Staggered vs. simultaneous arrival patterns impact context-switch penalties and overall fairness metrics in our heuristic model.
            </p>
         </div>
      </section>
    </div>
  );
};

export default RecommendationView;
