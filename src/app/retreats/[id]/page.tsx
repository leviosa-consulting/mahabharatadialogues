// app/retreats/[id]/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

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
  subtitle: string
  day1: DaySchedule
  day2: DaySchedule
  footerNote: string
}

const RetreatDetailPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const [retreat, setRetreat] = useState<Retreat | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchRetreat(params.id as string)
    }
  }, [params.id])

  const fetchRetreat = async (id: string) => {
    try {
      const response = await fetch('/api/retreats')
      const data = await response.json()
      
      if (data.success) {
        const foundRetreat = data.data.find((r: Retreat) => r.id === id)
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

  const renderScheduleSection = (section: ScheduleSection, index: number, isLastActivity: boolean) => {
    if (section.type === 'meal') {
      return (
        <div key={index} className="bg-[#60a5fa] text-white px-4 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center">
          <span>{section.title}</span>
          <span className="text-[16px] md:text-lg">{section.time}</span>
        </div>
      )
    }

    return (
      <div key={index} className="space-y-2">
        {section.items?.map((item, itemIndex) => (
          <div key={itemIndex} className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <div className="font-semibold text-md leading-snug">
                {item.title}
              </div>
              {item.description && (
                <div className={`text-sm text-gray-600 leading-tight mt-0.5 ${isLastActivity && itemIndex === section.items!.length - 1 ? 'pb-8' : ''}`}>
                  {item.description}
                </div>
              )}
            </div>
            <div className="text-md whitespace-nowrap pt-0.5">
              {item.time}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading retreat schedule...</p>
        </div>
      </div>
    )
  }

  if (error || !retreat) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Retreat Not Found</h2>
          <p className="text-gray-600 mb-6">The retreat you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/retreats')}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Retreats
          </button>
        </div>
      </div>
    )
  }

  const days = [
    { day: 1, date: retreat.day1.date, dayName: retreat.day1.dayName },
    { day: 2, date: retreat.day2.date, dayName: retreat.day2.dayName }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push('/retreats')}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to All Retreats</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#282828] text-white py-12 md:py-24 px-6 relative overflow-hidden">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-lg mb-2">Mahabharata Dialogues</div>
            <h1 className="text-4xl md:text-5xl font-bold">The Retreat</h1>
          </div>
          <div className="hidden md:block w-px h-24 bg-white/60" />
          <div className="text-center md:text-left">
            <p className="text-lg italic leading-relaxed">
              An immersive two-day residential retreat with every moment<br className="hidden md:block" /> revolving around the Mahabharata.
            </p>
          </div>
        </div>
      </div>

      {/* Day circles - Desktop */}
      <div className="w-full hidden relative z-10 mx-auto -mt-18 md:flex flex-col md:flex-row items-center justify-center gap-8 md:gap-84">
        {days.map((dayInfo) => (
          <div key={dayInfo.day} className="w-40 h-40 md:w-44 md:h-44 rounded-full bg-red-600 shadow-xl text-white flex items-center justify-center">
            <div className="text-center leading-tight">
              <div className="text-xs tracking-wide mb-1">-DAY {dayInfo.day}-</div>
              <div className="text-xl md:text-2xl font-semibold">{dayInfo.date}</div>
              <div className="text-sm mt-1">{dayInfo.dayName}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Day circle Mobile - Day 1 */}
      <div className="sm:hidden flex justify-center items-center mt-4">
        <div className="w-40 h-40 rounded-full bg-red-600 shadow-xl text-white flex items-center justify-center">
          <div className="text-center leading-tight">
            <div className="text-xs tracking-wide mb-1">-DAY 1-</div>
            <div className="text-xl font-semibold">{days[0].date}</div>
            <div className="text-sm mt-1">{days[0].dayName}</div>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:mt-8 md:grid-cols-2 lg:mx-10 xl:mx-30">
        {/* Day 1 Column */}
        <div className="md:border-r-2 border-black">
          <div className="px-6 md:px-8 py-6 md:py-0 space-y-4">
            {retreat.day1.schedule.map((section, index) => 
              renderScheduleSection(section, index, index === retreat.day1.schedule.length - 1)
            )}
          </div>
        </div>

        {/* Day 2 Column */}
        <div>
          {/* Day circle Mobile - Day 2 */}
          <div className="sm:hidden flex justify-center items-center mt-4">
            <div className="w-40 h-40 rounded-full bg-red-600 shadow-xl text-white flex items-center justify-center">
              <div className="text-center leading-tight">
                <div className="text-xs tracking-wide mb-1">-DAY 2-</div>
                <div className="text-xl font-semibold">{days[1].date}</div>
                <div className="text-sm mt-1">{days[1].dayName}</div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 md:px-8 md:py-0 space-y-4">
            {retreat.day2.schedule.map((section, index) => 
              renderScheduleSection(section, index, false)
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-md text-gray-500 py-4 border-t-2 border-black md:mx-10 lg:mx-30">
        * Optional/Simultaneous events
      </div>
    </div>
  )
}

export default RetreatDetailPage