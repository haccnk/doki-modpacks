/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#08090C',
        surface: {
          0: '#08090C',
          1: '#0E1017',
          2: '#13151F',
          3: '#1A1D2B',
          4: '#222638',
          card: 'rgba(18, 20, 29, 0.75)',
          hover: 'rgba(26, 29, 43, 0.85)',
          elevated: '#1A1D2B',
        },
        brand: {
          50: 'rgb(var(--color-brand-light) / 0.05)',
          100: 'rgb(var(--color-brand-light) / 0.1)',
          200: 'rgb(var(--color-brand-light) / 0.2)',
          300: 'rgb(var(--color-brand-light) / 0.4)',
          400: 'rgb(var(--color-brand-light) / <alpha-value>)',
          500: 'rgb(var(--color-brand) / <alpha-value>)',
          600: 'rgb(var(--color-brand-hover) / <alpha-value>)',
          700: 'rgb(var(--color-brand-hover) / 0.8)',
          800: 'rgb(var(--color-brand-hover) / 0.6)',
          900: 'rgb(var(--color-brand-hover) / 0.4)',
          DEFAULT: 'rgb(var(--color-brand) / <alpha-value>)',
          hover: 'rgb(var(--color-brand-hover) / <alpha-value>)',
          light: 'rgb(var(--color-brand-light) / <alpha-value>)',
          gradient: 'rgb(var(--color-brand-gradient) / <alpha-value>)',
        },
        accent: {
          violet: '#8B5CF6',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.06)',
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          bright: 'rgba(255, 255, 255, 0.2)',
          focus: 'rgb(var(--color-brand))',
        },
        text: {
          primary: '#EDEDED',
          secondary: '#A1A1AA',
          muted: '#71717A',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'glow-subtle': '0 0 40px -10px rgb(var(--color-brand) / 0.25)',
        'glow-card': '0 12px 32px -12px rgba(0, 0, 0, 0.7)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'inner-glow': 'inset 0 0 20px 0 rgb(var(--color-brand) / 0.08)',
        'spotlight': '0 0 50px -10px rgb(var(--color-brand) / 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'border-beam': 'borderBeam 8s linear infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'stream-flow': 'streamFlow 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        borderBeam: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(10px, -15px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        streamFlow: {
          '0%': { strokeDashoffset: '40' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
