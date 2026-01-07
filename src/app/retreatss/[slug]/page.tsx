// app/retreats/[slug]/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Video, Image as ImageIcon } from 'lucide-react'
import { use } from 'react'

interface ScheduleItem {
  title: string
  description: string
  time: string
}

interface ScheduleSection {
  type: 'meal' | 'activities'
  title?: string
  time?: string
  items?: ScheduleItem[]
}

interface DaySchedule {
  date: string
  dayName: string
  schedule: ScheduleSection[]
}

interface Retreat {
  id: string
  title: string
  slug: string
  description?: string
  venue?: string
  youtube_video?: string
  photos?: string[]
  day1: DaySchedule
  day2: DaySchedule
  day3?: DaySchedule
}

export default function RetreatPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = use(params)
  const [retreat, setRetreat] = useState<Retreat | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRetreat()
  }, [resolvedParams.slug])

  const fetchRetreat = async () => {
    try {
      const response = await fetch(`/api/retreats/by-slug/${resolvedParams.slug}`)
      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Retreat not found')
        setLoading(false)
        return
      }

      setRetreat(data.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load retreat')
      setLoading(false)
    }
  }

  const renderScheduleSection = (section: ScheduleSection, index: number) => {
    if (section.type === 'meal') {
      return (
        <div
          key={index}
          className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-purple-900">{section.title}</h4>
              <p className="text-sm text-purple-700">{section.time}</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div key={index} className="space-y-3">
        {section.items?.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm"
          >
            <h4 className="font-semibold text-gray-900">{item.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            <p className="text-sm text-blue-600 mt-2 font-medium">{item.time}</p>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading retreat...</p>
        </div>
      </div>
    )
  }

  if (error || !retreat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Retreat Not Found
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="/"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {retreat.title}
          </h1>
          {retreat.description && (
            <p className="text-xl text-purple-100">{retreat.description}</p>
          )}
          {retreat.venue && (
            <div className="flex items-center gap-2 mt-4">
              <MapPin size={20} />
              <span className="text-lg">{retreat.venue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* YouTube Video */}
        {retreat.youtube_video && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Video className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Watch Video</h2>
            </div>
            <div className="aspect-video">
              <iframe
                src={retreat.youtube_video.replace('watch?v=', 'embed/')}
                className="w-full h-full rounded-lg"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Photos */}
        {retreat.photos && retreat.photos.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {retreat.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                />
              ))}
            </div>
          </div>
        )}

        {/* Schedule */}
        <div className="space-y-8">
          {/* Day 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <Calendar className="text-purple-600" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Day 1</h2>
                <p className="text-gray-600">
                  {retreat.day1.dayName}, {retreat.day1.date}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {retreat.day1.schedule.map((section, idx) =>
                renderScheduleSection(section, idx)
              )}
            </div>
          </div>

          {/* Day 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <Calendar className="text-purple-600" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Day 2</h2>
                <p className="text-gray-600">
                  {retreat.day2.dayName}, {retreat.day2.date}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {retreat.day2.schedule.map((section, idx) =>
                renderScheduleSection(section, idx)
              )}
            </div>
          </div>

          {/* Day 3 (if exists) */}
          {retreat.day3 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <Calendar className="text-purple-600" size={28} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Day 3</h2>
                  <p className="text-gray-600">
                    {retreat.day3.dayName}, {retreat.day3.date}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {retreat.day3.schedule.map((section, idx) =>
                  renderScheduleSection(section, idx)
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}