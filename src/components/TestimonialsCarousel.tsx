'use client'

import React, { useEffect, useRef, useState } from 'react'
import { merri } from '@/app/fonts/merri'

interface Testimonial {
  id: string
  quote: string
  name: string
  designation: string
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
  textColor?: string
}

/* Must match the `duration-600` on the fading wrapper below. If the swap fires
   earlier than this, the text changes while still half-visible and reads as a
   flicker rather than a crossfade. */
const FADE_MS = 600

/* How long a testimonial stays on screen, derived from its own length so short
   quotes don't linger and long ones aren't cut off. 250ms/word ~= 240wpm; the
   extra 1200ms covers reading the name and designation. */
const dwellFor = (quote: string) => {
  const words = quote.trim().split(/\s+/).filter(Boolean).length
  return Math.min(14000, Math.max(7000, words * 250 + 1200))
}

const TestimonialsCarousel = ({
  testimonials,
  textColor,
}: TestimonialsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null)
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null)
  const fadeTimeout = useRef<NodeJS.Timeout | null>(null)

  /* Reschedules per slide rather than running on a fixed interval, so each
     testimonial gets dwell time proportional to its own length. Depends on
     currentIndex, which also means a manual dot click restarts the clock. */
  useEffect(() => {
    if (testimonials.length === 0 || isAutoScrollPaused) return

    const dwell = dwellFor(testimonials[currentIndex]?.quote ?? '')

    autoScrollInterval.current = setTimeout(() => {
      setIsTransitioning(true)
      fadeTimeout.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        setIsTransitioning(false)
      }, FADE_MS)
    }, dwell)

    return () => {
      if (autoScrollInterval.current) clearTimeout(autoScrollInterval.current)
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
    }
    // depends on .length, not the array itself: a changing reference would reset
    // the timer every render and the carousel would never advance
  }, [currentIndex, testimonials.length, isAutoScrollPaused])

  const handleWheel = (e: React.WheelEvent) => {
    if (wheelTimeout.current) {
      clearTimeout(wheelTimeout.current)
    }

    wheelTimeout.current = setTimeout(() => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        setIsTransitioning(true)
        setTimeout(() => {
          if (e.deltaX > 0) {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
          } else if (e.deltaX < 0) {
            setCurrentIndex(
              (prev) => (prev - 1 + testimonials.length) % testimonials.length,
            )
          }
          setIsTransitioning(false)
        }, FADE_MS)
      }
    }, 50)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      setIsTransitioning(true)
      setTimeout(() => {
        if (swipeDistance > 0) {
          setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        } else {
          setCurrentIndex(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length,
          )
        }
        setIsTransitioning(false)
      }, FADE_MS)
    }
  }

  const handleTestimonialClick = () => {
    setIsAutoScrollPaused((prev) => !prev)
  }

  const handleDotClick = (index: number) => {
    if (index !== currentIndex) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(index)
        setIsTransitioning(false)
      }, FADE_MS)
    }
  }

  if (testimonials.length === 0) {
    return null
  }

  // console.log("textcolor", textColor)

  return (
    <div className="flex flex-col justify-center items-center gap-2 max-w-2xl mx-auto pt-8 pb-10 md:pt-6 md:pb-8">
      <div
        className="bg-opacity-60 rounded-lg p-4 text-center cursor-pointer relative"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleTestimonialClick}
      >
        <div className="h-[300px] md:h-[230px] flex flex-col justify-center items-center relative overflow-hidden">
          <div
            className={`transition-all duration-600 ease-in-out ${
              isTransitioning
                ? 'opacity-0 transform translate-y-4'
                : 'opacity-100 transform translate-y-0'
            }`}
          >
            <p
            style={{ color: textColor }}
              className={`font-neco italic text-[20px] leading-relaxed line-clamp-7`}
            >
              {testimonials[currentIndex]?.quote}
            </p>
            <div
            style={{ color: textColor }}
              className={` ${merri.className} mt-4 text-center`}
            >
              <p className="uppercase font-bold text-[14px] md:text-[16px]">
                {testimonials[currentIndex]?.name},
              </p>

              <p className="font-bold italic text-[13px] md:text-[15px] opacity-90">
                {testimonials[currentIndex]?.designation}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3.5 mt-4">
          {testimonials.map((_, index) => {
            const isActive = index === currentIndex

            return (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDotClick(index)
                }}
                className={`
          w-2.5 h-2.5
          rounded-full
          cursor-pointer
          transition-all duration-300
          ${isActive ? 'scale-125' : ''}
        `}
                style={{
                  backgroundColor: isActive ? textColor : '#9CA3AF', 
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TestimonialsCarousel
