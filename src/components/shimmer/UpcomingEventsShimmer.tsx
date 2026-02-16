export default function UpcomingEventShimmer() {
  return (
    <div
      className="
        snap-start shrink-0 flex flex-col gap-3
        w-[90%]
        sm:w-[60%] md:w-[50%] lg:w-[42%] xl:w-[30%]
        bg-[#1D5C75CC]
        animate-pulse
      "
    >
      {/* Image shimmer */}
      <div className="relative w-full">
        <div className="aspect-465/285 w-full bg-white/20" />
      </div>

      <div className="flex flex-col px-4 justify-center items-center text-center w-full">

        {/* Title */}
        <div className="h-[36px] w-[80%] bg-white/20 rounded mb-3" />

        {/* Date */}
        <div className="h-[20px] w-[60%] bg-white/20 rounded mb-4" />

        {/* Venue */}
        <div className="flex flex-col items-center gap-2 mb-3">
          <div className="h-[18px] w-[70%] bg-white/20 rounded" />
          <div className="h-[18px] w-[50%] bg-white/20 rounded" />
        </div>

        {/* Map link */}
        <div className="h-[16px] w-[40%] bg-white/20 rounded mb-4" />

        {/* Description (3 lines) */}
        <div className="space-y-2 w-full px-4">
          <div className="h-[16px] w-full bg-white/20 rounded" />
          <div className="h-[16px] w-[90%] bg-white/20 rounded mx-auto" />
          <div className="h-[16px] w-[80%] bg-white/20 rounded mx-auto" />
        </div>
      </div>

      {/* Button Row */}
      <div className="flex justify-center items-center gap-2 pb-8 w-[80%] mx-auto mt-6">
        {/* Learn more button */}
        <div className="flex-1 h-[44px] bg-white/20 rounded" />

        {/* Arrow box */}
        <div className="w-[56px] h-[56px] bg-white/20" />
      </div>
    </div>
  )
}