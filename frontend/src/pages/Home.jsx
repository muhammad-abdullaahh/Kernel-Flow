import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BarChart2, Lightbulb, ChevronRight, Cpu, Zap, BarChart, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 text-sm font-semibold text-primary-500 border border-primary-500/20">
          <Zap size={16} />
          <span>v1.0 is now live</span>
        </div>
        <h1 className="text-6xl font-black tracking-tight text-white leading-tight">
          Master CPU Scheduling with <span className="text-primary-500">KernelFlow</span>
        </h1>
        <p className="text-xl text-slate-400">
          A professional-grade simulation and analysis platform for operating system process scheduling algorithms.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link 
            to="/simulate" 
            className="group flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-4 font-bold text-white transition-all hover:bg-primary-500 hover:scale-105"
          >
            Get Started <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/compare" 
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-8 py-4 font-bold text-white transition-all hover:bg-slate-700"
          >
            Run Comparison
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-3 gap-8">
        {[
          {
            icon: <Cpu className="text-primary-500" size={32} />,
            title: "6 Core Algorithms",
            desc: "Simulate FCFS, SJF, SRTF, Round Robin, and Priority algorithms with sub-millisecond precision."
          },
          {
            icon: <BarChart className="text-emerald-500" size={32} />,
            title: "Real-time Metrics",
            desc: "Track Waiting Time, Turnaround, and CPU Utilization live as the simulation progresses."
          },
          {
            icon: <ShieldCheck className="text-purple-500" size={32} />,
            title: "Smart Insights",
            desc: "Our heuristic engine recommends the optimal algorithm based on your specific workload data."
          }
        ].map((f, i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 space-y-4 hover:border-slate-700 transition-colors">
            <div className="rounded-xl bg-slate-950 p-3 inline-block">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-white">{f.title}</h3>
            <p className="text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Algorithms Showcase */}
      <section className="rounded-3xl bg-gradient-to-br from-primary-900/20 to-slate-900 border border-primary-500/10 p-12">
        <div className="flex items-center justify-between gap-12">
          <div className="space-y-6 max-w-xl">
            <h2 className="text-3xl font-bold text-white">Compare side-by-side</h2>
            <p className="text-slate-400 text-lg">
              Don't guess performance. Run multiple algorithms on the exact same process set and see detailed statistical comparisons to find the most efficient scheduler for your needs.
            </p>
            <ul className="space-y-3">
              {['Gantt Chart Visualization', 'Turnaround Time Analysis', 'Throughput Comparison'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-300 font-medium text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
             <div className="h-32 rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500">FCFS</span>
                <div className="h-2 w-full bg-primary-600 rounded-full"></div>
             </div>
             <div className="h-32 rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500">Round Robin</span>
                <div className="flex gap-1">
                   <div className="h-2 w-1/4 bg-primary-600 rounded-full"></div>
                   <div className="h-2 w-1/4 bg-primary-600 rounded-full"></div>
                   <div className="h-2 w-1/4 bg-primary-600 rounded-full"></div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
