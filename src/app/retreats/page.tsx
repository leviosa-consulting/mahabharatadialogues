// app/retreats/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Calendar, ArrowRight, MapPin, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DaySchedule {
  date: string
  dayName: string
  schedule: any[]
}

interface Retreat {
  id: string
  title: string
  description?: string
  venue?: string
  youtube_video?: string
  photos?: string[]
  day1: DaySchedule
  day2: DaySchedule
  day3?: DaySchedule
  footerNote: string
  created_at: string
}

const RetreatsPage: React.FC = () => {
  const [retreats, setRetreats] = useState<Retreat[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchRetreats()
  }, [])

  const fetchRetreats = async () => {
    try {
      const response = await fetch('/api/retreats')
      const data = await response.json()
      
      if (data.success) {
        // Sort retreats: upcoming first (by day1 date), then by created_at
        const sorted = data.data.sort((a: Retreat, b: Retreat) => {
          const dateA = new Date(parseDate(a.day1.date))
          const dateB = new Date(parseDate(b.day1.date))
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const isUpcomingA = dateA >= today
          const isUpcomingB = dateB >= today

          // If one is upcoming and other is not, upcoming comes first
          if (isUpcomingA && !isUpcomingB) return -1
          if (!isUpcomingA && isUpcomingB) return 1

          // If both upcoming or both past, sort by date (upcoming: nearest first, past: most recent first)
          if (isUpcomingA && isUpcomingB) {
            return dateA.getTime() - dateB.getTime()
          } else {
            return dateB.getTime() - dateA.getTime()
          }
        })
        setRetreats(sorted)
      }
      setLoading(false)
    } catch (err) {
      console.error('Error fetching retreats:', err)
      setLoading(false)
    }
  }

  // Helper to parse "03 Aug 2024" format to Date
  const parseDate = (dateStr: string): Date => {
    const months: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    }
    const parts = dateStr.split(' ')
    const day = parseInt(parts[0])
    const month = months[parts[1]]
    const year = parseInt(parts[2])
    return new Date(year, month, day)
  }

  const isUpcoming = (dateStr: string): boolean => {
    const retreatDate = parseDate(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return retreatDate >= today
  }

  const getTotalScheduleSections = (retreat: Retreat): number => {
    let total = retreat.day1.schedule.length + retreat.day2.schedule.length
    if (retreat.day3) {
      total += retreat.day3.schedule.length
    }
    return total
  }

  const handleRetreatClick = (id: string) => {
    router.push(`/retreats/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading retreats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#282828] text-white py-12 md:py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-lg mb-2 font-merri">Mahabharata Dialogues</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-merri">Retreats</h1>
          <p className="text-lg font-neco italic">
            Explore our immersive residential retreats
          </p>
        </div>
      </div>

      {/* Retreats Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 font-merri">
        {retreats.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Retreats Available</h2>
            <p className="text-gray-600">Check back soon for upcoming retreat schedules.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retreats.map((retreat) => {
              const upcoming = isUpcoming(retreat.day1.date)
              const isThreeDay = !!retreat.day3
              
              return (
                <div
                  key={retreat.id}
                  onClick={() => handleRetreatClick(retreat.id)}
                  className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group hover:border-red-600"
                >
                  {/* Card Header */}
                  <div className={`${upcoming ? 'bg-red-600' : 'bg-gray-600'} text-white px-6 py-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold tracking-wide">
                          {upcoming ? 'UPCOMING' : 'PAST RETREAT'}
                        </span>
                       
                      </div>
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {retreat.title}
                    </h3>

                    {retreat.description && (
                      <p className="text-sm text-red-600 font-medium mb-2">
                        {retreat.description}
                      </p>
                    )}

                    {retreat.venue && (
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="text-gray-500 flex-shrink-0" size={16} />
                        <span className="text-sm text-gray-600">{retreat.venue}</span>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {/* Day 1 */}
                      <div className="flex items-start gap-3">
                        <Calendar className="text-red-600 mt-1 flex-shrink-0" size={18} />
                        <div>
                          <div className="font-semibold text-gray-900">Day 1</div>
                          <div className="text-sm text-gray-600">
                            {retreat.day1.date} • {retreat.day1.dayName}
                          </div>
                        </div>
                      </div>

                      {/* Day 2 */}
                      <div className="flex items-start gap-3">
                        <Calendar className="text-red-600 mt-1 flex-shrink-0" size={18} />
                        <div>
                          <div className="font-semibold text-gray-900">Day 2</div>
                          <div className="text-sm text-gray-600">
                            {retreat.day2.date} • {retreat.day2.dayName}
                          </div>
                        </div>
                      </div>

                      {/* Day 3 (if exists) */}
                      {retreat.day3 && (
                        <div className="flex items-start gap-3">
                          <Calendar className="text-red-600 mt-1 flex-shrink-0" size={18} />
                          <div>
                            <div className="font-semibold text-gray-900">Day 3</div>
                            <div className="text-sm text-gray-600">
                              {retreat.day3.date} • {retreat.day3.dayName}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {getTotalScheduleSections(retreat)} schedule sections
                        </div>
                        {retreat.photos && retreat.photos.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <ImageIcon size={16} />
                            <span>{retreat.photos.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <button className="text-red-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                      View Full Schedule
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default RetreatsPage