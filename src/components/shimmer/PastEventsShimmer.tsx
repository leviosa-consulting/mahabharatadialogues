import React from 'react'

const PastEventsShimmer = () => {
  // Create 3 shimmer cards
  const shimmerCards = [1, 2, 3]

  return (
    <div className="px-4 relative xl:mx-30 max-w-full overflow-x-hidden">
      <div className="grid grid-cols-12 gap-0 md:gap-8">
        {shimmerCards.map((index) => (
          <div
            key={index}
            className="col-span-12 md:col-start-2 md:col-span-10 bg-[#FFFFFFCC] mb-6 min-w-0 animate-pulse"
          >
            <div className="grid grid-cols-12 gap-4 md:flex md:flex-row md:justify-between px-4 md:px-8 py-6">
              {/* LEFT TEXT SHIMMER */}
              <div className="col-span-12 md:flex-1 flex flex-col justify-between max-w-full md:max-w-[400px] text-center md:text-left">
                <div>
                  {/* Title Shimmer */}
                  <div className="h-7 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded w-3/4 mx-auto md:mx-0 mb-2" />
                  <div className="h-7 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded w-1/2 mx-auto md:mx-0 mb-2" />

                  {/* Date Shimmer */}
                  <div className="h-5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded w-2/3 mx-auto md:mx-0 mb-1" />

                  {/* Venue Shimmer */}
                  <div className="h-5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded w-1/2 mx-auto md:mx-0" />
                </div>

                {/* DESKTOP BUTTON SHIMMER */}
                <div className="hidden md:block mt-4 w-[80%]">
                  <div className="h-12 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded" />
                </div>
              </div>

              {/* IMAGES SHIMMER */}
              <div className="col-span-12 md:flex md:flex-row gap-2 mt-4 md:mt-0 justify-center md:justify-start min-w-0">
                {/* Main Image Shimmer */}
                <div className="w-full md:w-[280px] lg:w-[320px] xl:w-[360px]">
                  <div className="w-full aspect-465/285 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer" />
                </div>

                {/* Gallery Thumbnails Shimmer */}
                <div className="flex flex-row md:flex-col gap-2 justify-center mt-2 md:mt-0">
                  <div className="w-[64px] h-[64px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer" />
                  <div className="w-[64px] h-[64px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer" />
                  <div className="w-[64px] h-[64px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer" />
                </div>
              </div>

              {/* MOBILE BUTTON SHIMMER */}
              <div className="col-span-12 mt-4 md:hidden">
                <div className="h-12 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  )
}

export default PastEventsShimmer