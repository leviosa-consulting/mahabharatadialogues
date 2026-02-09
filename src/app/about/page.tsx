import MobileNavbar from '@/components/MobileNavbar'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import Navbar from '@/components/Navbar'
import NavbarScroll from '@/components/NavbarScroll'
import { merri } from '../fonts/merri'
import CustomButton from '@/components/CustomButton'

const AboutPage = () => {
  return (
    <div>
      <div>
        <div>
          <MobileNavbar textColor="#1D5C75" isNotHome />
          <MobileNavbarScroll textColor="#1D5C75" showOnScrollUp={true} />
        </div>
        <div className="hidden sm:block relative pt-5 z-10">
          <Navbar textColor="#1D5C75" isNotHome />
        </div>
        <NavbarScroll textColor="#1D5C75" />

        <div className="mx-4 xl:mx-30 my-10">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-start-1 lg:col-start-3 col-span-12 lg:col-span-8">
              <p className="font-neco font-medium italic text-[#1D5C75] text-[20px] md:text-[28px] text-center">
                Mahabharata Dialogues stemed from iscover our upcoming events
                and relive the memories from past gatherings Dive into the
                mystical world of Indian mythology with 'Kiriti & Kirata', part
                of the Heroes of Bharata series by Abhilash Purohit. This
                captivating tale follows Arjuna's transformative journey as he
                prepares for an unprecedented war. Dive into the mystical world
                of Indian mythology with 'Kiriti & Kirata', part of the Heroes
                of Bharata series by Abhilash Purohit. This captivating tale
                follows Arjuna's transformative journey as he prepares for an
                unprecedented war.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* second section */}
      <div
        style={{
          backgroundImage: `
    linear-gradient(#1D5C75, #1D5C7580),
    url('/MD-Texture_BG_Blue-01-04.png')
  `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <div className="mx-4 xl:mx-30 py-20">
          <div className="grid grid-cols-12 ">
            <div className="col-start-2 col-span-10">
              <div className="flex justify-between gap-4">
                <p
                  className={`text-white ${merri.className} font-bold italic text-[20px] md:text-[24px]`}
                >
                  We have done Think you want to take the story of Mahabharata
                  ahead and see what is left to explore?
                </p>
                <CustomButton
                  text="REACH US"
                  bgColor="#1D5C75"
                  textColor="#FFFFFF"
                  url={''}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* third section */}
      <div className="mx-4 xl:mx-30 my-30">
        <div className='flex justify-center items-center my-6 '>
            <h2 className={`${merri.className} font-bold text-[#1D5C75] text-[18px]`}>CORE TEAM</h2>
        </div>
        <div className="w-full flex justify-between gap-6">
          <div className="relative w-[400px] h-[440px] flex flex-col items-center justify-center">
            <div className="absolute top-0 w-full h-[71%] bg-[#D9D9D9]/60"></div>
            <img
              src="/teamImg.png"
              alt="teamImg"
              className="w-full h-full object-contain "
            />
            <div className="w-full flex flex-col justify-center items-center h-full -mt-32 p-4 bg-gradient-to-b from-[#1D5C75] to-[#1D5C75]/50">
              <h2
                className={`${merri.className} italic font-extrabold text-[34px] text-white`}
              >
                Abhilash Purohit
              </h2>

              <h3
                className={`${merri.className} font-normal text-[24px] text-white`}
              >
                STORIES | AUTHOR | SPEAKER
              </h3>
            </div>
          </div>

          <div className="relative w-[400px] h-[440px] flex flex-col items-center justify-center">
            <div className="absolute top-0 w-full h-[71%] bg-[#D9D9D9]/60"></div>
            <img
              src="/teamImg.png"
              alt="teamImg"
              className="w-full h-full object-contain "
            />
            <div className="w-full flex flex-col justify-center items-center h-full -mt-32 p-4 bg-gradient-to-b from-[#1D5C75] to-[#1D5C75]/50">
              <h2
                className={`${merri.className} italic font-extrabold text-[34px] text-white`}
              >
                Rakshith Bhagvwath
              </h2>

              <h3
                className={`${merri.className} font-normal text-[24px] text-white`}
              >
                STORIES | AUTHOR | SPEAKER
              </h3>
            </div>
          </div>
          <div className="relative w-[400px] h-[440px] flex flex-col items-center justify-center">
            <div className="absolute top-0 w-full h-[71%] bg-[#D9D9D9]/60"></div>
            <img
              src="/teamImg.png"
              alt="teamImg"
              className="w-full h-full object-contain "
            />
            <div className="w-full flex flex-col justify-center items-center h-full -mt-32 p-4 bg-gradient-to-b from-[#1D5C75] to-[#1D5C75]/50">
              <h2
                className={`${merri.className} italic font-extrabold text-[34px] text-white`}
              >
                Radha Sawana
              </h2>

              <h3
                className={`${merri.className} font-normal text-[24px] text-white`}
              >
                STORIES | AUTHOR | SPEAKER
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
