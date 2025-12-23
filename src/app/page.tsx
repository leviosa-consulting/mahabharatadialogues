'use client'
import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import db from '@/firebase/firebaseServices'
import { formatRetreatText } from '@/utils/formatRetreatText'
import { Mail, Phone } from 'lucide-react'
interface Testimonial {
  id: string
  quote: string
  name: string
  designation: string
}

export default function MahabharataDialogues() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [retreatText, setRetreatText] = useState('')
  const [loading, setLoading] = useState(true)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchTestimonials()
    fetchRetreat()
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

  const fetchRetreat = async () => {
    try {
      const retreatRef = doc(db, 'retreat', 'settings')
      const snap = await getDoc(retreatRef)

      if (snap.exists()) {
        const data = snap.data()

        if (data.startDate && data.endDate) {
          const start = data.startDate.toDate()
          const end = data.endDate.toDate()

          const formatted = formatRetreatText(start, end)
          setRetreatText(formatted)
        }
      }
    } catch (error) {
      console.error('Error fetching retreat:', error)
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
      } else {
        if (e.deltaY > 0) {
          setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        } else if (e.deltaY < 0) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className='bg-blue-800 w-full h-full'>
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url('/Blue_Background_with_Texture-02.png')`,
          backgroundSize: 'contain',
        }}
      >
        {/* Texture softener overlay */}
        {/* <div className="absolute inset-0 bg-black/40 pointer-events-none" /> */}

        <div className="relative">
          <div className="flex items-center justify-between mb-12">
            <div className="">
              <img src="Web_Assets-07.png" alt="" />
            </div>

            <div className="md:mb-30 w-[650px] md:w-100">
              <img
                src="Web_Assets-08.png"
                alt="web-asset"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="">
              <img src="Web_Assets-09.png" alt="" />
            </div>
          </div>

          <div
            className="bg-opacity-60  rounded-lg p-6 -mt-12 sm:-mt-40 md:-mt-48 xl:-mt-66 sm:mx-40 md:mx-60 lg:mx-90 xl:mx-[450px] 2xl:mx-[500px] text-center"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <p className="text-white text-lg italic leading-relaxed ">
              {testimonials[currentIndex]?.quote}
            </p>
            <p className="text-white mt-4 font-semibold">
              {testimonials[currentIndex]?.name}
            </p>
            <p className="text-white text-sm">
              {testimonials[currentIndex]?.designation}
            </p>
          </div>
          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mb-18">
            {testimonials.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-gray-400'
                }`}
              ></div>
            ))}
          </div>

          {/* Event Banner */}
          <div className="bg-[#1D5C75] bg-opacity-80 p-4 mb-8 text-center mx-4 sm:max-w-[320px] sm:mx-auto">
            <p className="text-white merriweather-sans font-extrabold text-[18px]">
              STORYTELLING @ JP NAGAR
            </p>
            <p className="text-white merriweather-sans font-normal text-[18px]">
              BENGALURU
            </p>
          </div>

          <div className="max-w-5xl mx-auto mt-10">
            {/* Button Section */}
            <div className="grid grid-cols-1 px-4 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 justify-center items-center">
              <Link
                href="https://www.youtube.com/@MahabharataDialogues/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1D5C75] merriweather-sans font-extrabold text-[18px] text-white py-4 px-6 transition duration-300 text-center flex items-center justify-center"
              >
                YOUTUBE
              </Link>

              <Link
                href={'/retreats'}
                className="bg-[#1D5C75] merriweather-sans text-[18px] text-white py-4 px-6 transition duration-300 text-center flex flex-col items-center justify-center"
              >
                <div className="font-extrabold">OUR RETREATS</div>
                {/* <div className="font-normal">{retreatText}</div> */}
              </Link>

              <Link
                href="/blogs"
                className="bg-[#1D5C75] merriweather-sans font-extrabold text-[18px] text-white py-4 px-6 transition duration-300 text-center flex items-center justify-center"
              >
                BLOGS
              </Link>
              <Link
                href="https://www.instagram.com/mahabharatadialogues"
                className="bg-[#1D5C75] merriweather-sans font-extrabold text-[18px] text-white py-4 px-6 transition duration-300 text-center flex items-center justify-center"
              >
                COMMUNITY STORIES
              </Link>

              <Link
                href="https://in.bookmyshow.com/plays/mahabharatha-dialogues-koramangala/ET00357289"
                className="bg-[#1D5C75] merriweather-sans font-extrabold text-[18px] text-white py-4 px-6 transition duration-300 text-center flex items-center justify-center"
              >
                Booking URL
              </Link>
            </div>
            {/* Footer */}
            <div className="flex justify-center pb-10 px-6">
              <div className="flex flex-col gap-4 text-white text-center">
                {/* Email */}
                <div className="flex items-center justify-center gap-3">
                  <Mail className="w-5 h-5 opacity-80" />
                  <a
                    href="mailto:mahabharatadialogues@gmail.com"
                    className="text-lg hover:underline transition"
                  >
                    mahabharatadialogues@gmail.com
                  </a>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5 opacity-80" />
                  <a
                    href="tel:+910000000000"
                    className="text-lg hover:underline transition"
                  >
                    +91 00000 00000
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
