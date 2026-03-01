/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#2F6FED',
            dark: '#1E3A8A',
            soft: '#4F8CFF',
            light: '#EAF2FF',
          },
          accent: {
            DEFAULT: '#F4B400',
            soft: '#FFD966',
          },
          neutral: {
            bg: '#F5F7FA',
            border: '#E5E7EB',
            card: '#FFFFFF',
          },
          text: {
            primary: '#111827',
            secondary: '#6B7280',
            muted: '#9CA3AF',
          },
          status: {
            success: '#22C55E',
            fulltime: '#2563EB',
            remote: '#7C3AED',
          },
        },
        fontFamily: {
          sans: ['DM Sans', 'sans-serif'],
          display: ['Sora', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };