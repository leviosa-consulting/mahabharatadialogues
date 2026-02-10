'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { merri } from '@/app/fonts/merri'

interface MobileNavbarProps {
  textColor: string
  isNotHome?: boolean
  showOnScrollUp?: boolean
}

const MobileNavbarScroll = ({ textColor, isNotHome, showOnScrollUp = false }: MobileNavbarProps) => {
  const [open, setOpen] = useState(false)
  const [scrollingUp, setScrollingUp] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isPastHero, setIsPastHero] = useState(false)

 
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])


  useEffect(() => {
    if (!showOnScrollUp) return

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
  }, [lastScrollY, showOnScrollUp])

 
  const shouldShow = isNotHome || (showOnScrollUp && scrollingUp && isPastHero)

  return (
    <div className="sm:hidden relative z-50">
      {/* TOP AREA (hide when menu open) */}
      {!open && (
        <div
          className={`
            fixed top-0 left-0 right-0
            flex items-center justify-center py-1 px-12
            bg-white/95 backdrop-blur-sm
            transition-all duration-300
            ${shouldShow ? 'translate-y-0 shadow-md' : '-translate-y-full'}
          `}
        >
          {/* Clickable circle logo */}
          <Link
            href="/"
            className="rounded-full flex items-center justify-center transition-all duration-300 w-[28%]"
          >
            <img
              src="/Logo_for_video_Corner-04.png"
              alt="Logo"
              className="w-full h-auto"
            />
          </Link>

          {/* Toggle icon */}
          <button
            onClick={() => setOpen(true)}
            className="absolute right-4"
            style={{ color: textColor }}
          >
            <Menu size={32} />
          </button>
        </div>
      )}

      {/* FULLSCREEN MENU */}
      <div
        className={`
          fixed inset-0
          bg-[#1D5C75]
          z-50
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-end px-6 py-6 mt-10">
          <button onClick={() => setOpen(false)}>
            <X size={32} className="text-white" />
          </button>
        </div>

         {/* NAV ITEMS — FORCE VISIBLE */}
        <nav className="flex flex-col items-start gap-8 px-6 pt-12">
          <Link
            href="/events"
            onClick={() => setOpen(false)}
            className={`${merri.className} text-white font-bold uppercase text-[18px]`}
          >
            Events
          </Link>

          <Link
            href="/retreats"
            onClick={() => setOpen(false)}
            className={`${merri.className} text-white font-bold uppercase text-[18px]`}
          >
            Retreats
          </Link>

          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className={`${merri.className} text-white font-bold uppercase text-[18px]`}
          >
            Products
          </Link>

          <Link
            href="/blogs"
            onClick={() => setOpen(false)}
            className={`${merri.className} text-white font-bold uppercase text-[18px]`}
          >
            Blogs
          </Link>
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className={`${merri.className} text-white font-bold uppercase text-[18px]`}
          >
            About Us
          </Link>

          <button
            onClick={() => {
              setOpen(false)
              document
                .getElementById('contact')
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
            className={`${merri.className} text-white font-bold uppercase text-[18px]`}
          >
            Contact
          </button>
        </nav>
      </div>
    </div>
  )
}

export default MobileNavbarScroll