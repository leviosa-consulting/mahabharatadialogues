// app/retreats/[slug]/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { merri } from '@/app/fonts/merri'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import MobileNavbar from '@/components/MobileNavbar'
import Footer from '@/components/Footer'
import RetreatScheduleShimmer from '@/components/shimmer/RetreatScheduleShimmer'
import NavbarScroll from '@/components/NavbarScroll'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
// import FooterBridge from '@/components/FooterBridge'

interface ScheduleItem {
  title: string
  description: string
  time: string
}

interface ScheduleSection {
  type: 'meal' | 'activities'
  title?: string
  time?: string
  items?: ScheduleItem[]
}

interface DaySchedule {
  date: string
  dayName: string
  schedule: ScheduleSection[]
}

interface Retreat {
  id: string
  slug?: string
  title: string
  description?: string
  venue?: string
  city?: string
  youtube_video?: string
  photos?: string[]
  footerNotes?: string
  day1: DaySchedule
  day2: DaySchedule
  day3?: DaySchedule
}

export default function RetreatClient({ retreat }: any) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return

      if (e.key === 'ArrowLeft') {
        navigateImage('prev')
      } else if (e.key === 'ArrowRight') {
        navigateImage('next')
      } else if (e.key === 'Escape') {
        closeLightbox()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex])

  const renderScheduleSection = (
    section: ScheduleSection,
    index: number,
    isLastActivity: boolean,
    isThreeDayRetreat: boolean,
  ) => {
    if (section.type === 'meal') {
      return (
        <div
          key={index}
          className={`bg-[#78B0C7] text-white ${merri.className} px-2 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center`}
        >
          <span
            className={`${merri.className} font-bold text-[16px] md:text-[18px]`}
          >
            {section.title}
          </span>
          <span
            className={`${merri.className} text-[16px] md:text-[18px] font-bold leading-none`}
          >
            {section.time}
          </span>
        </div>
      )
    }

    return (
      <div key={index} className="space-y-2">
        {section.items?.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className="flex justify-between items-start px-2 pt-4"
          >
            <div className="flex-1">
              <div className={`flex items-start ${merri.className}`}>
                <span className="text-2xl leading-none">•</span>
                <span
                  className={`${merri.className} font-bold text-[16px] md:text-[18px] pl-2 leading-none`}
                >
                  {item.title}
                </span>
              </div>

              {item.description && (
                <div
                  className={`text-sm text-gray-600 mt-0.5 ${
                    merri.className
                  } px-[19px] ${
                    isThreeDayRetreat ? '2xl:w-[90%]' : 'md:w-full'
                  } ${itemIndex === section.items!.length - 1 ? 'pb-8' : ''}`}
                >
                  {item.description}
                </div>
              )}
            </div>
            <div
              className={`${merri.className} text-[16px] md:text-[18px] font-bold whitespace-nowrap ml-4 leading-none`}
            >
              {item.time}
            </div>
          </div>
        ))}
      </div>
    )
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

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImageIndex(null)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null || !retreat?.photos) return

    if (direction === 'prev') {
      setSelectedImageIndex(
        selectedImageIndex === 0
          ? retreat.photos.length - 1
          : selectedImageIndex - 1,
      )
    } else {
      setSelectedImageIndex(
        selectedImageIndex === retreat.photos.length - 1
          ? 0
          : selectedImageIndex + 1,
      )
    }
  }

  const days = [
    { day: 1, date: retreat.day1.date, dayName: retreat.day1.dayName },
    { day: 2, date: retreat.day2.date, dayName: retreat.day2.dayName },
  ]

  if (retreat.day3) {
    days.push({
      day: 3,
      date: retreat.day3.date,
      dayName: retreat.day3.dayName,
    })
  }

  const isThreeDay = !!retreat.day3

  const youtubeEmbedUrl = retreat.youtube_video
    ? getYoutubeEmbedUrl(retreat.youtube_video)
    : null

  return (
    <div className="min-h-screen">
      <div className="sm:hidden">
        <div>
          <MobileNavbar textColor="#1D5C75" isNotHome />
           <MobileNavbarScroll textColor="#1D5C75" showOnScrollUp={true} />
        </div>
      </div>
      <div className="hidden sm:block relative pt-5  z-10">
        <Navbar textColor="#1D5C75" isNotHome />
      </div>
      <NavbarScroll textColor="#1D5C75" />

      {/* Header */}
      <div className="bg-[#282828] text-white py-12 md:py-24 px-6 -mt-7 md:-mt-10 xl:-mt-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Left */}
          <div className={`text-center md:text-left`}>
            <div
              className={`font-neco text-[24px] leading-none text-white font-bold mb-2`}
            >
              Mahabharata Dialogues
            </div>
            <h1
              className={`${merri.className} text-[44px] leading-none text-white font-extrabold italic mb-6`}
            >
              The Retreat
            </h1>

            <div className="flex flex-col items-center justify-center md:justify-start md:items-start">
              <span
                className={`${merri.className} text-white text-[16px] md:text-[18px] font-bold`}
              >
                {retreat.day1.date} <span className="mx-1">–</span>{' '}
                {isThreeDay ? retreat.day3!.date : retreat.day2.date}
              </span>
              {retreat.venue && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span
                    className={`text-sm  md:text-base text-white/90 ${merri.className}`}
                  >
                    {retreat.venue}, {retreat.city}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-38 bg-white/60" />

          {/* Right */}
          <div className="text-center md:text-left md:max-w-lg">
            <p className="text-lg italic leading-relaxed font-neco">
              {retreat.description}
            </p>
          </div>
        </div>
      </div>

      {/* Day circles - Desktop */}
      <div
        className={`hidden md:grid ${
          isThreeDay ? 'md:grid-cols-3' : 'md:grid-cols-2'
        } relative z-10 -mt-18 lg:mx-10 xl:mx-25`}
      >
        {days.map((dayInfo) => (
          <div key={dayInfo.day} className="flex items-center justify-center">
            <div
              className={`w-70 ${merri.className} h-36  rounded-md bg-[#1D5C75] shadow-xl text-white flex items-center justify-center`}
            >
              <div className="text-center leading-tight">
                <div className="text-xs tracking-wide mb-1">
                  -DAY {dayInfo.day}-
                </div>
                <div className="text-xl md:text-2xl font-semibold">
                  {dayInfo.date}
                </div>
                <div className="text-sm mt-1">{dayInfo.dayName}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Day circle Mobile - Day 1 */}
      <div
        className={`md:hidden flex justify-center items-center mt-4 ${merri.className}`}
      >
        <div className="w-40 h-40 rounded-full bg-[#D12127] shadow-xl text-white flex items-center justify-center">
          <div className="text-center leading-tight">
            <div className="text-xs tracking-wide mb-1">-DAY 1-</div>
            <div className="text-xl font-semibold">{days[0].date}</div>
            <div className="text-sm mt-1">{days[0].dayName}</div>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div
        className={`grid grid-cols-1 md:mt-8 ${
          isThreeDay ? 'md:grid-cols-3' : 'md:grid-cols-2'
        } lg:mx-10 xl:mx-25`}
      >
        {/* Day 1 Column */}
        <div className="border-b md:border-b-0 md:border-r border-black">
          <div className="px-2 md:px-8 py-6 md:py-0">
            {retreat.day1.schedule.map((section, index) =>
              renderScheduleSection(
                section,
                index,
                index === retreat.day1.schedule.length - 1,
                isThreeDay,
              ),
            )}
          </div>
        </div>

        {/* Day 2 Column */}
        <div className={isThreeDay ? 'md:border-r border-black' : ''}>
          {/* Day circle Mobile - Day 2 */}
          <div
            className={`md:hidden flex justify-center items-center mt-4 ${merri.className}`}
          >
            <div className="w-40 h-40 rounded-full bg-[#D12127] shadow-xl text-white flex items-center justify-center">
              <div className="text-center leading-tight">
                <div className="text-xs tracking-wide mb-1">-DAY 2-</div>
                <div className="text-xl font-semibold">{days[1].date}</div>
                <div className="text-sm mt-1">{days[1].dayName}</div>
              </div>
            </div>
          </div>

          <div
            className={`px-2 py-6 md:px-8 md:py-0 ${
              isThreeDay ? '' : 'border-b md:border-b-0'
            }`}
          >
            {retreat.day2.schedule.map((section, index) =>
              renderScheduleSection(section, index, false, isThreeDay),
            )}
          </div>
        </div>

        {/* Day 3 Column (if exists) */}
        {retreat.day3 && (
          <div>
            {/* Day circle Mobile - Day 3 */}
            <div
              className={`md:hidden flex justify-center items-center mt-4 ${merri.className}`}
            >
              <div className="w-40 h-40 rounded-full bg-[#D12127] shadow-xl text-white flex items-center justify-center">
                <div className="text-center leading-tight">
                  <div className="text-xs tracking-wide mb-1">-DAY 3-</div>
                  <div className="text-xl font-semibold">{days[2].date}</div>
                  <div className="text-sm mt-1">{days[2].dayName}</div>
                </div>
              </div>
            </div>

            <div className="px-2 py-6 md:px-8 md:py-0">
              {retreat.day3.schedule.map((section, index) =>
                renderScheduleSection(section, index, false, isThreeDay),
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`text-center text-md text-gray-500 py-4 border-t border-black md:mx-10 lg:mx-30 ${merri.className}`}
      >
        {retreat.footerNotes}
      </div>

      {/* YouTube Video Section */}
      {youtubeEmbedUrl && (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="aspect-video w-full  overflow-hidden shadow-lg">
            <iframe
              src={youtubeEmbedUrl}
              title="Retreat Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Photos Gallery */}
      {retreat.photos && retreat.photos.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {retreat.photos.map((photo, idx) => (
              <div
                key={idx}
                className="aspect-square overflow-hidden  shadow-md cursor-pointer"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={photo}
                  alt={`Retreat photo ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && retreat.photos && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={36} />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('prev')
            }}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft size={48} />
          </button>

          {/* Image */}
          <div
            className="max-w-7xl max-h-[90vh] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={retreat.photos[selectedImageIndex]}
              alt={`Retreat photo ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {/* Image Counter */}
            <div className="text-center text-white mt-4 text-sm">
              {selectedImageIndex + 1} / {retreat.photos.length}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('next')
            }}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
      {/* <div className="bg-[#1D5C75CC] pt-16">
      <FooterBridge />
      </div> */}
    </div>
  )
}
