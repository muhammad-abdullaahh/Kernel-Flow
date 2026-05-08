import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   KernelSelect  –  High-fidelity custom dropdown
   ───────────────────────────────────────────────────────────────── */
export const KernelSelect = ({ value, onChange, options, disabled, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="kernel-select flex items-center justify-between w-full group"
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 text-slate-500 group-hover:text-primary ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-3 z-50 glass-card p-2 border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-slide-up overflow-hidden"
          style={{ background: '#05050a', backdropFilter: 'none' }}
        >
          <div className="max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange({ target: { value: opt } });
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-4 rounded-xl text-lg font-semibold transition-all duration-200 mb-1 last:mb-0 ${value === opt
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
/* ─────────────────────────────────────────────────────────────────
   NeonButton  –  action-coded, micro-animated buttons
   Variants: 'start' | 'reset' | 'secondary' | 'ghost'
   ───────────────────────────────────────────────────────────────── */
export const NeonButton = ({
  children,
  onClick,
  variant = 'secondary',
  className = '',
  disabled = false,
  icon: Icon,
  type = 'button',
}) => {
  const variantClass = {
    start: 'btn-start',
    primary: 'btn-start',          // legacy alias
    reset: 'btn-reset',
    orange: 'btn-reset',          // legacy alias
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  }[variant] ?? 'btn-secondary';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn-base ${variantClass} ${className}`}
    >
      {Icon && <Icon size={18} strokeWidth={2.5} />}
      {children}
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────────
   GlassCard  –  unified premium card shell
   Props:
     title, subtitle, icon, actions  →  card header
     accent: 'cyan'|'purple'|'emerald'|'none'  →  top-edge glow
     noPad  →  remove inner padding (use when child handles its own)
   ───────────────────────────────────────────────────────────────── */
export const GlassCard = ({
  children,
  className = '',
  title,
  subtitle,
  icon: Icon,
  actions,
  accent = 'none',
  noPad = false,
  centered = false,
  overflowVisible = false,
}) => {
  const accentBorder = {
    cyan: 'after:absolute after:top-0 after:left-[8%] after:right-[8%] after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/50 after:to-transparent',
    purple: 'after:absolute after:top-0 after:left-[8%] after:right-[8%] after:h-px after:bg-gradient-to-r after:from-transparent after:via-secondary/50 after:to-transparent',
    emerald: 'after:absolute after:top-0 after:left-[8%] after:right-[8%] after:h-px after:bg-gradient-to-r after:from-transparent after:via-accent-emerald/50 after:to-transparent',
    none: '',
  }[accent];

  return (
    <div className={`glass-card relative ${overflowVisible ? '' : 'overflow-hidden'} flex flex-col ${accentBorder} ${className}`}>
      {/* Card Header */}
      {(title || Icon || actions) && (
        <div className={`flex ${centered ? 'flex-col items-center text-center py-10' : 'items-center justify-between pt-6 pb-4'} px-7`}>
          <div className={`flex ${centered ? 'flex-col items-center gap-6' : 'items-center gap-3.5'}`}>
            {Icon && (
              <div
                className={`flex items-center justify-center ${centered ? 'w-20 h-20 rounded-2xl mb-2' : 'w-9 h-9 rounded-xl'}`}
                style={{
                  background: 'rgba(0,240,255,0.06)',
                  border: '1px solid rgba(0,240,255,0.12)',
                }}
              >
                <Icon size={centered ? 42 : 18} className="text-primary" strokeWidth={2} />
              </div>
            )}
            <div>
              {title && (
                <h3 className={`${centered ? 'text-5xl' : 'text-sm'} font-bold text-white tracking-wide transition-all duration-300`}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className={`${centered ? 'text-lg mt-3 font-medium' : 'text-[11px] mt-0.5'} text-slate-500 tracking-wider transition-all duration-300`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className={`flex items-center gap-3 ${centered ? 'mt-8' : ''}`}>{actions}</div>
          )}
        </div>
      )}

      {/* Divider line under header */}
      {(title || Icon || actions) && !centered && (
        <div className="kernel-divider mx-7" />
      )}

      {/* Card Body */}
      <div className={`flex-1 ${noPad ? '' : 'p-7'} ${(title || Icon || actions) && !centered ? 'pt-5' : ''}`}>
        {children}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SectionLabel  –  tiny uppercase eyebrow label
   ───────────────────────────────────────────────────────────────── */
export const SectionLabel = ({ children, className = '' }) => (
  <span
    className={`text-sm font-bold uppercase tracking-[0.3em] text-slate-500/80 ${className}`}
  >
    {children}
  </span>
);

/* ─────────────────────────────────────────────────────────────────
   StatusPill  –  inline status badge
   ───────────────────────────────────────────────────────────────── */
export const StatusPill = ({ active, label, activeLabel }) => (
  <div
    className={`status-pill transition-all duration-300 ${active
        ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
        : 'bg-dark-600/60 border border-dark-500/30 text-slate-500'
      }`}
  >
    <span
      className={`w-2 h-2 rounded-full transition-all duration-300 ${active
          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse'
          : 'bg-slate-600'
        }`}
    />
    {active ? (activeLabel ?? label) : label}
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   Modal  –  High-fidelity overlay for important notifications
   ───────────────────────────────────────────────────────────────── */
export const Modal = ({ isOpen, onClose, title, children, icon: Icon, accent = 'cyan' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-card max-w-lg w-full p-8 relative overflow-hidden animate-slide-up shadow-[0_0_100px_rgba(0,0,0,1)]"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Accent glow top */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${accent === 'cyan' ? 'primary' : 'secondary'}/50 to-transparent`}
        />

        <div className="flex flex-col items-center text-center gap-6">
          {Icon && (
            <div
              className="flex items-center justify-center w-20 h-20 rounded-2xl"
              style={{
                background: accent === 'cyan' ? 'rgba(0,240,255,0.06)' : 'rgba(192,132,252,0.06)',
                border: `1px solid ${accent === 'cyan' ? 'rgba(0,240,255,0.12)' : 'rgba(192,132,252,0.12)'}`,
              }}
            >
              <Icon size={42} className={accent === 'cyan' ? 'text-primary' : 'text-secondary'} strokeWidth={1.5} />
            </div>
          )}

          <div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              {title}
            </h2>
            <div className="text-slate-400 font-medium text-lg leading-relaxed">
              {children}
            </div>
          </div>

          <NeonButton
            variant={accent === 'cyan' ? 'start' : 'reset'}
            onClick={onClose}
            className="px-12 py-4 text-base mt-2"
          >
            Acknowledge
          </NeonButton>
        </div>
      </div>
    </div>
  );
};
