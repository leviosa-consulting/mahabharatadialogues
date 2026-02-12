import MobileNavbar from '@/components/MobileNavbar'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import Navbar from '@/components/Navbar'
import NavbarScroll from '@/components/NavbarScroll'
import { merri } from '../fonts/merri'
import CustomButton from '@/components/CustomButton'
import Footer from '@/components/Footer'
import FooterWithBlogs from '@/components/FooterWithBlogs'

const AboutPage = () => {
  const team = [
    {
      name: 'Abhilash Purohit',
      role: 'STORIES | AUTHOR | SPEAKER',
    },
    {
      name: 'Rakshith Bhagvwath',
      role: 'STORIES | AUTHOR | SPEAKER',
    },
    {
      name: 'Radha Sawana',
      role: 'STORIES | AUTHOR | SPEAKER',
    },
    {
      name: 'Namitha Vijaykumar',
      role: 'STORIES | AUTHOR | SPEAKER',
    },
    {
      name: 'Saishraddha Balla',
      role: 'STORIES | AUTHOR | SPEAKER',
    },
    {
      name: 'Deepika',
      role: 'STORIES | AUTHOR | SPEAKER',
    },
    {
      name: 'Nikhil Joshi',
      role: 'STORIES | AUTHOR | SPEAKER',
    },
    {
      name: 'Saurabh Dubey',
      role: 'STORIES | AUTHOR | SPEAKER',
    },
    {
      name: 'Ruchika Kadam',
      role: 'STORIES | AUTHOR | SPEAKER',
    },
  ]
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
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <p
                  className={`text-white ${merri.className} font-bold italic text-center md:text-left text-[20px] md:text-[24px]`}
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
      <div className=" my-30">
        <div className="flex flex-col md:flex-row justify-center items-center my-6 ">
          <h2
            className={`${merri.className} font-bold text-[#1D5C75] text-[18px]`}
          >
            CORE TEAM
          </h2>
        </div>
        <div className="w-full">
          {/* GRID CONTAINER */}
          <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center max-w-7xl">
            {team.map((item, index) => (
              <div
                key={index}
                className="relative w-full max-w-[400px] h-[440px] flex flex-col items-center justify-center"
              >
                {/* Image background */}
                <div className="absolute top-0 w-full h-[71%] bg-[#D9D9D9]/60" />

                <img
                  src="/teamImg.png"
                  alt={item.name}
                  className="w-full h-full object-contain"
                />

                {/* Bottom gradient content */}
                <div className="w-full flex flex-col justify-center items-center h-full -mt-32 p-4 bg-gradient-to-b from-[#1D5C75] to-[#1D5C75]/50 text-center">
                  <h2
                    className={`${merri.className} italic font-extrabold text-[28px] md:text-[34px] text-white`}
                  >
                    {item.name}
                  </h2>

                  <h3
                    className={`${merri.className} font-normal text-[18px] md:text-[24px] text-white`}
                  >
                    {item.role}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* fourth section */}
      <div className="my-30">
        <div className="flex justify-center items-center my-6 ">
          <h2
            className={`${merri.className} font-bold text-[#1D5C75] text-[18px]`}
          >
            COLLABORATORS
          </h2>
        </div>
        <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl gap-4">
          <div className="bg-gray-400 w-full h-80"></div>
          <div className="bg-gray-200 w-full h-80"></div>
          <div className="bg-gray-200 w-full h-80"></div>
          <div className="bg-gray-200 w-full h-80"></div>

          <div className="bg-gray-400 w-full h-80"></div>
          <div className="bg-gray-200 w-full h-80"></div>
          <div className="bg-gray-200 w-full h-80"></div>
          <div className="bg-gray-200 w-full h-80"></div>
        </div>
      </div>

      <div
        className=""
        style={{
          backgroundImage: `
    linear-gradient(#1D5C75, #1D5C75),
    url('/MD-Texture_BG_Blue-01-04.png')
  `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <div className="pt-16">
          <FooterWithBlogs />
        </div>
      </div>
    </div>
  )
}

export default AboutPage
