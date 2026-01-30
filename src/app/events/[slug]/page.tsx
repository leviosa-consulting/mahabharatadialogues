// app/events/[slug]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Calendar,
  Clock,
  ArrowLeft,
  ExternalLink,
  Quote,
  Youtube,
  Image as ImageIcon,
  X,
  MapPin,
} from 'lucide-react'
import { merri } from '@/app/fonts/merri'
import CustomButton from '@/components/CustomButton'
import EventDetailShimmer from '@/components/shimmer/EventDetailShimmer'

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

const EventDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (params.slug) {
      fetchEvent(params.slug as string)
    }
  }, [params.slug])

  const fetchEvent = async (slug: string) => {
    try {
      const response = await fetch(`/api/events/slug/${slug}`)
      const data = await response.json()
      if (data.success) {
        setEvent(data.data)
      } else {
        router.push('/events')
      }
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch event:', err)
      router.push('/events')
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const extractYouTubeId = (url: string) => {
    if (!url) return null
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[7].length === 11 ? match[7] : null
  }

  if (loading) {
    return <EventDetailShimmer />
  }

  if (!event) {
    return null
  }

  const youtubeId = event.youtubeUrl ? extractYouTubeId(event.youtubeUrl) : null

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className="relative h-96 bg-[#1D5C75]">
        {event.coverImage && (
          <>
            {/* Background image */}
            <img
              src={event.coverImage}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D5C75]/90 via-[#1D5C75]/50 to-transparent" />
          </>
        )}

        <div
          className={`relative ${merri.className} h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12`}
        >
          <button
            onClick={() => router.push('/events')}
            className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors mb-6 w-fit"
          >
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-neco font-bold text-white mb-4">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div
        className={`max-w-7xl ${merri.className} mx-auto px-4 sm:px-6 lg:px-8 py-12`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* YouTube Video */}
            {youtubeId && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Youtube className="text-red-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Event Video
                  </h2>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="Event Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Gallery */}
            {event.gallery && event.gallery.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="text-purple-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Event Gallery
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className="relative aspect-square overflow-hidden cursor-pointer group"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonial */}
            {event.testimonial && (
              <div
                className={`bg-gradient-to-br ${merri.className} from-purple-50 to-purple-100 rounded-lg shadow-md p-8`}
              >
                <div className="flex items-start gap-4">
                  <Quote className="text-purple-600 flex-shrink-0" size={32} />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Testimonial
                    </h2>
                    <p className="text-gray-700 text-lg italic leading-relaxed">
                      "{event.testimonial}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className={`bg-white ${merri.className} rounded-lg shadow-md p-6 sticky top-6`}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Event Details
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="text-gray-900 font-semibold">
                    {formatDate(event.eventDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Time</p>
                  <p className="text-gray-900 font-semibold">
                    {formatTime(event.eventDate)}
                  </p>
                </div>

                {event.venue && event.mapUrl && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Venue</p>
                    <a
                      href={event.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 font-semibold hover:underline inline-block"
                    >
                      {event.venue}, {event.city}
                    </a>
                  </div>
                )}

                {event.gallery && event.gallery.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Gallery</p>
                    <p className="text-gray-900 font-semibold">
                      {event.gallery.length} Photos
                    </p>
                  </div>
                )}
              </div>

              {event.bookingUrl && new Date(event.eventDate) > new Date() && (
                // <a
                //   href={event.bookingUrl}
                //   target="_blank"
                //   rel="noopener noreferrer"
                //   className="w-full flex items-center justify-center gap-2 bg-[#D12127] text-white px-6 py-3  transition-colors font-semibold"
                // >
                //   <span>Book Now</span>
                //   <ExternalLink size={18} />
                // </a>

                <CustomButton
                  text="Book Now"
                  bgColor="#D12127"
                  textColor="#FFFFFF"
                  url={event.bookingUrl}
                  isArrow
                  isOutSideLink
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default EventDetailPage
