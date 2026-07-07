import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        muted: '#64748B',
        line: '#E2E8F0',
        canvas: '#F8FAF9',
        meadow: '#24745f',
        'meadow-dark': '#1d5f4e',
        'meadow-soft': '#EAF7F1',
        coral: '#d75d4f',
        'coral-soft': '#FFF1F0',
        wheat: '#F8FAF9',
      },
      boxShadow: {
        soft: '0 12px 34px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
