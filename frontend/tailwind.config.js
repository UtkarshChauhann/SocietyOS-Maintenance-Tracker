/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        brand: 'rgb(var(--brand) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.07)',
        lift: '0 18px 45px rgba(15, 23, 42, 0.12)',
        focus: '0 0 0 4px rgba(15, 118, 110, 0.14)'
      },
      backgroundImage: {
        'brand-soft': 'linear-gradient(135deg, rgba(15,118,110,0.12), rgba(37,99,235,0.08))',
        'brand-button': 'linear-gradient(135deg, #0f766e, #0d9488)'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite'
      }
    }
  },
  plugins: []
};
