/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        f: {
          dark:    '#0E0B14',
          purple:  '#2D1B3D',
          mid:     '#7A5E8A',
          accent:  '#C27A8E',
          light:   '#F0EBF4',
          soft:    '#F7F3F8',
          border:  '#2D2235',
          muted:   '#9B7FA8',
          pink:    '#8B2D52',
          green:   '#2D6A4F',
          greenBg: '#E8F5EE',
          gray:    '#8A7A95',
          grayBg:  '#1B1525',
          gold:    '#C9A870',
          burgundy: '#8B2D52',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.f.gray'),
            a: { color: theme('colors.f.purple'), textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
            'h2,h3,h4': { fontFamily: '"Cormorant Garamond", serif', color: theme('colors.f.dark') },
            blockquote: { borderLeftColor: theme('colors.f.purple'), backgroundColor: theme('colors.f.soft'), borderRadius: '0 12px 12px 0', padding: '12px 20px' },
            code: { backgroundColor: theme('colors.f.soft'), color: theme('colors.f.purple'), padding: '2px 6px', borderRadius: '4px', fontWeight: '400' },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: { backgroundColor: theme('colors.f.dark') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
