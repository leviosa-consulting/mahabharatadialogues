'use client'

import React from 'react'
import CustomButton from './CustomButton'
import { merri } from '@/app/fonts/merri'
import { MapPin } from 'lucide-react'
import { Event, getDisplayDate } from '@/lib/events'

/* The large "COMING UP NEXT" card. Shared by the home page and /events, so it
   deliberately renders no background or outer section of its own — home wraps it
   in a blue-texture section, /events drops it into a container already painted
   #47ABD8CC. The wrapper belongs to the caller; only the card travels. */
export default function FeaturedEventCard({ item }: { item: Event }) {
  const renderTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ))
  }

  /* Desktop shows only the opening paragraph of the featured description — the
     full text makes the right column ~290px taller than the image beside it.
     Cutting on a blank line keeps the truncation on a sentence boundary. */
  const firstParagraph = (item.description || '').split(/\n\s*\n/)[0]

  return (
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
          src={item.coverImage || '/assets/videoImg.png'}
          alt={item.title}
          className="w-full"
        />
      </div>

      {/* `contents` on mobile lets these children order individually against the
          image; on desktop they collapse into one centred right-hand column so all
          text — including when/where — reads top-to-bottom in a single column. */}
      <div className="contents lg:flex lg:flex-col lg:justify-center lg:col-start-2 lg:px-12 lg:py-12">
        <div className="order-1 lg:order-none flex flex-col items-center lg:items-start text-center lg:text-left px-4 md:px-10 lg:px-0 pt-6 lg:pt-0">
          <p
            className={`${merri.className} text-[#78B0C7] font-bold text-[16px] md:text-[18px] tracking-[0.22em]`}
          >
            COMING UP NEXT
          </p>
          <h2
            className={`${merri.className} text-white font-extrabold text-[32px] lg:text-[46px] italic leading-relaxed lg:leading-[1.15] text-balance mt-2 lg:mt-3`}
          >
            {item.title}
          </h2>
        </div>

        {/* When / where */}
        <div className="order-2 lg:order-none flex flex-col items-center lg:items-start text-center lg:text-left px-4 md:px-10 lg:px-0 my-2 lg:my-0 lg:pt-6">
          <h3
            className={`${merri.className} text-white font-bold text-[16px] md:text-[18px] pb-3`}
          >
            {getDisplayDate(item)}
          </h3>
          {item.venue && (
            <div className="flex flex-col items-center lg:items-start pb-4 lg:pb-0">
              <h4
                className={`${merri.className} text-white font-normal text-[16px] md:text-[18px] leading-snug`}
              >
                {item.venue},
              </h4>
              <h4
                className={`${merri.className} text-white font-normal text-[16px] md:text-[18px] leading-snug`}
              >
                {item.city}
              </h4>
              {item.mapUrl && (
                <a
                  href={item.mapUrl}
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
          {item.description && (
            <p
              className={`${merri.className} lg:hidden text-white font-light text-[16px] md:text-[18px] italic py-6 text-center whitespace-pre-line`}
            >
              {renderTextWithLineBreaks(item.description)}
            </p>
          )}
          {firstParagraph && (
            <p
              className={`${merri.className} hidden lg:block text-white font-light text-[18px] italic lg:pt-6 lg:pb-8 lg:text-left lg:max-w-[65ch] text-balance`}
            >
              {firstParagraph}
            </p>
          )}
          <div className="flex justify-center lg:justify-start items-center gap-2 pb-8 lg:pb-0 w-[80%] lg:w-auto mx-auto lg:mx-0">
            <div className="flex-1 lg:flex-none lg:w-[260px]">
              <CustomButton
                text={'LEARN MORE'}
                bgColor="#78B0C7"
                textColor="#FFFFFF"
                url={item.type === 'retreat' ? '/retreats' : `/events/${item.slug}`}
              />
            </div>
            <div
              className="bg-[#D12127] p-[16px] cursor-pointer shrink-0"
              onClick={() => window.open(item.bookingUrl, '_blank')}
            >
              <img src="/Arrow_up-right.png" alt="share" className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
