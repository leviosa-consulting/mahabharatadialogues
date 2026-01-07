import { merri } from '@/app/fonts/merri'
import React from 'react'
import CustomButton from './CustomButton'
import LatestBlogs from '@/lib/LatestBlogs'
import YouTubeSection from './YouTubeSection'
import { getLatestVideos } from '@/lib/youtube'
import Footer from './Footer'
import { adminDB } from '@/firebase/firebaseAdmin'

interface DaySchedule {
  date: string
  dayName: string
  schedule: any[]
}

interface Retreat {
  id: string
  slug?: string
  title: string
  description?: string
  venue?: string
  youtube_video?: string
  photos?: string[]
  day1: DaySchedule
  day2: DaySchedule
  day3?: DaySchedule
  created_at: string
}

// Helper to parse "03 Aug 2024" format to Date
const parseDate = (dateStr: string): Date => {
  const months: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  }
  const parts = dateStr.split(' ')
  const day = parseInt(parts[0])
  const month = months[parts[1]]
  const year = parseInt(parts[2])
  return new Date(year, month, day)
}

const isUpcoming = (dateStr: string): boolean => {
  const retreatDate = parseDate(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return retreatDate >= today
}

async function getRetreats() {
  try {
    const snapshot = await adminDB
      .collection('retreats')
      .orderBy('created_at', 'desc')
      .get()

    const retreats: Retreat[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Retreat[]

    // Sort: upcoming first, then past
    const sorted = retreats.sort((a, b) => {
      const dateA = parseDate(a.day1.date)
      const dateB = parseDate(b.day1.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const isUpcomingA = dateA >= today
      const isUpcomingB = dateB >= today

      if (isUpcomingA && !isUpcomingB) return -1
      if (!isUpcomingA && isUpcomingB) return 1

      if (isUpcomingA && isUpcomingB) {
        return dateA.getTime() - dateB.getTime()
      } else {
        return dateB.getTime() - dateA.getTime()
      }
    })

    return sorted
  } catch (error) {
    console.error('Error fetching retreats:', error)
    return []
  }
}

export default async function RetreatHero() {
  const videos = await getLatestVideos()
  const retreats = await getRetreats()

  // Get upcoming retreat (only the first one)
  const upcomingRetreat = retreats.find(r => isUpcoming(r.day1.date))
  
  // Get past retreats (already sorted with most recent past first)
  const pastRetreats = retreats.filter(r => !isUpcoming(r.day1.date))

  const getRetreatUrl = (retreat: Retreat) => {
    return retreat.slug ? `/retreats/${retreat.slug}` : `/retreats/${retreat.id}`
  }

  const getDateRange = (retreat: Retreat) => {
    const endDate = retreat.day3 ? retreat.day3.date : retreat.day2.date
    return `${retreat.day1.date} - ${endDate}`
  }

  return (
    <div>
      <div
        className="w-full"
        style={{
          background: `
      linear-gradient(
        to bottom,
        #FFFFFF 0%,
        #47ABD880 50%,
        #1D5C75 100%
      )
    `,
        }}
      >
        {/* WHITE SECTION */}
        <div className="w-full ">
          <div className="mx-2 xl:mx-0 2xl:mx-20">
            <div className="grid  grid-cols-12 gap-3">
              <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10">
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

        {/* BLUE SECTION - UPCOMING RETREATS */}
        {upcomingRetreat && (
          <div
            className="
          w-full
          bg-[#1D5C75]
          -mt-[5vh]
          md:-mt-[20vh]
          pt-[20vh]
          pb-[5vh]
        "
          >
            <div className="mx-4 2xl:mx-20">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 overflow-hidden">
                <div className="w-full order-1 sm:order-0 md:col-start-1 lg:col-start-2 col-span-6 md:my-6">
                  <div>
                    <p
                      className={`${merri.className} text-[20px] text-[#78B0C7] font-bold`}
                    >
                      UPCOMING RETREATS
                    </p>
                    <h2 className={`font-neco text-[28px] text-white font-bold`}>
                      Mahabharata Dialogues
                    </h2>
                    <h1
                      className={`${merri.className} text-[44px] text-white font-extrabold italic`}
                    >
                      {upcomingRetreat.title}
                    </h1>
                    <p
                      className={`${merri.className} text-[20px] text-white italic font-bold`}
                    >
                      {getDateRange(upcomingRetreat)}
                    </p>
                    <h4
                      className={`${merri.className} text-[20px] text-white font-normal italic`}
                    >
                      {upcomingRetreat.venue || 'Fireflies, Kanakpura Road, Bengaluru'}
                    </h4>
                    <p
                      className={`${merri.className} text-[20px] text-white font-light italic py-6 lg:pr-19`}
                    >
                      {upcomingRetreat.description || 'Join us for an immersive retreat experience.'}
                    </p>
                  </div>
                </div>
                <div className="w-full order-2 sm:order-0 md:col-start-8 col-span-5 lg:col-span-4 ">
                  <div className="flex flex-col justify-between gap-6 lg:mt-10">
                    <div className='w-full'>
                      <CustomButton
                        text="EXPERIENCE THE RETREAT"
                        bgColor="#D12127"
                        textColor="#FFFFFF"
                        url="#"
                      />
                    </div>

                    <div>
                      <p className="font-neco font-bold text-[18px] text-white">
                        21,000/- Early Bird offer
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
                        text="SCHEDULE"
                        bgColor="#1D5C75"
                        textColor="#FFFFFF"
                        url={getRetreatUrl(upcomingRetreat)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full">
          {/* PAST RETREATS */}
          {pastRetreats.length > 0 && (
            <div className="w-full pt-8 pb-30">
              <div className="mx-4 sm:mx-4 xl:mx-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 overflow-hidden">
                  {pastRetreats.map((retreat, index) => (
                    <div
                      key={retreat.id}
                      className={`w-full ${
                        index % 2 === 0
                          ? 'md:col-start-1 lg:col-start-2 col-span-6 lg:col-span-5'
                          : 'md:col-start-7 lg:col-start-8 col-span-6 lg:col-span-5'
                      }`}
                    >
                      <div className="flex flex-col justify-between gap-3">
                        {index === 0 && (
                          <p
                            className={`${merri.className} text-[20px] text-[#4298BA] font-bold `}
                          >
                            PAST RETREATS
                          </p>
                        )}
                        <h3
                          className={`font-neco text-[28px] text-[#1D5C75] font-bold ${
                            index % 2 === 1 ? 'mt-8 lg:mt-14' : ''
                          }`}
                        >
                          Mahabharata Dialogues
                        </h3>
                        <h2
                          className={`${merri.className} text-[44px] text-[#1D5C75] font-extrabold italic`}
                        >
                          {retreat.title}
                        </h2>
                        <h3
                          className={`${merri.className} text-[20px] text-[#1D5C75] italic font-bold`}
                        >
                          {getDateRange(retreat)}
                        </h3>
                        <p
                          className={`${merri.className} text-[20px] text-[#1D5C75] font-normal italic pb-2`}
                        >
                          {retreat.venue || 'Fireflies, Kanakpura Road, Bengaluru'}
                        </p>
                      </div>

                      <div>
                        {retreat.photos && retreat.photos.length > 0 ? (
                          <img 
                            src={retreat.photos[0]} 
                            alt={retreat.title}
                            className="w-full h-auto object-cover"
                          />
                        ) : (
                          <img src="/assets/eight.png" alt="" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`${merri.className} text-[20px] text-[#1D5C75] font-light italic py-6 lg:pr-19`}
                        >
                          {retreat.description || 'A memorable retreat experience.'}
                        </p>
                        <CustomButton
                          text="SEE THE MAGIC WE CREATED"
                          bgColor="#1D5C75"
                          textColor="#FFFFFF"
                          url={getRetreatUrl(retreat)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* youtube/blogs */}
          <div className=" ">
            <div className="mx-4 sm:mx-4 xl:mx-20 overflow-hidden bg-[#1D5C7580]">
              <div className="grid grid-cols-1 md:grid-cols-10 xl:grid-cols-12">
                {/* YOUTUBE*/}
                <div className="order-1 md:order-0 col-start-1 md:col-span-6 xl:col-span-8 bg-[#D1212780]">
                  <div className="flex flex-col gap-6 px-6 py-8">
                    <h2
                      className={`${merri.className} text-[24px] text-center md:text-left text-white font-bold`}
                    >
                      LATEST ON YOUTUBE
                    </h2>

                    <YouTubeSection videos={videos} count={1} layout="row" />
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

                    <LatestBlogs count={2} />
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
      {/* bg */}
      <div className="bg-[#124056] py-6 w-full"></div>
    </div>
  )
}