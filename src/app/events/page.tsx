'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { merri } from '../fonts/merri'
import MobileNavbar from '@/components/MobileNavbar'
import Footer from '@/components/Footer'
import EventsPageShimmer from '@/components/shimmer/EventsPageShimmer'

interface Event {
  id: string
  title: string
  description: string
  coverImage: string
  gallery?: string[]
  testimonial?: string
  bookingUrl?: string
  youtubeUrl?: string
  eventDate: string
  slug: string
  venue: string
  city?: string
  mapUrl?: string
}

const EventsPage = () => {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setLoading(false)
    }
  }

  const getCurrentDate = () => {
    return new Date()
  }

  const filterEvents = (type: 'upcoming' | 'past') => {
    const now = getCurrentDate()
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.eventDate)
      if (type === 'upcoming') {
        return eventDate >= now
      } else {
        return eventDate < now
      }
    })

    return filtered.sort((a, b) => {
      const dateA = new Date(a.eventDate).getTime()
      const dateB = new Date(b.eventDate).getTime()
      if (type === 'upcoming') {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    })
  }

  const upcomingEvents = filterEvents('upcoming')
  const pastEvents = filterEvents('past')

  // Auto-switch to past events if no upcoming events
  useEffect(() => {
    if (!loading && upcomingEvents.length === 0 && pastEvents.length > 0) {
      setActiveTab('past')
    }
  }, [loading, upcomingEvents.length, pastEvents.length])

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
  if (loading) {
  return <EventsPageShimmer />
}

  const formatEventDateTime = (dateString: string) => {
    const date = new Date(dateString)

    const datePart = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    const timePart = date
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase()

    return `${datePart} | ${timePart}`
  }

  const handleEventClick = (slug: string) => {
    router.push(`/events/${slug}`)
  }

  const EventCard = ({ event }: { event: Event }) => (
    <div
      onClick={() => handleEventClick(event.slug)}
      className="
      flex flex-col
      items-center
      cursor-pointer
      group
      bg-white
      shadow-2xl
    "
    >
      {/* Image */}
      <div className="w-full h-[260px] overflow-hidden">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar size={64} className="text-black/40" />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="
        flex flex-col
        justify-center
        items-center
        text-center
       px-4 md:px-10
      "
      >
        {/* Title */}
        <h2
          className={`${merri.className}
          text-black
          font-extrabold
          italic
          text-[26px] md:text-[32px]
          leading-tight
          mt-6
        `}
        >
          {event.title}
        </h2>

        {/* Date */}
        <h3
          className={`${merri.className}
          text-black
          font-bold
          text-[16px] md:text-[18px]
          mt-2
        `}
        >
          {formatEventDateTime(event.eventDate)}
        </h3>

        {/* Venue */}
        <div className="flex flex-col items-center mt-3">
          <h4
            className={`${merri.className}
            text-black
            font-normal
            text-[16px] md:text-[18px]
            leading-snug px-4
          `}
          >
            {event.venue},
          </h4>
          <h4
            className={`${merri.className}
            text-black
            font-normal
            text-[16px] md:text-[18px]
            leading-snug
          `}
          >
            {event.city}
          </h4>

          {event.mapUrl && (
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`${merri.className}
              inline-flex items-center gap-1
              text-black hover:text-blue-600
              transition-colors
              text-[14px] uppercase
              mt-[6px]
            `}
            >
              <MapPin size={18} />
              <span>View in Map</span>
            </a>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p
            className={`${merri.className}
            text-black
            font-light
            italic
            text-[16px] md:text-[18px] 
            py-6
          `}
          >
            {event.description.length > 300
              ? event.description.slice(0, 300) + '...'
              : event.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex flex-col items-center pb-8 gap-4">
          {/* View details */}
          <div
            className={`${merri.className}
      flex items-center gap-2
      text-[#1D5C75]
      text-[16px] md:text-[18px]
      font-bold uppercase
    `}
          >
            <span>View Details</span>
          </div>

          {/* Gallery preview thumbnails */}
          {event.gallery && event.gallery.length > 0 && (
            <div className="flex items-center gap-2">
              {event.gallery.slice(0, 4).map((img, index) => (
                <div key={index} className="w-14 h-14 overflow-hidden">
                  <img
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* +X indicator if more images */}
              {event.gallery.length > 4 && (
                <div
                  className="w-14 h-14 flex items-center justify-center
            bg-black/10 text-black text-[14px] font-semibold"
                >
                  +{event.gallery.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const showTabs = upcomingEvents.length > 0 && pastEvents.length > 0

  return (
    <div className="min-h-screen">
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
        {/* Web Asset – TOP CENTER */}
        <div className="hidden sm:block py-10">
          <Navbar textColor="#1D5C75" isNotHome />
        </div>
        <div>
          <MobileNavbar textColor="#1D5C75" isNotHome />
        </div>
      </div>
      <div className="">
        {/* Hero Section */}
        <div className="bg-[#1D5C75] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className={`font-neco text-4xl md:text-5xl font-bold mb-4`}>
              Events
            </h1>
            <p
              className={`${merri.className} text-lg md:text-xl text-white max-w-2xl`}
            >
              {upcomingEvents.length > 0
                ? 'Discover our upcoming events and relive the memories from past gatherings'
                : 'Relive the memories from our past events'}
            </p>
          </div>
        </div>

        {/* Tabs  */}
        <div
          className="relative w-full bg-texture"
          style={{
            backgroundImage: "url('/MD-Texture_BG_Blue-01-04.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: '240px 240px',
          }}
        >
          {showTabs && (
            <div
              className={`max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 ${
                showTabs ? 'pt-12' : 'pt-8'
              }`}
            >
              <div className="bg-white shadow-md p-2 inline-flex gap-2">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-6 py-3  ${merri.className} font-semibold  transition-all ${
                    activeTab === 'upcoming'
                      ? 'bg-[#1D5C75CC] text-white shadow-md'
                      : 'text-[#1d5c7f] hover:bg-gray-100'
                  }`}
                >
                  Upcoming Events
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`px-6 py-3 ${merri.className} font-semibold transition-all ${
                    activeTab === 'past'
                      ? 'bg-[#1D5C75CC] text-white shadow-md'
                      : 'text-[#1d5c7f] hover:bg-gray-100'
                  }`}
                >
                  Past Events
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Events Grid */}
        <div
          className="relative w-full bg-texture"
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
          <div
            className={`max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 ${
              showTabs ? 'py-12' : 'py-8'
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="inline-block animate-spin h-12 w-12 border-4 border-t-transparent"></div>
              </div>
            ) : (
              <>
                {(activeTab === 'upcoming' || !showTabs) &&
                  upcomingEvents.length > 0 && (
                    <div>
                      {!showTabs && (
                        <h2
                          className={`${merri.className} text-2xl font-bold mb-6`}
                        >
                          Upcoming Events
                        </h2>
                      )}
                      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    </div>
                  )}

                {(activeTab === 'past' ||
                  (upcomingEvents.length === 0 && !showTabs)) && (
                  <>
                    {pastEvents.length === 0 ? (
                      <div className="text-center py-20">
                        <Calendar
                          size={64}
                          className="mx-auto mb-4 text-white"
                        />
                        <h3 className="text-xl font-semibold text-white mb-2">
                          No Past Events
                        </h3>
                        <p className="text-gray-500">
                          Past events will appear here once they conclude.
                        </p>
                      </div>
                    ) : (
                      <div>
                        {!showTabs && (
                          <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Past Events
                          </h2>
                        )}
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                          {pastEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {upcomingEvents.length === 0 && pastEvents.length === 0 && (
                  <div className="text-center py-20">
                    <Calendar size={64} className="mx-auto mb-4 text-white" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Events Yet
                    </h3>
                    <p className="text-gray-500">
                      Check back soon for upcoming events!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default EventsPage
