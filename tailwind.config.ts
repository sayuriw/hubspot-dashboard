import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default <Partial<Config>>(<unknown>{
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app/**/*.vue'
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: '#8259ff',
          200: '#d8d4ff',
          600: '#7337fc',
        },
        yellow: '#f5c41c',
        black: '#141314',
        gray: {
          DEFAULT: '#dfe1e5',
          50: '#fbf9fa',
        },
      },
    },
  },
  plugins: [
    typography
  ],
});