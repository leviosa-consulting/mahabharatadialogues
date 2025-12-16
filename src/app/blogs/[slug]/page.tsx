
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  Calendar,
  User,
  Tag,
  ArrowLeft,
  Share2,
  Clock,
  ChevronRight,
} from 'lucide-react'
import Head from 'next/head'

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

      // Fetch current blog
      const response = await fetch(`/api/blogs/${slug}`)
      const data = await response.json()

      if (!data.success) {
        setError(true)
        setLoading(false)
        return
      }

      setBlog(data.data)

      // Fetch all blogs for related posts
      const allBlogsResponse = await fetch('/api/blogs')
      const allBlogsData = await allBlogsResponse.json()

      if (allBlogsData.success) {
        // Filter related blogs by matching categories or author
        const related = allBlogsData.data
          .filter((b: Blog) => b.slug !== slug)
          .filter(
            (b: Blog) =>
              b.author === data.data.author ||
              b.categories?.some((cat: string) =>
                data.data.categories?.includes(cat)
              )
          )
          .slice(0, 3)

        setRelatedBlogs(related)
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

    // Update document title
    document.title = `${blog.title} | Mahabharata Dialogues`

    // Helper function to update or create meta tags
    const setMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${property}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, property)
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', content)
    }

    // Get excerpt from content (first 160 characters)
    const contentText = blog.content.replace(/<[^>]*>/g, '').trim()
    const description = blog.subtitle || contentText.substring(0, 160) + '...'

    // Basic meta tags
    setMetaTag('description', description)
    setMetaTag('keywords', blog.categories?.join(', ') || '')
    setMetaTag('author', blog.author)

    // Open Graph meta tags
    setMetaTag('og:title', blog.title, true)
    setMetaTag('og:description', description, true)
    setMetaTag('og:image', blog.image_url, true)
    setMetaTag('og:url', `https://mahabharatadialogues.com/blogs/${blog.slug}`, true)
    setMetaTag('og:type', 'article', true)
    setMetaTag('og:site_name', 'Mahabharata Dialogues', true)
    setMetaTag('article:published_time', blog.created_at, true)
    setMetaTag('article:author', blog.author, true)
    
    if (blog.categories) {
      blog.categories.forEach(cat => {
        const tagElement = document.createElement('meta')
        tagElement.setAttribute('property', 'article:tag')
        tagElement.setAttribute('content', cat)
        document.head.appendChild(tagElement)
      })
    }

    // Twitter Card meta tags
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', blog.title)
    setMetaTag('twitter:description', description)
    setMetaTag('twitter:image', blog.image_url)
    setMetaTag('twitter:creator', `@${blog.author.replace(/\s+/g, '')}`)

    // Additional SEO meta tags
    setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMetaTag('googlebot', 'index, follow')

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', `https://mahabharatadialogues.com/blogs/${blog.slug}`)
  }

  const updateStructuredData = () => {
    if (!blog) return

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }

    const contentText = blog.content.replace(/<[^>]*>/g, '').trim()
    const wordCount = contentText.split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)

    // Create Article structured data
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

    // Create BreadcrumbList structured data
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

    // Add both structured data to the page
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
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.subtitle || blog.title,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled or failed:', err)
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
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
    <div className="min-h-screen bg-gray-50">
      {/* SEO Breadcrumbs - visible to users and search engines */}
      <nav className="bg-white hidden border-b border-gray-200" aria-label="Breadcrumb">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-purple-600">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight size={16} className="text-gray-400" />
            </li>
            <li>
              <Link href="/blogs" className="text-gray-500 hover:text-purple-600">
                Blogs
              </Link>
            </li>
            <li>
              <ChevronRight size={16} className="text-gray-400" />
            </li>
            <li>
              <span className="text-gray-900 font-medium line-clamp-1">
                {blog.title}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <article className="relative">
        <header className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          {blog.image_url && (
            <div className="absolute inset-0 opacity-20">
              <img
                src={blog.image_url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Blogs
            </Link>

            {/* Categories */}
            {blog.categories && blog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Subtitle */}
            {blog.subtitle && (
              <p className="text-lg sm:text-xl text-purple-100 mb-8 leading-relaxed">
                {blog.subtitle}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{estimateReadTime(blog.content)} min read</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                aria-label="Share this article"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Image */}
          {blog.image_url && (
            <figure className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={blog.image_url}
                alt={blog.title}
                className="w-full h-auto"
              />
            </figure>
          )}

          {/* Blog Content */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-12 mb-12">
            <style jsx global>{`
              .blog-content {
                font-family: Georgia, 'Times New Roman', serif;
                line-height: 1.8;
                color: #1a1a1a;
              }

              .blog-content h1 {
                font-size: 2.25em;
                font-weight: 700;
                line-height: 1.2;
                margin-top: 1.5em;
                margin-bottom: 0.67em;
                color: #1a1a1a;
              }

              .blog-content h2 {
                font-size: 1.75em;
                font-weight: 600;
                line-height: 1.3;
                margin-top: 1.5em;
                margin-bottom: 0.75em;
                color: #2a2a2a;
                padding-bottom: 0.3em;
                border-bottom: 2px solid #e5e7eb;
              }

              .blog-content h3 {
                font-size: 1.5em;
                font-weight: 600;
                line-height: 1.4;
                margin-top: 1.5em;
                margin-bottom: 0.75em;
                color: #3a3a3a;
              }

              .blog-content p {
                font-size: 1.125em;
                line-height: 1.8;
                margin-top: 1em;
                margin-bottom: 1em;
                color: #4a4a4a;
              }

              .blog-content ul,
              .blog-content ol {
                font-size: 1.125em;
                padding-left: 2em;
                margin-top: 1em;
                margin-bottom: 1em;
              }

              .blog-content li {
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                line-height: 1.8;
              }

              .blog-content img {
                max-width: 100%;
                height: auto;
                border-radius: 1rem;
                margin: 2em auto;
                display: block;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
              }

              .blog-content iframe {
                max-width: 640px;
                width: 100%;
                height: 315px;
                border-radius: 1rem;
                margin: 2em auto;
                display: block;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                border: none;
              }

              .blog-content div[data-youtube-video] {
                max-width: 660px;
              }

              .blog-content div[data-youtube-video] iframe {
                max-width: 660px;
                width: 100%;
                height: 315px;
                border: none;
                display: block;
                margin: 0 auto;
              }

              @media (min-width: 768px) {
                .blog-content iframe,
                .blog-content div[data-youtube-video] iframe {
                  height: 360px;
                }
              }

              .blog-content strong {
                font-weight: 700;
                color: #1a1a1a;
              }

              .blog-content em {
                font-style: italic;
              }

              .blog-content u {
                text-decoration: underline;
              }

              .blog-content a {
                color: #7c3aed;
                text-decoration: underline;
                transition: color 0.2s;
              }

              .blog-content a:hover {
                color: #5b21b6;
              }

              .blog-content blockquote {
                border-left: 4px solid #7c3aed;
                padding-left: 1.5em;
                margin: 1.5em 0;
                font-style: italic;
                color: #4a4a4a;
              }

              .blog-content code {
                background-color: #f3f4f6;
                padding: 0.2em 0.4em;
                border-radius: 0.25rem;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
              }

              .blog-content pre {
                background-color: #1f2937;
                color: #f3f4f6;
                padding: 1.5em;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 1.5em 0;
              }

              .blog-content pre code {
                background-color: transparent;
                padding: 0;
                color: inherit;
              }
            `}</style>
            
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Author Card */}
          <aside className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 mb-12 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <p className="text-sm text-purple-100">Written by</p>
                <h3 className="text-2xl font-bold">{blog.author}</h3>
              </div>
            </div>
          </aside>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    href={`/blogs/${relatedBlog.slug}`}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-purple-400 to-blue-500 overflow-hidden">
                      {relatedBlog.image_url ? (
                        <img
                          src={relatedBlog.image_url}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <Tag size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {relatedBlog.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <User size={14} className="mr-1" />
                        {relatedBlog.author}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back to Blogs Button */}
          <div className="text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
            >
              <ArrowLeft size={20} />
              Back to All Blogs
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}

export default BlogDetailPage