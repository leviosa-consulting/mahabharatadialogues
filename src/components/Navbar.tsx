import { merri } from '@/app/fonts/merri'
import Link from 'next/link'

interface NavProps {
  textColor: string
}

const Navbar = ({ textColor }: NavProps) => {
  return (
    <>
      {/* ---------------- MOBILE NAVBAR ---------------- */}
      <div className="sm:hidden w-full px-4 pt-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <Link
            href="/events"
            className={`${merri.className} font-bold uppercase text-[14px] text-[${textColor}]`}
          >
            Events
          </Link>

          <Link
            href="/retreats"
             className={`${merri.className} font-bold uppercase text-[14px] text-[${textColor}]`}
          >
            Retreats
          </Link>

          <Link
            href="/blogs"
             className={`${merri.className} font-bold uppercase text-[14px] text-[${textColor}]`}
          >
            Blogs
          </Link>

          <Link
            href="/contact"
            className={`${merri.className} font-bold text-lg text-[${textColor}]`}
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* --------------- TABLET / DESKTOP NAVBAR --------------- */}
      <div className="hidden sm:flex max-w-4xl mx-auto items-center justify-between px-4 gap-10">
        {/* Left */}
        <div className="flex gap-6">
          <Link href="/events"  className={`${merri.className} font-bold uppercase text-[14px] text-[${textColor}]`}>
            Events
          </Link>
          <Link href="/retreats"  className={`${merri.className} font-bold uppercase text-[14px] text-[${textColor}]`}>
            Retreats
          </Link>
          <Link href="/contact"  className={`${merri.className} font-bold uppercase text-[14px] text-[${textColor}]`}>
            Products
          </Link>
        </div>

        {/* Center Logo */}
        <Link href="/" className="flex justify-center">
          <img
            src="Web_Assets-08.png"
            alt="Logo"
            className="w-42 xl:w-60 2xl:w-62 h-auto object-contain"
          />
        </Link>

        {/* Right */}
        <div className="flex gap-6">
          <Link href="/blogs"  className={`${merri.className} font-bold uppercase text-[14px] text-[${textColor}]`}>
            Blogs
          </Link>
          <Link href="/contact"  className={`${merri.className} font-bold uppercase text-[14px] text-[${textColor}]`}>
            About Us
          </Link>
          <Link href="/contact"  className={`${merri.className} font-bold uppercase text-[14px] text-[${textColor}]`}>
            Contact
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar
