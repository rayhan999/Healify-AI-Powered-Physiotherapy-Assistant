/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B9AAE',
          dark: '#024B87',
          light: '#52C9D3',
        },
        healify: {
          'dark-blue': '#024B87',
          'teal': '#1B9AAE',
          'light-cyan': '#52C9D3',
          'hover': '#41cdcf',
        },
        text: {
          primary: '#1a1a1a',
          body: '#333333',
          muted: '#6c6c6c',
        },
        border: {
          DEFAULT: '#d1d5db',
          light: '#e5e7eb',
          error: '#dc2626',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #024B87 0%, #1B9AAE 50%, #52C9D3 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
}
