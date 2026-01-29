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
  testimonials?: Testimonial[]
}

const TestimonialsCarousel = ({
  testimonials: initialTestimonials,
}: TestimonialsCarouselProps) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    initialTestimonials || [],
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null)
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!initialTestimonials) {
      fetchTestimonials()
    }
  }, [initialTestimonials])

  // Auto-scroll effect with transition
  useEffect(() => {
    if (testimonials.length > 0 && !isAutoScrollPaused) {
      autoScrollInterval.current = setInterval(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % testimonials.length)
          setIsTransitioning(false)
        }, 300) // Half of transition time for smooth effect
      }, 3000)

      return () => {
        if (autoScrollInterval.current) {
          clearInterval(autoScrollInterval.current)
        }
      }
    }
  }, [testimonials.length, isAutoScrollPaused])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        setTestimonials(data.data)
      } else {
        setTestimonials([
          {
            id: '1',
            quote:
              'Quotes on how amazing it is to be in any of the workshop, long or short, and what an enriching time you had with information and meeting like-minded people.',
            name: 'Hansini',
            designation: 'President of Rotary Club, Bengaluru',
          },
        ])
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setTestimonials([
        {
          id: '1',
          quote:
            'Quotes on how amazing it is to be in any of the workshop, long or short, and what an enriching time you had with information and meeting like-minded people.',
          name: 'Hansini',
          designation: 'President of Rotary Club, Bengaluru',
        },
      ])
    }
  }

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
            <p className="text-white font-neco italic text-[20px] sm:text-[24px] leading-relaxed line-clamp-7">
              {testimonials[currentIndex]?.quote}
            </p>
            <div className={`text-white ${merri.className} mt-4 text-center`}>
              <p className="uppercase font-bold text-[14px] md:text-[16px]">
                {testimonials[currentIndex]?.name},
              </p>

              <p className="font-bold italic text-[13px] md:text-[15px] opacity-90">
                {testimonials[currentIndex]?.designation}
              </p>
            </div> 
          </div>
        </div>

        {/* Pause/Play indicator */}
        {/* <div className="absolute top-4 right-4">
          <div
            className={`w-3 h-3 rounded-full transition-colors ${
              isAutoScrollPaused ? 'bg-yellow-400' : 'bg-green-400'
            }`}
            title={isAutoScrollPaused ? 'Paused - Click to resume' : 'Playing - Click to pause'}
          />
        </div> */}

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3.5 mt-8">
          {testimonials.map((_, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                handleDotClick(index)
              }}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-gray-400 hover:bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestimonialsCarousel
