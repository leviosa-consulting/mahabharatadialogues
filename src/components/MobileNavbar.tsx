'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { merri } from '@/app/fonts/merri'

interface MobileNavbarProps {
  textColor: string
  isNotHome?: boolean
}

const MobileNavbar = ({ textColor, isNotHome }: MobileNavbarProps) => {
  const [open, setOpen] = useState(false)

  /* 🔒 LOCK BODY SCROLL */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="sm:hidden relative z-50">
      {/* TOP AREA (hide when menu open) */}
      {!open && (
        <div className="relative flex items-center justify-center py-4 px-12">
          {/* Clickable circle logo */}
          <Link
            href="/"
            className={`
              rounded-full
              flex items-center justify-center
              transition-all duration-300
              ${isNotHome ? 'w-[23%]' : 'w-[70%]'}
            `}
          >
            <img
              src={
              isNotHome ? '/Logo_for_video_Corner-04.png' : '/Web_Assets-08.png'
            }
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
            href="/blogs"
            onClick={() => setOpen(false)}
            className={`${merri.className} text-white font-bold uppercase text-[18px]`}
          >
            Blogs
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

export default MobileNavbar
