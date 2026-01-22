import { merri } from '@/app/fonts/merri'
import Link from 'next/link'
import React from 'react'

interface NavProps{
    textColor : string
}

const Navbar = ({textColor}: NavProps) => {
  return (
    <div className="hidden max-w-4xl mx-auto sm:flex items-center justify-between px-4 gap-6">
      
      {/* Left items */}
      <div className="flex gap-6">
        <Link href={"/events"} className={`${merri.className} font-bold text-2xl text-[${textColor}]`}>
          Events
        </Link>
        <Link href={"/retreats"} className={`${merri.className} font-bold text-2xl text-[${textColor}]`}>
          Retreats
        </Link>
      </div>

      {/* Center logo */}
      <Link href={"/"} className="flex justify-center">
        <img
          src="Web_Assets-08.png"
          alt="Logo"
          className="w-42 xl:w-60 2xl:w-82 h-auto object-contain"
        />
      </Link>

      {/* Right items */}
      <div className="flex gap-6">
        <Link href={"/blogs"} className={`${merri.className} font-bold text-2xl text-[${textColor}]`}>
          Blogs
        </Link>
        <h2 className={`${merri.className} font-bold text-2xl text-[${textColor}]`}>
          Contact Us
        </h2>
      </div>

    </div>
  )
}

export default Navbar
