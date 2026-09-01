'use client'

import { merri } from '@/app/fonts/merri'
import Link from 'next/link'

interface NavProps {
  textColor: string
  isNotHome?: boolean
}

const Navbar = ({ textColor, isNotHome }: NavProps) => {
  return (
    <div className="hidden sm:flex justify-center w-full">
      <div
        className={`flex items-center w-full ${isNotHome ? 'px-16' : 'max-w-4xl px-4'}`}
      >
        
        <div className={`flex flex-1 justify-end ${isNotHome ? 'gap-12' : 'gap-6'}`}>
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
            href="/products"
            className={`${merri.className} font-bold uppercase text-[14px]`}
            style={{ color: textColor }}
          >
            Products
          </Link>
        </div>

        {/* CENTER LOGO — fixed width so both sides get truly equal remaining space */}
        <Link href="/" className={`flex justify-center flex-shrink-0 ${isNotHome ? 'mx-12' : 'mx-8'}`}>
          <img
            src={isNotHome ? '/Logo_for_video_Corner-04.png' : '/Web_Assets-08.png'}
            alt="Logo"
            className={`
              h-auto object-contain cursor-pointer transition-all duration-300
              ${isNotHome ? 'w-31' : 'w-42 xl:w-60 2xl:w-62'}
            `}
          />
        </Link>

        {/* RIGHT — flex-1 + justify-start pulls links toward the logo */}
        <div className={`flex flex-1 justify-start ${isNotHome ? 'gap-12' : 'gap-6'}`}>
          {/* Blog link hidden for now — restore by uncommenting */}
          {/* <Link
            href="/blogs"
            className={`${merri.className} font-bold uppercase text-[14px]`}
            style={{ color: textColor }}
          >
            Blog
          </Link> */}
          <Link
            href="/about"
            className={`${merri.className} font-bold uppercase text-[14px]`}
            style={{ color: textColor }}
          >
            About Us
          </Link>
          <button
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
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
