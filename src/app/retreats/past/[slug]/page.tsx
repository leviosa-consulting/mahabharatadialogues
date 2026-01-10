// app/retreats/past/[slug]/page.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { merri } from '@/app/fonts/merri'
import Link from 'next/link'
import CustomButton from '@/components/CustomButton'

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

const PastRetreatPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [retreat, setRetreat] = useState<Retreat | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  )

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        setTestimonials(data.data)
      } else {
        setTestimonials([
          {
            id: '1',
            quote:
              'Quotes on how amazing it is to be in any of the workshop, long or short, and what an enriching time you had with information and meeting like-minded people.',
            name: 'Hansini',
            designation: 'President of Rotary Club, Bengaluru',
          },
        ])
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setTestimonials([
        {
          id: '1',
          quote:
            'Quotes on how amazing it is to be in any of the workshop, long or short, and what an enriching time you had with information and meeting like-minded people.',
          name: 'Hansini',
          designation: 'President of Rotary Club, Bengaluru',
        },
      ])
    }
  }

  useEffect(() => {
    if (params.slug) {
      fetchRetreat(params.slug as string)
    }
  }, [params.slug])

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

  const fetchRetreat = async (slugOrId: string) => {
    try {
      const slugResponse = await fetch(`/api/retreats/by-slug/${slugOrId}`)

      if (slugResponse.ok) {
        const slugData = await slugResponse.json()
        if (slugData.success && slugData.data) {
          setRetreat(slugData.data)
          setLoading(false)
          return
        }
      }

      const response = await fetch('/api/retreats')
      const data = await response.json()

      if (data.success) {
        const foundRetreat = data.data.find((r: Retreat) => r.id === slugOrId)
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

  const handleWheel = (e: React.WheelEvent) => {
    if (wheelTimeout.current) {
      clearTimeout(wheelTimeout.current)
    }

    wheelTimeout.current = setTimeout(() => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (e.deltaX > 0) {
          setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        } else if (e.deltaX < 0) {
          setCurrentIndex(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length
          )
        }
      }
    }, 50)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      } else {
        setCurrentIndex(
          (prev) => (prev - 1 + testimonials.length) % testimonials.length
        )
      }
    }
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
          : selectedImageIndex - 1
      )
    } else {
      setSelectedImageIndex(
        selectedImageIndex === retreat.photos.length - 1
          ? 0
          : selectedImageIndex + 1
      )
    }
  }

  const getDateRange = () => {
    if (!retreat) return ''
    const endDate = retreat.day3 ? retreat.day3.date : retreat.day2.date
    return `${retreat.day1.date} - ${endDate}`
  }

  const getScheduleUrl = (retreat: Retreat) => {
    return retreat.slug
      ? `/retreats/schedule/${retreat.slug}`
      : `/retreats/schedule/${retreat.id}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading retreat...</p>
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
          {/* Web Asset */}
          <Link
            href="/"
            className="flex justify-center items-center  relative z-20"
          >
            <img
              src="/Web_Assets-08.png"
              alt="Home"
              className="w-30 h-30 md:w-50 md:h-50 -mb-16 md:-mb-24 cursor-pointer"
            />
          </Link>

          {/* Video */}
          {youtubeEmbedUrl && (
            <div className="mx-2 xl:mx-0 2xl:mx-20">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10">
                  <div className="w-full aspect-video relative z-10">
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
        <div className="w-full  -mt-[25vh] md:-mt-[20vh] pt-[20vh] pb-[5vh]">
          <div className="sm:mx-4 xl:mx-30 bg-white p-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden">
              <div className="w-full order-1 sm:order-0 md:col-start-1 lg:col-start-2 col-span-12 lg:col-span-10 md:my-6">
                <div className="text-left mt-16">
                  <p
                    className={`${merri.className} text-[20px] text-[#78B0C7] font-bold`}
                  >
                    PAST RETREATS
                  </p>
                  <h2
                    className={`font-neco text-[28px] text-[#1D5C75] font-bold`}
                  >
                    Mahabharata Dialogues
                  </h2>
                  <h1
                    className={`${merri.className} text-[44px] text-[#1D5C75] font-extrabold italic`}
                  >
                    {retreat.title}
                  </h1>
                  <p
                    className={`${merri.className} text-[20px] text-[#1D5C75] italic font-bold`}
                  >
                    {getDateRange()}
                  </p>
                  <h4
                    className={`${merri.className} text-[20px] text-[#1D5C75] font-normal italic`}
                  >
                    {retreat.venue || 'Fireflies, Kanakpura Road, Bengaluru'}
                  </h4>
                  {retreat.description && (
                    <p
                      className={`${merri.className} text-[20px] text-[#1D5C75] font-light italic py-6 max-w-4xl`}
                    >
                      {retreat.description}
                    </p>
                  )}

                  {/* Testimonials Section */}
                  <div className="flex flex-col justify-center items-center gap-2 max-w-2xl mx-auto pt-6">
                    <div
                      className="bg-opacity-60 rounded-lg p-6 text-center"
                      onWheel={handleWheel}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <p className="text-[#1D5C75] font-neco italic text-[20px] sm:text-[24px] leading-relaxed">
                        {testimonials[currentIndex]?.quote}
                      </p>
                      <p
                        className={`text-[#1D5C75] ${merri.className} mt-4 font-bold text-[16px] md:text-[18px]`}
                      >
                        <span className="uppercase">
                          {testimonials[currentIndex]?.name},{' '}
                        </span>
                        {testimonials[currentIndex]?.designation}
                      </p>

                      {/* Navigation Dots */}
                      <div className="flex justify-center gap-3.5 my-8">
                        {testimonials.map((_, index) => (
                          <div
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                              index === currentIndex
                                ? 'bg-[#1D5C75]'
                                : 'bg-[#78B0C7]'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* button */}
                  <div className='flex justify-center items-center'>
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
            <div className="mx-4 2xl:mx-20">
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

export default PastRetreatPage