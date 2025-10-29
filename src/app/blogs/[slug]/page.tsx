'use client'

import React, { useEffect, useState, use } from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ShimmerNavigation } from '@/components/shimmer/ShimmerNavigation'
import { ShimmerMobileHeader } from '@/components/shimmer/ShimmerMobileHeader'
import { ShimmerArticleContent } from '@/components/shimmer/ShimmerArticleContent'
import { ShimmerShareSection } from '@/components/shimmer/ShimmerShareSection'
import { ShimmerMoreStories } from '@/components/shimmer/ShimmerMoreStories'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

interface Article {
  id: string
  title: string
  subtitle: string
  image_url: string
  content: string
  slug: string
}

const Page = ({ params }: PageProps) => {
  const resolvedParams = use(params)
  const [article, setArticle] = useState<Article | null>(null)
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [shareSuccess, setShareSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
         console.log("t", resolvedParams.slug)
        // Fetch current article
        const articleRes = await fetch(`/api/articles/${resolvedParams.slug}`)
        if (!articleRes.ok) {
          throw new Error('Failed to fetch article')
        }
        const articleData = await articleRes.json()

        // Fetch all articles for navigation
        const articlesRes = await fetch(`/api/articles`)
        if (!articlesRes.ok) {
          throw new Error('Failed to fetch articles')
        }
        const articlesData = await articlesRes.json()
        // console.log('articleData = ', articleData)
        setArticle(articleData)
        setAllArticles(articlesData)

        // Find current article index
        const index = articlesData.findIndex(
          (a: Article) => a.slug === resolvedParams.slug
        )
        setCurrentIndex(index !== -1 ? index : 0)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [resolvedParams.slug])

  const goToPrevious = () => {
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : allArticles.length - 1
    const prevArticle = allArticles[prevIndex]
    if (prevArticle) {
      router.push(`/blogs/${prevArticle.slug}`)
    }
  }

  const goToNext = () => {
    const nextIndex =
      currentIndex < allArticles.length - 1 ? currentIndex + 1 : 0
    const nextArticle = allArticles[nextIndex]
    if (nextArticle) {
      router.push(`/blogs/${nextArticle.slug}`)
    }
  }

  const goBack = () => {
    router.push('/blogs')
  }

  // Handle clicking outside overlay for desktop/tablet
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      goBack()
    }
  }

  // Handle share functionality
  const handleShare = async () => {
    try {
      const currentUrl = `${window.location.origin}/insight/${resolvedParams.slug}`

      // Check if clipboard API is available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl)
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea')
        textArea.value = currentUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
      // Still show success message as fallback method might work
      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 2000)
    }
  }

  if (!article && !loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg">
          <div className="text-center">Article not found</div>
          <button
            onClick={goBack}
            className="mt-4 px-4 py-2 bg-[#39AA69] text-white rounded hover:opacity-80"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

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

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        onClick={handleOverlayClick}
      >
        <div className="w-full max-w-full sm:max-w-[90vw] max-h-[100vh] mx-0 sm:mx-12 lg:mx-36 relative overflow-y-scroll scrollbar-hide">
          {loading ? (
            <>
              {/* Shimmer Mobile Header */}
              <ShimmerMobileHeader />

              {/* Shimmer Content */}
              <div
                className="w-full h-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-full bg-white">
                  <div className="mx-0 sm:mx-8 xl:mx-32 pt-20 md:pt-0">
                    {/* Shimmer Navigation for desktop */}
                    <ShimmerNavigation />

                    {/* Shimmer Article Content */}
                    <ShimmerArticleContent />

                    {/* Shimmer Share section */}
                    <ShimmerShareSection />

                    {/* Shimmer More Stories */}
                    <ShimmerMoreStories />

                    {/* Extra spacing for mobile scroll */}
                    <div className="pb-20"></div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Fixed Header for Mobile - Close Button on top, Navigation below */}
              <div className="sm:hidden fixed top-0 left-0 right-0 z-60 bg-white ">
                {/* Close Button Row */}
                <div className="flex justify-end py-2 px-4">
                  <button
                    onClick={goBack}
                    className="bg-white rounded-full p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Journey Content */}
              <div className="w-full " onClick={(e) => e.stopPropagation()}>
                <div className="h-full bg-white">
                  {/* Main content container with top padding for mobile fixed header */}
                  <div className="mx-0 sm:mx-8 xl:mx-32 pt-20 md:pt-0">
                    {/* Navigation section for desktop - NO close button */}
                    <div
                      className="hidden md:flex flex-row justify-between items-center py-8 sm:py-4 border-b-[2px] border-[#39AA69] gap-2 px-4 sm:px-0"
                      style={{ fontFamily: 'var(--font-lato)' }}
                    >
                      {/* Left Section - Previous Story */}
                      <button
                        onClick={goToPrevious}
                        className="flex gap-2 sm:gap-3 items-center hover:opacity-70 transition-opacity cursor-pointer"
                      >
                        <img
                          src="/Left-Circle-green.svg"
                          alt="Left-Circle-Green"
                          className=""
                        />
                        <h2 className="font-normal text-[16px] text-[#39AA69]">
                          Previous Story
                        </h2>
                      </button>

                      {/* Right Section - Next Story */}
                      <button
                        onClick={goToNext}
                        className="flex gap-2 sm:gap-3 items-center hover:opacity-70 transition-opacity cursor-pointer"
                      >
                        <h2 className="font-normal text-[16px] text-[#39AA69]">
                          Next story
                        </h2>
                        <img
                          src="/Left-Circle-green.svg"
                          alt="Left-Circle-Green"
                          className=" rotate-180"
                        />
                      </button>
                    </div>

                    {/* Current Article Content */}
                    <div className="flex flex-col lg:flex-row my-4 sm:my-8 gap-4 lg:gap-8 xl:gap-0 px-4 sm:px-0">
                      {/* Left Image */}
                      <div className="w-full lg:w-[30%] flex justify-center lg:justify-start">
                        <img
                          src={`/${article.image_url}`}
                          alt={article.title}
                          className="w-[120px] sm:w-[150px] lg:w-[194px] lg:h-[194px]"
                        />
                      </div>

                      {/* Right content */}
                      <div className="w-full lg:w-[70%]">
                        <h2
                          className="font-bold text-[#59265D] text-[36px] sm:text-[32px] lg:text-[40px] text-center lg:text-left leading-[1.2]"
                          style={{ fontFamily: 'var(--font-fira-sans)' }}
                        >
                          {article.title}
                        </h2>

                        {article.subtitle && (
                          <p
                            className="font-normal text-[#000000] text-[24px] py-2 sm:py-4 text-center lg:text-left leading-[1.3]"
                            style={{ fontFamily: 'var(--font-lato)' }}
                          >
                            {article.subtitle}
                          </p>
                        )}

                        {/* Article content with exact JourneyOverlay styling */}
                        <div
                          className={`
    text-left py-2 sm:py-4 text-[#000000] text-[18px] sm:text-[14px] lg:text-[16px]
    [&>h2]:text-[18px] [&>h2]:text-[#59265D] [&>h2]:mt-6 [&>h2]:mb-4
    [&>h2]:[font-family:var(--font-fira-sans)] [&>h2]:font-bold
    [&>h3]:text-[16px] [&>h3]:font-bold [&>h3]:text-black [&>h3]:mt-5 [&>h3]:mb-3 [&>h3]:[font-family:var(--font-fira-sans)]
    [&>p]:text-[18px] [&>p]:sm:text-[14px] [&>p]:lg:text-[16px] [&>p]:text-black [&>p]:my-4 [&>p]:leading-6
    [&>img]:w-full [&>img]:my-5 [&>img]:block [&>img]:mx-0

    [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4 [&>ol]:text-black
    [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 [&>ul]:text-black

    [&>li]:my-2 [&>li]:leading-6
    [&>a]:text-[#39AA69] [&>a]:underline
    [&>blockquote]:border-l-4 [&>blockquote]:border-[#39AA69] [&>blockquote]:pl-4 [&>blockquote]:my-5 [&>blockquote]:italic [&>blockquote]:text-gray-600
  `}
                          style={{ fontFamily: 'var(--font-lato)' }}
                          dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                      </div>
                    </div>

                    {/* Share section */}
                    <div
                      className="py-2 text-[#39AA69] text-[14px] sm:text-[16px] lg:text-[20px] border-y-[2px] border-[#39AA69] flex justify-center items-center px-4 sm:px-0"
                      style={{ fontFamily: 'var(--font-lato)' }}
                    >
                      <div className="flex gap-2 sm:gap-3 items-center justify-center relative">
                        <button
                          onClick={handleShare}
                          className="flex gap-2 sm:gap-3 items-center hover:opacity-70 transition-opacity"
                        >
                          <img
                            src="/share.svg"
                            alt="share"
                            className="w-[20px] sm:w-[24px] lg:w-[27px]"
                          />
                          <p>Share</p>
                        </button>
                        {shareSuccess && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                            URL copied!
                          </div>
                        )}
                      </div>
                    </div>

                    {/* All Articles Section */}
                    <div className="mt-12 px-4 sm:px-0">
                      {/* <h3
                        className="text-[#39AA69] text-[24px] sm:text-[28px] font-bold text-center mb-6"
                        style={{ fontFamily: 'var(--font-fira-sans)' }}
                      >
                        More Stories
                      </h3> */}

                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-8 mb-4"
                        style={{ fontFamily: 'var(--font-lato)' }}
                      >
                        {allArticles
                          .filter((item) => item.slug !== resolvedParams.slug) // Exclude current article
                          .map((item, index) => (
                            <div
                              key={index}
                              onClick={() =>
                                router.push(`/insight/${item.slug}`)
                              }
                              className="flex flex-col gap-4 justify-center items-center cursor-pointer hover:opacity-80 transition-opacity p-4 rounded-lg"
                            >
                              {/* Image */}
                              <div>
                                <img
                                  src={`/${item.image_url}`}
                                  alt={item.title}
                                  className="w-[150px] sm:w-[160px] md:w-[170px] lg:w-[180px] h-auto"
                                />
                              </div>
                              {/* Content */}
                              <div className="flex flex-col text-center">
                                <h4 className="text-[#000000] font-bold text-[16px] sm:text-[17px] md:text-[18px] mb-2">
                                  {item.title}
                                </h4>
                                <button className="text-center font-bold text-[14px] text-[#39AA69] hover:underline">
                                  READ THE STORY
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Extra spacing for mobile scroll */}
                    <div className="pb-20"></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Page
