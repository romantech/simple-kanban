import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        progress: {
          '0%, 60%': { transform: 'translateY(0px)' },
          '30%': { transform: 'translateY(-30px)' },
        },
      },
      animation: {
        progress: 'progress 1s linear infinite',
      },
      colors: {
        baltic: {
          '50': '#f6f6f9',
          '100': '#ecedf2',
          '200': '#d5d6e2',
          '300': '#b1b5c8',
          '400': '#868daa',
          '500': '#676e90',
          '600': '#525777',
          '700': '#444860',
          '800': '#3a3d52',
          '900': '#343646',
          '950': '#20212b',
        },

        charade: {
          '50': '#f6f6f9',
          '100': '#ededf1',
          '200': '#d7d8e0',
          '300': '#b4b7c5',
          '400': '#8a8fa6',
          '500': '#6c718b',
          '600': '#575b72',
          '700': '#474a5d',
          '800': '#3d404f',
          '900': '#363844',
          '950': '#2b2c36',
        },

        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindScrollbar],
} satisfies Config;
