/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        surface: "#0f172a",
        accent: {
          primary: "#a855f7",    // Purple
          secondary: "#3b82f6",  // Blue
          glow: "#8b5cf6",
        },
        text: {
          main: "#f8fafc",
          muted: "#94a3b8",
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'ai-mesh': "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')", // Just a placeholder texture
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
