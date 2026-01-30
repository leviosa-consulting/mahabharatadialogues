'use client'

import React from 'react'
import { merri } from '@/app/fonts/merri'

const EventDetailShimmer = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section Shimmer */}
      <div className="relative h-96 bg-gray-300 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-400/90 via-gray-400/50 to-transparent" />
        
        <div
          className={`relative ${merri.className} h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12`}
        >
          {/* Back Button Shimmer */}
          <div className="w-32 h-6 bg-white/30 animate-pulse rounded mb-6" />
          
          {/* Title Shimmer */}
          <div className="space-y-3">
            <div className="h-12 md:h-14 bg-white/30 animate-pulse rounded w-3/4" />
            <div className="h-12 md:h-14 bg-white/30 animate-pulse rounded w-1/2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={`max-w-7xl ${merri.className} mx-auto px-4 sm:px-6 lg:px-8 py-12`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Shimmer */}
            <div className="bg-white shadow-md p-8">
              <div className="h-7 bg-gray-300 animate-pulse rounded w-48 mb-4" />
              <div className="space-y-3">
                <div className="h-5 bg-gray-300 animate-pulse rounded w-full" />
                <div className="h-5 bg-gray-300 animate-pulse rounded w-full" />
                <div className="h-5 bg-gray-300 animate-pulse rounded w-full" />
                <div className="h-5 bg-gray-300 animate-pulse rounded w-5/6" />
                <div className="h-5 bg-gray-300 animate-pulse rounded w-full" />
                <div className="h-5 bg-gray-300 animate-pulse rounded w-4/5" />
                <div className="h-5 bg-gray-300 animate-pulse rounded w-full" />
                <div className="h-5 bg-gray-300 animate-pulse rounded w-3/4" />
              </div>
            </div>

            {/* YouTube Video Shimmer */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gray-300 animate-pulse rounded" />
                <div className="h-7 bg-gray-300 animate-pulse rounded w-32" />
              </div>
              <div className="relative aspect-video rounded-lg bg-gray-300 animate-pulse" />
            </div>

            {/* Gallery Shimmer */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gray-300 animate-pulse rounded" />
                <div className="h-7 bg-gray-300 animate-pulse rounded w-36" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="relative aspect-square bg-gray-300 animate-pulse rounded"
                  />
                ))}
              </div>
            </div>

            {/* Testimonial Shimmer */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gray-300 animate-pulse rounded flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-7 bg-gray-300 animate-pulse rounded w-36 mb-4" />
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-300 animate-pulse rounded w-full" />
                    <div className="h-6 bg-gray-300 animate-pulse rounded w-full" />
                    <div className="h-6 bg-gray-300 animate-pulse rounded w-5/6" />
                    <div className="h-6 bg-gray-300 animate-pulse rounded w-4/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Shimmer */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="h-6 bg-gray-300 animate-pulse rounded w-32 mb-4" />

              <div className="space-y-4 mb-6">
                {/* Date */}
                <div>
                  <div className="h-4 bg-gray-300 animate-pulse rounded w-12 mb-1" />
                  <div className="h-5 bg-gray-300 animate-pulse rounded w-full" />
                </div>

                {/* Time */}
                <div>
                  <div className="h-4 bg-gray-300 animate-pulse rounded w-12 mb-1" />
                  <div className="h-5 bg-gray-300 animate-pulse rounded w-24" />
                </div>

                {/* Venue */}
                <div>
                  <div className="h-4 bg-gray-300 animate-pulse rounded w-14 mb-1" />
                  <div className="h-5 bg-gray-300 animate-pulse rounded w-full" />
                </div>

                {/* Gallery Count */}
                <div>
                  <div className="h-4 bg-gray-300 animate-pulse rounded w-16 mb-1" />
                  <div className="h-5 bg-gray-300 animate-pulse rounded w-20" />
                </div>
              </div>

              {/* Book Now Button Shimmer */}
              <div className="w-full h-12 bg-gray-300 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailShimmer