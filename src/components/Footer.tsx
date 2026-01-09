
import React from 'react'
import {
  Mail,
  Phone,
  Youtube,
  Instagram,
  Linkedin,
} from 'lucide-react'

const Footer = () => {
  return (
    <div>
       <div
      className="
        flex flex-col justify-center items-center
        text-white font-bold font-neco
        py-16
        text-[18px] sm:text-[22px] md:text-[32px]
        px-4
        text-center
      "
    >
      {/* Email */}
      <div className="flex items-center gap-3 break-all sm:break-normal">
        <Mail className="w-5 h-5 md:w-7 md:h-7" />
        <p className='font'>mahabharatadialogues@gmail.com</p>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-3 mt-2">
        <Phone className="w-5 h-5 md:w-7 md:h-7" />
        <p>+91 78923 32932</p>
      </div>

      {/* Social Icons */}
      <div className="flex gap-4 mt-6">
        <a
          href="https://www.youtube.com/@MahabharataDialogues/videos"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center hover:scale-110 transition"
        >
          <Youtube className="w-5 h-5 text-black" />
        </a>

        <a
          href="https://www.instagram.com/mahabharatadialogues/"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center hover:scale-110 transition"
        >
          <Instagram className="w-5 h-5 text-black" />
        </a>

        <a
          href="https://in.linkedin.com/company/mahabharatadialogues"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center hover:scale-110 transition"
        >
          <Linkedin className="w-5 h-5 text-black" />
        </a>
        
      </div>
      
    </div>
         <div className="bg-[#124056] py-6 w-full"></div>
    </div>
   
  )
}

export default Footer

