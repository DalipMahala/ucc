import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-display)'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#1a80f8',      // logo blue color
        secondary: '#A70B0B',    // live red color
        accent: '#0B773C',       // result green color
        colorFirst: '#A45B09',   // Scheduled color
        colorSecound: '#586577',  // 
        colorThird: '#757A82',  //
        colorFourth: '#E7F2F4'   // border line color
      },
    },
  },
  plugins: [],
}

export default config

