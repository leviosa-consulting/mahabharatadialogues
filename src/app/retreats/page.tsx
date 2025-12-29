// components/RetreatScheduleDisplay.tsx
'use client'

import React, { useState, useEffect } from 'react'

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

const RetreatScheduleDisplay: React.FC = () => {
  const [retreat, setRetreat] = useState<Retreat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLatestRetreat()
  }, [])

  const fetchLatestRetreat = async () => {
    try {
      const response = await fetch('/api/retreats')
      const data = await response.json()
      if (data.success && data.data.length > 0) {
        // Get the most recent retreat
        setRetreat(data.data[0])
      }
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch retreat:', err)
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
                <div className={`text-sm text-gray-600 leading-tight mt-0.5 ${isLastActivity && itemIndex === (section.items?.length || 0) - 1 ? 'pb-8' : ''}`}>
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading retreat schedule...</p>
        </div>
      </div>
    )
  }

  if (!retreat) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No retreat schedule available.</p>
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
      {/* Header */}
      <div className="bg-[#282828] text-white py-12 md:py-24 px-6 relative overflow-hidden">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-lg mb-2">{retreat.title}</div>
            <h1 className="text-4xl md:text-5xl font-bold">The Retreat</h1>
          </div>
          <div className="hidden md:block w-px h-24 bg-white/60" />
          <div className="text-center md:text-left">
            <p className="text-lg italic leading-relaxed">
              {retreat.subtitle}
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
        {retreat.footerNote}
      </div>
    </div>
  )
}

export default RetreatScheduleDisplay