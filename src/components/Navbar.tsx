'use client'

import { merri } from '@/app/fonts/merri'
import Link from 'next/link'

interface NavProps {
  textColor: string
  isNotHome?: boolean
}

const Navbar = ({ textColor, isNotHome }: NavProps) => {
  return (
    <div className="hidden sm:flex justify-center">
      <div
        className={`flex items-center
          ${isNotHome ? 'gap-12 max-w-5xl' : 'gap-10 max-w-4xl'}
        `}
      >
        {/* LEFT */}
        <div className={`flex ${isNotHome ? 'gap-12' : 'gap-6'}`}>
          <Link
            href="/events"
            className={`${merri.className} font-bold uppercase text-[14px]`}
            style={{ color: textColor }}
          >
            Events
          </Link>

          <Link
            href="/retreats"
            className={`${merri.className} font-bold uppercase text-[14px]`}
            style={{ color: textColor }}
          >
            Retreats
          </Link>

          <Link
            href="/"
            className={`${merri.className} font-bold uppercase text-[14px]`}
            style={{ color: textColor }}
          >
            Products
          </Link>
        </div>

        {/* CENTER LOGO */}
        <Link href="/" className="flex justify-center">
          <img
            src="/Web_Assets-08.png"
            alt="Logo"
            className={`h-auto object-contain cursor-pointer transition-all duration-300
              ${isNotHome ? 'w-31' : 'w-42 xl:w-60 2xl:w-62'}
            `}
          />
        </Link>

        {/* RIGHT */}
        <div className={`flex ${isNotHome ? 'gap-12' : 'gap-6'}`}>
          <Link
            href="/blogs"
            className={`${merri.className} font-bold uppercase text-[14px]`}
            style={{ color: textColor }}
          >
            Blogs
          </Link>

          <Link
            href="/"
            className={`${merri.className} font-bold uppercase text-[14px]`}
            style={{ color: textColor }}
          >
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
    </div>
  )
}

export default Navbar
