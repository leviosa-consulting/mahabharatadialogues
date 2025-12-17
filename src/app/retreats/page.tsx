
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  Clock,
  Image as ImageIcon,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'

interface Retreat {
  id: string
  retreatstartData: string
  retreatendData: string
  title: string
  description?: string
  coverImage: string
  gallery?: string[]
  testimonial?: string
  bookingUrl?: string
  youtubeUrl?: string
  faqs?: Array<{ question: string; answer: string }>
}

const RetreatsPage = () => {
  const router = useRouter()
  const [retreats, setRetreats] = useState<Retreat[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    fetchRetreats()
  }, [])

  const fetchRetreats = async () => {
    try {
      const response = await fetch('/api/retreats')
      const data = await response.json()
      setRetreats(data.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch retreats:', err)
      setLoading(false)
    }
  }

  const getCurrentDate = () => {
    return new Date()
  }

  const filterRetreats = (type: 'upcoming' | 'past') => {
    const now = getCurrentDate()
    const filtered = retreats.filter((retreat) => {
      const endDate = new Date(retreat.retreatendData)
      if (type === 'upcoming') {
        return endDate >= now
      } else {
        return endDate < now
      }
    })

    return filtered.sort((a, b) => {
      const dateA = new Date(a.retreatstartData).getTime()
      const dateB = new Date(b.retreatstartData).getTime()
      if (type === 'upcoming') {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    })
  }

  const upcomingRetreats = filterRetreats('upcoming')
  const pastRetreats = filterRetreats('past')

  useEffect(() => {
    if (!loading && upcomingRetreats.length === 0 && pastRetreats.length > 0) {
      setActiveTab('past')
    }
  }, [loading, upcomingRetreats.length, pastRetreats.length])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  const handleRetreatClick = (retreatId: string) => {
    router.push(`/retreats/${retreatId}`)
  }

  const RetreatCard = ({ retreat }: { retreat: Retreat }) => {
    const isUpcoming = new Date(retreat.retreatendData) >= getCurrentDate()

    return (
      <div
        onClick={() => handleRetreatClick(retreat.id)}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      >
        <div className="relative h-56 overflow-hidden">
          {retreat.coverImage ? (
            <img
              src={retreat.coverImage}
              alt={retreat.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <Calendar size={64} className="text-purple-400" />
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
            <span className="text-sm font-semibold text-purple-600">
              {new Date(retreat.retreatstartData).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors h-16 overflow-hidden">
            {retreat?.title?.length > 60
              ? retreat.title.substring(0, 60) + '...'
              : retreat?.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar size={16} />
            <span className="line-clamp-2">
              {formatDateRange(retreat.retreatstartData, retreat.retreatendData)}
            </span>
          </div>

          {retreat.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {retreat?.description?.length > 80
                ? retreat.description.substring(0, 80) + '...'
                : retreat?.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {retreat.gallery && retreat.gallery.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <ImageIcon size={16} />
                  <span>{retreat.gallery.length}</span>
                </div>
              )}
              {retreat.faqs && retreat.faqs.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <HelpCircle size={16} />
                  <span>{retreat.faqs.length}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
              <span>View Details</span>
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const showTabs = upcomingRetreats.length > 0 && pastRetreats.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Retreats</h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl">
            {upcomingRetreats.length > 0
              ? 'Discover our upcoming retreats and relive the memories from past gatherings'
              : 'Relive the memories from our past retreats'}
          </p>
        </div>
      </div>

      {/* Tabs - Only show if both upcoming and past retreats exist */}
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
              Upcoming Retreats
              {upcomingRetreats.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                  {upcomingRetreats.length}
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
              Past Retreats
              {pastRetreats.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                  {pastRetreats.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Retreats Grid */}
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
              upcomingRetreats.length > 0 && (
                <div>
                  {!showTabs && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Upcoming Retreats
                    </h2>
                  )}
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingRetreats.map((retreat) => (
                      <RetreatCard key={retreat.id} retreat={retreat} />
                    ))}
                  </div>
                </div>
              )}

            {(activeTab === 'past' ||
              (upcomingRetreats.length === 0 && !showTabs)) && (
              <>
                {pastRetreats.length === 0 ? (
                  <div className="text-center py-20">
                    <Calendar
                      size={64}
                      className="mx-auto mb-4 text-gray-400"
                    />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Past Retreats
                    </h3>
                    <p className="text-gray-500">
                      Past retreats will appear here once they conclude.
                    </p>
                  </div>
                ) : (
                  <div>
                    {!showTabs && (
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Past Retreats
                      </h2>
                    )}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {pastRetreats.map((retreat) => (
                        <RetreatCard key={retreat.id} retreat={retreat} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {upcomingRetreats.length === 0 && pastRetreats.length === 0 && (
              <div className="text-center py-20">
                <Calendar size={64} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Retreats Yet
                </h3>
                <p className="text-gray-500">
                  Check back soon for upcoming retreats!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default RetreatsPage