'use client'

import React from 'react'
import { merri } from '@/app/fonts/merri'
import Navbar from '@/components/Navbar'
import MobileNavbar from '@/components/MobileNavbar'
import Footer from '@/components/Footer'

const EventsPageShimmer = () => {
  // Create array for 6 shimmer cards (2 rows of 3 in lg)
  const shimmerCards = Array(6).fill(null)

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
        <div className="hidden sm:block pt-5 -mb-7">
          <Navbar textColor="#1D5C75" isNotHome />
        </div>
        <div>
          <MobileNavbar textColor="#1D5C75" isNotHome />
        </div>
      </div>

      <div className="">
        {/* Hero Section Shimmer */}
        <div className="bg-[#1D5C75] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-10 md:h-12 bg-white/20 animate-pulse rounded w-48 mb-4" />
            <div className="h-6 md:h-7 bg-white/20 animate-pulse rounded w-full max-w-2xl" />
          </div>
        </div>

        {/* Tabs Shimmer */}
        <div
          className="relative w-full bg-texture"
          style={{
            backgroundImage: "url('/MD-Texture_BG_Blue-01-04.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: '240px 240px',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 pt-12">
            <div className="bg-white shadow-md p-2 inline-flex gap-2">
              <div className="w-40 h-12 bg-gray-300 animate-pulse rounded" />
              <div className="w-32 h-12 bg-gray-300 animate-pulse rounded" />
            </div>
          </div>
        </div>

        {/* Events Grid Shimmer */}
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
          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {shimmerCards.map((_, index) => (
                <EventCardShimmer key={index} />
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

const EventCardShimmer = () => (
  <div className="flex flex-col items-center bg-white shadow-2xl">
    {/* Image Shimmer */}
    <div className="w-full h-[260px] bg-gray-300 animate-pulse" />

    {/* Content Shimmer */}
    <div className="flex flex-col justify-center items-center text-center px-4 md:px-10 w-full">
      {/* Title Shimmer */}
      <div className="w-4/5 h-8 md:h-10 bg-gray-300 animate-pulse rounded mt-6" />
      <div className="w-3/5 h-8 md:h-10 bg-gray-300 animate-pulse rounded mt-2" />

      {/* Date Shimmer */}
      <div className="w-3/4 h-5 md:h-6 bg-gray-300 animate-pulse rounded mt-4" />

      {/* Venue Shimmer */}
      <div className="flex flex-col items-center mt-3 w-full">
        <div className="w-2/3 h-5 md:h-6 bg-gray-300 animate-pulse rounded" />
        <div className="w-1/2 h-5 md:h-6 bg-gray-300 animate-pulse rounded mt-1" />
        <div className="w-32 h-4 bg-gray-300 animate-pulse rounded mt-2" />
      </div>

      {/* Description Shimmer */}
      <div className="w-full space-y-2 py-6">
        <div className="h-4 md:h-5 bg-gray-300 animate-pulse rounded w-full" />
        <div className="h-4 md:h-5 bg-gray-300 animate-pulse rounded w-full" />
        <div className="h-4 md:h-5 bg-gray-300 animate-pulse rounded w-5/6" />
        <div className="h-4 md:h-5 bg-gray-300 animate-pulse rounded w-4/5" />
      </div>

      {/* Footer Shimmer */}
      <div className="flex flex-col items-center pb-8 gap-4 w-full">
        {/* View Details Button Shimmer */}
        <div className="w-32 h-5 bg-gray-300 animate-pulse rounded" />

        {/* Gallery Thumbnails Shimmer */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-14 h-14 bg-gray-300 animate-pulse rounded"
            />
          ))}
          <div className="w-14 h-14 bg-gray-300 animate-pulse rounded" />
        </div>
      </div>
    </div>
  </div>
)

export default EventsPageShimmer