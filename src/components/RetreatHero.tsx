import { merri } from '@/app/fonts/merri'
import React from 'react'
import CustomButton from './CustomButton'

const RetreatHero = () => {
  return (
    <div className="w-full">
      {/* WHITE SECTION */}
      <div className="w-full bg-white">
        <div className="mx-2 sm:mx-4 xl:mx-20">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-start-2 col-span-10">
              {/* Video */}
              <div className="w-full aspect-video relative z-10">
                <iframe
                  src="https://www.youtube.com/embed/vzIB3zXqMVk?start=64"
                  title="Join us for a 2-day Mahabharata Retreat at Fireflies Ashram!"
                  className="w-full h-full shadow-xl"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BLUE SECTION */}
      <div
        className="
          w-full
          bg-[#1D5C75]
          -mt-[20vh]
          pt-[20vh]
          pb-[5vh]
        "
      >
        {/* upcoming retreats */}
        <div className="mx-2 sm:mx-4 xl:mx-20">
          <div className="grid grid-cols-12 gap-3">
            <div className="w-full col-start-2 col-span-6 my-6">
              <div>
                <p
                  className={`${merri.className} text-[20px] text-[#78B0C7] font-bold`}
                >
                  UPCOMING RETREATS
                </p>
                <h2 className={`font-neco text-[32px] text-white font-bold`}>
                  Mahabharata Dialogues
                </h2>
                <h1
                  className={`${merri.className} text-[44px] text-white font-extrabold italic`}
                >
                  The Retreat 3.0
                </h1>
                <p
                  className={`${merri.className} text-[20px] text-white italic font-bold`}
                >
                  10 - 11 February. 2026
                </p>
                <h4
                  className={`${merri.className} text-[20px] text-white font-normal italic`}
                >
                  Fireflies, Kanakpura Road, Bengaluru
                </h4>
                <p
                  className={`${merri.className} text-[20px] text-white font-light italic py-6 pr-9`}
                >
                  A brief about Retreat dada da dada dadadada Mahabharata
                  Dialogues is a collective dadada dad which meets on the 4th
                  Saturday of every month on new topics dada da da.{' '}
                </p>
              </div>
            </div>
            <div className="w-full col-start-8 col-span-4 ">
              <div className="flex flex-col justify-between gap-6 mt-10">
                <div>
                  <CustomButton
                    text="EXPERIENCE THE RETREAT"
                    bgColor="#D12127"
                    textColor="#FFFFFF"
                    url="#"
                  />
                </div>

                <div>
                  <p className="font-neco font-bold text-[18px] text-white">
                    21,ooo/- Early Bird offer
                  </p>
                  <p className="font-neco font-normal text-[18px] text-white">
                    25,000/- January onwards
                  </p>
                  <p className="font-neco font-normal text-[18px] text-white">
                    Includes stay, 2 meals and 2 snacks
                  </p>
                </div>
                <div className="border border-white">
                  <CustomButton
                    text="SCHEDULE COMING SOON"
                    bgColor="#1D5C75"
                    textColor="#FFFFFF"
                    url="#"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* past retreats */}
      <div
        className="w-full h-screen bg-[#47ABD880]"
      >
        <div className='mx-2 sm:mx-4 xl:mx-20'>
          <div className='grid grid-cols-12 gap-3'>
            <div className="w-full h-40 bg-gray-400"></div>
            <div className="w-full h-40 bg-gray-400"></div>
            <div className="w-full h-40 bg-gray-400"></div>
            <div className="w-full h-40 bg-gray-400"></div>
            <div className="w-full h-40 bg-gray-400"></div>
            <div className="w-full h-40 bg-gray-400"></div>
            <div className="w-full h-40 bg-gray-400"></div>
            <div className="w-full h-40 bg-gray-400"></div>
            <div className="w-full h-40 bg-gray-400"></div>
            <div className="w-full h-40 bg-gray-400"></div>
            <div className="w-full h-40 bg-gray-400"></div>
            <div className="w-full h-40 bg-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RetreatHero
