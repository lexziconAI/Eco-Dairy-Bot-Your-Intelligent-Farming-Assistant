/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coolMint: '#A8E6CF',
        softPeach: '#FFD3A5',
        skyLavender: '#C7CEEA',
        sesGreen: '#5AC48C',
        chaosPurple: '#9F7AEA',
        bojeGold: '#F6C177',
      },
      backdropBlur: {
        '8': '8px',
      },
    },
  },
  plugins: [],
}