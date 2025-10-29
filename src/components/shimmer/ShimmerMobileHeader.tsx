export const ShimmerMobileHeader = () => (
  <div className="sm:hidden fixed top-0 left-0 right-0 z-60 bg-white shadow-sm border-b-2 border-[#39AA69] animate-pulse">
    {/* Close Button Row */}
    <div className="flex justify-end py-2 px-4">
      <div className="w-9 h-9 bg-gray-300 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
      </div>
    </div>
    
    {/* Navigation Row */}
    <div className="flex flex-row justify-between items-center py-2 px-4">
      {/* Previous Story */}
      <div className="flex gap-2 items-center">
        <div className="w-4 h-4 bg-gray-300 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
        </div>
      </div>

      {/* Next Story */}
      <div className="flex gap-2 items-center">
        <div className="h-4 bg-gray-300 rounded w-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
        </div>
        <div className="w-4 h-4 bg-gray-300 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
        </div>
      </div>
    </div>
  </div>
);