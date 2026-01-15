'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  Calendar,
  User,
  Tag,
  ArrowLeft,
  X,
  Share2,
  Clock,
  ChevronRight,
} from 'lucide-react'
import Head from 'next/head'
import { merri } from '@/app/fonts/merri'
import BlogCard from '@/components/BlogCard'

interface Blog {
  id: string
  title: string
  subtitle: string
  image_url: string
  slug: string
  content: string
  author: string
  categories: string[]
  created_at: string
}

const BlogDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [shareTooltip, setShareTooltip] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (slug) {
      fetchBlog()
    }
  }, [slug])

  useEffect(() => {
    if (blog) {
      updateMetaTags()
      updateStructuredData()
    }
  }, [blog])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      setError(false)

      const response = await fetch(`/api/blogs/${slug}`)
      const data = await response.json()

      if (!data.success) {
        setError(true)
        setLoading(false)
        return
      }

      setBlog(data.data)

      const allBlogsResponse = await fetch('/api/blogs')
      const allBlogsData = await allBlogsResponse.json()

      if (allBlogsData.success) {
       
        const relatedByCategory = allBlogsData.data.filter(
          (b: Blog) => 
            b.slug !== slug && 
            b.categories?.some(cat => data.data.categories?.includes(cat))
        )

       
        setRelatedBlogs(relatedByCategory.slice(0, 3))
      }

      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch blog:', err)
      setError(true)
      setLoading(false)
    }
  }

  const updateMetaTags = () => {
    if (!blog) return

    document.title = `${blog.title} | Mahabharata Dialogues`

    const setMetaTag = (
      property: string,
      content: string,
      isProperty = false
    ) => {
      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${property}"]`)

      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, property)
        document.head.appendChild(element)
      }

      element.setAttribute('content', content)
    }

    const contentText = blog.content.replace(/<[^>]*>/g, '').trim()
    const description = blog.subtitle || contentText.substring(0, 160) + '...'

    setMetaTag('description', description)
    setMetaTag('keywords', blog.categories?.join(', ') || '')
    setMetaTag('author', blog.author)

    setMetaTag('og:title', blog.title, true)
    setMetaTag('og:description', description, true)
    setMetaTag('og:image', blog.image_url, true)
    setMetaTag(
      'og:url',
      `https://mahabharatadialogues.com/blogs/${blog.slug}`,
      true
    )
    setMetaTag('og:type', 'article', true)
    setMetaTag('og:site_name', 'Mahabharata Dialogues', true)
    setMetaTag('article:published_time', blog.created_at, true)
    setMetaTag('article:author', blog.author, true)

    if (blog.categories) {
      blog.categories.forEach((cat) => {
        const tagElement = document.createElement('meta')
        tagElement.setAttribute('property', 'article:tag')
        tagElement.setAttribute('content', cat)
        document.head.appendChild(tagElement)
      })
    }

    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', blog.title)
    setMetaTag('twitter:description', description)
    setMetaTag('twitter:image', blog.image_url)
    setMetaTag('twitter:creator', `@${blog.author.replace(/\s+/g, '')}`)

    setMetaTag(
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    )
    setMetaTag('googlebot', 'index, follow')

    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute(
      'href',
      `https://mahabharatadialogues.com/blogs/${blog.slug}`
    )
  }

  const updateStructuredData = () => {
    if (!blog) return

    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    )
    if (existingScript) {
      existingScript.remove()
    }

    const contentText = blog.content.replace(/<[^>]*>/g, '').trim()
    const wordCount = contentText.split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.subtitle || contentText.substring(0, 160),
      image: blog.image_url,
      author: {
        '@type': 'Person',
        name: blog.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Mahabharata Dialogues',
        logo: {
          '@type': 'ImageObject',
          url: 'https://mahabharatadialogues.com/logo.png',
        },
      },
      datePublished: blog.created_at,
      dateModified: blog.created_at,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://mahabharatadialogues.com/blogs/${blog.slug}`,
      },
      keywords: blog.categories?.join(', '),
      articleSection: blog.categories?.[0] || 'Blog',
      wordCount: wordCount,
      timeRequired: `PT${readTime}M`,
    }

    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://mahabharatadialogues.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blogs',
          item: 'https://mahabharatadialogues.com/blogs',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: blog.title,
          item: `https://mahabharatadialogues.com/blogs/${blog.slug}`,
        },
      ],
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify([structuredData, breadcrumbData])
    document.head.appendChild(script)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return 'Unknown date'
    }
  }

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const text = content.replace(/<[^>]*>/g, '')
    const wordCount = text.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }

  const handleShare = async () => {
    const currentUrl = window.location.href

    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.subtitle || blog.title,
          url: currentUrl,
        })
      } catch (err) {
        console.log('Share cancelled or failed:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl)
        setShareTooltip(true)
        setTimeout(() => setShareTooltip(false), 2000)
      } catch (err) {
        alert('Link copied to clipboard!')
      }
    }
  }

  const handleClose = () => {
    router.push('/blogs')
  }

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      handleClose()
    }
  }

  const handleCategoryClick = (category: string) => {
    router.push(`/blogs?category=${encodeURIComponent(category)}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div onClick={handleBackgroundClick}>
      <div className="w-full min-h-screen bg-[#1D5C75CC]">
        <div className="md:mx-1 lg:mx-4 xl:mx-30 2xl:mx-40">
          <div className="grid grid-cols-12">
            <div
              className="col-span-12 md:col-start-2 md:col-span-10"
              ref={contentRef}
            >
              {blog.image_url && (
                <figure className="overflow-hidden">
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full md:aspect-963/462 object-cover"
                  />
                </figure>
              )}

              <div className="bg-white">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 col-start-1 lg:col-start-2 lg:col-span-10 p-4 sm:py-4  lg:p-8">
                    <div className="w-full">
                      <div className="flex flex-col items-start text-start  w-full">
                        <div className="flex justify-between items-start w-full gap-4">
                          <span className="font-neco font-bold text-[#1D5C75] text-xl sm:text-2xl md:text-3xl lg:text-[40px] leading-6 md:leading-10 mb-4 md:mb-8">
                            {blog.title}
                          </span>

                          <button
                            onClick={handleClose}
                            className="flex-shrink-0 text-[#1D5C75] hover:bg-gray-100 rounded-full p-1 transition-colors"
                            aria-label="Close"
                          >
                            <X className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-[45px] lg:h-[45px]" />
                          </button>
                        </div>

                        <div className="flex  justify-between items-start sm:items-center w-full gap-3 mb-6 sm:mb-10">
                          <div>
                            <div>
                              <h3
                                className={`${merri.className} italic text-[#1D5C75] text-lg sm:text-[22px] font-bold`}
                              >
                                {blog.author}
                              </h3>
                            </div>
                            <div
                              className={`${merri.className} flex items-center font-normal gap-2 text-[#1D5C75] text-sm sm:text-base md:text-lg`}
                            >
                              <Calendar
                                size={16}
                                className="sm:w-[18px] sm:h-[18px]"
                              />
                              <time dateTime={blog.created_at}>
                                {formatDate(blog.created_at)}
                              </time>
                            </div>
                          </div>

                          <div className="relative">
                            <button
                              onClick={handleShare}
                              className="flex items-center gap-2 border-2 border-[#1D5C75] py-1.5 px-4 sm:py-2 sm:px-5 text-[#1D5C75] text-sm sm:text-base hover:bg-[#1D5C75] hover:text-white "
                            >
                              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span>Share</span>
                            </button>
                            {shareTooltip && (
                              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap">
                                Link copied!
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          {blog.categories?.length > 0 && (
                            <div className="flex flex-wrap text-center items-center  mb-8 sm:mb-10">
                              <span
                                className={`${merri.className} flex items-center font-bold gap-2 text-[#1D5C75] text-sm sm:text-base md:text-lg mr-4 md:mr-6`}
                              >
                                {estimateReadTime(blog.content)} min read
                              </span>

                              {blog.categories.map((cat, index) => (
                                <div
                                  key={cat}
                                  className={`${merri.className} flex items-center font-normal text-[78B0C7] text-sm sm:text-base md:text-lg`}
                                >
                                  <button
                                    onClick={() => handleCategoryClick(cat)}
                                    className="hover:underline hover:text-[#47ABD8] transition-colors cursor-pointer"
                                  >
                                    {cat}
                                  </button>

                                  {index !== blog.categories.length - 1 && (
                                    <span className=" flex items-center mx-2">
                                      |
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mb-4 sm:mb-6">
                        <p className="font-neco font-bold italic text-lg sm:text-xl md:text-[22px] text-[#1D5C75]">
                          {blog.subtitle}
                        </p>
                      </div>
                    </div>
                    <style jsx global>{`
                      .blog-content {
                        font-size: 16px;
                        line-height: 1.8;
                      }
                      .blog-content ul,
                      .blog-content ol {
                       padding-left: 2rem;
                       margin: 1.25em 0;
                      }

                    .blog-content ul {
                    list-style-type: disc;
                    }

                   .blog-content ol {
                     list-style-type: decimal;
                    }
                     .blog-content [data-youtube-video] {
  position: relative;
  width: 100%;
  max-width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  margin: 1.5em auto;
}

.blog-content [data-youtube-video] iframe {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  max-width: 100%;
  border: none;
}

                    .blog-content li {
                      margin: 0.6em 0;
                      line-height: 1.8;
                      display: list-item;
                  }
                   .blog-content ul li p {
  font-size: 1em;
}
.blog-content .font-hindi {
  font-family: var(--font-merri), serif;
  font-weight: 400;
  line-height: 1.9;
}

                      @media (min-width: 640px) {
                        .blog-content {
                          font-size: 17px;
                        }
                      }

                      @media (min-width: 768px) {
                        .blog-content {
                          font-size: 18px;
                        }
                      }

                      .blog-content h1 {
                        font-size: 1em;
                        font-weight: 700;
                        line-height: 1.2;
                        margin-top: 1.6em;
                        margin-bottom: 0.6em;
                      }

                      @media (min-width: 768px) {
                        .blog-content h1 {
                          font-size: 2.25em;
                        }
                      }

                      .blog-content h2 {
                        font-size: 1em;
                        font-weight: 400;
                        line-height: 1.3;
                        margin-top: 1.6em;
                        margin-bottom: 0.7em;
                        padding-bottom: 0.3em;
                        border-bottom: 2px solid #e5e7eb;
                      }

                      @media (min-width: 768px) {
                        .blog-content h2 {
                          font-size: 1.75em;
                        }
                      }

                      .blog-content h3 {
                        font-size: 1.25em;
                        font-weight: 600;
                        line-height: 1.4;
                        margin-top: 1.4em;
                        margin-bottom: 0.6em;
                      }

                      @media (min-width: 768px) {
                        .blog-content h3 {
                          font-size: 1.4em;
                        }
                      }

                     .blog-content p:not(:where(ul li p, ol li p)) {
                   font-size: 1em;
                   line-height: 1.8;
                   margin: 1em 0;
                  }

                      @media (min-width: 768px) {
                      .blog-content ul,
                     .blog-content ol {
                      padding-left: 2rem;
                       margin: 1.25em 0;
                    }

                    .blog-content ul {
                     list-style-type: disc;
                    }

                   .blog-content ol {
                     list-style-type: decimal;
                    }

                    .blog-content li {
                     margin: 0.1em 0;
                     line-height: 1.8;
                     display: list-item;
                    }

                      .blog-content img {
                        max-width: 100%;
                        height: auto;
                        margin: 1.5em auto;
                        display: block;
                      }

                      @media (min-width: 768px) {
                        .blog-content img {
                          margin: 2em auto;
                        }
                      }

                      .blog-content iframe {
                        max-width: 640px;
                        width: 100%;
                        height: 250px;
                        margin: 1.5em auto;
                        display: block;
                        border: none;
                      }

                      @media (min-width: 640px) {
                        .blog-content iframe {
                          height: 315px;
                        }
                      }

                      @media (min-width: 768px) {
                        .blog-content iframe {
                          height: 360px;
                          margin: 2em auto;
                        }
                      }

                      .blog-content em {
                        font-style: italic;
                      }

                      .blog-content u {
                        text-decoration: underline;
                      }

                      .blog-content code {
                        font-size: 0.9em;
                        padding: 0.2em 0.4em;
                        background-color: #f3f4f6;
                        border-radius: 0.25rem;
                      }

                      .blog-content pre {
                        font-size: 0.85em;
                        padding: 1em;
                        border-radius: 0.5rem;
                        overflow-x: auto;
                        margin: 1.5em 0;
                        background-color: #1f2937;
                      }

                      @media (min-width: 768px) {
                        .blog-content pre {
                          font-size: 0.9em;
                          padding: 1.5em;
                        }
                      }

                      .blog-content pre code {
                        background-color: transparent;
                        padding: 0;
                      }
                    `}</style>
                    <div  className={`${merri.className} text-black`}>
                      <div
                        className="blog-content font-light"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                      />
                    </div>
                  </div>

                  {relatedBlogs.length > 0 && (
                    <div className="bg-[#47ABD8B2] col-span-12 md:col-start-1 lg:col-start-2 lg:col-span-10 m-4 sm:my-4 lg:m-8">
                      <h2
                        className={`${merri.className} text-center text-white text-2xl font-bold  my-6 uppercase`}
                      >
                        Next Story
                      </h2>

                      <div className="flex flex-col items-center gap-6 px-4 sm:px-8 md:px-16 lg:px-24 pb-10">
                        {relatedBlogs.map((relatedBlog) => (
                          <div key={relatedBlog.id} className="w-full max-w-2xl">
                            <BlogCard blog={relatedBlog} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailPage