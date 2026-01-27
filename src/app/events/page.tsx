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

  const handleEventClick = (slug: string) => {
    router.push(`/events/${slug}`)
  }

  const EventCard = ({ event }: { event: Event }) => (
    <div
      onClick={() => handleEventClick(event.slug)}
      className="bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-56 overflow-hidden">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar size={64} className="text-[#1D5C75CC]" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 shadow-md">
          <span className="text-sm font-semibold text-[#1D5C75CC]">
            {new Date(event.eventDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3
          className={`${merri.className} text-[32px] font-bold transition-colors text-[#1d5c7f] overflow-hidden mb-2`}
        >
          {event?.title?.length > 60
            ? event.title.substring(0, 60) + '...'
            : event?.title}
        </h3>

        <div
          className={`flex ${merri.className} text-[16px] md:text-[18px] items-center gap-2 text-sm text-[#1d5c7f] leading-[1.5]`}
        >
          <Calendar size={18} />
          <span>{formatDate(event.eventDate)}</span>
        </div>

        <div
          className={`flex ${merri.className} text-[16px] md:text-[18px] items-center gap-2 text-sm leading-none text-[#1d5c7f] mb-4`}
        >
          <Clock size={18} />
          <span>{formatTime(event.eventDate)}</span>
        </div>

        <div
          className={`flex flex-col ${merri.className} text-[16px] md:text-[18px] items-start gap-2 text-[#1d5c7f] mb-4`}
        >
          <span className="leading-none">
            {event.venue}, {event.city}
          </span>

          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Maps"
            className={` ${merri.className}
              inline-flex items-center gap-1
              text-[#1d5c7f] hover:text-blue-300
              transition-colors
              shrink-0
              leading-none text-[16px] mt-1
            `}
          >
            <MapPin size={18} />
            <span>View in Map</span>
          </a>
        </div>

        <p
          className={`text-[#1d5c7f] ${merri.className} text-[16px] md:text-[18px] mb-4 line-clamp-3`}
        >
          {event?.description?.length > 80
            ? event.description.substring(0, 80) + '...'
            : event?.description}
        </p>

        <div className="flex items-center justify-between">
          {event.gallery && event.gallery.length > 0 && (
            <div className="flex items-center gap-1  text-[#1d5c7f]">
              <ImageIcon size={16} />
              <span>{event.gallery.length} photos</span>
            </div>
          )}
          <div
            className={`flex ${merri.className} items-center gap-2 text-[16px] md:text-[18px] text-[#1d5c7f] font-semibold group-hover:gap-3 transition-all`}
          >
            <span>View Details</span>
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </div>
  )

  const showTabs = upcomingEvents.length > 0 && pastEvents.length > 0

  return (
    <div className="min-h-screen">
      {/* Web Asset – TOP CENTER */}
      <div className="hidden sm:block py-10">
        <Navbar textColor="#1D5C75" isNotHome/>
      </div>
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
        {showTabs && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
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

        {/* Events Grid */}
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
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
                      <Calendar size={64} className="mx-auto mb-4 text-white" />
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
      </div>
    </div>
  )
}

export default EventsPage
