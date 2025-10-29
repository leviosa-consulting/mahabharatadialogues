export const ShimmerNavigation = () => (
  <div className="hidden md:flex flex-row justify-between items-center py-8 sm:py-4 border-b-[2px] border-[#39AA69] gap-2 px-4 sm:px-0 animate-pulse">
    {/* Previous Story Shimmer */}
    <div className="flex gap-2 sm:gap-3 items-center">
      <div className="w-6 h-6 bg-gray-300 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
      </div>
      <div className="h-5 bg-gray-300 rounded w-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
      </div>
    </div>

    {/* Next Story Shimmer */}
    <div className="flex gap-2 sm:gap-3 items-center">
      <div className="h-5 bg-gray-300 rounded w-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
      </div>
      <div className="w-6 h-6 bg-gray-300 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
      </div>
    </div>
  </div>
);