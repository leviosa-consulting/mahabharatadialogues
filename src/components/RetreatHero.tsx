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

  const getDateRange = (retreat: Retreat) => {
    const endDate = retreat.day3 ? retreat.day3.date : retreat.day2.date
    return `${retreat.day1.date} - ${endDate}`
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
        <div
          className="w-full"
          style={{
            backgroundImage: `
      linear-gradient(
        rgba(255, 255, 255, 0.6),
        rgba(255, 255, 255, 0.6)
      ),
      url('/MD-Texture_BG_White-04.png')
    `,
            backgroundRepeat: 'repeat',
            backgroundSize: '240px 240px',
          }}
        >
          <div className="sm:hidden py-10">
            {/* Web Asset */}
            <Link
              href="/"
              className="flex justify-center items-center relative z-20"
            >
              <img
                src="/Web_Assets-08.png"
                alt="Home"
                className="w-35 h-35 -mb-20 cursor-pointer"
              />
            </Link>
          </div>
          <div className="hidden sm:block relative sm:pt-10 z-10">
            <Navbar textColor="#1D5C75" isNotHome />
          </div>

          {/* Video */}
          {youtubeEmbedUrl && (
            <div className="mx-4 2xl:mx-30 md:-mt-10 xl:-mt-8">
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
          <div className="w-full bg-[#1D5C75] -mt-[5vh] md:-mt-[20vh] pt-[10vh] md:pt-[20vh] pb-[5vh]">
            <div className="mx-4 2xl:mx-30">
              <div className="grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                <div className="w-full order-1 sm:order-0 md:col-start-1 lg:col-start-2 col-span-6 md:my-6">
                  <div className="text-center md:text-left">
                    <p
                      className={`${merri.className} text-[20px] text-[#78B0C7] font-bold my-6`}
                    >
                      UPCOMING RETREAT
                    </p>
                    <h2
                      className={`font-neco text-[28px] leading-none text-white font-bold`}
                    >
                      Mahabharata Dialogues
                    </h2>
                    <h1
                      className={`${merri.className} text-[44px] leading-none text-white font-extrabold italic mb-6`}
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
                <div className="w-full order-2 sm:order-0 md:col-start-8 xl:col-start-9 col-span-5 lg:col-span-4 xl:col-span-3">
                  <div className="flex flex-col justify-between gap-6 md:mt-24">
                    <div className="">
                      <CustomButton
                        text="EXPERIENCE THE RETREAT"
                        bgColor="#D12127"
                        textColor="#FFFFFF"
                        isOutSideLink
                        url={upcomingRetreat.bookingUrl || '#'}
                      />
                    </div>

                    <div className="text-center md:text-left">
                      <p className="font-neco font-bold text-[28px] text-white flex items-center gap-1 justify-center md:justify-start">
                        <span>₹</span>
                        <span>
                          {upcomingRetreat.price?.toLocaleString('en-IN')}
                        </span>
                      </p>

                      <p className="font-neco font-normal text-[18px] text-white">
                        {upcomingRetreat.inclusions}
                      </p>
                    </div>
                    <div className="">
                      <CustomButton
                        text="SCHEDULE"
                        bgColor="#1D5C75"
                        textColor="#FFFFFF"
                        isBorder
                        borderColor="#FFFFFF"
                        url={getScheduleUrl(upcomingRetreat)}
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
              <div className="mx-4 2xl:mx-30">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-14 sm:gap-4 overflow-hidden">
                  {pastRetreats.map((retreat, index) => (
                    <div
                      key={retreat.id}
                      className={`w-full ${
                        index % 2 === 0
                          ? 'md:col-start-1 lg:col-start-2 col-span-6 lg:col-span-5'
                          : 'md:col-start-7 lg:col-start-8 col-span-6 lg:col-span-5'
                      } ${index > 0 ? 'mt-12 md:mt-0' : ''}`}
                    >
                      <div className="flex flex-col justify-between text-center md:text-left">
                        {index === 0 && (
                          <p
                            className={`${merri.className} text-[20px] text-[#4298BA] font-bold mb-6`}
                          >
                            PAST RETREATS
                          </p>
                        )}
                        <h3
                          className={`font-neco text-[28px] leading-none text-[#1D5C75] font-bold ${
                            index % 2 === 1 ? 'mt-0 md:mt-[55px]' : ''
                          }`}
                        >
                          Mahabharata Dialogues
                        </h3>

                        <h2
                          className={`${merri.className} text-[44px] leading-none text-[#1D5C75] font-extrabold italic mb-6`}
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
                          {retreat.venue}, {retreat.city}
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
                      <div className="text-center md:text-left">
                        <p
                          className={`${merri.className} text-[20px] text-[#1D5C75] font-light italic py-6 lg:pr-12`}
                        >
                          {retreat.description ||
                            'A memorable retreat experience.'}
                        </p>
                        <CustomButton
                          text="SEE THE MAGIC WE CREATED"
                          bgColor="#1D5C75"
                          textColor="#FFFFFF"
                          url={getPastRetreatUrl(retreat)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* youtube/blogs */}
          <div>
            <div className="mx-4 sm:mx-4 xl:mx-30 overflow-hidden bg-[#1D5C7580]">
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
