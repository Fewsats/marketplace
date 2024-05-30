import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import lineClamp from '@tailwindcss/line-clamp';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'inner-white': 'inset 0 2px 0 0 rgb(255 255 255 / 0.15)',
      },
      zIndex: {
        '60': '60',
      },
      maxWidth: {
        'screen-1xl': '1440px',
      },
    },
  },
  plugins: [forms, lineClamp],
};
export default config;
