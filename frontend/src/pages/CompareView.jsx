import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  Activity, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { GlassCard, NeonButton } from '../components/UI/UIComponents';
import { useSimulationStore } from '../store/simulationStore';
import { compareApi } from '../api/compareApi';

const CompareView = () => {
  const { processes, timeQuantum } = useSimulationStore();
  const [selectedAlgos, setSelectedAlgos] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [error, setError] = useState(null);

  const algorithms = [
    'FCFS', 'SJF', 'SRTF', 'RR', 'Priority Preemptive', 'Priority Non-preemptive'
  ];

  const handleToggleAlgo = (algo) => {
    if (selectedAlgos.includes(algo)) {
      setSelectedAlgos(selectedAlgos.filter(a => a !== algo));
    } else if (selectedAlgos.length < 4) {
      setSelectedAlgos([...selectedAlgos, algo]);
    }
  };

  const handleCompare = async () => {
    if (processes.length === 0 || selectedAlgos.length === 0) return;
    setIsComparing(true);
    setError(null);
    try {
      const { data } = await compareApi.compare({
        processes,
        algorithms: selectedAlgos,
        time_quantum: timeQuantum
      });
      setComparisonResults(data.results);
    } catch (err) {
      console.error(err);
      setError("Failed to run comparison analysis.");
    } finally {
      setIsComparing(false);
    }
  };

  const chartData = comparisonResults.map(res => ({
    name: res.algorithm,
    waiting: res.metrics.avg_waiting_time,
    turnaround: res.metrics.avg_turnaround_time,
    utilization: res.metrics.cpu_load
  }));

  const COLORS = ['#00F0FF', '#C084FC', '#FF8C42', '#FF4E8E'];

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-10 animate-slide-in">
      <div className="flex flex-col gap-4">
         <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">
            Algorithm <span className="text-primary">Benchmarking</span>
         </h1>
         <p className="text-slate-400 text-lg font-medium">Side-by-side performance analysis across multiple scheduling strategies.</p>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Selector Panel */}
        <GlassCard 
          className="col-span-4"
          title="Comparison Set" 
          subtitle="Select up to 4 strategies"
          icon={Layers}
        >
          <div className="space-y-4">
             {algorithms.map(algo => (
               <button
                 key={algo}
                 onClick={() => handleToggleAlgo(algo)}
                 className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${
                   selectedAlgos.includes(algo)
                     ? 'bg-primary/10 border-primary text-white shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                     : 'bg-dark-800 border-dark-600 text-slate-500 hover:border-dark-500 hover:text-slate-300'
                 }`}
               >
                 <span className="text-base font-black uppercase tracking-wider">{algo}</span>
                 {selectedAlgos.includes(algo) && <CheckCircle2 size={20} className="text-primary" />}
               </button>
             ))}
          </div>

          <div className="mt-10">
             <NeonButton 
               className="w-full py-6 text-xl"
               disabled={isComparing || selectedAlgos.length === 0 || processes.length === 0}
               onClick={handleCompare}
               icon={Activity}
             >
               {isComparing ? 'Benchmarking...' : 'Execute Analysis'}
             </NeonButton>
             {processes.length === 0 && (
               <p className="mt-6 text-xs text-accent-orange font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 bg-accent-orange/10 py-3 rounded-xl border border-accent-orange/20">
                  <AlertCircle size={14} /> Simulation queue empty
               </p>
             )}
          </div>
        </GlassCard>

        {/* Charts Panel */}
        <div className="col-span-8 space-y-8">
           {comparisonResults.length > 0 ? (
             <>
               <GlassCard 
                 title="Performance Metrics" 
                 subtitle="Waiting vs Turnaround Time"
                 icon={BarChart3}
               >
                 <div className="h-[350px] mt-4">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748b" 
                          fontSize={10} 
                          fontWeight={900} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={10} 
                          fontWeight={900} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #2A2A3A', borderRadius: '12px' }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', paddingTop: '20px' }} />
                        <Bar dataKey="waiting" name="Avg Waiting" fill="#00F0FF" radius={[4, 4, 0, 0]} barSize={40} />
                        <Bar dataKey="turnaround" name="Avg Turnaround" fill="#C084FC" radius={[4, 4, 0, 0]} barSize={40} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </GlassCard>

               <GlassCard 
                 title="Efficiency Matrix" 
                 subtitle="System-wide Analysis"
                 icon={Activity}
               >
                 <div className="overflow-hidden rounded-2xl border border-dark-600 bg-dark-800/30">
                    <table className="w-full text-left">
                       <thead>
                           <tr className="bg-dark-900/50">
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Algorithm</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Waiting</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Turnaround</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Throughput</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">CPU Util</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-dark-600/30">
                          {comparisonResults.map((res, i) => (
                            <tr key={i} className="hover:bg-dark-600/20 transition-colors">
                               <td className="px-6 py-4 text-sm font-black text-white">{res.algorithm}</td>
                               <td className="px-6 py-4 text-xs font-mono font-bold text-primary">{res.metrics.avg_waiting_time}ms</td>
                               <td className="px-6 py-4 text-xs font-mono font-bold text-secondary">{res.metrics.avg_turnaround_time}ms</td>
                               <td className="px-6 py-4 text-xs font-mono font-bold text-emerald-400">
                                  {res.metrics.completed} / {res.metrics.total_time}
                                  <span className="ml-1 text-[8px] text-slate-500">proc/ms</span>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                     <div className="flex-1 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${res.metrics.cpu_load}%` }} />
                                     </div>
                                     <span className="text-xs font-mono font-bold text-white">{res.metrics.cpu_load}%</span>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               </GlassCard>
             </>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-card">
                <div className="p-6 rounded-3xl bg-dark-800 border border-dark-600 mb-6">
                   <BarChart3 size={48} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-black text-slate-300 uppercase tracking-tighter italic">Ready for Analysis</h3>
                <p className="text-slate-500 text-sm max-w-sm mt-2">Select algorithms and click "Run Benchmark" to generate a side-by-side performance report.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CompareView;
