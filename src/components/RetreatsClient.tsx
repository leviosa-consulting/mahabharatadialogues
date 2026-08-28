'use client'

import React, { useState, useEffect } from 'react'
import CustomButton from './CustomButton'
import YouTubeSection from './YouTubeSection'
import { merri } from '@/app/fonts/merri'
import Footer from './Footer'



const FALLBACK_VIDEOS = [
  { id: 'tw7d2hMHyRY', title: 'A Weekend of Wisdom: Inside the Mahabharata Retreat (Second Edition) Experience', publishedAt: '2025-02-28' },
  { id: 'vzIB3zXqMVk', title: 'Join us for a 2-day Mahabharata Retreat at Fireflies Ashram!', publishedAt: '2025-01-24' },
];

type Blog = {
  id: string
  title: string
  slug: string
  image_url?: string
  updated_at?: string
}

export default function RetreatsClient({
  blogs,
}: {
  blogs: Blog[]
}) {
  const [videos] = useState(FALLBACK_VIDEOS)


  return (
    <section
      /* pt matches the horizontal mx-2 xl:mx-36 inset in spirit: without it the
         first panel sits flush against the section top while being inset left and
         right. The padding also exposes the gradient's lighter #47ABD880 half,
         which is what actually separates the panel from the same-toned
         testimonials section above it. */
      className="relative w-full overflow-hidden flex flex-col justify-center pt-8 xl:pt-16"
      style={{
        backgroundImage: `
    linear-gradient(
      to bottom,
      #47ABD880 50%,
      #1D5C75 100%
    )
 
  `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-2 xl:mx-36 overflow-hidden bg-[#1D5C7580]">
        <div className="grid grid-cols-6 md:grid-cols-10 xl:grid-cols-12 p-4 lg:p-10">
          {/* IMAGE – first on mobile */}
          <div className="col-span-6 md:col-start-7 md:col-span-6 order-1 md:order-2">
            <img
              src="/assets/videoImg.png"
              alt="videoImg"
              className="w-full h-full object-cover"
            />
          </div>

          {/* TEXT – below image on mobile */}
          <div className="col-span-6 md:col-start-1 md:col-span-6 order-2 md:order-1 py-4 lg:py-10">
            <div className="lg:p-2 flex flex-col gap-6 text-center md:text-left">
              <h2 className="font-neco text-[32px] text-white font-bold">
                Our Retreats
              </h2>

              <p className={`${merri.className} italic font-light text-[16px] md:text-[18px] text-white`}>
               We come together to listen, question, play, and reflect using the Mahabharata as our guide. Each retreat is a shared journey of stories, insights, and warm connections.
              </p>

              <div className="flex justify-center md:justify-start">
                <CustomButton
                  text="LEARN MORE"
                  bgColor="#47ABD880"
                  textColor="#FFFFFF"
                  url="/retreats"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* blogs */}
      <div className="mx-2 xl:mx-36 overflow-hidden bg-[#1D5C7580]">
        <div className="grid grid-cols-1 md:grid-cols-10 xl:grid-cols-12">
          {/* YOUTUBE — spans the full row since the blog panel was removed */}
          <div className="order-1 md:order-0 col-start-1 md:col-span-10 xl:col-span-12 bg-[#D1212780]">
            <div className="flex flex-col gap-6 px-6 py-8">
              <h2
                className={`${merri.className} text-[18px] text-center md:text-left text-white font-bold`}
              >
                LATEST ON YOUTUBE
              </h2>

              <YouTubeSection
                videos={videos}
                count={2}
                columns={2}
                layout="column"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  )
}
