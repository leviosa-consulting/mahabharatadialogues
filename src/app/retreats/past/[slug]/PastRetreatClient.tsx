// app/retreats/past/[slug]/page.tsx
'use client'

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { merri } from '@/app/fonts/merri'
import Link from 'next/link'
import CustomButton from '@/components/CustomButton'
import Navbar from '@/components/Navbar'
import MobileNavbar from '@/components/MobileNavbar'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import NavbarScroll from '@/components/NavbarScroll'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'

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
  const router = useRouter()
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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

  const openLightbox = (index: number) => setSelectedImageIndex(index)
  const closeLightbox = () => setSelectedImageIndex(null)

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null || !retreat?.photos) return
    if (direction === 'prev') {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? retreat.photos.length - 1 : selectedImageIndex - 1,
      )
    } else {
      setSelectedImageIndex(
        selectedImageIndex === retreat.photos.length - 1 ? 0 : selectedImageIndex + 1,
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
    if (start.year === end.year) {
      return `${start.day} ${start.month} - ${end.day} ${end.month} ${end.year}`
    }
    return `${start.day} ${start.month} ${start.year} - ${end.day} ${end.month} ${end.year}`
  }

  const getScheduleUrl = (retreat: Retreat) => {
    return retreat.slug
      ? `/retreats/schedule/${retreat.slug}`
      : `/retreats/schedule/${retreat.id}`
  }

  const handleClose = () => {
    router.push('/retreats')
  }

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      handleClose()
    }
  }

  if (!retreat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Retreat Not Found</h1>
          <p className="text-gray-600 mb-8">The retreat you're looking for doesn't exist.</p>
          <Link
            href="/retreats"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-black transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Retreats
          </Link>
        </div>
      </div>
    )
  }

  const youtubeEmbedUrl = retreat.youtube_video
    ? getYoutubeEmbedUrl(retreat.youtube_video)
    : null

  return (
    <div onClick={handleBackgroundClick}>
    
      <div className="bg-[#1D5C75CC] w-full min-h-screen">
        {/* Navbar*/}
        <div className="relative z-10">
          <div className="">
            <MobileNavbar textColor="#fff" isNotHome />
             <MobileNavbarScroll textColor="#1D5C75" showOnScrollUp={true} />
          </div>
          <div className="hidden sm:block pt-5">
            <Navbar textColor="#fff" isNotHome />
          </div>
          <NavbarScroll textColor="#1D5C75" />
        </div>

        {/* Same grid/column structure as BlogDetailClient */}
        <div className="md:mx-1 lg:mx-4 xl:mx-30 2xl:mx-40">
          <div className="grid grid-cols-12">
            <div
              className="col-span-12 md:col-start-2 md:col-span-10"
              ref={contentRef}
            >
              {/* YouTube Video — replaces the blog hero image */}
              {youtubeEmbedUrl && (
                <figure className="overflow-hidden -mt-7 md:-mt-10 xl:-mt-8">
                  <div className="w-full aspect-video">
                    <iframe
                      src={youtubeEmbedUrl}
                      title={retreat.title}
                      className="w-full h-full shadow-xl"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </figure>
              )}

              {/* White content card — same as blog detail */}
              <div className="bg-white">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 col-start-1 lg:col-start-2 lg:col-span-10 p-4 sm:py-4">
                    <div className="w-full">
                      <div className="flex flex-col items-start text-start w-full">

                        {/* Title row  */}
                        <div className="flex justify-between items-start w-full gap-4">
                          <div>
                            <p
                              className={`${merri.className} text-[16px] md:text-[18px] text-[#78B0C7] font-bold mt-8 mb-6`}
                            >
                              PAST RETREATS
                            </p>
                            <h2 className={`font-neco text-[24px] leading-none text-[#1D5C75] font-bold`}>
                              Mahabharata Dialogues
                            </h2>
                            <h1
                              className={`${merri.className} text-[32px] text-[#1D5C75] font-extrabold italic leading-none mb-6`}
                            >
                              {retreat.title}
                            </h1>
                          </div>

                          <button
                            onClick={handleClose}
                            className="shrink-0 text-[#1D5C75] flex justify-end items-end hover:bg-gray-100 p-1 transition-colors"
                            aria-label="Close"
                          >
                            <X className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-[45px] lg:h-[45px]" />
                          </button>
                        </div>

                        {/* Date / Venue row */}
                        <div className="flex justify-between items-start sm:items-center w-full gap-3 ">
                          <div>
                            <p
                              className={`${merri.className} text-[16px] md:text-[18px] text-[#1D5C75] font-bold`}
                            >
                              {getDateRange()}
                            </p>
                            <h4
                              className={`${merri.className} text-[16px] md:text-[18px] text-[#1D5C75] font-normal leading-6 pb-2`}
                            >
                              {retreat.venue}, {retreat.city}
                            </h4>
                          </div>
                        </div>

                        {/* Description */}
                        {retreat.description && (
                          <p
                            className={`${merri.className} text-[16px] md:text-[18px] text-[#1D5C75] font-light italic py-6 max-w-4xl`}
                          >
                            {retreat.description}
                          </p>
                        )}
                      </div>

                      {/* Testimonials */}
                      <TestimonialsCarousel
                        testimonials={testimonials}
                        textColor={'#1D5C75'}
                      />

                      {/* CTA Button */}
                      <div className="flex justify-center items-center mb-10">
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

              {/* Photos Gallery — mirrors "Related Blogs" section */}
              {retreat.photos && retreat.photos.length > 0 && (
                <div className="bg-[#47ABD8B2] mt-8">
                  <div className="grid grid-cols-12">
                    <div className="col-span-12 lg:col-span-10 lg:col-start-2 px-4 sm:px-6 lg:px-8 py-8">
                      <h2
                        className={`${merri.className} text-center text-white text-[20px] font-bold my-9 uppercase`}
                      >
                        Gallery
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
                        {retreat.photos.map((photo, idx) => (
                          <div
                            key={idx}
                            className="aspect-square overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-shadow"
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
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && retreat.photos && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={36} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage('prev') }}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft size={48} />
          </button>
          <div
            className="max-w-7xl max-h-[90vh] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={retreat.photos[selectedImageIndex]}
              alt={`Retreat photo ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="text-center text-white mt-4 text-sm">
              {selectedImageIndex + 1} / {retreat.photos.length}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage('next') }}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </div>
  )
}