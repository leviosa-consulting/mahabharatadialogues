// app/retreats/[id]/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Youtube, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { merri } from '@/app/fonts/merri'

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
  title: string
  description?: string
  venue?: string
  youtube_video?: string
  photos?: string[]
  day1: DaySchedule
  day2: DaySchedule
  day3?: DaySchedule
}

const RetreatDetailPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const [retreat, setRetreat] = useState<Retreat | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchRetreat(params.id as string)
    }
  }, [params.id])

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

  const fetchRetreat = async (id: string) => {
    try {
      const response = await fetch('/api/retreats')
      const data = await response.json()

      if (data.success) {
        const foundRetreat = data.data.find((r: Retreat) => r.id === id)
        if (foundRetreat) {
          setRetreat(foundRetreat)
        } else {
          setError(true)
        }
      } else {
        setError(true)
      }
      setLoading(false)
    } catch (err) {
      console.error('Error fetching retreat:', err)
      setError(true)
      setLoading(false)
    }
  }

  const renderScheduleSection = (
    section: ScheduleSection,
    index: number,
    isLastActivity: boolean,
    isThreeDayRetreat: boolean
  ) => {
    if (section.type === 'meal') {
      return (
        <div
          key={index}
          className={`bg-[#60a5fa] text-white ${merri.className} px-2 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center`}
        >
          <span className="${merri.className}">{section.title}</span>
          <span className={`text-[16px] md:text-lg ${merri.className}`}>
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
            className="flex justify-between items-start gap-3"
          >
            <div className="flex-1">
              <div className={`flex items-start font-semibold text-md leading-snug ${merri.className}`}>
                <span className="mr-2 text-2xl leading-none">•</span>
                <span>{item.title}</span>
              </div>

              {item.description && (
                <div
                  className={`text-sm text-gray-600 leading-tight mt-0.5 ${merri.className} px-3 ${
                    isThreeDayRetreat 
                      ? '2xl:w-[90%]' 
                      : 'md:w-[90%]'
                  } ${
                    itemIndex === section.items!.length - 1
                      ? 'pb-8'
                      : ''
                  }`}
                >
                  {item.description}
                </div>
              )}
            </div>
            <div className={`text-md whitespace-nowrap pt-0.5 pr-2.5 ${merri.className} md:pr-5`}>
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
        selectedImageIndex === 0 ? retreat.photos.length - 1 : selectedImageIndex - 1
      )
    } else {
      setSelectedImageIndex(
        selectedImageIndex === retreat.photos.length - 1 ? 0 : selectedImageIndex + 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading retreat schedule...</p>
        </div>
      </div>
    )
  }

  if (error || !retreat) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Retreat Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The retreat you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push('/retreats')}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Retreats
          </button>
        </div>
      </div>
    )
  }

  const days = [
    { day: 1, date: retreat.day1.date, dayName: retreat.day1.dayName },
    { day: 2, date: retreat.day2.date, dayName: retreat.day2.dayName },
  ]

  if (retreat.day3) {
    days.push({ day: 3, date: retreat.day3.date, dayName: retreat.day3.dayName })
  }

  const isThreeDay = !!retreat.day3

  const youtubeEmbedUrl = retreat.youtube_video
    ? getYoutubeEmbedUrl(retreat.youtube_video)
    : null

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push('/retreats')}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to All Retreats</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#282828] text-white py-12 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Left */}
          <div className={`text-center md:text-left ${merri.className}`}>
            <div className="text-lg mb-2 ">Mahabharata Dialogues</div>
            <h1 className="text-4xl md:text-5xl font-bold">The Retreat</h1>

            <div className="flex items-center justify-center md:justify-start gap-3 mt-4 text-white/90">
              <Calendar size={18} className="opacity-80" />
              <span className="text-sm md:text-base tracking-wide">
                {retreat.day1.date} <span className="mx-1">–</span>{' '}
                {isThreeDay ? retreat.day3!.date : retreat.day2.date}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-28 bg-white/60" />

          {/* Right */}
          <div className="text-center md:text-left md:max-w-lg">
            <p className="text-lg italic leading-relaxed font-neco">
              {retreat.description}
            </p>
            {retreat.venue && (
              <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                <MapPin size={18} className="text-white/80" />
                <span className={`text-sm md:text-base tracking-wide text-white/90 ${merri.className}`}>
                  {retreat.venue}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Day circles - Desktop */}
      <div className={`w-full hidden relative z-10 mx-auto -mt-18 md:flex flex-col md:flex-row items-center justify-center ${isThreeDay ? 'gap-8 md:gap-16' : 'gap-8 md:gap-84'}`}>
        {days.map((dayInfo) => (
          <div
            key={dayInfo.day}
            className={`w-40 ${merri.className} h-40 md:w-44 md:h-44 rounded-full bg-red-600 shadow-xl text-white flex items-center justify-center`}
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
        ))}
      </div>

      {/* Day circle Mobile - Day 1 */}
      <div className={`md:hidden flex justify-center items-center mt-4 ${merri.className}`}>
        <div className="w-40 h-40 rounded-full bg-red-600 shadow-xl text-white flex items-center justify-center">
          <div className="text-center leading-tight">
            <div className="text-xs tracking-wide mb-1">-DAY 1-</div>
            <div className="text-xl font-semibold">{days[0].date}</div>
            <div className="text-sm mt-1">{days[0].dayName}</div>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className={`grid grid-cols-1 md:mt-8 ${isThreeDay ? 'md:grid-cols-3' : 'md:grid-cols-2'} lg:mx-10 xl:mx-25`}>
        {/* Day 1 Column */}
        <div className="border-b md:border-b-0 md:border-r border-black">
          <div className="px-2 md:px-8 py-6 md:py-0 space-y-4">
            {retreat.day1.schedule.map((section, index) =>
              renderScheduleSection(
                section,
                index,
                index === retreat.day1.schedule.length - 1,
                isThreeDay
              )
            )}
          </div>
        </div>

        {/* Day 2 Column */}
        <div className={isThreeDay ? 'md:border-r border-black' : ''}>
          {/* Day circle Mobile - Day 2 */}
          <div className={`md:hidden flex justify-center items-center mt-4 ${merri.className}`}>
            <div className="w-40 h-40 rounded-full bg-red-600 shadow-xl text-white flex items-center justify-center">
              <div className="text-center leading-tight">
                <div className="text-xs tracking-wide mb-1">-DAY 2-</div>
                <div className="text-xl font-semibold">{days[1].date}</div>
                <div className="text-sm mt-1">{days[1].dayName}</div>
              </div>
            </div>
          </div>

          <div className={`px-2 py-6 md:px-8 md:py-0 space-y-4 ${isThreeDay ? '' : 'border-b md:border-b-0'}`}>
            {retreat.day2.schedule.map((section, index) =>
              renderScheduleSection(section, index, false, isThreeDay)
            )}
          </div>
        </div>

        {/* Day 3 Column (if exists) */}
        {retreat.day3 && (
          <div>
            {/* Day circle Mobile - Day 3 */}
            <div className={`md:hidden flex justify-center items-center mt-4 ${merri.className}`}>
              <div className="w-40 h-40 rounded-full bg-red-600 shadow-xl text-white flex items-center justify-center">
                <div className="text-center leading-tight">
                  <div className="text-xs tracking-wide mb-1">-DAY 3-</div>
                  <div className="text-xl font-semibold">{days[2].date}</div>
                  <div className="text-sm mt-1">{days[2].dayName}</div>
                </div>
              </div>
            </div>

            <div className="px-2 py-6 md:px-8 md:py-0 space-y-4">
              {retreat.day3.schedule.map((section, index) =>
                renderScheduleSection(section, index, false, isThreeDay)
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`text-center text-md text-gray-500 py-4 border-t border-black md:mx-10 lg:mx-30 ${merri.className}`}>
        * Optional/Simultaneous events
      </div>

      {/* YouTube Video Section */}
      {youtubeEmbedUrl && (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
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
                className="aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer"
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
    </div>
  )
}

export default RetreatDetailPage