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
      {/* Home uses a definite w-4xl (the old max-w-4xl cap, now a fixed width) rather than w-full.
          In the hero this navbar sits inside a content-sized shrink-0 column, so
          w-full resolved to the content's own width — zero free space, nothing for
          flex-1 to distribute, and the sides kept their natural widths. Since the
          left group has one more link than the right (Blog is hidden), that pushed
          the logo off-centre. A definite width gives flex-1 something to split, so
          both sides come out equal and the logo lands dead centre.
          isNotHome keeps w-full: those pages are full-width and already had slack. */}
      <div
        className={`flex items-center ${isNotHome ? 'w-full px-16' : 'w-4xl px-4'}`}
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

        {/* CENTER LOGO — stays in flow between the two flex-1 groups. flex-1 is
            flex:1 1 0%, so the sides only end up equal when the container has free
            space to hand out; that is why the home branch below sets a definite
            width instead of w-full. */}
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
