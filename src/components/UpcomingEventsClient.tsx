'use client'

import React, { useState } from 'react'
import CustomButton from './CustomButton'
import { merri } from '@/app/fonts/merri'
import TestimonialsShimmer from './shimmer/TestimonialsShimmer'
import { MapPin } from 'lucide-react'

interface Event {
  id: string
  type: 'event' | 'retreat'
  title: string
  coverImage: string
  date: string
  time: string
  venue: string
  mapUrl: string
  description: string
  bookingUrl?: string
  slug?: string
  endDate?: string
  city?: string
}



interface Props {
  initialFeaturedItem: Event | null
  initialUpcomingItems: Event[]
}

const UpcomingEventsClient =  ({ 
  initialFeaturedItem, 
  initialUpcomingItems 
}: Props) => {
  const [upcomingItems, setUpcomingItems] = useState(initialUpcomingItems)
  const [featuredItem, setFeaturedItem] = useState(initialFeaturedItem)
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const MAX_CHARS = 80

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
    return `${day} ${month} ${year}`
  }

 const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

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

  const startDayName = weekdays[start.getDay()]
  const endDayName = weekdays[end.getDay()]

  const startDay = start.getDate()
  const endDay = end.getDate()

  const startMonth = months[start.getMonth()]
  const endMonth = months[end.getMonth()]
  const year = start.getFullYear()

  // Same month (your current case)
  if (startMonth === endMonth) {
    return `${startDayName}, ${startDay} ${startMonth} - ${endDayName}, ${endDay} ${endMonth} ${year}`
  }

  // Different months (future-proof)
  return `${startDayName}, ${startDay} ${startMonth} - ${endDayName}, ${endDay} ${endMonth} ${year}`
}


 const formatEventDateTime = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr)

  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const dayName = weekdays[date.getDay()]

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

  return `${dayName}, ${day} ${month} ${year} | ${timeStr}`
}




  const getDisplayDate = (item: Event): string => {
    if (item.type === 'retreat' && item.endDate && item.endDate !== item.date) {
      return formatDateRange(item.date, item.endDate)
    } else if (item.type === 'event') {
      return formatEventDateTime(item.date)
    }
    return formatDate(item.date)
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

  const truncateText = (text: string, max = 70) =>
    text.length > max ? text.slice(0, max) + '...' : text

  /* Desktop shows only the opening paragraph of the featured description — the
     full text makes the right column ~290px taller than the image beside it.
     Cutting on a blank line keeps the truncation on a sentence boundary. */
  const firstParagraph = (featuredItem?.description || '').split(/\n\s*\n/)[0]

  return (
    <div className="w-full">
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
          backgroundSize: '240px 240px',
        }}
      >
        {upcomingItems.length > 0 && (
          <div className="text-center">
            
            <div
              className={`flex items-start gap-8 md:gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mt-12 pb-8 px-4 scroll-pl-4 md:scroll-pl-0 
    ${upcomingItems.length === 1 ? 'justify-center' : ''}
    ${upcomingItems.length === 2 ? 'md:justify-center' : ''}
    ${upcomingItems.length === 3 ? 'md:justify-start md:pl-[8%] lg:pl-[8%]' : ''}
    ${upcomingItems.length >= 4 ? 'md:pl-[8%] lg:pl-[8%]' : ''}`}
              style={{
                backgroundImage: `
        linear-gradient(
          rgba(29, 92, 117, 0.5),
          rgba(29, 92, 117, 0.5)   
        ),
        url('/MD-Texture_BG_Blue-01-04.png')
      `,

                backgroundRepeat: 'repeat',
                backgroundSize: '240px 240px',
              }}
            >
              {upcomingItems.map((item) => (
                <div
                  key={item.id}
                  className="snap-start shrink-0 flex flex-col gap-3
    w-[90%]        
    sm:w-[60%] md:w-[50%] lg:w-[42%] xl:w-[30%] bg-[#78B0C799] self-start"
                >
                  {/* Image */}
                  <div className="relative w-full">
                    <img
                      src={item.coverImage || '/abhilash.png'}
                      alt={item.title}
                      className="aspect-465/285 object-cover w-full"
                    />
                  </div>

                  <div className="flex flex-col px-4 justify-center items-center text-center w-full">
                    <h2
                      className={`${merri.className} text-white font-bold px-[2px]  text-[32px]  italic leading-tight mb-2`}
                    >
                      {item.title}
                    </h2>

                    <p
                      className={`${merri.className} text-white font-bold text-[16px] md:text-[18px] leading-normal pb-3`}
                    >
                      {getDisplayDate(item)}
                    </p>
                    {item.venue && (
                      <div className="flex items-start leading-normal gap-2">
                        {/* Text (not clickable) */}
                        <div>
                          <p
                            className={`${merri.className} text-white font-normal text-[16px] px-2 md:text-[18px]`}
                          >
                            {item.venue},
                          </p>
                          <p
                            className={`${merri.className} text-white font-normal text-[16px] md:text-[18px]`}
                          >
                            {item.city}
                          </p>
                        </div>
                      </div>
                    )}

                    {item.mapUrl && (
                      <a
                        href={item.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Google Maps"
                        className={` ${merri.className}
    inline-flex items-center gap-1
    text-white hover:text-blue-300
    transition-colors
    shrink-0
    text-[14px]  uppercase
    mt-[6px] 
  `}
                      >
                        <MapPin size={18} />
                        <span className="">View in Map</span>
                      </a>
                    )}

                    <h2
                      className={`${merri.className} text-white font-light my-4 text-[16px] md:text-[18px] italic line-clamp-3`}
                    >
                      {item.description}

                      {/* {item.description.length > MAX_CHARS && (
                        <button
                          onClick={() =>
                            setExpandedId(
                              expandedId === item.id ? null : item.id,
                            )
                          }
                          className="ml-2 text-[#1D5C75] hover:text-[#214351] uppercase font-normal text-[14px] not-italic"
                        >
                          {expandedId === item.id ? 'Read less' : 'Read more'}
                        </button>
                      )} */}
                    </h2>
                  </div>

                  <div className="flex justify-center items-center gap-2 pb-8 w-[80%] mx-auto">
                    {/* Button */}
                    <div className="flex-1">
                      <CustomButton
                        text={'LEARN MORE'}
                        bgColor="#1D5C75"
                        textColor="#FFFFFF"
                        url={
                          item.type === 'retreat'
                            ? '/retreats'
                            : `/events/${item.slug ?? ''}`
                        }
                      />
                    </div>

                    {/* Arrow icon */}
                    <div
                      className="bg-[#D12127] p-[16px] cursor-pointer shrink-0"
                      onClick={() => window.open(item.bookingUrl, '_blank')}
                    >
                      <img
                        src="/Arrow_up-right.png"
                        alt="share"
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Upcoming Events */}
        {!featuredItem && upcomingItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className={`${merri.className} text-white text-2xl text-center`}>
              No upcoming events in the next 30 days
            </p>
          </div>
        )}
      </div>

      {/* Featured Event — dedicated section in normal document flow, below the strip */}
      {featuredItem && (
        <section
          className="w-full flex justify-center px-4 lg:px-8 xl:px-16"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(29, 92, 117, 0.5),
                rgba(29, 92, 117, 0.5)
              ),
              url('/MD-Texture_BG_Blue-01-04.png')
            `,
            backgroundRepeat: 'repeat',
            backgroundSize: '240px 240px',
          }}
        >
          <div
            /* Width comes from the section's padding now, so the card simply fills it.
               On mobile, section px-4 + w-full max-w-[520px] is exactly the old
               calc(100%-2rem) capped at 520px — deliberately a no-op there. */
            className="grid w-full max-w-[520px] lg:max-w-none bg-[#1D5C75CC] my-10
              grid-cols-1 lg:grid-cols-2"
          >
            {/* Image — the whole left half. Rendered at its native ratio rather than
                cropped to fill: this is a poster (logo, byline, characters at the
                edges), so object-cover would cut the artwork. Centred vertically so
                any height the text doesn't match shows as symmetric matting instead
                of a hole under the image. */}
            <div className="order-3 lg:order-none lg:col-start-1 lg:self-center lg:pl-24">
              <img
                src={featuredItem.coverImage || '/assets/videoImg.png'}
                alt={featuredItem.title}
                className="w-full"
              />
            </div>

            {/* `contents` on mobile lets these children order individually against the
                image; on desktop they collapse into one centred right-hand column so all
                text — including when/where — reads top-to-bottom in a single column. */}
            <div className="contents lg:flex lg:flex-col lg:justify-center lg:col-start-2 lg:px-12 lg:py-12">
              <div className="order-1 lg:order-none flex flex-col items-center lg:items-start text-center lg:text-left px-4 md:px-10 lg:px-0 pt-6 lg:pt-0">
                <p className={`${merri.className} text-[#78B0C7] font-bold text-[16px] md:text-[18px] tracking-[0.22em]`}>
                  COMING UP NEXT
                </p>
                <h2 className={`${merri.className} text-white font-extrabold text-[32px] lg:text-[46px] italic leading-relaxed lg:leading-[1.15] text-balance mt-2 lg:mt-3`}>
                  {featuredItem.title}
                </h2>
              </div>

              {/* When / where */}
              <div className="order-2 lg:order-none flex flex-col items-center lg:items-start text-center lg:text-left px-4 md:px-10 lg:px-0 my-2 lg:my-0 lg:pt-6">
                <h3 className={`${merri.className} text-white font-bold text-[16px] md:text-[18px] pb-3`}>
                  {getDisplayDate(featuredItem)}
                </h3>
                {featuredItem.venue && (
                  <div className="flex flex-col items-center lg:items-start pb-4 lg:pb-0">
                    <h4 className={`${merri.className} text-white font-normal text-[16px] md:text-[18px] leading-snug`}>
                      {featuredItem.venue},
                    </h4>
                    <h4 className={`${merri.className} text-white font-normal text-[16px] md:text-[18px] leading-snug`}>
                      {featuredItem.city}
                    </h4>
                    {featuredItem.mapUrl && (
                      <a
                        href={featuredItem.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Google Maps"
                        className={`${merri.className} inline-flex items-center gap-1 text-white hover:text-blue-300 transition-colors shrink-0 text-[14px] uppercase mt-[6px]`}
                      >
                        <MapPin size={18} />
                        <span>View in Map</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="order-4 lg:order-none flex flex-col items-center lg:items-start px-4 md:px-10 lg:px-0">
                {/* Two elements rather than one line-clamped element on purpose.
                    -webkit-line-clamp clips at the PADDING edge, so this <p>'s
                    lg:pb-8 let an extra line render into the padding and collide
                    with the buttons; the <br/>-separated blank line also ate a
                    clamp slot and stranded the ellipsis. Truncating in JS at a
                    paragraph boundary avoids both and never cuts mid-sentence. */}
                {featuredItem.description && (
                  <p className={`${merri.className} lg:hidden text-white font-light text-[16px] md:text-[18px] italic py-6 text-center whitespace-pre-line`}>
                    {renderTextWithLineBreaks(featuredItem.description)}
                  </p>
                )}
                {firstParagraph && (
                  <p className={`${merri.className} hidden lg:block text-white font-light text-[18px] italic lg:pt-6 lg:pb-8 lg:text-left lg:max-w-[65ch] text-balance`}>
                    {firstParagraph}
                  </p>
                )}
                <div className="flex justify-center lg:justify-start items-center gap-2 pb-8 lg:pb-0 w-[80%] lg:w-auto mx-auto lg:mx-0">
                  <div className="flex-1 lg:flex-none lg:w-[260px]">
                    <CustomButton
                      text={'LEARN MORE'}
                      bgColor="#78B0C7"
                      textColor="#FFFFFF"
                      url={featuredItem.type === 'retreat' ? '/retreats' : `/events/${featuredItem.slug}`}
                    />
                  </div>
                  <div
                    className="bg-[#D12127] p-[16px] cursor-pointer shrink-0"
                    onClick={() => window.open(featuredItem.bookingUrl, '_blank')}
                  >
                    <img src="/Arrow_up-right.png" alt="share" className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default UpcomingEventsClient