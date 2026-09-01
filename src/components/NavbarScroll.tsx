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
      const heroSection = document.querySelector('[class*="Hero"]')?.parentElement
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
    <div>
      {shouldShow && (
        <div
          className={`
            hidden sm:flex fixed top-0 left-0 right-0 z-40
            justify-center
            bg-white backdrop-blur-sm 
            transition-all duration-300
            ${shouldShow ? 'translate-y-0 shadow-md' : '-translate-y-full'}
          `}
        >
          <div className="relative flex items-center pt-18 pb-5 max-w-[812px] w-full">
            
            {/* LEFT — flex-1 so it takes equal half */}
            <div className="flex flex-1 gap-12">
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

            {/* LOGO — absolutely centered in the full nav bar */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <img
                src="/Logo_for_video_Corner-04.png"
                alt="Logo"
                className="object-contain cursor-pointer transition-all duration-300 w-31"
              />
            </Link>

            {/* RIGHT — flex-1 + justify-end so it takes equal half and aligns right */}
            <div className="flex flex-1 justify-end mr-7 gap-12">
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
      )}
    </div>
  )
}

export default NavbarScroll