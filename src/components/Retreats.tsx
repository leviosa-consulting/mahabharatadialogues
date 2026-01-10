import React from 'react'
import CustomButton from './CustomButton'
import YouTubeSection from './YouTubeSection'
import LatestBlogs from '@/lib/LatestBlogs'
import { merri } from '@/app/fonts/merri'
import Footer from './Footer'
import { getLatestVideos } from '@/lib/youtube'
export default async function Retreats() {
  const videos = await getLatestVideos()
  return (
    <section
      className="relative w-full overflow-hidden flex flex-col justify-center "
      style={{
        backgroundImage: `
    linear-gradient(
      to bottom,
      #47ABD880 50%,
      #1D5C75 100%
    )
 
  `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-2 xl:mx-36 overflow-hidden bg-[#1D5C7580]">
        <div className="grid grid-cols-6 md:grid-cols-10 xl:grid-cols-12 p-4 lg:p-10">
          {/* IMAGE – first on mobile */}
          <div className="col-span-6 md:col-start-7 md:col-span-6 order-1 md:order-2">
            <img
              src="/assets/videoImg.png"
              alt="videoImg"
              className="w-full h-full object-cover"
            />
          </div>

          {/* TEXT – below image on mobile */}
          <div className="col-span-6 md:col-start-1 md:col-span-6 order-2 md:order-1 py-4 lg:py-10">
            <div className="lg:p-2 flex flex-col gap-6 text-center md:text-left">
              <h2 className="font-neco text-[32px] text-white font-bold">
                Our Retreats
              </h2>

              <p className="font-merii italic font-light text-[18px] lg:text-[24px] text-white">
               We come together to listen, question, play, and reflect using the Mahabharata as our guide. Each retreat is a shared journey of stories, insights, and warm connections.
              </p>

              <div className="flex justify-center md:justify-start">
                <CustomButton
                  text="LEARN MORE"
                  bgColor="#47ABD880"
                  textColor="#FFFFFF"
                  url="/retreats"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* blogs */}
      <div className="mx-2 xl:mx-36 overflow-hidden bg-[#1D5C7580]">
        <div className="grid grid-cols-1 md:grid-cols-10 xl:grid-cols-12">
          {/* YOUTUBE*/}
          <div className="order-1 md:order-0 col-start-1 md:col-span-6 xl:col-span-8 bg-[#D1212780]">
            <div className="flex flex-col gap-6 px-6 py-8">
              <h2
                className={`${merri.className} text-[24px] text-center md:text-left text-white font-bold`}
              >
                LATEST ON YOUTUBE
              </h2>

              <YouTubeSection videos={videos} count={2} layout="row" />
            </div>
          </div>

          {/* BLOG */}
          <div className="order-2 md:order-0 md:col-start-7 xl:col-start-9 col-span-4 bg-[#47ABD880]">
            <div className="flex flex-col px-6 py-8">
              <h2
                className={`${merri.className} text-white font-bold text-[24px] text-center md:text-left`}
              >
                ON OUR BLOG
              </h2>

              <LatestBlogs />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  )
}
