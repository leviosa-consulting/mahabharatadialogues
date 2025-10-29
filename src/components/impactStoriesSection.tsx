'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useWorkshopStore } from '../../store/useStore'
import { impactStoriesDataCarousl } from '@/utils/data'
import ImpactStory from './ImpactStory'

const ImpactStoriesSection = () => {
  // ===========================
  // CONSTANTS
  // ===========================
  const ITEM_WIDTH = 500 + 18 // image width + gap
  const MIN_SWIPE_DISTANCE = 50
  const TRANSITION_DURATION = 500

  // ===========================
  // STATE DECLARATIONS
  // ===========================
  const [currentImpactIndex, setCurrentImpactIndex] = useState(0)
  const [isImpactTransitioning, setIsImpactTransitioning] = useState(false)
  const [impactTransitionDirection, setImpactTransitionDirection] = useState<
    'left' | 'right' | null
  >(null)

  // Touch handling refs
  const impactTouchStartX = useRef(0)
  const impactTouchEndX = useRef(0)
  const impactCarouselRef = useRef(null)
  // const impactCardRef = useRef<HTMLDivElement>(null)

  // Wheel handling refs
  // const impactWheelTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  // const isImpactWheelThrottled = useRef(false)

  // Section overlay touch states
  const [impactTouchStart, setImpactTouchStart] = useState<number | null>(null)
  const [impactTouchEnd, setImpactTouchEnd] = useState<number | null>(null)

  // Store hooks
  const {
    showImpactSections,
    setShowImpactSections,
    currentImpactSectionIndex,
    setCurrentImpactSectionIndex,
  } = useWorkshopStore()

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================
  const createImpactTransitionHandler = (direction: 'next' | 'prev') => {
    return () => {
      if (isImpactTransitioning) return

      setIsImpactTransitioning(true)
      setImpactTransitionDirection(direction === 'next' ? 'right' : 'left')

      setCurrentImpactIndex((prev) => {
        const maxIndex = impactStoriesDataCarousl.length - 2 // Show last 2 items
        if (direction === 'next') {
          return prev >= maxIndex ? 0 : prev + 1
        } else {
          return prev <= 0 ? maxIndex : prev - 1
        }
      })

      setTimeout(() => {
        setIsImpactTransitioning(false)
        setImpactTransitionDirection(null)
      }, TRANSITION_DURATION)
    }
  }

  // ===========================
  // CAROUSEL NAVIGATION FUNCTIONS
  // ===========================
  const nextImpactSlide = createImpactTransitionHandler('next')
  const prevImpactSlide = createImpactTransitionHandler('prev')

  // ===========================
  // TOUCH HANDLERS
  // ===========================
  // const createImpactTouchHandlers = () => ({
  //   handleTouchStart: (e: TouchEvent) => {
  //     impactTouchStartX.current = e.touches[0].clientX
  //   },
  //   handleTouchMove: (e: TouchEvent) => {
  //     impactTouchEndX.current = e.touches[0].clientX
  //   },
  //   handleTouchEnd: () => {
  //     const swipeDistance = impactTouchStartX.current - impactTouchEndX.current
  //     if (swipeDistance > MIN_SWIPE_DISTANCE) {
  //       nextImpactSlide()
  //     } else if (swipeDistance < -MIN_SWIPE_DISTANCE) {
  //       prevImpactSlide()
  //     }
  //   },
  // })

  // const { handleTouchStart, handleTouchMove, handleTouchEnd } =
  //   createImpactTouchHandlers()

  // ===========================
  // WHEEL HANDLERS
  // ===========================
  // const handleImpactWheel = useCallback((e: WheelEvent) => {
  //   // Prevent default scrolling behavior
  //   e.preventDefault()

  //   // If already transitioning or throttled, ignore completely
  //   if (isImpactTransitioning || isImpactWheelThrottled.current) {
  //     return
  //   }

  //   // Use deltaX if available (horizontal scroll), otherwise use deltaY for trackpads
  //   const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

  //   // Only proceed if there's meaningful delta (increased threshold)
  //   if (Math.abs(delta) < 30) {
  //     return
  //   }

  //   // Set throttle flag immediately and for a longer duration
  //   isImpactWheelThrottled.current = true

  //   // Clear any existing timeout
  //   if (impactWheelTimeoutRef.current) {
  //     clearTimeout(impactWheelTimeoutRef.current)
  //   }

  //   // Determine direction and move (only one slide at a time)
  //   if (delta > 0) {
  //     nextImpactSlide()
  //   } else if (delta < 0) {
  //     prevImpactSlide()
  //   }

  //   // Extended throttle time to prevent rapid firing
  //   impactWheelTimeoutRef.current = setTimeout(() => {
  //     isImpactWheelThrottled.current = false
  //     impactWheelTimeoutRef.current = null
  //   }, 1200) // Increased throttle time
  // }, [isImpactTransitioning, nextImpactSlide, prevImpactSlide])

  // ===========================
  // SECTION OVERLAY TOUCH HANDLERS
  // ===========================
  const handleImpactTouchStartSection = (e: TouchEvent) => {
    setImpactTouchEnd(null)
    setImpactTouchStart(e.targetTouches[0].clientX)
  }

  const handleImpactTouchMoveSection = (e: TouchEvent) => {
    setImpactTouchEnd(e.targetTouches[0].clientX)
  }

  const handleImpactTouchEndSection = (impactStory: any) => {
    if (!impactTouchStart || !impactTouchEnd) return

    const distance = impactTouchStart - impactTouchEnd
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE

    const sections = impactStory.experience?.sections || []
    const totalSections = sections.length + 2

    if (isLeftSwipe && currentImpactSectionIndex < totalSections - 1) {
      setCurrentImpactSectionIndex((prev) => prev + 1)
    } else if (isLeftSwipe) {
      setShowImpactSections(-1)
      setCurrentImpactSectionIndex(0)
    }

    if (isRightSwipe && currentImpactSectionIndex > 0) {
      setCurrentImpactSectionIndex((prev) => prev - 1)
    } else if (isRightSwipe) {
      setShowImpactSections(-1)
      setCurrentImpactSectionIndex(0)
    }
  }

  // ===========================
  // GRADIENT STYLE FUNCTIONS
  // ===========================
  const getImpactGradientStyle = (position: number): React.CSSProperties => {
    const gradientMap: Record<number, React.CSSProperties> = {
      0: {
        background:
          'transparent linear-gradient(180deg, #FFFFFF 0%, #FFFFFF00 100%) 0% 0% no-repeat padding-box',
      },
      1: {
        background:
          'transparent linear-gradient(270deg, #FFC944 0%, #FFC944DE 51%, #FFFFFF00 100%) 0% 0% no-repeat padding-box',
      },
    }
    return gradientMap[position] || {}
  }

  const getImpactWorkshopGradientStyle = (
    position: number
  ): React.CSSProperties => {
    const gradientMap: Record<number, React.CSSProperties> = {
      0: {
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF80 30%, rgba(255,255,255,0) 100%)',
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      },
      1: {
        background:
          'transparent linear-gradient(270deg, #010101 0%, #000000 51%, #FFFFFF00 100%) 0% 0% no-repeat padding-box',
      },
    }
    return gradientMap[position] || {}
  }

  // ===========================
  // EFFECTS
  // ===========================
  useEffect(() => {
    const shouldLockScroll = showImpactSections !== -1

    if (shouldLockScroll) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [showImpactSections])

  return (
    <div className="w-full bg-[#eaeaea]">
      {/* Main part*/}
      <div className="w-full">
        <div className="lg:mt-0 w-full">
          {/* Impact Stories Carousel Container */}
          <div
            ref={impactCarouselRef}
            className="relative "
            // onTouchStart={handleTouchStart}
            // onTouchMove={handleTouchMove}
            // onTouchEnd={handleTouchEnd}
            // onWheel={handleImpactWheel}
          >
            {/* Desktop /ipad - Shows 2 items */}
            <div className="hidden md:flex justify-center w-full mt-6 overflow-x-scroll scrollbar-hide">
              <div className="relative w-full h-[400px] ">
                {/* Gradient Overlay */}
                <div
                  className="absolute w-1/4 top-0 right-24 h-full z-10 pointer-events-none"
                  // style={{
                  //   background:
                  //     'transparent linear-gradient(270deg, #FFC944 0%, #FFC944DE 51%, #FFFFFF00 100%) 0% 0% no-repeat padding-box',
                  // }}
                ></div>

                {/* Slider */}
                <div
                  className="flex gap-[18px] transition-transform duration-500 ease-in-out bg-[#eaeaea]"
                  style={{
                    transform: `translateX(-${
                      currentImpactIndex * ITEM_WIDTH
                    }px)`,
                    width: `${impactStoriesDataCarousl.length * ITEM_WIDTH}px`,
                  }}
                >
                  {impactStoriesDataCarousl.map((impactStory, idx) => (
                    <div
                      // ref={idx === 0 ? impactCardRef : null}
                      key={`${impactStory.id}-${idx}`}
                      className="relative w-[300px] md:w-[500px] h-[280px] md:h-[400px]   flex-shrink-0"
                    >
                      {/* Gradient Overlay */}
                      <div
                        className="absolute inset-0 z-10 pointer-events-none bg-white/70"
                        // style={getImpactWorkshopGradientStyle(0)}
                      ></div>

                      {/* Image */}
                      <img
                        src={impactStory.image}
                        alt={impactStory.alt}
                        className="w-full h-full object-cover relative z-0 transition-transform duration-500 ease-in-out "
                      />

                      {/* Content Container - Centered */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                        {/* Title */}
                        <p
                          className="font-bold text-[24px] text-[#3A113D] text-center px-4"
                          style={{
                            fontFamily:
                              'var(--font-fira-sans, "Fira Sans", sans-serif)',
                          }}
                        >
                          {impactStory.title}
                        </p>

                        {/* Description */}
                        <p
                          className="font-normal text-[18px] text-[#3A113D] text-center px-4 mb-6"
                          style={{ fontFamily: 'var(--font-lato)' }}
                        >
                          {impactStory.description}
                        </p>

                        {/* Read More Button */}
                        <button
                          className="px-6 py-2 bg-green text-white font-normal text-[16px] cursor-pointer transition-all uppercase duration-300 pointer-events-auto"
                          onClick={() => setShowImpactSections(impactStory.id)}
                          style={{ fontFamily: 'var(--font-lato)' }}
                        >
                          learn more
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===================== */}
            {/* Show Section Overlay */}
            {/* ===================== */}
            {impactStoriesDataCarousl.map(
              (impactStory) =>
                showImpactSections === impactStory.id && (
                  <div
                    key={impactStory.id}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                  >
                    <div className="relative w-full h-full bg-black/90">
                      <ImpactStory impactStoryData={impactStory} />
                    </div>
                  </div>
                )
            )}

            {/* Mobile/Tablet View */}
            {/* Mobile / tablet carousel */}
            <div
              className="md:hidden mt-2 overflow-x-scroll scrollbar-hide"
              style={{ backgroundColor: '#eaeaea' }} // outermost background forced black
            >
              <div
                className="flex flex-col transition-transform duration-500 ease-in-out gap-[20px]"
                style={{
                  backgroundColor: '#eaeaea', // flex container background black
                  
                }}
              >
                {impactStoriesDataCarousl.map((impactStory, idx) => (
                  <div
                    key={`${impactStory.id}-${currentImpactIndex}-mobile`}
                    className="flex-shrink-0 relative overflow-hidden"
                    
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 z-10 pointer-events-none bg-white/70" ></div>

                  
                    <img
                      src={impactStory.image}
                      alt={impactStory.alt}
                      className="w-full h-full object-cover relative z-0 block"
                      style={{ backgroundColor: '#eaeaea', display: 'block' }}
                    />

                    {/* Content Container - Centered */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                      <p
                        className="font-bold text-[24px] text-[#3A113D] text-center px-4"
                        style={{
                          fontFamily:
                            'var(--font-fira-sans, "Fira Sans", sans-serif)',
                        }}
                      >
                        {impactStory.title}
                      </p>

                      <p
                        className="font-normal text-[18px] text-[#3A113D] text-center px-4 mb-6"
                        style={{ fontFamily: 'var(--font-lato)' }}
                      >
                        {impactStory.description}
                      </p>

                      <button
                        className="px-6 py-2 bg-green text-white font-normal text-[16px] cursor-pointer transition-all uppercase duration-300 pointer-events-auto"
                        onClick={() => setShowImpactSections(impactStory.id)}
                        style={{ fontFamily: 'var(--font-lato)' }}
                      >
                        learn more
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="hidden  justify-center mt-6 mb-6 md:mb-0 gap-[30px]">
            {impactStoriesDataCarousl.slice(0, -1).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isImpactTransitioning) {
                    const maxIndex = impactStoriesDataCarousl.length - 2
                    const targetIndex = Math.min(index, maxIndex)
                    setIsImpactTransitioning(true)
                    setCurrentImpactIndex(targetIndex)
                    setTimeout(() => setIsImpactTransitioning(false), 500)
                  }
                }}
                className={`w-[10px] h-[10px] rounded-full border-2 transition-colors duration-200 cursor-pointer
                  ${
                    index === currentImpactIndex
                      ? 'bg-[#3A113D] border-[#3A113D]'
                      : 'border-[#3A113D] bg-transparent'
                  }`}
                disabled={isImpactTransitioning}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpactStoriesSection

// in mobile overlay ipactStory overlay is getting closed when i scroll down , left, right and top sometime why this is happening it should not be closed unless i click on x in mobile. please fix this issue.
