import Image from 'next/image'
import CustomButton from './CustomButton'
import { merri } from '@/app/fonts/merri'

export default function HeroSection() {
  return (
    <section
      className="relative w-full sm:h-screen overflow-hidden"
      style={{
        backgroundImage: `url('/Blue_Background_with_Texture-01.png')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* ipad/desktop */}
      <div className="hidden sm:flex w-full overflow-hidden items-center">
        {/* left image */}
        <div className="flex-1 -mt-20 -ml-20">
          <img
            src="Web_Assets-02.png"
            alt="Left Asset"
            className="w-full h-full object-cover"
          />
        </div>

        {/* mid content */}
        <div className="flex-[1.5] flex flex-col items-center justify-center my-20 px-12">
          <div className='w-45 h-45 xl:w-60 xl:h-60 rounded-full'>
             <img src="Web_Assets-08.png" alt="webAssets9" className=""/>
          </div>
        
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
        {/* top circle */}
        <div className="flex flex-col items-center justify-center my-4 px-12">
          {/* circle */}
          <div className="w-54 h-54 rounded-full bg-red-500 flex items-center justify-center text-center">
             <img src="Web_Assets-08.png" alt="webAssets9" className=""/>

          </div>
        </div>

        {/* both image */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 -ml-20">
            <img
              src="Web_Assets-02.png"
              alt="Left Asset"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 -mr-20">
            <img
              src="Web_Assets-09.png"
              alt="Right Asset"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

       
      </div>
    </section>
  )
}
