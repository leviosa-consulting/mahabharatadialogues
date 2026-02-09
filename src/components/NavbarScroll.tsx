'use client'

import { useState, useEffect } from 'react'
import { merri } from '@/app/fonts/merri'
import Link from 'next/link'

interface NavProps {
  textColor: string
  isNotHome?: boolean
}

const NavbarScroll = ({ textColor, isNotHome }: NavProps) => {
  const [scrollingUp, setScrollingUp] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isPastHero, setIsPastHero] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      const heroSection =
        document.querySelector('[class*="Hero"]')?.parentElement

      const heroHeight = heroSection?.offsetHeight || window.innerHeight

      const pastHero = currentScrollY > heroHeight - 100
      setIsPastHero(pastHero)

      if (pastHero) {
        if (currentScrollY < lastScrollY) {
          setScrollingUp(true)
        } else if (currentScrollY > lastScrollY) {
          setScrollingUp(false)
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const shouldShow = isNotHome || (scrollingUp && isPastHero)

  return (
    <div
      className={`
        hidden sm:flex fixed top-0 left-0 right-0 z-40
        justify-center
        bg-white backdrop-blur-sm
        transition-all duration-300
        ${shouldShow ? 'translate-y-0 shadow-md' : '-translate-y-full'}
      `}
    >
      <div
        className={`flex items-center justify-center py-1
        ${isNotHome ? 'gap-12 w-full px-12' : 'gap-10 max-w-4xl'}
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
            href="/products"
            className={`${merri.className} font-bold uppercase text-[14px]`}
            style={{ color: textColor }}
          >
            Products
          </Link>
        </div>

     

         <Link href="/" className="flex justify-center">
          <img
            src={
              isNotHome ? '/Logo_for_video_Corner-04.png' : '/Web_Assets-08.png'
            }
            alt="Logo"
            className={`
     object-contain cursor-pointer
      transition-all duration-300 w-32
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
            href="/about"
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

export default NavbarScroll
