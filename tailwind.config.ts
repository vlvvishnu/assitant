import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        brand: {
          50: '#eef6ff',
          500: '#2f80ed',
          600: '#1f6fd4',
          900: '#12345f',
        },
      },
      boxShadow: {
        soft: '0 20px 60px -30px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
} satisfies Config
