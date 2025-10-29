export const ShimmerShareSection = () => (
  <div className="py-2 border-y-[2px] border-[#39AA69] flex justify-center items-center px-4 sm:px-0 animate-pulse">
    <div className="flex gap-2 sm:gap-3 items-center justify-center">
      <div className="w-6 h-6 bg-gray-300 rounded relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
      </div>
      <div className="h-5 bg-gray-300 rounded w-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-wave"></div>
      </div>
    </div>
  </div>
);