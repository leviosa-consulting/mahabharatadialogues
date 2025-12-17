import localFont from 'next/font/local'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Fira_Sans, Lato, Bellota } from 'next/font/google'

import './globals.css'
import { AuthProvider } from '@/lib/authContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const firaSans = Fira_Sans({
  variable: '--font-fira-sans',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  style: ['normal', 'italic'],
})

const bellota = Bellota({
  variable: '--font-bellota',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
})

const firaSansUltra = localFont({
  src: '../fonts/FiraSans-Ultra.ttf',
  variable: '--font-fira-sans-ultra',
  weight: '900',
  style: 'normal',
})

export const metadata: Metadata = {
  title: 'Mahabharata Dailogues',
  description: 'Mahabharata Dailogues',
    icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${firaSans.variable}
        ${lato.variable}
        ${bellota.variable}
        ${firaSansUltra.variable}
      `}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
