/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#fafafa',
        surface: '#ffffff',
        line: {
          DEFAULT: '#e5e7eb',
          soft: '#f0f0f1',
        },
        ink: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
          faint: '#94a3b8',
        },
        accent: {
          DEFAULT: '#14233c',
          hover: '#0a1424',
          soft: '#eef1f4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
