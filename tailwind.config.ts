import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#21201d',
        paper: '#fbfaf6',
        matcha: '#658447',
        coral: '#d86f56',
        sky: '#77a9c5',
        plum: '#775b86',
        line: '#ded8cb',
      },
      boxShadow: {
        soft: '0 18px 60px rgba(33, 32, 29, 0.12)',
      },
    },
  },
  plugins: [],
}

export default config

