'use client'

import React, { useEffect, useState } from 'react'
import { Mail, Phone, Youtube, Instagram, Linkedin } from 'lucide-react'
import LatestBlogs from '@/lib/LatestBlogs'
import YouTubeSection from './YouTubeSection'
import { merri } from '@/app/fonts/merri'
import { getLatestVideos } from '@/lib/youtube'

type Blog = {
  id: string
  title: string
  slug: string
  image_url?: string
  updated_at?: string
}

export default function FooterWithBlogs({ count = 2 }: { count?: number }) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [videos, setVideos] = useState<any[]>([])

  useEffect(() => {
    // Fetch blogs
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setBlogs(data.data)
      })

    // Fetch youtube (client wrapper)
    getLatestVideos().then(setVideos)
  }, [])

  return (
    <div>
      {/* youtube/blogs */}
      <div>
        <div className="mx-4 xl:mx-40 overflow-hidden bg-[#1D5C7580]">
          <div className="grid grid-cols-1 md:grid-cols-10 xl:grid-cols-12">
            {/* YOUTUBE*/}
            <div className="order-1 md:order-0 col-start-1 md:col-span-6 xl:col-span-8 bg-[#D1212780]">
              <div className="flex flex-col gap-6 px-6 py-8">
                <h2
                  className={`${merri.className} text-[18px] text-center md:text-left text-white font-bold`}
                >
                  LATEST ON YOUTUBE
                </h2>

                <YouTubeSection videos={videos} count={1} layout="row" />
              </div>
            </div>

            {/* BLOG */}
            <div className="order-2 md:order-0 md:col-start-7 xl:col-start-9 col-span-4 bg-[#47ABD880]">
              <div className="flex flex-col px-6 py-8">
                <h2
                  className={`${merri.className} text-white font-bold text-[18px] text-center md:text-left`}
                >
                  ON OUR BLOG
                </h2>

                <LatestBlogs blogs={blogs} count={count} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="contact">
        <div className="flex flex-col justify-center items-center text-white font-bold font-neco py-16 text-[20px] sm:text-[22px] md:text-[32px] px-4 text-center">
          <a href="mailto:mahabharatadialogues@gmail.com" className="flex items-center gap-2 hover:underline">
            <Mail className="w-5 h-5 md:w-7 md:h-7" />
            <span>mahabharatadialogues@gmail.com</span>
          </a>

          <div className="flex items-center gap-2 mt-2">
            <Phone className="w-5 h-5 md:w-7 md:h-7" />
            <p>+91 78923 32932</p>
          </div>

          <div className="flex gap-4 mt-6">
            <a href="https://www.youtube.com/@MahabharataDialogues/videos" target="_blank" className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center">
              <Youtube className="w-5 h-5 text-black" />
            </a>

            <a href="https://www.instagram.com/mahabharatadialogues/" target="_blank" className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center">
              <Instagram className="w-5 h-5 text-black" />
            </a>

            <a href="https://in.linkedin.com/company/mahabharatadialogues" target="_blank" className="w-10 h-10 bg-[#D9D9D9] rounded-full flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-black" />
            </a>
          </div>
        </div>

        <div className="bg-[#124056] py-6 w-full" />
      </div>
    </div>
  )
}
