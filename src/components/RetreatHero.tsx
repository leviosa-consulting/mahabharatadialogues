import { merri } from '@/app/fonts/merri'
import React from 'react'
import CustomButton from './CustomButton'
import LatestBlogs from '@/lib/LatestBlogs'
import YouTubeSection from './YouTubeSection'
import { getLatestVideos } from '@/lib/youtube'
import Footer from './Footer'
import { adminDB } from '@/firebase/firebaseAdmin'
import Link from 'next/link'
import Navbar from './Navbar'
import MobileNavbar from './MobileNavbar'
import MobileNavbarScroll from './MobileNavbarScroll'
import CustomButtonRetreat from './CustomButtonRetreat'

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
  city?: string
  price?: string
  inclusions?: string
  youtube_video?: string
  photos?: string[]
  bookingUrl?: string
  day1: DaySchedule
  day2: DaySchedule
  day3?: DaySchedule
  created_at: string
}

const parseDate = (dateStr: string): Date => {
  const months: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
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

  const upcomingRetreat = retreats.find((r) => isUpcoming(r.day1.date))
  const pastRetreats = retreats.filter((r) => !isUpcoming(r.day1.date))

  const getScheduleUrl = (retreat: Retreat) => {
    return retreat.slug
      ? `/retreats/schedule/${retreat.slug}`
      : `/retreats/schedule/${retreat.id}`
  }

  const getPastRetreatUrl = (retreat: Retreat) => {
    return retreat.slug
      ? `/retreats/past/${retreat.slug}`
      : `/retreats/past/${retreat.id}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)

    const day = date.getDate()
    const month = date.toLocaleString('en-US', { month: 'long' })
    const year = date.getFullYear()

    return { day, month, year }
  }

  const getDateRange = (retreat: Retreat) => {
    const start = formatDate(retreat.day1.date)
    const endDateStr = retreat.day3 ? retreat.day3.date : retreat.day2.date
    const end = formatDate(endDateStr)

    if (start.month === end.month && start.year === end.year) {
      return `${start.day} - ${end.day} ${start.month}. ${start.year}`
    }

    return `${start.day} ${start.month}. ${start.year} - ${end.day} ${end.month}. ${end.year}`
  }

  const getYoutubeEmbedUrl = (url: string): string | null => {
    try {
      const urlObj = new URL(url)
      let videoId = ''

      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || ''
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1)
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    } catch {
      return null
    }
  }

  const youtubeEmbedUrl = upcomingRetreat?.youtube_video
    ? getYoutubeEmbedUrl(upcomingRetreat.youtube_video)
    : null

  return (
    <div>
      <div className="w-full">
        <div className="w-full">
          <div>
            <MobileNavbar textColor="#1D5C75" isNotHome />
            <MobileNavbarScroll textColor="#1D5C75" showOnScrollUp={true} />
          </div>
          <div className="hidden sm:block relative pt-5 z-10">
            <Navbar textColor="#1D5C75" isNotHome />
          </div>

          {/* Video */}
          {youtubeEmbedUrl && (
            <div className="mx-4 xl:mx-30 -mt-7 md:-mt-10 xl:-mt-8">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10">
                  <div className="w-full aspect-video relative ">
                    <iframe
                      src={youtubeEmbedUrl}
                      title="Join us for a 2-day Mahabharata Retreat"
                      className="w-full h-full shadow-xl"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {upcomingRetreat && (
          <div
            className="w-full -mt-[5vh] md:-mt-[40vh] pt-[10vh] md:pt-[40vh] pb-[5vh]"
            style={{
              backgroundImage: `
    linear-gradient(#1D5C75CC, #1D5C75CC),
    url('/MD-Texture_BG_Blue-01-04.png')
  `,
              backgroundRepeat: 'repeat',
              backgroundSize: '240px 240px',
            }}
          >
            <div className="mx-4 xl:mx-30">
              <div className="grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                <div className="w-full order-1 sm:order-0 md:col-start-1 lg:col-start-2 col-span-6 md:my-6">
                  <div className="text-center md:text-left">
                    <p
                      className={`${merri.className} text-[20px] text-[#78B0C7] font-bold my-6`}
                    >
                      UPCOMING RETREAT
                    </p>
                    <h2
                      className={`font-neco text-[24px] leading-none text-white font-bold`}
                    >
                      Mahabharata Dialogues
                    </h2>
                    <h1
                      className={`${merri.className} text-[44px] leading-none text-white font-extrabold italic mb-6`}
                    >
                      {upcomingRetreat.title}
                    </h1>
                    <p
                      className={`${merri.className} text-white text-[16px] md:text-[18px] font-bold`}
                    >
                      {getDateRange(upcomingRetreat)}
                    </p>
                    <h4
                      className={`${merri.className} text-white text-[16px] md:text-[18px] font-normal italic leading-6 pb-2`}
                    >
                      {upcomingRetreat.venue}, {upcomingRetreat.city}
                    </h4>
                    <p
                      className={`${merri.className} text-[20px] text-white font-light italic py-6 lg:pr-19`}
                    >
                      {upcomingRetreat.description ||
                        'Join us for an immersive retreat experience.'}
                    </p>
                  </div>
                </div>
                <div className="w-full order-2 sm:order-0 md:col-start-8  col-span-5 lg:col-span-4">
                  <div className="flex flex-col items-center md:items-start gap-6 md:mt-24">
                    {/* TOP BUTTON */}
                    <div className="w-full flex justify-center md:justify-start">
                      <CustomButtonRetreat
                        text="EXPERIENCE THE RETREAT"
                        bgColor="#D12127"
                        textColor="#FFFFFF"
                        isOutSideLink
                        url={upcomingRetreat.bookingUrl || '#'}
                      />
                    </div>

                    {/* PRICE + CONTENT */}
                    <div className="text-center flex justify-between md:text-left">
                      <p className="font-neco px-4 py-2 border-r font-bold text-white flex items-center gap-1 justify-center md:justify-start">
                        <span className="text-[16px] leading-none">₹</span>
                        <span className="text-[28px] leading-none">
                          {upcomingRetreat.price?.toLocaleString('en-IN')}
                        </span>
                      </p>

                      <p className="font-neco px-8 py-2 font-normal text-[18px] text-white">
                        {upcomingRetreat.inclusions}
                      </p>
                    </div>

                    {/* BOTTOM BUTTON */}
                    <div className="w-full flex justify-center md:justify-start">
                      <CustomButtonRetreat
                        text="SEE THE SCHEDULE"
                        bgColor="#1D5C75"
                        textColor="#FFFFFF"
                        url={getScheduleUrl(upcomingRetreat)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className="w-full"
          style={{
            backgroundImage: `
    linear-gradient(
      to bottom,
      #47ABD880 50%,
      #1D5C75 100%
    ),
    url('/MD-Texture_BG_Blue-01-04.png')
  `,
            backgroundRepeat: 'repeat',
            backgroundSize: 'cover, 240px 240px',
            backgroundPosition: 'center, top left',
          }}
        >
          {/* PAST RETREATS */}
          {pastRetreats.length > 0 && (
            <div className="w-full pt-8 pb-30">
              <div className="py-10">
                <p
                  className={`${merri.className} font-bold text-[24px] text-[#1D5C75] text-center`}
                >
                  PAST RETREATS
                </p>
              </div>
              <div className="mx-4 xl:mx-30">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 overflow-hidden">
                  {pastRetreats.map((retreat, index) => (
                    <div
                      key={retreat.id}
                      className="w-full md:col-span-12 lg:col-span-10 lg:col-start-2"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? '#1D5C75' : '#D9D9D9E5',
                      }}
                    >
                      <div
                        className={`grid grid-cols-1 md:grid-cols-2  items-center`}
                      >
                        {/* Text Content */}
                        <div className="flex flex-col justify-center text-center md:text-left px-6 py-10">

                          <div className='md:hidden'>
                             {retreat.photos && retreat.photos.length > 0 ? (
                            <img
                              src={retreat.photos[0]}
                              alt={retreat.title}
                              className="w-full h-auto object-cover"
                            />
                          ) : (
                            <img
                              src="/assets/eight.png"
                              alt=""
                              className="w-full h-auto object-cover"
                            />
                          )}
                          </div>
                          <h3
                            className="font-neco text-[24px] mt-8 md:mt-0 leading-none font-bold"
                            style={{
                              color: index % 2 === 0 ? '#FFFFFF' : '#1D5C75',
                            }}
                          >
                            Mahabharata Dialogues
                          </h3>

                          <h2
                            className={`${merri.className} text-[44px] leading-none font-extrabold italic mb-6`}
                            style={{
                              color: index % 2 === 0 ? '#FFFFFF' : '#1D5C75',
                            }}
                          >
                            {retreat.title}
                          </h2>

                          <h3
                            className={`${merri.className} text-[16px] md:text-[18px] font-bold`}
                            style={{
                              color: index % 2 === 0 ? '#FFFFFF' : '#1D5C75',
                            }}
                          >
                            {getDateRange(retreat)}
                          </h3>
                          <p
                            className={`${merri.className} text-[16px] md:text-[18px] font-normal leading-6 pb-2`}
                            style={{
                              color: index % 2 === 0 ? '#FFFFFF' : '#1D5C75',
                            }}
                          >
                            {retreat.venue}, {retreat.city}
                          </p>

                          <p
                            className={`${merri.className} font-light text-[16px] md:text-[18px] italic py-6 lg:pr-4`}
                            style={{
                              color: index % 2 === 0 ? '#FFFFFF' : '#1D5C75',
                            }}
                          >
                            {retreat.description ||
                              'A memorable retreat experience.'}
                          </p>

                          <div className="text-center md:text-left">
                            <CustomButton
                              text="SEE THE MAGIC WE CREATED"
                              bgColor={index % 2 === 0 ? '#78B0C7' : '#1D5C75'}
                              textColor="#FFFFFF"
                              url={getPastRetreatUrl(retreat)}
                            />
                          </div>
                        </div>

                        {/* Image  */}
                        <div className='hidden md:block'>
                          {retreat.photos && retreat.photos.length > 0 ? (
                            <img
                              src={retreat.photos[0]}
                              alt={retreat.title}
                              className="w-full h-auto object-cover md:pr-6"
                            />
                          ) : (
                            <img
                              src="/assets/eight.png"
                              alt=""
                              className="w-full h-auto object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* youtube/blogs */}
          <div>
            <div className="mx-4 xl:mx-40 overflow-hidden bg-[#1D5C7580]">
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
    </div>
  )
}
