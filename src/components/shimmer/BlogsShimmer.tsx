import React from 'react'


const BlogsShimmer = () => {
  // Create 3 shimmer cards to match typical loading state
  const shimmerCards = [1, 2, 3]

  return (
    <>
      {shimmerCards.map((index) => (
        <div
          key={index}
          className="col-span-12 md:col-start-2 md:col-span-10 bg-[#FFFFFF] mb-4 min-w-0 animate-pulse"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left: Image Shimmer */}
            <div className="w-full md:w-[340px] flex-shrink-0">
              <div className="w-full h-[226px] md:w-[340px] md:h-[226px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
            </div>

            {/* Right: Content Shimmer */}
            <div className="flex-1 flex px-4 md:px-8 py-4 flex-col justify-between">
              <div className="space-y-4">
                {/* Title Shimmer */}
                <div className="space-y-2">
                  <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />
                  <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-1/2" />
                </div>

                {/* Date and Author Shimmer */}
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-2/5" />

                {/* Subtitle Shimmer */}
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-full" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-5/6" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-4/5 md:hidden" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  )
}

export default BlogsShimmer