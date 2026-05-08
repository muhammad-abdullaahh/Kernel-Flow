import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  LayoutDashboard,
  Database,
  Lightbulb,
  Clock,
  User,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

/* ─── Sidebar Navigation Link ────────────────────────────────────── */
const SidebarLink = ({ to, icon: Icon, label, collapsed }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      title={collapsed ? label : undefined}
      className={`sidebar-link group flex flex-row items-center whitespace-nowrap ${active ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
    >
      <Icon
        size={32}
        strokeWidth={active ? 2.5 : 2}
        className={`flex-shrink-0 ${active ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`}
      />
      {!collapsed && (
        <span className={`text-xl font-bold tracking-wide transition-colors ${active ? 'text-primary' : ''}`}>
          {label}
        </span>
      )}
      {active && !collapsed && (
        <div className="ml-auto flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-primary"
            style={{ boxShadow: '0 0 8px #00F0FF' }}
          />
        </div>
      )}
    </Link>
  );
};

/* ─── Main Layout Shell ───────────────────────────────────────────── */
const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentTime, algorithm, isRunning } = useSimulationStore();

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden font-sans">

      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <aside
        className={`flex flex-col m-3 mr-0 transition-all duration-300 ease-in-out glass-card rounded-2xl ${
          collapsed ? 'w-28' : 'w-96'
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-5 px-8 py-10 ${collapsed ? 'justify-center' : ''}`}>
          <div
            className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,240,255,0.05))',
              border: '1px solid rgba(0,240,255,0.25)',
              boxShadow: '0 0 20px rgba(0,240,255,0.1)',
            }}
          >
            <Cpu size={32} className="text-primary" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="block text-2xl font-black tracking-tight text-white leading-none">
                Kernel<span className="text-primary">Flow</span>
              </span>
              <span className="block text-xs text-slate-500 tracking-[0.25em] uppercase mt-1.5 font-bold">
                Scheduler
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="kernel-divider mx-4 mb-4" />

        {/* Nav section label */}
        {!collapsed && (
          <span className="px-8 mb-4 text-sm font-bold tracking-[0.3em] uppercase text-slate-600">
            Navigation
          </span>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-6 space-y-14">
          <SidebarLink to="/"          icon={LayoutDashboard} label="Simulation" collapsed={collapsed} />
          <SidebarLink to="/compare"   icon={BarChart3}       label="Compare"    collapsed={collapsed} />
          <SidebarLink to="/recommend" icon={Lightbulb}       label="Recommend"  collapsed={collapsed} />
          <SidebarLink to="/reports"   icon={Database}        label="Reports"    collapsed={collapsed} />
        </nav>

        {/* Collapse Toggle */}
        <div className="kernel-divider mx-6 mb-6" />
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="mx-6 mb-6 flex items-center justify-center gap-4 py-5 rounded-2xl text-slate-500 hover:text-slate-200 transition-all duration-200 hover:bg-white/4"
          style={{ border: '1px solid rgba(255,255,255,0.04)' }}
        >
          {collapsed ? <ChevronRight size={28} /> : (
            <>
              <ChevronLeft size={28} />
              {!collapsed && <span className="text-base font-bold">Collapse Sidebar</span>}
            </>
          )}
        </button>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top Bar ─────────────────────────────────────────────── */}
        <header
          className="flex-shrink-0 flex items-center justify-between px-8"
          style={{
            height: '68px',
            background: 'rgba(7,11,20,0.7)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Left: System Clock + Status */}
          <div className="flex items-center gap-4">
            {/* Clock */}
            <div
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isRunning ? 'animate-pulse-cyan' : ''
              }`}
              style={{
                background: 'rgba(0,240,255,0.05)',
                border: `1px solid ${isRunning ? 'rgba(0,240,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <Clock
                size={15}
                className={`transition-colors duration-300 ${isRunning ? 'text-primary' : 'text-slate-500'}`}
                strokeWidth={2}
              />
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 leading-none">
                  System Clock
                </span>
                <span
                  className={`block text-sm font-mono font-bold leading-none mt-1 transition-colors ${
                    isRunning ? 'text-primary' : 'text-slate-300'
                  }`}
                >
                  T = {currentTime}
                </span>
              </div>
            </div>

            {/* Status */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{
                background: 'rgba(52,211,153,0.04)',
                border: '1px solid rgba(52,211,153,0.12)',
              }}
            >
              <Wifi size={15} className="text-accent-emerald" strokeWidth={2} />
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 leading-none">
                  Status
                </span>
                <span className="block text-sm font-bold text-accent-emerald leading-none mt-1">
                  Connected
                </span>
              </div>
            </div>

            {/* Running indicator */}
            {isRunning && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl animate-slide-in"
                style={{
                  background: 'rgba(0,240,255,0.08)',
                  border: '1px solid rgba(0,240,255,0.2)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-primary animate-pulse"
                  style={{ boxShadow: '0 0 10px #00F0FF' }}
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Live
                </span>
              </div>
            )}
          </div>

          {/* Right: User chip */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white tracking-wide">Senior Engineer</p>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase">Authorized Access</p>
            </div>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(192,132,252,0.15))',
                border: '1px solid rgba(0,240,255,0.2)',
              }}
            >
              <User size={16} className="text-slate-300" strokeWidth={2} />
            </div>
          </div>
        </header>

        {/* ── Scrollable Content ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer
          className="flex-shrink-0 flex items-center justify-between px-8"
          style={{
            height: '52px',
            background: 'rgba(3,3,10,0.85)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isRunning
                    ? 'bg-primary animate-pulse'
                    : 'bg-slate-700'
                }`}
                style={isRunning ? { boxShadow: '0 0 8px #00F0FF' } : {}}
              />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                {isRunning ? 'Simulation Running' : 'Engine Idle'}
              </span>
            </div>
            <div className="w-px h-4 bg-dark-600" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Strategy:</span>
              <span className="text-[11px] font-bold text-secondary tracking-wide">{algorithm}</span>
            </div>
          </div>

          {/* Right: KernelFlow brand */}
          <span className="text-[10px] text-slate-700 tracking-[0.3em] uppercase font-medium">
            KernelFlow &copy; 2025
          </span>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
