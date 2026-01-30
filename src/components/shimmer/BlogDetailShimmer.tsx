'use client'

import React from 'react'
import { merri } from '@/app/fonts/merri'

const BlogDetailShimmer = () => {
  return (
    <div className="w-full min-h-screen bg-[#1D5C75CC]">
      <div className="md:mx-1 lg:mx-4 xl:mx-30 2xl:mx-40">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-start-2 md:col-span-10">
            {/* Image Shimmer */}
            <div className="overflow-hidden">
              <div className="w-full md:aspect-963/462 bg-gray-300 animate-pulse" />
            </div>

            <div className="bg-white">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 col-start-1 lg:col-start-2 lg:col-span-10 p-4 sm:py-4 lg:p-8">
                  <div className="w-full">
                    <div className="flex flex-col items-start text-start w-full">
                      {/* Title and Close Button */}
                      <div className="flex justify-between items-start w-full gap-4 mb-4 md:mb-8">
                        <div className="flex-1">
                          <div className="h-8 sm:h-10 md:h-12 lg:h-[45px] bg-gray-300 animate-pulse rounded w-3/4" />
                        </div>
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-[45px] lg:h-[45px] bg-gray-300 animate-pulse rounded" />
                      </div>

                      {/* Author and Share Section */}
                      <div className="flex justify-between items-start sm:items-center w-full gap-3 mb-6 sm:mb-10">
                        <div className="space-y-2">
                          {/* Author Name */}
                          <div className="h-6 sm:h-7 bg-gray-300 animate-pulse rounded w-32 sm:w-40" />
                          {/* Date */}
                          <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-36 sm:w-44" />
                        </div>

                        {/* Share Button */}
                        <div className="h-9 sm:h-11 bg-gray-300 animate-pulse rounded w-24 sm:w-28" />
                      </div>

                      {/* Read Time and Categories */}
                      <div className="flex flex-wrap items-center mb-8 sm:mb-10 gap-4">
                        <div className="h-5 sm:h-6 bg-gray-300 animate-pulse rounded w-24" />
                        <div className="h-5 sm:h-6 bg-gray-300 animate-pulse rounded w-28" />
                        <div className="h-5 sm:h-6 bg-gray-300 animate-pulse rounded w-32" />
                      </div>
                    </div>

                    {/* Subtitle */}
                    <div className="mb-4 sm:mb-6">
                      <div className="h-6 sm:h-7 md:h-8 bg-gray-300 animate-pulse rounded w-full mb-2" />
                      <div className="h-6 sm:h-7 md:h-8 bg-gray-300 animate-pulse rounded w-2/3" />
                    </div>
                  </div>

                  {/* Content Shimmer */}
                  <div className="space-y-4">
                    {/* Paragraph 1 */}
                    <div className="space-y-2">
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-full" />
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-full" />
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-5/6" />
                    </div>

                    {/* Paragraph 2 */}
                    <div className="space-y-2 mt-6">
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-full" />
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-full" />
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-4/5" />
                    </div>

                    {/* Heading */}
                    <div className="mt-8">
                      <div className="h-7 sm:h-8 bg-gray-300 animate-pulse rounded w-2/5" />
                    </div>

                    {/* Paragraph 3 */}
                    <div className="space-y-2 mt-4">
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-full" />
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-full" />
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-3/4" />
                    </div>

                    {/* Paragraph 4 */}
                    <div className="space-y-2 mt-6">
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-full" />
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-full" />
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-11/12" />
                    </div>

                    {/* Heading */}
                    <div className="mt-8">
                      <div className="h-7 sm:h-8 bg-gray-300 animate-pulse rounded w-1/3" />
                    </div>

                    {/* Paragraph 5 */}
                    <div className="space-y-2 mt-4">
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-full" />
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-full" />
                      <div className="h-4 sm:h-5 bg-gray-300 animate-pulse rounded w-2/3" />
                    </div>
                  </div>
                </div>

                {/* Related Blogs Shimmer */}
                <div className="bg-[#47ABD8B2] col-span-12 md:col-start-1 lg:col-start-2 lg:col-span-10 m-4 sm:my-4 lg:m-8">
                  <div className="h-6 bg-gray-400 animate-pulse rounded w-32 mx-auto my-6" />

                  <div className="flex flex-col items-center gap-6 px-4 sm:px-8 md:px-16 lg:px-24 pb-10">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-full max-w-2xl bg-white">
                        {/* Blog Card Shimmer */}
                        <div className="animate-pulse">
                          <div className="aspect-video bg-gray-300 w-full" />
                          <div className="p-4 space-y-3">
                            <div className="h-6 bg-gray-300 rounded w-3/4" />
                            <div className="h-4 bg-gray-300 rounded w-full" />
                            <div className="h-4 bg-gray-300 rounded w-5/6" />
                            <div className="flex gap-2 mt-4">
                              <div className="h-6 bg-gray-300 rounded w-20" />
                              <div className="h-6 bg-gray-300 rounded w-24" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailShimmer