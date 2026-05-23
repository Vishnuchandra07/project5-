/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        brand: {
          500: '#0d9488',
          600: '#0f766e',
          700: '#115e59',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.05)',
        elevated: '0 8px 24px -4px rgb(15 23 42 / 0.1)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
