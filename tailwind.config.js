/** @type {import('tailwindcss').Config} */
export const content = [
  './src/App.{js,ts,tsx}',
  './src/components/**/*.{js,ts,tsx}',
  './src/app/**/*.{js,ts,tsx}',
];
export const presets = [require('nativewind/preset')];
export const theme = {
  extend: {},
};
export const plugins = [];

// module.exports = {
//   content: [
//     './src/App.{js,ts,tsx}',
//     './src/components/**/*.{js,ts,tsx}',
//     './src/app/**/*.{js,ts,tsx}',
//   ],
//
//   presets: [require('nativewind/preset')],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };
