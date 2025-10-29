export const ShimmerMoreStories = () => (
  <div className="mt-8 px-4 sm:px-0 animate-pulse">
    {/* Title shimmer */}
    <div className="h-7 sm:h-8 bg-gray-300 rounded w-48 mx-auto mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
    </div>
    
    {/* Grid shimmer */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col gap-4 justify-center items-center p-4 rounded-lg">
          {/* Image shimmer */}
          <div className="w-[150px] sm:w-[160px] md:w-[170px] lg:w-[180px] h-[150px] sm:h-[160px] md:h-[170px] lg:h-[180px] bg-gray-300 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
          </div>
          {/* Content shimmer */}
          <div className="flex flex-col text-center w-full">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
            </div>
            <div className="h-3 bg-gray-300 rounded w-28 mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);