import React from 'react'
import CustomButton from './CustomButton'
import YouTubeSection from './YouTubeSection'

const Retreats = () => {
  return (
    <section
      className="w-full overflow-hidden flex flex-col justify-center "
      style={{
        backgroundImage: "url('/Blue_Background_with_Texture-01.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-2 xl:mx-36 overflow-hidden bg-[#1D5C7580]">
        <div className="grid grid-cols-1 sm:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 p-10 ">
          <div className="col-start-1 col-span-6 py-10">
            <div className="p-2 flex flex-col gap-6">
              <h2 className="font-neco text-[32px] text-white font-bold">
                Our Retreats
              </h2>
              <p className="font-merii italic font-light text-[18px] md:text-[24px] text-white">
                Mahabharata Dialogues is a collective dadada dad which meets on
                the 4th Saturday of every month on new topics dada da da.
                Mahabharata Dialogues is a collective dadada dad which meets on
                the
              </p>
              <CustomButton
                text="LEARN MORE"
                bgColor="#47ABD880"
                textColor="#FFFFFF"
                url="/retreats"
              />
            </div>
          </div>
          <div className="col-start-7 col-span-6 ">
            <img
              src="/assets/videoImg.png"
              alt="videoImg"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* blogs */}
      <div className="mx-2 xl:mx-36 overflow-hidden bg-[#1D5C7580]">
        <div className="grid grid-cols-1 sm:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 ">
          <div className="col-start-1 col-span-8  bg-[#D1212780]">
            <div className="flex flex-col gap-6 px-6 py-8">
              <h2 className="font-merri text-[24px] text-white font-bold">
                LATEST ON YOUTUBE
              </h2>
              <div className="hidden flex-col gap-6">
                {/* youtube */}
                <div className="flex gap-3 items-center">
                  <div className="w-[284px] aspect-284/186">
                    <iframe
                      src="https://www.youtube.com/embed/tw7d2hMHyRY"
                      title="YouTube video"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="text-white max-w-[300px]">
                    <h2 className="font-merri font-bold text-[18px]">
                      Feb 28, 2025
                    </h2>
                    <p className="font-neco font-bold text-[18px] underline">
                      A Weekend of Wisdom: Inside the Mahabharata Retreat
                      (Second Edition) Experience
                    </p>
                  </div>
                </div>
                {/* youtube */}
                <div className="flex gap-3 items-center">
                  <div className="w-[284px] aspect-284/186">
                    <iframe
                      src="https://www.youtube.com/embed/vzIB3zXqMVk"
                      title="YouTube video"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="text-white max-w-[300px]">
                    <h2 className="font-merri font-bold text-[18px]">
                      Jan 24, 2025
                    </h2>
                    <p className="font-neco font-bold text-[18px] underline">
                      Join us for a 2-day Mahabharata Retreat at Fireflies
                      Ashram!
                    </p>
                  </div>
                </div>
              </div>
              <YouTubeSection />
            </div>
          </div>
          <div className="col-start-9 col-span-4 bg-[#47ABD880]">
            <div className="flex flex-col px-6 py-8">
              <h2 className="font-merri text-white font-bold text-[24px]">
                ON OUR BLOG
              </h2>

              <div className="flex flex-col w-full mt-12 gap-12">
                <div className="text-white max-w-[300px] flex flex-col gap-2">
                  <h2 className="font-merri font-bold text-[18px]">
                    Dec 25, 2024
                  </h2>
                  <p className="font-neco font-bold text-[18px] underline">
                    Beginning, Middle and End
                  </p>
                </div>

                <div className="text-white max-w-[300px] flex flex-col gap-2">
                  <h2 className="font-merri font-bold text-[18px]">
                    Dec 25, 2024
                  </h2>
                  <p className="font-neco font-bold text-[18px] underline">
                    Ashvatthama's curse
                  </p>
                </div>

                <div className="text-white max-w-[300px] flex flex-col gap-2">
                  <h2 className="font-merri font-bold text-[18px]">
                    Dec 25, 2024
                  </h2>
                  <p className="font-neco font-bold text-[18px] underline">
                    The 18 parva classification of Mahabharata
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="flex flex-col justify-center items-center text-white text-[32px] font-bold font-neco my-16">
        <p>mahabharatadialogues@gmail.com</p>
        <p>+91 00000 00000</p>
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-[#D9D9D9]"></div>
          <div className="w-8 h-8 bg-[#D9D9D9]"></div>
          <div className="w-8 h-8 bg-[#D9D9D9]"></div>
        </div>
      </div>

      <div className="bg-[#1D5C7580] h-12"></div>
    </section>
  )
}

export default Retreats
