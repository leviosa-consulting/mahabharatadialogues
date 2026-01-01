import Image from 'next/image'
import CustomButton from './CustomButton'

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
          {/* circle */}
          <div className="w-45 h-45 xl:w-60 xl:h-60 rounded-full bg-red-500 flex items-center justify-center text-center">
            <div className="flex flex-col gap-2">
              <p className="text-white text-lg xl:text-2xl font-merri font-bold italic">
                Mahabharata Dialogues
              </p>
              <span className="font-normal font-merri text-sm italic text-white">
                Epic stories, Ancient Wisdom
              </span>
            </div>
          </div>

          {/* text */}
          <p className="font-neco italic text-[24px] xl:text-[32px] font-bold text-white  text-center mt-8 xl:max-w-[600px]">
            Mahabharata Dialogues is a collective dadada dad which meets on the
            4th Saturday of every month on new topics dada da da.
          </p>

          {/* button */}
          <div className="py-6">
           <CustomButton
              text="GET YOUR TICKETS"
              bgColor="#1D5C75"
              textColor="#ffffff"
              url="https://in.bookmyshow.com/plays/mahabharatha-dialogues-koramangala/ET00357289"
            />
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
            <div className="flex flex-col gap-2">
              <p className="text-white text-2xl font-merri font-bold italic">
                Mahabharata Dialogues
              </p>
              <span className="font-normal font-merri text-sm italic text-white">
                Epic stories, Ancient Wisdom
              </span>
            </div>
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

        {/* text */}
        <div className="flex flex-col gap-2 justify-center items-center text-center py-6 px-1.5">
          {/* text */}
          <p className="font-neco italic text-[22px] font-bold text-white  text-center mt-8">
            Mahabharata Dialogues is a collective dadada dad which meets on the
            4th Saturday of every month on new topics dada da da.
          </p>
          {/* button */}
          <div className="py-6">
            <CustomButton
              text="GET YOUR TICKETS"
              bgColor="#1D5C75"
              textColor="#ffffff"
              url="https://in.bookmyshow.com/plays/mahabharatha-dialogues-koramangala/ET00357289"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
