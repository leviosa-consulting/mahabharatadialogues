import Image from 'next/image'
import CustomButton from './CustomButton'
import { merri } from '@/app/fonts/merri'
import Navbar from './Navbar'
import MobileNavbar from './MobileNavbar'
import MobileNavbarScroll from './MobileNavbarScroll'
import NavbarScroll from './NavbarScroll'

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-[78vh] sm:h-[82vh] overflow-hidden"
      // style={{
      //   backgroundImage: `url('/Blue_Background_with_Texture-01.png')`,
      //   backgroundSize: 'cover',
      //   backgroundRepeat: 'no-repeat',
      //   backgroundPosition: 'center',
      // }}
    >
      {/* ipad/desktop */}
      <div className="hidden sm:flex w-full h-full overflow-hidden items-start">
        {/* left image */}
        <div className="flex-1 -mt-20 -ml-20">
          <img
            src="Web_Assets-02.png"
            alt="Left Asset"
            className="w-full h-full object-cover"
          />
        </div>

        {/* navbar */}
        <div className="hidden lg:flex mt-10">
          <Navbar textColor="#fff" />
          <NavbarScroll textColor="#1D5C75" />
        </div>

        {/* circle */}
        <div className="lg:hidden w-[50%] h-[50%] rounded-full flex items-center justify-center text-center">
          <img src="/Web_Assets-08.png" alt="webAssets9" className="" />
        </div>

        {/* right image */}
        <div className="flex-1 -mt-20 -mr-20">
          <img
            src="Web_Assets-09.png"
            alt="Right Asset"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Mobile */}
      <div className="sm:hidden">
        {/* <MobileNavbar textColor="#fff" /> */}

         {/* top circle */}
        <div className="flex flex-col items-center justify-center my-4 px-12">
          {/* circle */}
          <div className="w-[70%] h-[70%] rounded-full bg-red-500 flex items-center justify-center text-center">
            <img src="/Web_Assets-08.png" alt="webAssets9" className="" />
          </div>
        </div>
        

        <div className="flex justify-between items-center gap-14 pb-10 -mt-20">
          <div className="flex-1 -ml-10">
            <img
              src="/Web_Assets-02.png"
              alt="Left Asset"
              className="w-[85%] h-full object-cover"
            />
          </div>
          <div className="flex-1 -mr-20">
            <img
              src="/Web_Assets-09.png"
              alt="Right Asset"
              className="w-[85%] h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
