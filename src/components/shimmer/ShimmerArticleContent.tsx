export const ShimmerArticleContent = () => (
  <div className="flex flex-col lg:flex-row my-4 sm:my-8 gap-4 lg:gap-0 px-4 sm:px-0 animate-pulse">
    {/* Left Image Shimmer */}
    <div className="w-full lg:w-[30%] flex justify-center lg:justify-start">
      <div className="w-[120px] sm:w-[150px] lg:w-[194px] h-[120px] sm:h-[150px] lg:h-[194px] bg-gray-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
      </div>
    </div>
    
    {/* Right content shimmer */}
    <div className="w-full lg:w-[70%]">
      {/* Title shimmer */}
      <div className="space-y-2 mb-4">
        <div className="h-8 sm:h-10 lg:h-12 bg-gray-300 rounded w-4/5 mx-auto lg:mx-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
        </div>
        <div className="h-8 sm:h-10 lg:h-12 bg-gray-300 rounded w-3/5 mx-auto lg:mx-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
        </div>
      </div>

      {/* Subtitle shimmer */}
      <div className="space-y-2 mb-6">
        <div className="h-5 bg-gray-300 rounded w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
        </div>
        <div className="h-5 bg-gray-300 rounded w-4/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
        </div>
      </div>

      {/* Content shimmer */}
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-300 rounded w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
          </div>
        ))}
        <div className="h-4 bg-gray-300 rounded w-3/4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
        </div>
      </div>
    </div>
  </div>
);