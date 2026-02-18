// app/retreats/past/[slug]/page.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { merri } from '@/app/fonts/merri'
import Link from 'next/link'
import CustomButton from '@/components/CustomButton'
import Navbar from '@/components/Navbar'
import MobileNavbar from '@/components/MobileNavbar'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import NavbarScroll from '@/components/NavbarScroll'

interface Testimonial {
  id: string
  quote: string
  name: string
  designation: string
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
  day1: {
    date: string
    dayName: string
  }
  day2: {
    date: string
    dayName: string
  }
  day3?: {
    date: string
    dayName: string
  }
}

export default function PastRetreatClient({
  retreat,
  testimonials,
}: {
  retreat: Retreat
  testimonials: any
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  )

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null)

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

  const getDateRange = () => {
    if (!retreat) return ''

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)

      return {
        day: date.getDate(),
        month: date.toLocaleString('en-US', { month: 'short' }),
        year: date.getFullYear(),
      }
    }

    const start = formatDate(retreat.day1.date)
    const endDateStr = retreat.day3 ? retreat.day3.date : retreat.day2.date
    const end = formatDate(endDateStr)

    // Same year
    if (start.year === end.year) {
      return `${start.day} ${start.month} - ${end.day} ${end.month} ${end.year}`
    }

    // Different year
    return `${start.day} ${start.month} ${start.year} - ${end.day} ${end.month} ${end.year}`
  }

  const getScheduleUrl = (retreat: Retreat) => {
    return retreat.slug
      ? `/retreats/schedule/${retreat.slug}`
      : `/retreats/schedule/${retreat.id}`
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
            className="inline-flex items-center gap-2 bg-red-600 text-[#1D5C75] px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Retreats
          </button>
        </div>
      </div>
    )
  }

  const youtubeEmbedUrl = retreat.youtube_video
    ? getYoutubeEmbedUrl(retreat.youtube_video)
    : null

  return (
    <div className="bg-[#1D5C75CC] w-full h-full">
      <div className="w-full">
        <div className="w-full">
          <div className="sm:hidden">
            {/* Web Asset */}
            <div>
              <MobileNavbar textColor="#fff" isNotHome />
            </div>
          </div>
          <div className="hidden sm:block relative pt-5 z-10">
            <Navbar textColor="#fff" isNotHome />
          </div>
          <NavbarScroll textColor="#1D5C75" />
          {/* Video */}
          {youtubeEmbedUrl && (
            <div className="mx-4 xl:mx-30 -mt-7 md:-mt-10 xl:-mt-8">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10">
                  <div className="w-full aspect-video ">
                    <iframe
                      src={youtubeEmbedUrl}
                      title={retreat.title}
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

        {/* Retreat Details Section */}
        <div className="w-full">
          <div className="xl:mx-40 bg-white">
            <div className="grid  md:grid-cols-12 gap-1 overflow-hidden">
              <div className="w-full order-1 sm:order-0 md:col-start-1 lg:col-start-2 col-span-12 lg:col-span-10 p-4 md:p-0 md:my-6">
                <div className="text-left mt-16">
                  <p
                    className={`${merri.className} text-[16px] md:text-[18px] text-[#78B0C7] font-bold my-6`}
                  >
                    PAST RETREATS
                  </p>
                  <h2
                    className={`font-neco text-[24px] leading-none text-[#1D5C75] font-bold`}
                  >
                    Mahabharata Dialogues
                  </h2>
                  <h1
                    className={`${merri.className} text-[32px] text-[#1D5C75] font-extrabold italic leading-none mb-6`}
                  >
                    {retreat.title}
                  </h1>
                  <p
                    className={`${merri.className} text-[16px] md:text-[18px] text-[#1D5C75] font-bold `}
                  >
                    {getDateRange()}
                  </p>
                  <h4
                    className={`${merri.className} text-[16px] md:text-[18px] text-[#1D5C75] font-normal leading-6 pb-2`}
                  >
                    {retreat.venue}, {retreat.city}
                  </h4>
                  {retreat.description && (
                    <p
                      className={`${merri.className} text-[16px] md:text-[18px] text-[#1D5C75] font-light italic py-6 max-w-4xl`}
                    >
                      {retreat.description}
                    </p>
                  )}

                  <TestimonialsCarousel
                    testimonials={testimonials}
                    textColor={'#1D5C75'}
                  />

                  {/* button */}
                  <div className="flex justify-center items-center mb-12">
                    <CustomButton
                      text="VIEW SCHEDULE"
                      bgColor="#1D5C75"
                      textColor="#FFFFFF"
                      url={getScheduleUrl(retreat)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Gallery */}
        {retreat.photos && retreat.photos.length > 0 && (
          <div className="w-full py-16">
            <div className="mx-4 xl:mx-40">
              <div className="max-w-7xl mx-auto">
                <h2
                  className={`${merri.className} text-[32px] md:text-[44px] text-[#fff] font-bold text-center mb-12`}
                >
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {retreat.photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="aspect-square overflow-hidden  shadow-lg cursor-pointer hover:shadow-2xl transition-shadow"
                      onClick={() => openLightbox(idx)}
                    >
                      <img
                        src={photo}
                        alt={`Retreat photo ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && retreat.photos && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
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