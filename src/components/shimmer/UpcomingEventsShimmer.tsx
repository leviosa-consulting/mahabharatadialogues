import React from 'react'

const UpcomingEventsShimmer = () => {
  // Create 3 shimmer cards
  const shimmerCards = [1, 2, 3]

  return (
    <div
      className={`flex items-start gap-8 md:gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mt-20 pb-8 px-4 scroll-pl-4 md:scroll-pl-0 md:pl-[8%] lg:pl-[8%]`}
    >
      {shimmerCards.map((index) => (
        <div
          key={index}
          className="snap-start shrink-0 flex flex-col gap-3
            w-[90%]
            sm:w-[60%] md:w-[50%] lg:w-[42%] xl:w-[30%]
            bg-[#1D5C75CC] self-start animate-pulse"
        >
          {/* Image Shimmer */}
          <div className="relative w-full">
            <div className="aspect-465/285 w-full bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer" />
          </div>

          <div className="flex flex-col px-4 justify-center items-center text-center w-full">
            {/* Title Shimmer */}
            <div className="w-3/4 h-8 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer rounded mb-2" />
            <div className="w-1/2 h-8 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer rounded mb-2" />

            {/* Date/Time Shimmer */}
            <div className="w-2/3 h-5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer rounded mb-3" />

            {/* Venue Shimmer */}
            <div className="w-1/2 h-5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer rounded mb-1" />
            <div className="w-1/3 h-5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer rounded mb-2" />

            {/* Map Link Shimmer */}
            <div className="w-32 h-4 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer rounded mb-4" />

            {/* Description Shimmer */}
            <div className="w-full space-y-2 my-4">
              <div className="h-4 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer rounded" />
              <div className="h-4 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer rounded" />
              <div className="h-4 w-3/4 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer rounded" />
            </div>
          </div>

          {/* Buttons Shimmer */}
          <div className="flex justify-center items-center gap-2 pb-8 w-[80%] mx-auto">
            <div className="flex-1 h-12 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer rounded" />
            <div className="w-14 h-14 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-[length:200%_100%] animate-shimmer" />
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
    </div>
  )
}

export default UpcomingEventsShimmer