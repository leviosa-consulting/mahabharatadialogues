import React from 'react'

const TestimonialsShimmer = () => {
  return (
    <div
      className="w-full pb-30"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(29, 92, 117, 0.5),
            rgba(29, 92, 117, 0.5)
          ),
          url('/Blue_Background_with_Texture-01.png')
        `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Featured Event/Retreat Shimmer */}
      <div className="flex flex-col max-w-84 md:max-w-[480px] mx-auto justify-center items-center bg-[#1D5C75CC] py-2">
        {/* "COMING UP NEXT" shimmer */}
        <div className="h-6 w-40 bg-gray-400/30 rounded animate-pulse mt-6"></div>
        
        {/* Title shimmer */}
        <div className="h-8 md:h-10 w-64 md:w-80 bg-gray-400/30 rounded animate-pulse mt-4"></div>
        
        {/* Date shimmer */}
        <div className="h-6 w-48 bg-gray-400/30 rounded animate-pulse mt-3"></div>
        
        {/* Venue shimmer */}
        <div className="h-5 w-32 bg-gray-400/30 rounded animate-pulse mt-2 mb-2"></div>
        
        {/* Image shimmer */}
        <div className="w-full aspect-[4/3] bg-gray-400/30 animate-pulse"></div>
        
        {/* Description shimmer */}
        <div className="w-full px-4 md:px-18 py-6 space-y-2">
          <div className="h-4 w-full bg-gray-400/30 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-400/30 rounded animate-pulse mx-auto"></div>
        </div>
        
        {/* Buttons shimmer */}
        <div className="flex justify-center items-center gap-2 py-6">
          <div className="h-12 w-40 bg-gray-400/30 rounded animate-pulse"></div>
          <div className="h-12 w-12 bg-gray-400/30 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Multiple Upcoming Events/Retreats Shimmer */}
      <div className="flex gap-6 md:gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory my-20 px-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="snap-start shrink-0 flex flex-col gap-3 w-[85%] md:w-[40%] lg:w-[30%] xl:w-[440px]"
          >
            {/* Image shimmer */}
            <div className="aspect-465/285 bg-gray-400/30 animate-pulse rounded"></div>

            <div className="flex flex-col justify-center items-center text-center gap-2">
              {/* Title shimmer */}
              <div className="h-12 md:h-16 w-full bg-gray-400/30 rounded animate-pulse"></div>
              
              {/* Date shimmer */}
              <div className="h-5 w-48 bg-gray-400/30 rounded animate-pulse"></div>
              
              {/* Venue shimmer */}
              <div className="h-5 w-32 bg-gray-400/30 rounded animate-pulse"></div>
            </div>

            {/* Buttons shimmer */}
            <div className="flex gap-2 md:justify-start mt-2">
              <div className="w-[80%] md:w-full h-12 bg-gray-400/30 rounded animate-pulse"></div>
              <div className="h-12 w-12 bg-gray-400/30 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials Section Shimmer */}
      <div className="flex flex-col justify-center items-center gap-2 max-w-2xl mx-auto pt-6">
        <div className="bg-opacity-60 rounded-lg p-6 text-center w-full">
          {/* Quote shimmer */}
          <div className="space-y-3">
            <div className="h-6 w-full bg-gray-400/30 rounded animate-pulse"></div>
            <div className="h-6 w-5/6 bg-gray-400/30 rounded animate-pulse mx-auto"></div>
            <div className="h-6 w-4/6 bg-gray-400/30 rounded animate-pulse mx-auto"></div>
          </div>
          
          {/* Name shimmer */}
          <div className="h-6 w-64 bg-gray-400/30 rounded animate-pulse mt-4 mx-auto"></div>

          {/* Navigation Dots shimmer */}
          <div className="flex justify-center gap-3.5 my-8">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className="w-2.5 h-2.5 rounded-full bg-gray-400/30 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialsShimmer