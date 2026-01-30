'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Calendar,
  Clock,
  ArrowLeft,
  Quote,
  Youtube,
  Image as ImageIcon,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight,
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

  // ✅ SINGLE SOURCE OF TRUTH (Retreat-style)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  )

  useEffect(() => {
    if (params.slug) fetchEvent(params.slug as string)
  }, [params.slug])

  const fetchEvent = async (slug: string) => {
    try {
      const res = await fetch(`/api/events/slug/${slug}`)
      const data = await res.json()

      if (data.success) {
        setEvent(data.data)
      } else {
        router.push('/events')
      }
    } catch (err) {
      console.error(err)
      router.push('/events')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

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
    setSelectedImageIndex(
      (prev) =>
        prev !== null
          ? (prev - 1 + event.gallery.length) % event.gallery.length
          : prev,
    )
  }

  const handleNextImage = () => {
    if (!event?.gallery) return
    setSelectedImageIndex(
      (prev) =>
        prev !== null
          ? (prev + 1) % event.gallery.length
          : prev,
    )
  }

  if (loading) return <EventDetailShimmer />
  if (!event) return null

  const youtubeId = event.youtubeUrl
    ? extractYouTubeId(event.youtubeUrl)
    : null

  return (
    <div className="min-h-screen">
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
            <span>Back to Events</span>
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {event.title}
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className={`max-w-7xl ${merri.className} mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8`}
      >
        {/* MAIN */}
        <div className="lg:col-span-2 space-y-8">
          {/* ABOUT */}
          <div className="bg-white shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* VIDEO */}
          {youtubeId && (
            <div className="bg-white shadow-md p-8">
              <div className="flex items-center gap-2 mb-4">
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
            <div className="bg-white shadow-md p-8">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon />
                <h2 className="text-2xl font-bold">Event Gallery</h2>
              </div>

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
            <div className="bg-purple-50 shadow-md p-8">
              <Quote className="text-purple-600 mb-4" size={32} />
              <p className="italic text-lg">"{event.testimonial}"</p>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div>
          <div className="bg-white shadow-md p-6 sticky top-6">
            <h3 className="text-xl font-bold mb-4">Event Details</h3>

            <p className="font-semibold">{formatDate(event.eventDate)}</p>
            <p className="font-semibold">{formatTime(event.eventDate)}</p>

            {event.mapUrl && (
              <a
                href={event.mapUrl}
                target="_blank"
                className="inline-flex items-center gap-1 font-semibold mt-2"
              >
                <MapPin size={16} />
                {event.venue}, {event.city}
              </a>
            )}

            {event.bookingUrl && (
              <div className="mt-6">
                <CustomButton
                  text="Book Now"
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

      {/* ✅ RETREAT-STYLE LIGHTBOX */}
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

export default EventDetailPage
