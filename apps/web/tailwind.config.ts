import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand: deep teal/green (enterprise feel)
        brand: {
          50:  '#edfaf8',
          100: '#ccf5ef',
          200: '#99eadf',
          300: '#5dd9cb',
          400: '#27c1b0',
          500: '#0ab5a0', // Main accent
          600: '#058f7e',
          700: '#077265',
          800: '#095b52',
          900: '#0a4c44',
          950: '#042e2a',
        },
        // Navy sidebar
        navy: {
          50:  '#eef2ff',
          100: '#d9e1f7',
          200: '#b3c3ef',
          300: '#7a98e1',
          400: '#4a6fd4',
          500: '#2952c5',
          600: '#1d3fa8',
          700: '#1a318a',
          800: '#152466',  // Primary sidebar
          900: '#0d1a4a',  // Deeper sidebar
          950: '#070e2e',  // Darkest
        },
        // Neutral grays for content area
        neutral: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Status/accent colors
        status: {
          success: '#16a34a',
          'success-bg': '#f0fdf4',
          warning: '#d97706',
          'warning-bg': '#fffbeb',
          danger:  '#dc2626',
          'danger-bg': '#fef2f2',
          info:    '#0284c7',
          'info-bg': '#f0f9ff',
        },
        // Keep surface for compatibility
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          green:  '#16a34a',
          red:    '#dc2626',
          amber:  '#d97706',
          blue:   '#0284c7',
          purple: '#7c3aed',
          cyan:   '#0ab5a0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'sm':  '4px',
        'md':  '6px',
        'lg':  '8px',
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'xs':   '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm':   '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md':   '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg':   '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl':   '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'card': '0 0 0 1px rgb(0 0 0 / 0.05), 0 2px 8px -2px rgb(0 0 0 / 0.08)',
        'card-hover': '0 0 0 1px rgb(10 181 160 / 0.2), 0 4px 16px -4px rgb(0 0 0 / 0.12)',
        'glow': '0 0 0 3px rgb(10 181 160 / 0.15)',
        'glow-lg': '0 0 0 4px rgb(10 181 160 / 0.2), 0 8px 24px rgb(10 181 160 / 0.15)',
        'sidebar': '4px 0 24px 0 rgb(0 0 0 / 0.15)',
      },
      keyframes: {
        'slide-in': {
          '0%':   { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(10 181 160 / 0)' },
          '50%':      { boxShadow: '0 0 0 6px rgb(10 181 160 / 0.15)' },
        },
      },
      animation: {
        'slide-in':  'slide-in 0.25s ease-out',
        'fade-in':   'fade-in 0.2s ease-out',
        'slide-up':  'slide-up 0.25s ease-out',
        'scale-in':  'scale-in 0.2s ease-out',
        shimmer:     'shimmer 2s linear infinite',
        pulse_glow:  'pulse_glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
