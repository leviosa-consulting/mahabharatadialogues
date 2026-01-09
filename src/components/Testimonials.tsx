'use client'

import React, { useEffect, useRef, useState } from 'react'
import CustomButton from './CustomButton'
import { merri } from '@/app/fonts/merri'
import TestimonialsShimmer from './TestimonialsShimmer'

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
}

interface RetreatData {
  id: string
  title: string
  description: string
  photos?: string[]
  venue?: string
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
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchTestimonials()
    fetchUpcomingItems()
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
    const timeStr = `${hours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''}${ampm}`
    
    return `${day} ${month}, ${year} | ${timeStr}`
  }

  const fetchUpcomingItems = async () => {
    try {
      setLoading(true)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const thirtyDaysLater = new Date(today)
      thirtyDaysLater.setDate(today.getDate() + 30)

      
      const retreatsResponse = await fetch('/api/retreats')
      const retreatsData = await retreatsResponse.json()

      
      const eventsResponse = await fetch('/api/events')
      const eventsData = await eventsResponse.json()

      const allItems: Event[] = []

      
      if (retreatsData.success && retreatsData.data) {
        retreatsData.data.forEach((retreat: RetreatData) => {
          const retreatDate = parseDate(retreat.day1.date)
          if (retreatDate >= today && retreatDate <= thirtyDaysLater) {
          
            const endDate = retreat.day3?.date || retreat.day2?.date || retreat.day1.date
            
            allItems.push({
              id: retreat.id,
              type: 'retreat',
              title: retreat.title,
              description: retreat.description,
              coverImage: retreat.coverImage || '/abhilash.png',
              date: retreat.day1.date,
              endDate: endDate,
              time: '', 
              venue: retreat.venue || 'Venue TBA',
              slug: retreat.slug,
              bookingUrl: retreat.bookingUrl
            })
          }
        })
      }

    
      if (eventsData.success && eventsData.data) {
        eventsData.data.forEach((event: EventData) => {
          const eventDate = new Date(event.eventDate)
          const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
          
          if (eventDateOnly >= today && eventDateOnly <= thirtyDaysLater) {
            allItems.push({
              id: event.id,
              type: 'event',
              title: event.title,
              coverImage: event.coverImage || '/abhilash.png',
              date: event.eventDate,
              time: event.eventTime || '',
              venue: event.venue || 'Venue TBA',
              description: event.description,
              bookingUrl: event.bookingUrl,
              slug: event.slug,
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

      // Set featured item (earliest) and rest
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

  if (loading) {
    return <TestimonialsShimmer />
  }

  console.log('featuredItems : ', featuredItem)
  return (
    <div
      className="w-full pb-30"
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
      {/* Featured Event/Retreat */}
      {featuredItem && (
        <div className="flex flex-col max-w-84 sm:max-w-[520px] mx-auto justify-center items-center bg-[#1D5C75CC] py-2">
          <p
            className={`${merri.className} text-[#78B0C7] font-bold text-[20px] pt-6`}
          >
            COMING UP NEXT
          </p>
          <h2
            className={`${merri.className} text-white font-extrabold text-[20px] md:text-[28px] italic px-0.5 md:px-10 text-center leading-relaxed`}
          >
            {featuredItem.title}
          </h2>
          <h3 className={`${merri.className} text-white font-bold text-[20px]`}>
            {getDisplayDate(featuredItem)}
          </h3>
          <h4
            className={`${merri.className} text-white font-normal text-center md:text-[18px] py-2 px-1`}
          >
            {featuredItem.venue}
          </h4>
          <div className="">
            <img
              src={featuredItem.coverImage}
              alt={featuredItem.title}
              className="w-full h-full object-cover"
            />
          </div>

          {featuredItem.description && (
            <p
              className={`${merri.className} text-white font-light text-[18px] md:px-10 italic py-6 text-center`}
            >
              {featuredItem.description}
            </p>
          )}
          <div className="flex justify-center items-center gap-2 pb-8 px-4">
            <div>
              <CustomButton
                text="GET YOUR TICKETS"
                bgColor="#D12127"
                textColor="#FFFFFF"
                url={featuredItem.bookingUrl}
                isArrow
              />
            </div>
            <div 
              className="bg-[#78B0C7] p-[9px] md:p-[17px] cursor-pointer"
              onClick={() => handleShare(featuredItem.bookingUrl)}
            >
              <img src="/share.png" alt="share" />
            </div>
          </div>
        </div>
      )}

      {upcomingItems.length > 0 && (
        <div
          className={`flex gap-6 md:gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory my-20 px-4 ${
            upcomingItems.length < 4 ? 'md:justify-center' : ''
          }`}
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
          {upcomingItems.map((item) => (
            <div
              key={item.id}
              className=" snap-start shrink-0 flex flex-col gap-3
    w-[95%]        
    
    md:w-[50%]    
    xl:w-[30%] "
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="aspect-465/285 object-cover"
                />
              </div>

              <div className="flex flex-col justify-center items-center text-center gap-2">
                <h2
                  className={`${merri.className} text-white font-bold px-[2px] h-12 md:h-16 text-[20px] md:text-[26px] italic leading-tight`}
                >
                  {item.title}
                </h2>
                <p
                  className={`${merri.className} text-white font-bold text-[16px] md:text-[18px]`}
                >
                  {getDisplayDate(item)}
                </p>
                <p
                  className={`${merri.className} text-white font-normal text-[15px] md:text-[17px]`}
                >
                  {item.venue}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 md:justify-start mt-2">
                <div className="w-[90%] md:w-full">
                  <CustomButton
                    text="LEARN MORE"
                    bgColor="#1D5C75"
                    textColor="#FFFFFF"
                    url={getItemUrl(item)}
                  />
                </div>
                <a
                  href={getItemUrl(item)}
                  className="bg-[#D12127] p-3.5 md:p-4 cursor-pointer flex items-center justify-center"
                >
                  <img
                    src="/Arrow_up-right.png"
                    alt="Arrow_up"
                    className="w-6 h-6 md:w-7.5 md:h-7.5 object-cover"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Upcoming Events Message */}
      {!featuredItem && upcomingItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className={`${merri.className} text-white text-2xl text-center`}>
            No upcoming events in the next 30 days
          </p>
        </div>
      )}

      {/* Testimonials Section */}
      <div className="flex flex-col justify-center items-center gap-2 max-w-2xl mx-auto pt-6">
        <div
          className="bg-opacity-60 rounded-lg p-6 text-center"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <p className="text-white font-neco italic text-[24px] sm:text-[32px] leading-relaxed">
            {testimonials[currentIndex]?.quote}
          </p>
          <p
            className={`text-white ${merri.className} mt-4 font-bold text-[24px] sm:[32px]`}
          >
            <span className="uppercase">
              {testimonials[currentIndex]?.name},{' '}
            </span>
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