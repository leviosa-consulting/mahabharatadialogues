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

  useEffect(() => {
    if (testimonials.length > 0 && !isAutoScrollPaused) {
      autoScrollInterval.current = setInterval(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % testimonials.length)
          setIsTransitioning(false)
        }, 300)
      }, 3000)

      return () => {
        if (autoScrollInterval.current) {
          clearInterval(autoScrollInterval.current)
        }
      }
    }
  }, [testimonials.length, isAutoScrollPaused])

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
        }, 300)
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
      }, 300)
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
      }, 300)
    }
  }

  if (testimonials.length === 0) {
    return null
  }

  // console.log("textcolor", textColor)

  return (
    <div className="flex flex-col justify-center items-center gap-2 max-w-2xl mx-auto pt-16 pb-24">
      <div
        className="bg-opacity-60 rounded-lg p-6 text-center cursor-pointer relative"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleTestimonialClick}
      >
        <div className="h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
          <div
            className={`transition-all duration-600 ease-in-out ${
              isTransitioning
                ? 'opacity-0 transform translate-y-4'
                : 'opacity-100 transform translate-y-0'
            }`}
          >
            <p
            style={{ color: textColor }}
              className={`font-neco italic text-[20px] sm:text-[24px] leading-relaxed line-clamp-7`}
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
        <div className="flex justify-center gap-3.5 mt-8">
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
