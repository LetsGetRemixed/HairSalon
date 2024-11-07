	/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
	  extend: {
		colors: {
		  darkBackground: '#333333',
		  mainBackground: '#F5F1E6',
		  mainWhite: '#F8F8F8',
		  headerText: '#fcd744',
		  darkCreme: '#e0cf9f',
		  
		  secondText: '#4A4A4A',
		  accentBackground: '#dea08a',
		},
		fontFamily: {
		  'mainfont': ['"Square Market"', 'sans-serif'],
		  'cinzel': ['"Cinzel"', 'serif'],
		},
	  },
	},
	plugins: [],
  };

