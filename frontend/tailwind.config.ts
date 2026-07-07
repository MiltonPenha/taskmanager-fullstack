import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        meadow: '#24745f',
        coral: '#d75d4f',
        wheat: '#f7f2e8',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(17, 24, 39, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;

