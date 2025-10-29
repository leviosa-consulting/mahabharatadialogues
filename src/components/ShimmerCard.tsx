export const ShimmerCard = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full sm:w-auto">
      {/* Image Shimmer */}
      <div className="w-[180px] sm:w-[200px]  lg:w-[240px] h-[200px] sm:h-[220px] md:w-[240px] lg:h-[260px] bg-gray-700/30 rounded-lg relative overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-wave"></div>
      </div>
      
      {/* Content Shimmer */}
      <div className="flex flex-col text-center gap-2 w-full animate-pulse">
        {/* Title Shimmer - Two lines */}
        <div className="h-5 bg-gray-700/30 rounded w-3/4 mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-wave"></div>
        </div>
        <div className="h-5 bg-gray-700/30 rounded w-1/2 mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-wave"></div>
        </div>
        
        {/* Button Shimmer */}
        <div className="h-4 bg-gray-700/30 rounded w-32 mx-auto mt-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-wave"></div>
        </div>
      </div>
    </div>
  );
};