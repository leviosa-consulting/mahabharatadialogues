'use client'

import MobileNavbar from '@/components/MobileNavbar'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import Navbar from '@/components/Navbar'
import React, { useState } from 'react'
import { merri } from '../fonts/merri'
import CustomButton from '@/components/CustomButton'
import { MapPin, X } from 'lucide-react'
import NavbarScroll from '@/components/NavbarScroll'

import FeaturedEventCard from '@/components/FeaturedEventCard'
import {
  Event,
  formatEventDateTime,
  formatPastEventDate,
} from '@/lib/events'

import { usePageSettingsStore } from '@/store/usePageSettingsStore'
import { useRouter } from 'next/navigation'

interface EventsClientProps {
  upcomingEvents: Event[]
  pastEvents: Event[]
}

const EventsClient = ({ upcomingEvents, pastEvents }: EventsClientProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const settings = usePageSettingsStore((state) => state.settings)
  const router = useRouter()

  /* The soonest event gets the big shared FeaturedEventCard; the rest stay in the
     horizontal strip. With only one upcoming event the strip is not rendered at
     all, so the featured card is what sits under the header. */
  const [featuredEvent, ...restEvents] = upcomingEvents

  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  const truncateWords = (text: string, limit: number) => {
    return {
      text: text.slice(0, limit),
      isTruncated: text.length > limit,
    }
  }

  return (
    <div>
      <div>
        <MobileNavbar textColor="#1D5C75" isNotHome />
        <MobileNavbarScroll textColor="#1D5C75" showOnScrollUp={true} />
      </div>
      <div className="hidden sm:block relative pt-5 z-10">
        <Navbar textColor="#1D5C75" isNotHome />
      </div>
      <NavbarScroll textColor="#1D5C75" />

      <div
        className="w-full relative -mt-7 md:-mt-10 xl:-mt-8"
        style={{
          backgroundImage: `
            linear-gradient(#1D5C75CC, #1D5C75CC),
            url('/MD-Texture_BG_Blue-01-04.png')
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <div className="max-w-xl mx-auto pt-28 pb-10 flex flex-col justify-center items-center text-center">
          <h2
            className={`${merri.className} text-white uppercase text-[24px] font-extrabold`}
          >
            {settings?.events.title}
          </h2>
          <p
            className={`${merri.className} text-[#D9D9D9] italic text-[24px] font-light px-4`}
          >
            {settings?.events.subtitle}
          </p>
        </div>
        {/* pb-8, not pb-28: the extra 80px only existed to host the card overlap
            below, which is gone. 32px is what actually showed under the heading. */}
        <div className="pb-8">
          {upcomingEvents.length > 0 && (
            <h2
              className={`${merri.className} text-[#D9D9D9] uppercase text-center text-[16px] md:text-[18px] font-bold`}
            >
              UPCOMING EVENTS
            </h2>
          )}
        </div>
      </div>

      {/* Upcoming events container */}
      <div
        className="w-full pb-10"
        style={{
          backgroundImage: `
            linear-gradient(#47ABD8CC, #47ABD8CC),
            url('/MD-Texture_BG_Blue-01-04.png')
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        {upcomingEvents.length > 0 ? (
          <>
            {/* No negative margin here: the gap comes from the card's own my-10, the
                same way the home page renders it. */}
            <div className="w-full flex justify-center px-4 lg:px-8 xl:px-16">
              <FeaturedEventCard item={featuredEvent} />
            </div>

            {restEvents.length > 0 && (
          <div
            className={`flex items-start gap-8 md:gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 px-4 scroll-pl-4 md:scroll-pl-0
              ${restEvents.length === 1 ? 'justify-center' : ''}
              ${restEvents.length === 2 ? 'md:justify-center' : ''}
              ${restEvents.length === 3 ? 'md:justify-start md:pl-[8%] lg:pl-[8%]' : ''}
              ${restEvents.length >= 4 ? 'md:pl-[8%] lg:pl-[8%]' : ''}
            `}
          >
            {restEvents.map((event) => (
              <div
                key={event.id}
                className="snap-start shrink-0 flex flex-col gap-3
                  w-[90%]
                  sm:w-[60%] md:w-[50%] lg:w-[42%] xl:w-[30%]
                  bg-[#1D5C75CC] self-start"
              >
                <div className="relative w-full">
                  <img
                    src={event.coverImage || '/abhilash.png'}
                    alt={event.title}
                    className="aspect-465/285 object-cover w-full"
                  />
                </div>

                <div className="flex flex-col px-4 justify-center items-center text-center w-full">
                  <h2
                    className={`${merri.className} text-white font-bold px-[2px] text-[32px] italic leading-tight mb-2`}
                  >
                    {event.title}
                  </h2>

                  <p
                    className={`${merri.className} text-white font-bold text-[16px] md:text-[18px] leading-normal pb-3`}
                  >
                    {formatEventDateTime(event.date)}
                  </p>

                  {event.venue && (
                    <div className="flex items-start leading-normal gap-2">
                      <div>
                        <p
                          className={`${merri.className} text-white font-normal text-[16px] px-2 md:text-[18px]`}
                        >
                          {event.venue},
                        </p>
                        <p
                          className={`${merri.className} text-white font-normal text-[16px] md:text-[18px]`}
                        >
                          {event.city}
                        </p>
                      </div>
                    </div>
                  )}

                  {event.mapUrl && (
                    <a
                      href={event.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in Google Maps"
                      className={`${merri.className} inline-flex items-center gap-1 text-white hover:text-blue-300 transition-colors shrink-0 text-[14px] uppercase mt-[6px]`}
                    >
                      <MapPin size={18} />
                      <span>View in Map</span>
                    </a>
                  )}

                  <h2
                    className={`${merri.className} text-white font-light my-4 text-[16px] md:text-[18px] italic line-clamp-3`}
                  >
                    {event.description}
                  </h2>
                </div>

                <div className="flex justify-center items-center gap-2 pb-8 w-[80%] mx-auto">
                  <div className="flex-1">
                    <CustomButton
                      text="LEARN MORE"
                      bgColor="#78B0C7"
                      textColor="#FFFFFF"
                      url={`/events/${event.slug ?? ''}`}
                    />
                  </div>

                  <div
                    className="bg-[#D12127] p-[16px] cursor-pointer shrink-0"
                    onClick={() => window.open(event.bookingUrl, '_blank')}
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
            )}
          </>
        ) : (
          <div className="flex justify-center items-center py-20">
            <p className={`${merri.className} text-white text-xl text-center`}>
              No upcoming events at the moment
            </p>
          </div>
        )}
      </div>

      {/* Past events container */}
      <div
        className="w-full"
        style={{
          backgroundImage: `
            linear-gradient(#47ABD8CC, #47ABD8CC),
            url('/MD-Texture_BG_Blue-01-04.png')
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <div>
          <h2
            className={`${merri.className} text-[#1D5C75] uppercase text-center text-[16px] md:text-[18px] font-bold mb-8`}
          >
            PAST EVENTS
          </h2>

          {pastEvents.length > 0 ? (
            <div className="px-4 relative xl:mx-30 max-w-full overflow-x-hidden">
              <div className="grid grid-cols-12 md:gap-8">
                {pastEvents.map((event) => (
                  <div
                    key={event.id}
                    className="col-span-12 md:col-start-2 md:col-span-10 bg-[#FFFFFFCC] mb-6 min-w-0"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between gap-10 px-4 md:px-8 py-6">
                      {/* Left Content */}
                      <div className="flex-1 flex flex-col justify-center text-center md:text-left min-w-0">
                        <div>
                          <h1
                            className={`${merri.className} text-[#1D5C75] font-bold text-[22px] md:text-[28px] italic leading-tight mb-2`}
                          >
                            {event.title}
                          </h1>

                          <p
                            className={`${merri.className} text-[#1D5C75] font-bold text-[14px] md:text-[16px]`}
                          >
                            {formatPastEventDate(event.date)} | {event.venue},{' '}
                            {event.city}
                          </p>

                          <p
                            className={`${merri.className} text-[#1D5C75] font-light text-[16px] md:text-[18px] italic text-center md:text-left my-3`}
                          >
                            {(() => {
                              const { text, isTruncated } = truncateWords(
                                event.description,
                                140,
                              )

                              return (
                                <>
                                  <span>
                                    {text}
                                    {isTruncated && '... '}
                                  </span>

                                  {isTruncated && (
                                    <span
                                      onClick={() =>
                                        router.push(
                                          `/events/${event.slug ?? ''}`,
                                        )
                                      }
                                      className="cursor-pointer font-bold italic text-[14px] md:text-[15px] hover:underline"
                                    >
                                      view more
                                    </span>
                                  )}
                                </>
                              )
                            })()}
                          </p>
                        </div>

                        <div className="hidden mt-4 w-[80%]">
                          <CustomButton
                            text="LEARN MORE"
                            bgColor="#1D5C75"
                            textColor="#FFFFFF"
                            url={`/events/${event.slug ?? ''}`}
                          />
                        </div>
                      </div>

                      {/* Right Image */}
                      <div className="flex justify-center md:justify-end items-center min-w-0">
                        <div className="w-full max-w-[292px] aspect-[4/3] overflow-hidden">
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center py-20">
              <p
                className={`${merri.className} text-[#1D5C75] text-xl text-center`}
              >
                No past events available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={closeImageModal}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default EventsClient
