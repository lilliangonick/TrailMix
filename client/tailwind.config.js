/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  important: true,
  theme: {
    extend: {
      fontFamily: { Inter: ['Inter', 'sans-serif'] },
      colors: {
        bgBlack: '#000000',
        bgWhite: '#feffff',
        bgGray: '#F3F3F4',
        textGray: '#404040',
        uclaBlue: '#2D68C4',
        uclaLightBlue: '#DAEBFE',
        bgBlur: 'rgba(255, 255, 255, 0.5)',
        transparent: 'transparent',
        bgTrash: '#f87171',
      },
      fontSize: {
        sm: '12px',
        md: '14px',
        lg: '19px',
        xl: '20px',
        xxl: '24px',
        '3xl': '30px',
      },
    },
  },
  plugins: [],
}


