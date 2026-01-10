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
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-56 overflow-hidden">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
            <Calendar size={64} className="text-purple-400" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
          <span className="text-sm font-semibold text-purple-600">
            {new Date(event.eventDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors h-16 overflow-hidden">
          {event?.title?.length > 60
            ? event.title.substring(0, 60) + '...'
            : event?.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Calendar size={16} />
          <span>{formatDate(event.eventDate)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Clock size={16} />
          <span>{formatTime(event.eventDate)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin size={16} />
          <span className="line-clamp-1">{event.venue}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event?.description?.length > 80
            ? event.description.substring(0, 80) + '...'
            : event?.description}
        </p>

        <div className="flex items-center justify-between">
          {event.gallery && event.gallery.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <ImageIcon size={16} />
              <span>{event.gallery.length} photos</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
            <span>View Details</span>
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </div>
  )

  const showTabs = upcomingEvents.length > 0 && pastEvents.length > 0

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Web Asset – TOP CENTER */}
      <Link href="/" className="flex justify-center items-center z-20 mt-10">
        <img
          src="/Web_Assets-08.png"
          alt="Home"
          className="w-28 h-28 md:w-44 md:h-44 cursor-pointer"
        />
      </Link>

      <div className="-mt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl">
              {upcomingEvents.length > 0
                ? 'Discover our upcoming events and relive the memories from past gatherings'
                : 'Relive the memories from our past events'}
            </p>
          </div>
        </div>

        {/* Tabs - Only show if both upcoming and past events exist */}
        {showTabs && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
            <div className="bg-white rounded-lg shadow-md p-2 inline-flex gap-2">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${
                  activeTab === 'upcoming'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Upcoming Events
                {upcomingEvents.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                    {upcomingEvents.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${
                  activeTab === 'past'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Past Events
                {pastEvents.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                    {pastEvents.length}
                  </span>
                )}
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
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {(activeTab === 'upcoming' || !showTabs) &&
                upcomingEvents.length > 0 && (
                  <div>
                    {!showTabs && (
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
                        className="mx-auto mb-4 text-gray-400"
                      />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
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
                  <Calendar size={64} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
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
