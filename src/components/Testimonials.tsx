'use client'

import React, { useEffect, useRef, useState } from 'react'
import CustomButton from './CustomButton'
import { merri } from '@/app/fonts/merri'
import TestimonialsShimmer from './TestimonialsShimmer'
import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'

interface Testimonial {
  id: string
  quote: string
  name: string
  designation: string
}

interface Event {
  id: string
  type: 'event' | 'retreat'
  title: string
  coverImage: string
  date: string
  time: string
  venue: string
  description?: string
  bookingUrl?: string
  slug?: string
  endDate?: string
  city?: string
}

interface RetreatData {
  id: string
  title: string
  description: string
  photos?: string[]
  venue?: string
  city?: string
  day1: {
    date: string
    dayName: string
  }
  day2?: {
    date: string
    dayName: string
  }
  day3?: {
    date: string
    dayName: string
  }
  slug?: string
  bookingUrl: string
  coverImage: string
}

interface EventData {
  id: string
  title: string
  coverImage: string
  eventDate: string
  eventTime?: string
  venue: string
  city?: string
  description?: string
  bookingUrl?: string
  slug?: string
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [upcomingItems, setUpcomingItems] = useState<Event[]>([])
  const [featuredItem, setFeaturedItem] = useState<Event | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [featuredCardHeight, setFeaturedCardHeight] = useState(0)
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null)
  const featuredCardRef = useRef<HTMLDivElement>(null)
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchTestimonials()
    fetchUpcomingItems()
  }, [])

  useEffect(() => {
    if (featuredCardRef.current && featuredItem) {
      const updateHeight = () => {
        const height = featuredCardRef.current?.offsetHeight || 0
        setFeaturedCardHeight((prevHeight) => {
          if (prevHeight !== height) {
            return height
          }
          return prevHeight
        })
      }

      updateHeight()

      window.addEventListener('resize', updateHeight)

      const timeoutId = setTimeout(updateHeight, 100)

      return () => {
        window.removeEventListener('resize', updateHeight)
        clearTimeout(timeoutId)
      }
    }
  }, [featuredItem])

  // Auto-scroll effect
  useEffect(() => {
    if (testimonials.length > 0 && !isAutoScrollPaused) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
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

  const parseDate = (dateStr: string): Date => {
    if (dateStr.includes('-')) {
      return new Date(dateStr)
    }

    const [day, month, year] = dateStr.split(' ')
    const monthMap: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    }
    return new Date(parseInt(year), monthMap[month], parseInt(day))
  }

  const formatDate = (dateStr: string): string => {
    const date = parseDate(dateStr)
    const day = date.getDate()
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
  }

  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = parseDate(startDate)
    const end = parseDate(endDate)

    const startDay = start.getDate()
    const endDay = end.getDate()
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const month = months[start.getMonth()]
    const year = start.getFullYear()

    return `${startDay} ${month} - ${endDay} ${month}, ${year}`
  }

  const formatEventDateTime = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr)
    const day = date.getDate()
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12
    const timeStr = `${hours}${
      minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''
    }${ampm}`

    return `${day} ${month}, ${year} | ${timeStr}`
  }

  const fetchUpcomingItems = async () => {
    try {
      setLoading(true)
      const now = new Date()
      const thirtyDaysLater = new Date(now)
      thirtyDaysLater.setDate(now.getDate() + 300)

      const retreatsResponse = await fetch('/api/retreats')
      const retreatsData = await retreatsResponse.json()

      const eventsResponse = await fetch('/api/events')
      const eventsData = await eventsResponse.json()

      const allItems: Event[] = []

      if (retreatsData.success && retreatsData.data) {
        retreatsData.data.forEach((retreat: RetreatData) => {
          const retreatDate = parseDate(retreat.day1.date)

          retreatDate.setHours(23, 59, 59, 999)

          if (retreatDate >= now && retreatDate <= thirtyDaysLater) {
            const endDate =
              retreat.day3?.date || retreat.day2?.date || retreat.day1.date

            allItems.push({
              id: retreat.id,
              type: 'retreat',
              title: retreat.title,
              description: retreat.description,
              coverImage: retreat.coverImage || '/assets/videoImg.png',
              date: retreat.day1.date,
              endDate: endDate,
              time: '',
              venue: retreat.venue || 'Venue TBA',
              city: retreat.city,
              slug: retreat.slug,
              bookingUrl: retreat.bookingUrl,
            })
          }
        })
      }

      if (eventsData.success && eventsData.data) {
        eventsData.data.forEach((event: EventData) => {
          const eventDateTime = new Date(event.eventDate)

          if (eventDateTime >= now && eventDateTime <= thirtyDaysLater) {
            allItems.push({
              id: event.id,
              type: 'event',
              title: event.title,
              coverImage: event.coverImage || '/assets/videoImg.png',
              date: event.eventDate,
              time: event.eventTime || '',
              venue: event.venue || 'Venue TBA',
              description: event.description,
              bookingUrl: event.bookingUrl,
              slug: event.slug,
              city: event.city,
            })
          }
        })
      }

      // Sort by date (earliest first)
      allItems.sort((a, b) => {
        const dateA = a.type === 'event' ? new Date(a.date) : parseDate(a.date)
        const dateB = b.type === 'event' ? new Date(b.date) : parseDate(b.date)
        return dateA.getTime() - dateB.getTime()
      })

      if (allItems.length > 0) {
        setFeaturedItem(allItems[0])
        setUpcomingItems(allItems.slice(1))
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching upcoming items:', error)
      setLoading(false)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
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

  const handleTestimonialClick = () => {
    setIsAutoScrollPaused((prev) => !prev)
  }

  const getItemUrl = (item: Event) => {
    if (item.type === 'event' && item.slug) {
      return `/events/${item.slug}`
    } else if (item.type === 'retreat' && item.slug) {
      return `/retreats/${item.slug}`
    }
    return '#'
  }

  const getDisplayDate = (item: Event): string => {
    if (item.type === 'retreat' && item.endDate && item.endDate !== item.date) {
      return formatDateRange(item.date, item.endDate)
    } else if (item.type === 'event') {
      return formatEventDateTime(item.date)
    }
    return formatDate(item.date)
  }

  const handleShare = async (bookingUrl?: string) => {
    if (!bookingUrl) {
      alert('No booking URL available')
      return
    }

    try {
      await navigator.clipboard.writeText(bookingUrl)
      alert('Booking URL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = bookingUrl
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        alert('Booking URL copied to clipboard!')
      } catch (err) {
        alert('Failed to copy URL')
      }
      document.body.removeChild(textArea)
    }
  }

  const renderTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ))
  }

  if (loading) {
    return <TestimonialsShimmer />
  }

  console.log('featuredItems : ', featuredItem)
  return (
    <div className="w-full pb-30">
      {/* BACKGROUND SECTION */}
      <div
        className="w-full relative"
        style={{
          backgroundImage: `
        linear-gradient(
          rgba(29, 92, 117, 0.5),
          rgba(29, 92, 117, 0.5)
        ),
        url('/MD-Texture_BG_Blue-01-04.png')
        
      `,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      >
        {featuredItem && featuredCardHeight > 0 && (
          <div
            style={
              {
                '--card-height-mobile': `${featuredCardHeight}px`,
                '--card-height-md': `${featuredCardHeight}px`,
                '--card-height-xl': `${featuredCardHeight * 0.8}px`,
              } as React.CSSProperties
            }
            className="
      h-[var(--card-height-mobile)]
      md:h-[var(--card-height-md)]
      xl:h-[var(--card-height-xl)]
    "
          ></div>
        )}

        {featuredItem && (
          <div
            ref={featuredCardRef}
            className="
    absolute top-0 left-1/2 -translate-x-1/2
    flex flex-col max-w-84 w-[calc(100%-2rem)] sm:max-w-100 sm:mx-0 lg:max-w-[520px]
    justify-center items-center
    -mt-[20%] sm:-mt-[10%] xl:-mt-[20%]
    bg-[#1D5C75CC]
    z-10
  "
          >
            <p
              className={`${merri.className} text-[#78B0C7] font-bold text-[16px] md:text-[18px] pt-6`}
            >
              COMING UP NEXT
            </p>
            <h2
              className={`${merri.className} text-white font-extrabold text-[32px] italic px-0.5 md:px-10 text-center leading-relaxed mt-2`}
            >
              {featuredItem.title}
            </h2>
            <div className="flex flex-col justify-center items-center my-2">
              <h3
                className={`${merri.className} text-white font-bold text-[16px] md:text-[18px] text-center pb-3`}
              >
                {getDisplayDate(featuredItem)}
              </h3>
              <h4
                className={`${merri.className} text-white font-normal text-center px-2 text-[16px] md:text-[18px]`}
              >
                {`${featuredItem.venue},`}
              </h4>
              <h4
                className={`${merri.className} text-white font-normal text-center px-2 text-[16px] md:text-[18px] pb-4`}
              >
                {featuredItem.city}
              </h4>
            </div>
            <div className="">
              <img
                src={featuredItem.coverImage || '/assets/videoImg.png'}
                alt={featuredItem.title}
                className="w-full h-full object-cover"
                onLoad={() => {
                  if (featuredCardRef.current) {
                    const newHeight = featuredCardRef.current.offsetHeight
                    setFeaturedCardHeight((prevHeight) => {
                      if (prevHeight !== newHeight) {
                        return newHeight
                      }
                      return prevHeight
                    })
                  }
                }}
              />
            </div>

            {featuredItem.description && (
              <p
                className={`${merri.className} text-white font-light text-[16px] md:text-[18px] px-2 md:px-10 italic py-6 text-center whitespace-pre-line`}
              >
                {renderTextWithLineBreaks(featuredItem.description)}
              </p>
            )}
            <div className="flex justify-center items-center gap-2 pb-8 sm:mx-2">
              <div className="sm:w-[280px]">
                <CustomButton
  text={
    featuredItem.type === 'retreat'
      ? 'LEARN MORE'
      : 'GET YOUR TICKETS'
  }
  bgColor="#D12127"
  textColor="#FFFFFF"
  url={
    featuredItem.type === 'retreat'
      ? '/retreats'
      : featuredItem.bookingUrl
  }
  isOutSideLink={featuredItem.type !== 'retreat'}
  isArrow
/>

              </div>
              <div
                className="bg-[#78B0C7] p-[9px]  cursor-pointer"
                onClick={() => handleShare(featuredItem.bookingUrl)}
              >
                <img src="/share.png" alt="share" />
              </div>
            </div>
          </div>
        )}

        {upcomingItems.length > 0 && (
          <div className="text-center">
            <h2 className="font-neco text-[32px] text-[#78B0C7] font-bold mb-12">
              COMING UP
            </h2>

            <div
              className={`flex gap-12 md:gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory sm:px-4 py-8  ${upcomingItems.length < 2 ? 'justify-center' : ''}
    ${upcomingItems.length < 4 ? 'md:justify-center' : ''}`}
              style={{
                backgroundImage: `
        linear-gradient(
          rgba(29, 92, 117, 0.5),
          rgba(29, 92, 117, 0.5)
        ),
        url('/MD-Texture_BG_Blue-01-04.png')
      `,

                backgroundRepeat: 'repeat',
                backgroundSize: '256px 256px',
              }}
            >
              {upcomingItems.map((item) => (
                <div
                  key={item.id}
                  className="snap-start shrink-0 flex flex-col gap-3
    w-[85%]        
    md:w-[40%] xl:w-[30%]"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={item.coverImage || '/abhilash.png'}
                      alt={item.title}
                      className="aspect-465/285 object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-center items-center text-center ">
                    <h2
                      className={`${merri.className} text-white font-bold px-[2px]  h-12 md:h-16 text-[20px] md:text-[26px] italic leading-tight`}
                    >
                      {item.title}
                    </h2>

                    <p
                      className={`${merri.className} text-white font-bold text-[16px] md:text-[18px] pb-2`}
                    >
                      {getDisplayDate(item)}
                    </p>
                    <p
                      className={`${merri.className} text-white font-normal text-[15px] md:text-[17px]`}
                    >
                      {`${item.venue},`}
                    </p>
                    <p
                      className={`${merri.className} text-white font-normal text-[15px] md:text-[17px]`}
                    >
                      {item.city}
                    </p>

                    <h2
                      className={`${merri.className} text-white font-normal px-[2px] my-4 text-[16px] md:text-[18px] italic leading-tight`}
                    >
                      {item.description}
                    </h2>
                  </div>

                  {/* Buttons */}
                  <div className="hidden gap-2 md:justify-start mt-2">
                    <div className="w-full md:w-full">
                      <CustomButton
                        text={
                          item.type === 'retreat'
                            ? 'LEARN MORE'
                            : 'GET YOUR TICKETS'
                        }
                        bgColor="#D12127"
                        textColor="#FFFFFF"
                        url={
                          item.type === 'retreat'
                            ? '/retreats'
                            : item.bookingUrl
                        }
                        isArrow
                      />
                    </div>

                    <div
                      className="bg-[#78B0C7] p-[9px] flex justify-center items-center cursor-pointer"
                      onClick={() => handleShare(item.bookingUrl)}
                    >
                      <img src="/share.png" alt="share" />
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-2 pb-8 sm:mx-2">
                    <div className="sm:w-[280px]">
                      <CustomButton
                        text={
                          item.type === 'retreat'
                            ? 'LEARN MORE'
                            : 'GET YOUR TICKETS'
                        }
                        bgColor="#D12127"
                        textColor="#FFFFFF"
                        url={
                          item.type === 'retreat'
                            ? '/retreats'
                            : item.bookingUrl
                        }
                        isArrow
                      />
                    </div>
                    <div
                      className="bg-[#78B0C7] p-[9px]  cursor-pointer"
                      onClick={() => handleShare(item.bookingUrl)}
                    >
                      <img src="/share.png" alt="share" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={`relative ${
            featuredItem ? 'mt-[20%] md:mt-[10%]' : 'mt-0'
          }`}
        >
          {/* No Upcoming Events */}
          {!featuredItem && upcomingItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <p
                className={`${merri.className} text-white text-2xl text-center`}
              >
                No upcoming events in the next 30 days
              </p>
            </div>
          )}

          {/* button */}
          <div className="flex flex-col md:flex-row justify-center gap-6  items-center text-center md:text-left bg-white/70 py-12 px-4 sm:px-10 xl:px-40">
            <p
              className={`text-[#1D5C75] ${merri.className} font-bold italic text-[20px] md:text-[24px]`}
            >
              Dialogues, Retreats, and Evenings with Mahabharata, celebrating
              art, music, dance, and stories.
            </p>
            <CustomButton
              text="EXPLORE MORE EVENTS"
              bgColor="#1D5C75"
              textColor="#FFFFFF"
              url={'/events'}
            />
          </div>

          {/* Testimonials Section */}
          <div className="flex flex-col justify-center items-center gap-2 max-w-2xl mx-auto py-16">
            <div
              className="bg-opacity-60 rounded-lg p-6 text-center cursor-pointer"
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={handleTestimonialClick}
            >
              <div className="h-[280px] flex flex-col justify-center items-center">
                <p className="text-white font-neco italic text-[20px] sm:text-[24px] leading-relaxed line-clamp-7">
                  {testimonials[currentIndex]?.quote}
                </p>
                <p
                  className={`text-white ${merri.className} mt-4 font-bold text-[14px] md:text-[16px]`}
                >
                  <span className="uppercase">
                    {testimonials[currentIndex]?.name},{' '}
                  </span>
                  {testimonials[currentIndex]?.designation}
                </p>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-3.5 mt-8">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentIndex(index)
                    }}
                    className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                      index === currentIndex ? 'bg-white' : 'bg-gray-400'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
