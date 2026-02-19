'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Quote,
  Youtube,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { merri } from '@/app/fonts/merri'
import CustomButton from '@/components/CustomButton'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import NavbarScroll from '@/components/NavbarScroll'

interface Event {
  id: string
  title: string
  description: string
  coverImage: string
  gallery?: string[]
  testimonial?: string
  bookingUrl?: string
  youtubeUrl?: string
  mapUrl?: string
  eventDate: string
  slug: string
  venue: string
  city?: string
}

export default function EventDetailClient({ event }: { event: Event }) {
  const router = useRouter()

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    const weekday = date.toLocaleDateString('en-US', {
      weekday: 'long',
    })

    const rest = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    return `${weekday} ${rest}`
  }

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

  const extractYouTubeId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[7].length === 11 ? match[7] : null
  }

  const handlePrevImage = () => {
    if (!event?.gallery) return
    setSelectedImageIndex((prev) =>
      prev !== null
        ? (prev - 1 + event.gallery.length) % event.gallery.length
        : prev,
    )
  }

  const handleNextImage = () => {
    if (!event?.gallery) return
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev + 1) % event.gallery.length : prev,
    )
  }

  const youtubeId = event.youtubeUrl ? extractYouTubeId(event.youtubeUrl) : null

  return (
    <div className="">

      <div>
      
        <MobileNavbarScroll textColor="#1D5C75" showOnScrollUp={true} />
        <NavbarScroll textColor="#1D5C75" />
      </div>
     
      
      {/* HERO */}
      <div className="relative h-96 bg-[#1D5C75]">
        <img
          src={event.coverImage}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D5C75]/90 via-[#1D5C75]/50 to-transparent" />

        <div
          className={`relative ${merri.className} h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12`}
        >
          <button
            onClick={() => router.push('/events')}
            className="flex items-center gap-2 text-white mb-6 w-fit"
          >
            <ArrowLeft size={20} />
            <span>Go to Events</span>
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {event.title}
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          backgroundImage: "url('/MD-Texture_BG_Blue-01-04.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
          backgroundPosition: 'top left',
        }}
      >
        <div className={`max-w-7xl ${merri.className} mx-auto px-6 py-12`}>
          <div className="bg-white shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-3 items-start">
              {/* LEFT */}
              <div className="lg:col-span-2 p-8 space-y-10">
                {/* ABOUT */}
                <div>
                  <h3
                    className={`${merri.className} text-[18px] uppercase text-[#1D5C75] font-bold mb-6`}
                  >
                    About This Event
                  </h3>

                  <p
                    className={`${merri.className} text-[16px] font-light leading-7`}
                  >
                    {event.description}
                  </p>
                </div>

                {/* VIDEO */}
                {youtubeId && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Youtube className="text-red-600" />
                      <h2 className="text-2xl font-bold">Event Video</h2>
                    </div>

                    <div className="relative aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* GALLERY */}
                {event.gallery && event.gallery.length >= 1 && (
                  <div>
                    <h2
                      className={`${merri.className} text-[18px] uppercase text-[#1D5C75] font-bold mb-6`}
                    >
                      Event Gallery
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.gallery.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className="aspect-square overflow-hidden cursor-pointer"
                        >
                          <img
                            src={img}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TESTIMONIAL */}
                {event.testimonial && (
                  <div className="bg-purple-50 p-6">
                    <Quote className="text-purple-600 mb-4" size={32} />
                    <p className="italic text-lg">"{event.testimonial}"</p>
                  </div>
                )}
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="border-t lg:border-t-0 lg:border-l border-gray-200 p-8 self-start">
                <div className="sticky top-6">
                  <h3
                    className={`${merri.className} text-[18px] uppercase text-[#1D5C75] font-bold mb-6`}
                  >
                    Event Details
                  </h3>

                  <p
                    className={`${merri.className} text-[16px] md:text-[18px] font-bold`}
                  >
                    {formatDate(event.eventDate)}
                  </p>

                  <p
                    className={`${merri.className} text-[16px] md:text-[18px] font-bold mb-2`}
                  >
                    {formatTime(event.eventDate)}
                  </p>

                  {event.venue && (
                    <a
                      href={event.mapUrl}
                      target="_blank"
                      className={`${merri.className} text-[16px] md:text-[18px] hover:underline block`}
                    >
                      {event.venue}, {event.city}
                    </a>
                  )}

                  {event.bookingUrl &&
                    new Date(event.eventDate) > new Date() && (
                      <div className="mt-6">
                        <CustomButton
                          text="BOOK NOW"
                          bgColor="#D12127"
                          textColor="#FFFFFF"
                          url={event.bookingUrl}
                          isArrow
                          isOutSideLink
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedImageIndex !== null && event.gallery && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setSelectedImageIndex(null)}
          >
            <X size={36} />
          </button>

          <button
            className="absolute left-4 text-white"
            onClick={(e) => {
              e.stopPropagation()
              handlePrevImage()
            }}
          >
            <ChevronLeft size={48} />
          </button>

          <div
            className="max-w-7xl max-h-[90vh] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={event.gallery[selectedImageIndex]}
              className="max-h-[90vh] object-contain mx-auto"
            />
            <div className="text-center text-white mt-4 text-sm">
              {selectedImageIndex + 1} / {event.gallery.length}
            </div>
          </div>

          <button
            className="absolute right-4 text-white"
            onClick={(e) => {
              e.stopPropagation()
              handleNextImage()
            }}
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </div>
  )
}
