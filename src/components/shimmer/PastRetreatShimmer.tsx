'use client'

import React from 'react'
import { merri } from '@/app/fonts/merri'
import Navbar from '@/components/Navbar'
import MobileNavbar from '@/components/MobileNavbar'
import Footer from '@/components/Footer'

const PastRetreatShimmer = () => {
  return (
    <div className="bg-[#1D5C75CC] w-full h-full">
      <div className="w-full">
        <div className="w-full">
          {/* Mobile Navbar */}
          <div className="sm:hidden">
            <div>
              <MobileNavbar textColor="#fff" isNotHome />
            </div>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden sm:block relative sm:pt-10 z-10">
            <Navbar textColor="#fff" isNotHome />
          </div>

          {/* Video Shimmer */}
          <div className="mx-4 2xl:mx-30 md:-mt-10 xl:-mt-8">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10">
                <div className="w-full aspect-video bg-gray-300 animate-pulse shadow-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Retreat Details Section Shimmer */}
        <div className="w-full">
          <div className="mx-4 2xl:mx-40 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-1 overflow-hidden p-3 lg:p-0">
              <div className="w-full order-1 sm:order-0 md:col-start-1 lg:col-start-2 col-span-12 lg:col-span-10 md:my-6">
                <div className="text-left mt-16">
                  {/* PAST RETREATS Label */}
                  <div className="h-6 w-40 bg-gray-300 animate-pulse rounded mb-2" />

                  {/* Mahabharata Dialogues */}
                  <div className="h-8 w-64 bg-gray-300 animate-pulse rounded mb-2" />

                  {/* Title */}
                  <div className="h-12 w-80 bg-gray-300 animate-pulse rounded mb-2" />

                  {/* Date Range */}
                  <div className="h-6 w-56 bg-gray-300 animate-pulse rounded mb-2" />

                  {/* Venue */}
                  <div className="h-6 w-72 bg-gray-300 animate-pulse rounded mb-6" />

                  {/* Description */}
                  <div className="space-y-3 py-6 max-w-4xl">
                    <div className="h-5 w-full bg-gray-300 animate-pulse rounded" />
                    <div className="h-5 w-full bg-gray-300 animate-pulse rounded" />
                    <div className="h-5 w-5/6 bg-gray-300 animate-pulse rounded" />
                    <div className="h-5 w-4/5 bg-gray-300 animate-pulse rounded" />
                  </div>

                  {/* Testimonials Carousel Shimmer */}
                  <TestimonialsCarouselShimmer />

                  {/* View Schedule Button */}
                  <div className="flex justify-center items-center mt-8">
                    <div className="h-12 w-48 bg-gray-300 animate-pulse rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Gallery Shimmer */}
        <div className="w-full py-16">
          <div className="mx-4 2xl:mx-30">
            <div className="max-w-7xl mx-auto">
              {/* Gallery Title */}
              <div className="h-10 md:h-12 w-40 bg-white/20 animate-pulse rounded mx-auto mb-12" />

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-300 animate-pulse rounded shadow-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

const TestimonialsCarouselShimmer = () => {
  return (
    <div className="w-full py-12">
      <div className="max-w-4xl mx-auto">
        {/* Carousel Container */}
        <div className="relative">
          {/* Main Testimonial Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            {/* Quote Icon Area */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-gray-300 animate-pulse rounded-full" />
            </div>

            {/* Quote Text */}
            <div className="space-y-3 mb-8">
              <div className="h-5 w-full bg-gray-300 animate-pulse rounded" />
              <div className="h-5 w-full bg-gray-300 animate-pulse rounded" />
              <div className="h-5 w-full bg-gray-300 animate-pulse rounded" />
              <div className="h-5 w-5/6 bg-gray-300 animate-pulse rounded mx-auto" />
              <div className="h-5 w-4/5 bg-gray-300 animate-pulse rounded mx-auto" />
            </div>

            {/* Name */}
            <div className="h-6 w-48 bg-gray-300 animate-pulse rounded mx-auto mb-2" />

            {/* Designation */}
            <div className="h-5 w-64 bg-gray-300 animate-pulse rounded mx-auto" />
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between items-center mt-6">
            <div className="w-10 h-10 bg-gray-300 animate-pulse rounded-full" />
            
            {/* Dots Indicator */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gray-300 animate-pulse rounded-full"
                />
              ))}
            </div>
            
            <div className="w-10 h-10 bg-gray-300 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PastRetreatShimmer