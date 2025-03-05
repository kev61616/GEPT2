/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',    // Extra small devices (phones)
        'sm': '640px',    // Small devices (large phones, small tablets)
        'md': '768px',    // Medium devices (tablets)
        'lg': '1024px',   // Large devices (laptops/desktops)
        'xl': '1280px',   // Extra large devices (large desktops)
        '2xl': '1536px',  // 2X large devices
      },
    },
  },
  plugins: [],
};
