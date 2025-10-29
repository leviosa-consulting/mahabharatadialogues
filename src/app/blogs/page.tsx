'use client'


import { CircleArrowDown } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import db from '@/firebase/firebaseServices'
import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import { ShimmerCard } from '@/components/ShimmerCard'

interface Articles {
  id: string
  title: string
  image_url: string
  subtitle: string
  slug: string
}

// Shimmer Card Component

const Insight = () => {
  const [articles, setArticles] = useState<Articles[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching articles:', error)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .shimmer-wave {
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="bg-[#50184d]">
        

        {loading ? (
          /* Shimmer Loading State */
          <div className="w-full md:h-screen py-16 2xl:py-4 px-4 sm:px-8 md:px-16 lg:px-24 bg-[#50184d]">
            <div
              className="w-full h-full flex flex-col md:flex-row justify-center items-center gap-16 sm:gap-24 md:gap-32 lg:gap-36"
              style={{ fontFamily: 'var(--font-lato)' }}
            >
              <div className="flex flex-col md:flex-row justify-center items-center gap-16 sm:gap-24 md:gap-32 lg:gap-36 flex-wrap">
                <ShimmerCard />
                <ShimmerCard />
                <ShimmerCard />
              </div>
            </div>
          </div>
        ) : articles.length === 0 ? (
          /* No Articles State */
          <div className="w-full h-screen bg-[#50184d] flex items-center justify-center">
            <p
              className="text-white text-xl"
              style={{ fontFamily: 'var(--font-lato)' }}
            >
              No articles found.
            </p>
          </div>
        ) : (
          /* Loaded Articles */
          <div>
            <div className="w-full py-16 2xl:py-4 px-4 sm:px-8 md:px-16 lg:px-24 bg-[#50184d] md:h-screen">
              <div
                className="w-full h-full flex flex-col md:flex-row justify-center items-center gap-16 sm:gap-24 md:gap-24 lg:gap-36"
                style={{ fontFamily: 'var(--font-lato)' }}
              >
                {articles.map((item, index) => (
                  <Link
                    key={item.id || index}
                    href={`/blogs/${item.slug}`}
                    className="flex flex-col gap-4 justify-center items-center w-full sm:w-auto cursor-pointer transform transition-transform hover:scale-105 duration-300"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
                        // loading="lazy"
                      />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col text-center">
                      <h1 className="text-white font-bold text-[18px] sm:text-[18px] lg:text-[20px] ">
                        {item.title}
                      </h1>
                      <button className="text-center pt-1 font-bold text-[16px] text-green hover:text-green-400 transition-colors duration-200">
                        READ THE STORY
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            
          </div>
        )}
      </div>
    </>
  )
}

export default Insight