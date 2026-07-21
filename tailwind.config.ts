import type { Config } from 'tailwindcss';

// VONANA design tokens are centralised in src/config/brand.ts.
// Tailwind reads the same hex values here so both stay in sync.
const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1326',
          50: '#EAEBF0',
          100: '#C7CADA',
          200: '#9DA2BF',
          300: '#6E75A0',
          400: '#454C80',
          500: '#232B5E',
          600: '#171E48',
          700: '#0D1326',
          800: '#080C1A',
          900: '#04060D',
        },
        electric: {
          DEFAULT: '#1B3CFF',
          light: '#5C74FF',
          dark: '#122AB8',
        },
        turquoise: {
          DEFAULT: '#00C2B5',
          light: '#3EDCD1',
          dark: '#009488',
        },
        orange: {
          DEFAULT: '#FF8A00',
          light: '#FFA940',
          dark: '#CC6E00',
        },
        offwhite: '#F2F4F8',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 2px 10px -2px rgba(13, 19, 38, 0.08), 0 1px 2px rgba(13, 19, 38, 0.06)',
        'card-hover': '0 12px 30px -8px rgba(13, 19, 38, 0.18)',
        glass: '0 8px 32px rgba(13, 19, 38, 0.12)',
      },
      backgroundImage: {
        'vonana-gradient': 'linear-gradient(135deg, #1B3CFF 0%, #00C2B5 100%)',
        'vonana-radial': 'radial-gradient(circle at top left, rgba(27,60,255,0.25), transparent 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
