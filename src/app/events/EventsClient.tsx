
'use client'

import MobileNavbar from '@/components/MobileNavbar'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import Navbar from '@/components/Navbar'
import React, { useState } from 'react'
import { merri } from '../fonts/merri'
import CustomButton from '@/components/CustomButton'
import { MapPin, X } from 'lucide-react'
import NavbarScroll from '@/components/NavbarScroll'
import FooterWithBlogs from '@/components/FooterWithBlogs'
import { usePageSettingsStore } from '@/store/usePageSettingsStore'

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
  gallery?: string[]
}

interface EventsClientProps {
  upcomingEvents: Event[]
  pastEvents: Event[]
}

const EventsClient = ({ upcomingEvents, pastEvents }: EventsClientProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const settings = usePageSettingsStore((state) => state.settings)

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

  const formatPastEventDate = (dateTimeStr: string): string => {
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

    return `${day} ${month} ${year} | ${timeStr}`
  }

  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
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
        <div className="pb-28">
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
          <div
            className={`flex items-start gap-8 md:gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mt-20 pb-8 px-4 scroll-pl-4 md:scroll-pl-0 
              ${upcomingEvents.length === 1 ? 'justify-center' : ''}
              ${upcomingEvents.length === 2 ? 'md:justify-center' : ''}
              ${upcomingEvents.length === 3 ? 'md:justify-start md:pl-[8%] lg:pl-[8%]' : ''}
              ${upcomingEvents.length >= 4 ? 'md:pl-[8%] lg:pl-[8%]' : ''}
            `}
          >
            {upcomingEvents.map((event) => (
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
        ) : (
          <div className="flex justify-center items-center -mt-20 pb-20">
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
              <div className="grid grid-cols-12 gap-0 md:gap-8">
                {pastEvents.map((event) => (
                  <div
                    key={event.id}
                    className="col-span-12 md:col-start-2 md:col-span-10 bg-[#FFFFFFCC] mb-6 min-w-0"
                  >
                    <div className="grid grid-cols-12 gap-4 md:flex md:flex-row md:justify-between px-4 md:px-8 py-6">
                      <div className="col-span-12 md:flex-1 flex flex-col justify-between max-w-full md:max-w-[400px] text-center md:text-left">
                        <div>
                          <h1
                            className={`${merri.className} text-[#1D5C75] font-bold text-[22px] md:text-[28px] italic leading-tight mb-2`}
                          >
                            {event.title}
                          </h1>

                          <p
                            className={`${merri.className} text-[#1D5C75] font-bold text-[14px] md:text-[16px]`}
                          >
                            {formatPastEventDate(event.date)}
                          </p>

                          <p
                            className={`${merri.className} text-[#1D5C75] text-[14px] md:text-[16px]`}
                          >
                            {event.venue}, {event.city}
                          </p>

                          <p
                            className={`${merri.className} text-[#1D5C75] font-light text-[16px] md:text-[18px] italic text-center md:text-left line-clamp-3 my-3`}
                          >
                            {event.description}
                          </p>
                        </div>

                        <div className="hidden md:block mt-4 w-[80%]">
                          <CustomButton
                            text="LEARN MORE"
                            bgColor="#1D5C75"
                            textColor="#FFFFFF"
                            url={`/events/${event.slug ?? ''}`}
                          />
                        </div>
                      </div>

                      <div className="col-span-12 xl:flex gap-2 mt-4 md:mt-0 items-stretch min-w-0">
                        <div
                          className="cursor-pointer w-full md:w-[320px] lg:w-[380px] h-[220px] md:h-[240px] lg:h-[260px] overflow-hidden"
                          onClick={() => openImageModal(event.coverImage)}
                        >
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {event.gallery?.length > 0 && (
                          <div className="flex xl:flex-col flex-row gap-2 w-full xl:w-[140px] h-20 mt-3 xl:mt-0  xl:h-[260px]">
                            {[0, 1, 2].map((slot) => {
                              const image = event.gallery?.[slot]

                              return (
                                <div
                                  key={slot}
                                  className="flex-1 overflow-hidden cursor-pointer"
                                  onClick={() => image && openImageModal(image)}
                                >
                                  {image && (
                                    <img
                                      src={image}
                                      alt={image}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      <div className="col-span-12 mt-4 md:hidden flex justify-center">
                        <CustomButton
                          text="LEARN MORE"
                          bgColor="#1D5C75"
                          textColor="#FFFFFF"
                          url={`/events/${event.slug ?? ''}`}
                        />
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
        <div className="mt-12">
          <FooterWithBlogs count={2} />
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