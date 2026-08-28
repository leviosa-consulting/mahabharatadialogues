import React from 'react'
import { Mail, Phone, Youtube, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <div id="contact">
      <div
        className="
          flex flex-col justify-center items-center
          text-white font-neco
          py-16
          text-[18px] sm:text-[22px] md:text-[32px]
          px-4
          text-center
        "
      >
        {/* Rows stack on mobile and go inline from md up. Stacking is deliberate:
            at 360px only ~328px is usable, and the email row needs ~474px, so it
            wraps no matter what. Left to flex-wrap alone, email wrapped while phone
            and socials stayed inline — three different shapes — and since those two
            clear by only 14 and 28px they wrap as well on a 320px phone, so the
            layout changed between devices. Stacking makes all three consistent at
            every width.
            items-center covers both directions: horizontal centring in column mode,
            vertical in row mode. md:flex-wrap stays because at exactly 768px the
            email row still needs ~700px of 736px available.
            Each row centres on its own width, so labels start at different x
            positions on desktop — the accepted cost of centring, given the rows
            differ too much in width to both align labels and centre every row. */}
        {/* Email — label sits outside the <a> so it isn't part of the mailto target */}
        <div className="flex flex-col items-center gap-2 md:flex-row md:flex-wrap md:justify-center">
          <span className='font-bold'>Email us at :</span>
          <a
            href="mailto:mahabharatadialogues@gmail.com"
            className="flex items-center gap-2 cursor-pointer hover:underline"
          >
            <Mail className="w-5 h-5 md:w-7 md:h-7" />
            <span>mahabharatadialogues@gmail.com</span>
          </a>
        </div>

        {/* Phone */}
        <div className="flex flex-col items-center gap-2 md:flex-row md:flex-wrap md:justify-center mt-8 md:mt-3">
          <span className='font-bold'>Call us at :</span>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 md:w-7 md:h-7" />
            <p>+91 78923 32932</p>
          </div>
        </div>

        {/* Social Icons — the icon row keeps its own gap-4 so the circles' spacing
            stays independent of the gap between label and row. */}
        <div className="flex flex-col items-center gap-2 md:flex-row md:flex-wrap md:justify-center md:gap-3 mt-10 md:mt-8">
          <span className='font-bold'>Follow us at :</span>
          <div className="flex gap-4">
          <a
            href="https://www.youtube.com/@MahabharataDialogues/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center hover:scale-110 transition"
          >
            <Youtube className="w-5 h-5 text-black" />
          </a>

          <a
            href="https://www.instagram.com/mahabharatadialogues/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center hover:scale-110 transition"
          >
            <Instagram className="w-5 h-5 text-black" />
          </a>

          <a
            href="https://in.linkedin.com/company/mahabharatadialogues"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center hover:scale-110 transition"
          >
            <Linkedin className="w-5 h-5 text-black" />
          </a>
          </div>
        </div>
      </div>

      <div className="bg-[#124056] py-6 w-full" />
    </div>
  )
}

export default Footer
