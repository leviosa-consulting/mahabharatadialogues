'use client'

import { merri } from '@/app/fonts/merri'
import Link from 'next/link'

interface NavProps {
  textColor: string
}

const Navbar = ({ textColor }: NavProps) => {
  return (
    <div className="hidden sm:flex max-w-4xl mx-auto items-center justify-between px-4 gap-10">
      {/* Left */}
      <div className="flex gap-6">
        <Link href="/events" className={`${merri.className} font-bold uppercase text-[14px]`} style={{ color: textColor }}>
          Events
        </Link>
        <Link href="/retreats" className={`${merri.className} font-bold uppercase text-[14px]`} style={{ color: textColor }}>
          Retreats
        </Link>
        <Link href="/" className={`${merri.className} font-bold uppercase text-[14px]`} style={{ color: textColor }}>
          Products
        </Link>
      </div>

      {/* Center Logo */}
      <Link href="/" className="flex justify-center">
        <img
          src="Web_Assets-08.png"
          alt="Logo"
          className="w-42 xl:w-60 2xl:w-62 h-auto object-contain cursor-pointer"
        />
      </Link>

      {/* Right */}
      <div className="flex gap-6">
        <Link href="/blogs" className={`${merri.className} font-bold uppercase text-[14px]`} style={{ color: textColor }}>
          Blogs
        </Link>
        <Link href="/" className={`${merri.className} font-bold uppercase text-[14px]`} style={{ color: textColor }}>
          About Us
        </Link>

        <button
          onClick={() =>
            document
              .getElementById('contact')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          className={`${merri.className} font-bold uppercase text-[14px]`}
          style={{ color: textColor }}
        >
          Contact
        </button>
      </div>
    </div>
  )
}

export default Navbar
