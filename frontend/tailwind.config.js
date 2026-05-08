/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: {
          950: '#03030a',
          900: '#070b14',
          800: '#0d1120',
          700: '#161b2e',
          600: '#1e2540',
          500: '#2a3354',
        },
        primary: {
          DEFAULT: '#00F0FF',
          dim:     'rgba(0, 240, 255, 0.15)',
          glow:    'rgba(0, 240, 255, 0.4)',
        },
        secondary: {
          DEFAULT: '#C084FC',
          dim:     'rgba(192, 132, 252, 0.15)',
          glow:    'rgba(192, 132, 252, 0.4)',
        },
        accent: {
          orange:  '#FF8C42',
          emerald: '#34d399',
          amber:   '#fbbf24',
          rose:    '#fb7185',
        }
      },
      animation: {
        'pulse-glow':    'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-cyan':    'pulse-glow-cyan 2s ease-in-out infinite',
        'pulse-emerald': 'pulse-glow-emerald 2s ease-in-out infinite',
        'slide-in':      'slide-in 0.3s ease-out',
        'slide-up':      'slide-up 0.3s ease-out',
        'fade-in':       'fadeIn 0.4s ease-out',
        'spin-dot':      'spinDot 4s linear infinite',
        'scan-line':     'scanLine 6s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)' },
          '50%':       { boxShadow: '0 0 30px rgba(0, 240, 255, 0.6)' },
        },
        'pulse-glow-cyan': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 240, 255, 0.15)' },
          '50%':       { boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)'  },
        },
        'pulse-glow-emerald': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(52, 211, 153, 0.2)' },
          '50%':       { boxShadow: '0 0 20px rgba(52, 211, 153, 0.5)' },
        },
        'slide-in': {
          '0%':   { transform: 'translateX(-8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',   opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        spinDot: {
          '0%':   { transform: 'rotate(0deg) translateX(10px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(10px) rotate(-360deg)' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
      },
      boxShadow: {
        'glow-cyan':    '0 0 20px rgba(0, 240, 255, 0.3)',
        'glow-purple':  '0 0 20px rgba(192, 132, 252, 0.3)',
        'glow-emerald': '0 0 20px rgba(52, 211, 153, 0.3)',
        'glow-orange':  '0 0 20px rgba(255, 140, 66, 0.3)',
        'inner-glow':   'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'grid-dark': 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-40': '40px 40px',
      }
    },
  },
  plugins: [],
}
