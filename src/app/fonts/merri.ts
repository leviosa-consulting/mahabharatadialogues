import { Merriweather_Sans } from 'next/font/google'

export const merri = Merriweather_Sans({
  subsets: ['latin'] as const,
  weight: ['300', '400', '600', '700', '800'] as const,
  style: ['normal', 'italic'] as const,
  display: 'swap',
  variable: '--font-merri',
})
