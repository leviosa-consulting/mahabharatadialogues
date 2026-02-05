import React from 'react'

const BlogsShimmer = () => {
  return (
    <div className="px-4">
      <div className="flex flex-col">
        {/* Generate 3 shimmer cards */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className=" bg-[#FFFFFF] mb-4 animate-pulse"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Left: Image Shimmer */}
              <div className="w-full md:w-[340px] flex-shrink-0">
                <div className="w-full h-[226px] md:w-[340px] md:h-[226px] bg-gray-300"></div>
              </div>

              {/* Right: Content Shimmer */}
              <div className="flex-1 flex px-4 md:px-8 py-4 flex-col justify-between">
                <div className="space-y-3">
                  {/* Title shimmer */}
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>

                  {/* Date and author shimmer */}
                  <div className="h-4 bg-gray-300 rounded w-1/3 mt-4"></div>

                  {/* Subtitle shimmer */}
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogsShimmer