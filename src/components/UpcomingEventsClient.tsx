'use client'

import React, { useState } from 'react'
import CustomButton from './CustomButton'
import FeaturedEventCard from './FeaturedEventCard'
import { merri } from '@/app/fonts/merri'
import TestimonialsShimmer from './shimmer/TestimonialsShimmer'
import { MapPin } from 'lucide-react'
import { Event, getDisplayDate } from '@/lib/events'

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

  if (loading) {
    return <TestimonialsShimmer />
  }

  const truncateText = (text: string, max = 70) =>
    text.length > max ? text.slice(0, max) + '...' : text

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
          <FeaturedEventCard item={featuredItem} />
        </section>
      )}
    </div>
  )
}

export default UpcomingEventsClient