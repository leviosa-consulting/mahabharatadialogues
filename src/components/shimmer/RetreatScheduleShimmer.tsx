'use client'

import React from 'react'
import { merri } from '@/app/fonts/merri'
import Navbar from '@/components/Navbar'
import MobileNavbar from '@/components/MobileNavbar'
import Footer from '@/components/Footer'

const RetreatScheduleShimmer = () => {
  // Defaulting to 2 days as most retreats are 2-day events
  const isThreeDay = false
  const days = isThreeDay ? [1, 2, 3] : [1, 2]

  return (
    <div className="min-h-screen">
      {/* Mobile Navbar */}
      <div
        className="sm:hidden"
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
        <div>
          <MobileNavbar textColor="#1D5C75" isNotHome />
        </div>
      </div>

      {/* Desktop Navbar */}
      <div
        className="hidden sm:block relative sm:py-10 z-10"
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
        <Navbar textColor="#1D5C75" isNotHome />
      </div>

      {/* Header Shimmer */}
      <div className="bg-[#282828] text-white py-12 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Left Section */}
          <div className="text-center md:text-left">
            <div className="h-6 w-48 bg-white/20 animate-pulse rounded mb-2 mx-auto md:mx-0" />
            <div className="h-12 md:h-14 w-64 bg-white/20 animate-pulse rounded mx-auto md:mx-0" />
            <div className="h-5 w-56 bg-white/20 animate-pulse rounded mt-4 mx-auto md:mx-0" />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-28 bg-white/60" />

          {/* Right Section */}
          <div className="text-center md:text-left md:max-w-lg">
            <div className="space-y-2">
              <div className="h-5 w-full bg-white/20 animate-pulse rounded" />
              <div className="h-5 w-5/6 bg-white/20 animate-pulse rounded" />
            </div>
            <div className="h-5 w-48 bg-white/20 animate-pulse rounded mt-3 mx-auto md:mx-0" />
          </div>
        </div>
      </div>

      {/* Day Circles - Desktop */}
      <div
        className={`hidden md:grid ${
          isThreeDay ? 'md:grid-cols-3' : 'md:grid-cols-2'
        } relative z-10 -mt-18 lg:mx-10 xl:mx-25`}
      >
        {days.map((day) => (
          <div key={day} className="flex items-center justify-center">
            <div className="w-40 h-40 md:w-44 md:h-44 rounded-full bg-gray-300 animate-pulse shadow-xl" />
          </div>
        ))}
      </div>

      {/* Day Circle Mobile - Day 1 */}
      <div className="md:hidden flex justify-center items-center mt-4">
        <div className="w-40 h-40 rounded-full bg-gray-300 animate-pulse shadow-xl" />
      </div>

      {/* Schedule Grid */}
      <div
        className={`grid grid-cols-1 md:mt-8 ${
          isThreeDay ? 'md:grid-cols-3' : 'md:grid-cols-2'
        } lg:mx-10 xl:mx-25`}
      >
        {/* Day 1 Column */}
        <div className="border-b md:border-b-0 md:border-r border-black">
          <div className="px-2 md:px-8 py-6 md:py-0">
            <ScheduleColumnShimmer />
          </div>
        </div>

        {/* Day 2 Column */}
        <div className={isThreeDay ? 'md:border-r border-black' : ''}>
          {/* Day Circle Mobile - Day 2 */}
          <div className="md:hidden flex justify-center items-center mt-4">
            <div className="w-40 h-40 rounded-full bg-gray-300 animate-pulse shadow-xl" />
          </div>

          <div className={`px-2 py-6 md:px-8 md:py-0 ${isThreeDay ? '' : 'border-b md:border-b-0'}`}>
            <ScheduleColumnShimmer />
          </div>
        </div>

        {/* Day 3 Column (won't show since isThreeDay is false) */}
        {isThreeDay && (
          <div>
            {/* Day Circle Mobile - Day 3 */}
            <div className="md:hidden flex justify-center items-center mt-4">
              <div className="w-40 h-40 rounded-full bg-gray-300 animate-pulse shadow-xl" />
            </div>

            <div className="px-2 py-6 md:px-8 md:py-0">
              <ScheduleColumnShimmer />
            </div>
          </div>
        )}
      </div>

      {/* Footer Notes */}
      <div className="text-center py-4 border-t border-black md:mx-10 lg:mx-30">
        <div className="h-5 w-3/4 md:w-1/2 bg-gray-300 animate-pulse rounded mx-auto" />
      </div>

      {/* YouTube Video Section Shimmer */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="aspect-video w-full bg-gray-300 animate-pulse rounded overflow-hidden shadow-lg" />
      </div>

      {/* Photos Gallery Shimmer */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="aspect-square bg-gray-300 animate-pulse rounded shadow-md"
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1D5C75CC]">
        <Footer />
      </div>
    </div>
  )
}

const ScheduleColumnShimmer = () => (
  <div className="space-y-2">
    {/* Meal Section */}
    <div className="bg-gray-300 animate-pulse px-2 py-4 flex justify-between items-center">
      <div className="h-5 w-24 bg-gray-400 animate-pulse rounded" />
      <div className="h-5 w-16 bg-gray-400 animate-pulse rounded" />
    </div>

    {/* Activity Items */}
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="px-2 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <div className="h-4 w-4 bg-gray-300 animate-pulse rounded-full mt-1" />
              <div className="h-5 w-48 bg-gray-300 animate-pulse rounded" />
            </div>
            <div className="ml-6 mt-2 space-y-2">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
          <div className="h-5 w-16 bg-gray-300 animate-pulse rounded ml-4" />
        </div>
      </div>
    ))}

    {/* Another Meal Section */}
    <div className="bg-gray-300 animate-pulse px-2 py-4 flex justify-between items-center mt-4">
      <div className="h-5 w-20 bg-gray-400 animate-pulse rounded" />
      <div className="h-5 w-16 bg-gray-400 animate-pulse rounded" />
    </div>

    {/* More Activity Items */}
    {[1, 2, 3].map((i) => (
      <div key={`activity-${i}`} className="px-2 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <div className="h-4 w-4 bg-gray-300 animate-pulse rounded-full mt-1" />
              <div className="h-5 w-40 bg-gray-300 animate-pulse rounded" />
            </div>
            <div className="ml-6 mt-2 space-y-2">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-4/5 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
          <div className="h-5 w-16 bg-gray-300 animate-pulse rounded ml-4" />
        </div>
      </div>
    ))}

    {/* Final Meal Section */}
    <div className="bg-gray-300 animate-pulse px-2 py-4 flex justify-between items-center mt-4">
      <div className="h-5 w-16 bg-gray-400 animate-pulse rounded" />
      <div className="h-5 w-16 bg-gray-400 animate-pulse rounded" />
    </div>
  </div>
)

export default RetreatScheduleShimmer