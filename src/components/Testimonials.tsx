'use client'

import React, { useEffect, useRef, useState } from 'react'
import CustomButton from './CustomButton'
import { merri } from '@/app/fonts/merri'
interface Testimonial {
  id: string
  quote: string
  name: string
  designation: string
}
const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [retreatText, setRetreatText] = useState('')
  const [loading, setLoading] = useState(true)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])
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
      setLoading(false)
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
      setLoading(false)
    }
  }
  const handleWheel = (e: React.WheelEvent) => {
    // e.preventDefault()

    if (wheelTimeout.current) {
      clearTimeout(wheelTimeout.current)
    }

    wheelTimeout.current = setTimeout(() => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (e.deltaX > 0) {
          setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        } else if (e.deltaX < 0) {
          setCurrentIndex(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length
          )
        }
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
      if (swipeDistance > 0) {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      } else {
        setCurrentIndex(
          (prev) => (prev - 1 + testimonials.length) % testimonials.length
        )
      }
    }
  }

  return (
    <div
      className="w-full  pb-30"
      style={{
        backgroundImage: `
      linear-gradient(
        rgba(29, 92, 117, 0.5),
        rgba(29, 92, 117, 0.5)
      ),
      url('/Blue_Background_with_Texture-01.png')
    `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-2 xl:mx-16 2xl:mx-30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 pt-20 ">
          {/* IMAGE */}
          <div className="order-1 sm:order-0 sm:col-start-1 sm:col-span-4 lg:col-start-2 lg:col-span-4 xl:col-start-3 xl:col-span-4 flex">
            <div className="w-full md:max-w-[465px] aspect-auto md:aspect-[465/345.2]">
              <img
                src="/abhilash.png"
                alt="Abhilash"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* TEXT */}
          <div className="order-2 sm:order-0 sm:col-start-5 sm:col-span-4 lg:col-start-6 lg:col-span-4 xl:col-start-7 xl:col-span-4 flex">
            <div className="px-2 sm:px-8 py-4 bg-white/30 flex flex-col justify-center items-center text-center sm:text-start">
              <p className="font-neco text-[22px] sm:text-[32px] text-white font-normal">
                Join us for the upcoming Dialogue on{' '}
                <span className="font-bold">23rd January, 2026</span>
              </p>

              <div className="sm:-ml-28 2xl:-ml-20 py-6">
                <CustomButton
                  text="GET YOUR TICKETS"
                  bgColor="#D12127"
                  textColor="#FFFFFF"
                  url="https://in.bookmyshow.com/plays/mahabharatha-dialogues-koramangala/ET00357289"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-2 max-w-2xl mx-auto pt-6">
        <div
          className="bg-opacity-60  rounded-lg p-6 text-center"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <p className="text-white font-neco italic text-[24px] sm:text-[32px] leading-relaxed ">
            {testimonials[currentIndex]?.quote}
          </p>
          <p className={`text-white ${merri.className} mt-4 font-bold text-[24px] sm:[32px]`}>
            <span className=" uppercase">
              {' '}
              {testimonials[currentIndex]?.name},{' '}
            </span>{' '}
            {testimonials[currentIndex]?.designation}
          </p>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3.5 my-8">
            {testimonials.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-gray-400'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials